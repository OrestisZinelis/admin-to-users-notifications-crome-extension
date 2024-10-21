export interface Message {
  id: string
  content: string
  priority: 'normal' | 'high' | 'low'
  timestamp: string
  read: boolean
}

export type MessagePayload =
  | { action: 'refreshMessages' }
  | { action: 'deleteMessage'; messageId: string }
  | { action: 'markAsRead'; messageId: string }
  | { action: 'markAllAsRead' }
  | { action: 'deleteAllMessages' }

export type ChromeRequestAction =
  | 'simulateAdminSendingMessages'
  | 'markAsRead'
  | 'deleteMessage'
  | 'addMessage'
  | 'checkMessages'
  | 'markAllAsRead'
  | 'deleteAllMessages'
  | 'refreshMessages'

export interface ChromeRequest {
  action: ChromeRequestAction
  messageId?: string
  newMessage?: Message
}
