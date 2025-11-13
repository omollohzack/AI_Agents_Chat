
import React from 'react';
import { Message } from '../types';
import { Volume2, PauseCircle } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isPlaying: boolean;
  onPlayAudio: (message: Message) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isPlaying, onPlayAudio }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex items-end mb-4 gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <img
          src={message.avatarUrl}
          alt="Contact Avatar"
          className="w-8 h-8 rounded-full self-start"
        />
      )}
      <div
        className={`relative max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-md transition-all duration-300 ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
        } ${ isPlaying ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}
      >
        <p className="text-sm">{message.text}</p>
      </div>
      {!isUser && (
        <button 
          onClick={() => onPlayAudio(message)}
          className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors focus:outline-none"
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
        >
          {isPlaying ? <PauseCircle size={20} /> : <Volume2 size={20} />}
        </button>
      )}
    </div>
  );
};

export default MessageBubble;
