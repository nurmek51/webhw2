import React, { useState } from 'react';
import { type Chat } from '../types/chat';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createChat } from '../api/chat';

// Define your avatar URL here
const MY_AVATAR_URL = 'https://www.czbiohub.org/wp-content/uploads/2024/03/sam-altman.png'; // Paste your avatar image URL

interface ChatListProps {
  chats: Chat[];
  selectedChatId: number | null;
  onSelectChat: (chatId: number) => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, selectedChatId, onSelectChat }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const createChatMutation = useMutation<Chat, Error, [string, 'person' | 'ai']>({
    mutationFn: ([name, type]) => createChat(name, type),
    onSuccess: () => {
      // Invalidate and refetch the chats query after creating a new chat
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });

  const handleCreateChat = (type: 'person' | 'ai') => {
    const chatName = prompt(`Enter name for new ${type === 'ai' ? 'AI ' : ''}chat:`);
    if (chatName) {
      createChatMutation.mutate([chatName, type]);
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Search Input */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search chats..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {/* Categories */}
        <div className="p-4 font-bold text-sm text-gray-500 uppercase">People</div>
        {filteredChats.filter(chat => chat.type === 'person').map(chat => (
          <div
            key={chat.id}
            className={`flex items-center p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-200 ${selectedChatId === chat.id ? 'bg-gray-200' : ''}`}
            onClick={() => onSelectChat(chat.id)}
          >
            {/* Avatar Image */}
            <img
              src={MY_AVATAR_URL}
              alt={`${chat.name} Avatar`}
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
            <div className="flex-1">
              <div className="font-semibold">{chat.name}</div>
              <div className="text-sm text-gray-500 truncate">{chat.lastMessage}</div>
            </div>
            {chat.unread > 0 && (
              <span className="ml-2 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {chat.unread}
              </span>
            )}
          </div>
        ))}

        <div className="p-4 font-bold text-sm text-gray-500 uppercase">AI Assistants</div>
        {filteredChats.filter(chat => chat.type === 'ai').map(chat => (
           <div
             key={chat.id}
             className={`flex items-center p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-200 ${selectedChatId === chat.id ? 'bg-gray-200' : ''}`}
             onClick={() => onSelectChat(chat.id)}
           >
            {/* AI Avatar Image */}
            <img
              src={MY_AVATAR_URL} // Using the same avatar URL for AI for simplicity
              alt={`${chat.name} Avatar`}
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
            <div className="flex-1">
              <div className="font-semibold">{chat.name}</div>
              <div className="text-sm text-gray-500 truncate">{chat.lastMessage}</div>
            </div>
            {chat.unread > 0 && (
              <span className="ml-2 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {chat.unread}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* New Chat Buttons */}
      <div className="p-4 border-t border-gray-200 ">
        <button
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md mb-2 hover:bg-blue-600"
          onClick={() => handleCreateChat('person')}
          disabled={createChatMutation.isPending}
        >
          {createChatMutation.isPending ? 'Creating...' : 'New Chat'}
        </button>

        <br/>
        <br/>
        <button
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
          onClick={() => handleCreateChat('ai')}
          disabled={createChatMutation.isPending}
        >
           {createChatMutation.isPending ? 'Creating AI Chat...' : 'New AI Chat'}
        </button>
      </div>
    </div>
  );
};

export default ChatList; 