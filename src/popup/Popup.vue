<template>
  <div class="flex flex-col min-w-[500px]">
    <div v-if="isLoading" class="flex flex-col p-4">Loading...</div>
    <div v-else-if="hasError" class="flex flex-col p-4">An error occurred!</div>
    <div v-else>
      <div class="flex justify-between p-4 sticky top-0 bg-white">
        <button
          :disabled="!unreadMessagesExist || isLoading"
          @click="handleMarkAllAsRead"
          class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          :class="{
            'cursor-not-allowed opacity-50': !unreadMessagesExist,
            'cursor-pointer': unreadMessagesExist
          }"
        >
          Mark all as Read
        </button>
        <button
          :disabled="!messages.length || isLoading"
          @click="handleDeleteAllMessages"
          class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          :class="{
            'cursor-not-allowed opacity-50': !messages.length,
            'cursor-pointer': messages.length
          }"
        >
          Delete all
        </button>
      </div>
      <div
        v-if="!messages.length"
        class="flex justify-center items-center p-4 w-full font-bold h-full"
      >
        No messages.
      </div>
      <div v-else class="flex flex-col gap-2">
        <div
          v-for="message in messages"
          :key="message.id"
          class="flex flex-col p-2 border border-solid rounded border-gray-200"
        >
          <div class="mb-2 flex gap-2 justify-between items-center">
            <div class="flex gap-1 items-center">
              <span
                :class="{
                  'bg-green-100 text-green-800': message.priority === 'low',
                  'bg-yellow-100 text-yellow-800': message.priority === 'normal',
                  'bg-red-100 text-red-800': message.priority === 'high'
                }"
                class="px-2 py-1 text-xs font-semibold rounded-full inline-block"
              >
                {{ message.priority }}
              </span>
              <span class="text-xs text-gray-500 inline-block">
                {{ formatDate(message.timestamp) }}
              </span>
            </div>
            <div class="flex flex-shrink-0 gap-1">
              <button
                v-if="!message.read"
                @click="handleMarkAsRead(message.id)"
                class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors whitespace-nowrap cursor-pointer"
              >
                Mark as Read
              </button>
              <button
                @click="handleDeleteMessage(message.id)"
                class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors whitespace-nowrap cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
          <p>{{ message.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Message, MessagePayload, ChromeRequest } from '@/types/types'

const isLoading = ref(false)
const hasError = ref(false)
const messages = ref<Message[]>([])

const unreadMessagesExist = computed(() => messages.value.some((m) => !m.read))

function formatDate(timestamp: string) {
  const date = new Date(timestamp)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const fetchMessagesFromStorage = async () => {
  isLoading.value = true
  hasError.value = false
  try {
    const { messages: storedMessages = [] } = await chrome.storage.local.get('messages')
    messages.value = storedMessages
  } catch (error) {
    console.error('Failed to fetch messages from storage:', error)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

const handleMarkAsRead = async (messageId: string) => {
  await chrome.runtime.sendMessage({ action: 'markAsRead', messageId } as MessagePayload)
}

const handleDeleteMessage = async (messageId: string) => {
  await chrome.runtime.sendMessage({ action: 'deleteMessage', messageId } as MessagePayload)
}

const handleMarkAllAsRead = async () => {
  await chrome.runtime.sendMessage({ action: 'markAllAsRead' } as MessagePayload)
}

const handleDeleteAllMessages = async () => {
  await chrome.runtime.sendMessage({ action: 'deleteAllMessages' } as MessagePayload)
}

chrome.runtime.onMessage.addListener((request: ChromeRequest) => {
  if (request.action === 'refreshMessages') {
    fetchMessagesFromStorage()
  }
})

onMounted(fetchMessagesFromStorage)
</script>
