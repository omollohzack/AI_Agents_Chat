
import React from 'react';
import { Contact } from '../types';

interface ChatHeaderProps {
  contact: Contact;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ contact }) => {
  return (
    <div className="hidden md:flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <img src={contact.avatarUrl} alt={contact.name} className="w-12 h-12 rounded-full mr-4" />
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{contact.name}</h2>
        <p className="text-sm text-green-500 dark:text-green-400">Online</p>
      </div>
    </div>
  );
};

export default ChatHeader;
