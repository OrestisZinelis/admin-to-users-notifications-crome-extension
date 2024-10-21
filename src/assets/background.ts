import { mockMessages, generateDummyMessages } from '@/api/mockData'
import type { Message, ChromeRequest, MessagePayload } from '@/types/types'

const MESSAGES_KEY = 'messages'
let initialFetch = true

async function fetchNewMessages() {
  // Simulate a delay to mimic server response time
  await new Promise((resolve) => setTimeout(resolve, 2000))
  // Return mock messages on initial fetch, generate new ones subsequently
  const messages = initialFetch ? mockMessages : generateDummyMessages(1)
  initialFetch = false
  return messages
}

async function addMessage(newMessage: Message) {
  try {
    const { messages: currentMessages = [] } = await chrome.storage.local.get(MESSAGES_KEY)
    if (currentMessages.some((m: Message) => m.id === newMessage.id)) {
      throw new Error('Message ID must be unique')
    }

    const updatedMessages = [...currentMessages, newMessage]
    await updateMessagesStorage(updatedMessages)
  } catch (error) {
    console.error('Error adding message:', error)
  }
}

async function deleteMessage(messageId: string) {
  try {
    const { messages: currentMessages = [] } = await chrome.storage.local.get(MESSAGES_KEY)
    const updatedMessages = currentMessages.filter((m: Message) => m.id !== messageId)
    await updateMessagesStorage(updatedMessages)
  } catch (error) {
    console.error('Error deleting message:', error)
  }
}

async function markAsRead(messageId: string) {
  try {
    const { messages: currentMessages = [] } = await chrome.storage.local.get(MESSAGES_KEY)
    const messageIndex = currentMessages.findIndex((m: Message) => m.id === messageId)

    if (messageIndex !== -1) {
      currentMessages[messageIndex].read = true
      await updateMessagesStorage(currentMessages)
    } else {
      throw new Error('Message not found')
    }
  } catch (error) {
    console.error('Error marking message as read:', error)
  }
}

async function handleMarkAllAsRead() {
  const { messages: currentMessages = [] } = await chrome.storage.local.get(MESSAGES_KEY)
  const updatedMessages = currentMessages.map((m: Message) => ({ ...m, read: true }))
  await updateMessagesStorage(updatedMessages)
}

async function handleDeleteAllMessages() {
  await updateMessagesStorage([])
}

async function simulateAdminSendingMessages() {
  const dummyMessages = generateDummyMessages(5)
  for (const message of dummyMessages) {
    await addMessage(message)
  }
}

async function checkForMessages() {
  try {
    const newMessages = await fetchNewMessages()
    const { messages: existingMessages = [] } = await chrome.storage.local.get(MESSAGES_KEY)
    const updatedMessages = [...existingMessages, ...newMessages]
    updateMessagesStorage(updatedMessages)
  } catch (error) {
    console.error('Failed to fetch new messages', error)
  }
}

async function updateMessagesStorage(updatedMessages: Message[]) {
  await chrome.storage.local.set({ messages: updatedMessages })
  await updateBadge(updatedMessages)

  const payload: MessagePayload = { action: 'refreshMessages' }
  await chrome.runtime.sendMessage(payload)
}

async function updateBadge(messages: Message[]) {
  const unreadCount = messages.filter((m) => !m.read).length
  await chrome.action.setBadgeText({ text: unreadCount > 0 ? `${unreadCount}` : '' })
}

chrome.runtime.onInstalled.addListener(() => {
  checkForMessages()
  setInterval(checkForMessages, 10000) // Set up a periodic check every 10 seconds
})

chrome.runtime.onMessage.addListener((request: ChromeRequest) => {
  switch (request.action) {
    case 'simulateAdminSendingMessages':
      simulateAdminSendingMessages().catch((error) => {
        console.error('Failed to simulate admin sending messages:', error)
      })
      break

    case 'markAsRead':
      if (request.messageId) {
        markAsRead(request.messageId).catch((error) => {
          console.error('Failed to mark message as read:', error)
        })
      }
      break

    case 'deleteMessage':
      if (request.messageId) {
        deleteMessage(request.messageId).catch((error) => {
          console.error('Failed to delete message:', error)
        })
      }
      break

    case 'markAllAsRead':
      handleMarkAllAsRead().catch((error) => {
        console.error('Failed to mark all messages as read:', error)
      })
      break

    case 'deleteAllMessages':
      handleDeleteAllMessages().catch((error) => {
        console.error('Failed to delete all messages:', error)
      })
      break

    case 'addMessage':
      if (request.newMessage) {
        addMessage(request.newMessage).catch((error) => {
          console.error('Failed to add message:', error)
        })
      }
      break

    case 'checkMessages':
      checkForMessages().catch((error) => {
        console.error('Failed to check for messages:', error)
      })
      break

    default:
      console.error('Unknown action:', request.action)
      break
  }
})
