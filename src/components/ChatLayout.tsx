import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import { type Chat } from '../types/chat';
import { fetchChats } from '../api/chat';

const ChatLayout: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

  const { data: chats, isLoading: isLoadingChats, error: chatsError } = useQuery<Chat[], Error>({
    queryKey: ['chats'],
    queryFn: fetchChats,
  });

  const handleSelectChat = (chatId: number) => {
    setSelectedChatId(chatId);
    // TODO: Mark messages as read - this might involve a mutation or local state update
    // Invalidate messages query for the selected chat to refetch and mark as read
    // queryClient.invalidateQueries(['messages', chatId]); // Need queryClient here or pass it down
  };

  const selectedChat = chats?.find((chat: Chat) => chat.id === selectedChatId);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Chat List */}
      <div className="w-110 bg-white border-r border-gray-200 flex flex-col">
        {isLoadingChats && <div className="p-4">Loading chats...</div>}
        {chatsError && <div className="p-4 text-red-500">Error loading chats: {chatsError.message}</div>}
        {chats && <ChatList chats={chats} selectedChatId={selectedChatId} onSelectChat={handleSelectChat} />}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <ChatWindow selectedChat={selectedChat} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
