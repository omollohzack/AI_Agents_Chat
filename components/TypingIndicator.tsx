
import React from 'react';

interface TypingIndicatorProps {
  avatarUrl: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ avatarUrl }) => {
  return (
    <div className="flex items-end mb-4 justify-start px-4">
      <img
        src={avatarUrl}
        alt="Contact Avatar"
        className="w-8 h-8 rounded-full mr-3"
      />
      <div className="flex items-center space-x-1.5 bg-gray-200 dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-none shadow-md">
        <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"></span>
      </div>
    </div>
  );
};

export default TypingIndicator;
