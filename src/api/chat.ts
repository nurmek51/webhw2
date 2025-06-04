import { type Chat, type Message } from '../types/chat';
import axios from 'axios'; // Import axios

const API_BASE_URL = 'http://localhost:3001'; // Define backend API base URL

// Fetch all chats
export const fetchChats = async (): Promise<Chat[]> => {
  // TODO: Replace with actual API call to fetch chats
  const response = await axios.get<Chat[]>(`${API_BASE_URL}/chats`);
  return response.data;
};

// Fetch messages for a specific chat
export const fetchMessages = async (chatId: number): Promise<Message[]> => {
  // TODO: Replace with actual API call to fetch messages for chatId
   const response = await axios.get<Message[]>(`${API_BASE_URL}/chats/${chatId}/messages`);
   return response.data;
};

// Send a new message
export const sendMessage = async (chatId: number, text: string): Promise<Message> => {
  // TODO: Replace with actual API call to send message
  const response = await axios.post<Message>(`${API_BASE_URL}/chats/${chatId}/messages`, { text });
  return response.data;
};

// Create a new chat
export const createChat = async (name: string, type: 'person' | 'ai'): Promise<Chat> => {
   // TODO: Replace with actual API call to create chat
  const response = await axios.post<Chat>(`${API_BASE_URL}/chats`, { name, type });
  return response.data;
};
