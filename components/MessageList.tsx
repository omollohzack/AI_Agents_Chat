
import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  nowPlayingId: string | null;
  onPlayMessage: (message: Message) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, nowPlayingId, onPlayMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((message) => (
        <MessageBubble 
          key={message.id} 
          message={message}
          isPlaying={nowPlayingId === message.id}
          onPlayAudio={onPlayMessage}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
