export interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  unread: number;
  type: 'person' | 'ai';
}

export interface Message {
  id: number;
  chatId: number; // Add chatId to link messages to chats
  text: string;
  sender: 'me' | 'other' | 'ai'; // Added 'ai' sender type
  time: string;
} 