
import React from 'react';
import { Contact, Message } from '../types';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';

interface ChatWindowProps {
  contact: Contact;
  messages: Message[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ contact, messages, onSendMessage, isTyping }) => {
  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <ChatHeader contact={contact} />
      <MessageList messages={messages} />
      {isTyping && <TypingIndicator avatarUrl={contact.avatarUrl} />}
      <ChatInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatWindow;
