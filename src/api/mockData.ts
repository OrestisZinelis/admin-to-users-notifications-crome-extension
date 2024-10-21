import type { Message } from '@/types/types'
import { v4 as uuidv4 } from 'uuid'

export const mockMessages: Message[] = [
  {
    id: 'mock-1',
    content: 'Team meeting at 3 PM today 🙂',
    priority: 'high',
    timestamp: '2024-09-30T15:00:00Z',
    read: false
  },
  {
    id: 'mock-2',
    content: 'Hello mate, how are you? 🥂',
    priority: 'low',
    timestamp: '2024-10-15T15:00:00Z',
    read: false
  },
  {
    id: 'mock-3',
    content: "Don't forget to submit the report by EOD!",
    priority: 'normal',
    timestamp: '2024-10-30T15:00:00Z',
    read: false
  }
]

export function generateDummyMessages(count: number): Message[] {
  const priorities: Message['priority'][] = ['low', 'normal', 'high']
  return Array.from({ length: count }, () => {
    const id = uuidv4()
    return {
      id,
      content: `This is a dummy message with ID: ${id}`,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      timestamp: new Date().toISOString(),
      read: false
    }
  })
}
