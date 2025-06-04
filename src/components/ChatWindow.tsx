import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type Chat, type Message } from '../types/chat';
import { fetchMessages, sendMessage } from '../api/chat';

// Define your avatar URL here
const MY_AVATAR_URL = 'https://www.czbiohub.org/wp-content/uploads/2024/03/sam-altman.png'; // Paste your avatar image URL

interface ChatWindowProps {
  selectedChat: Chat;
}

interface MessageFormInputs {
  message: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedChat }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<MessageFormInputs>();

  const { data: messages, isLoading: isLoadingMessages, error: messagesError } = useQuery<Message[], Error>({
    queryKey: ['messages', selectedChat.id],
    queryFn: () => fetchMessages(selectedChat.id),
    enabled: !!selectedChat.id,
  });

  const sendMessageMutation = useMutation<Message, Error, { chatId: number, text: string }>({
    mutationFn: ({ chatId, text }) => sendMessage(chatId, text),
    onSuccess: (newMessage) => {
      queryClient.invalidateQueries({ queryKey: ['messages', newMessage.chatId] });
    },
     onError: (error) => {
       console.error('Error sending message:', error);
     }
  });

  useEffect(() => {
    if (messages && !isLoadingMessages) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoadingMessages]);

  const onSubmit = (data: MessageFormInputs) => {
    if (data.message.trim()) {
      sendMessageMutation.mutate({ chatId: selectedChat.id, text: data.message });
      console.log('Attempting to reset form...');
      reset();
      console.log('Form reset called.');
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }

  if (isLoadingMessages) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Loading messages...
      </div>
    );
  }

  if (messagesError) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500">
        Error loading messages: {messagesError.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <img
          src={MY_AVATAR_URL}
          alt={`${selectedChat.name} Avatar`}
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
        <div className="flex-1">
          <div className="font-bold text-lg">{selectedChat.name}</div>
          <div className="text-sm text-gray-500">Online</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages && messages.map(message => (
          <div
            key={message.id}
            className={`flex mb-4 ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender !== 'me' && (
               <img
                 src={MY_AVATAR_URL}
                 alt={`${message.sender === 'ai' ? 'AI' : selectedChat.name} Avatar`}
                 className="w-8 h-8 rounded-full mr-2 object-cover"
               />
            )}
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${message.sender === 'me'
                ? 'bg-blue-500 text-white rounded-br-md'
                : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
              }`}
            >
              <p>{message.text}</p>
              <div className="text-xs mt-1 opacity-75 text-right">{message.time}</div>
            </div>
            {message.sender === 'me' && (
               <img
                 src={MY_AVATAR_URL}
                 alt="My Avatar"
                 className="w-8 h-8 rounded-full ml-2 object-cover"
               />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white border-t border-gray-200 px-4 py-3 flex items-center">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 mr-2"
          {...register('message', { required: true })}
          disabled={sendMessageMutation.status === 'pending'}
        />
         {errors.message && <span className="text-red-500 text-xs">Message is required</span>}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          disabled={sendMessageMutation.status === 'pending'}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;