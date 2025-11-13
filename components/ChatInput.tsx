
import React, { useState, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [text, setText] = useState('');
  const { transcript, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setText(transcript);
    }
  }, [transcript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text.trim());
      setText('');
      if(isListening) stopListening();
    }
  };
  
  const handleMicClick = () => {
      if (isListening) {
          stopListening();
      } else {
          setText('');
          startListening();
      }
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isListening ? "Listening..." : "Type a message..."}
          className="flex-1 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
        />
        {hasRecognitionSupport && (
          <button
            type="button"
            onClick={handleMicClick}
            className={`flex-shrink-0 text-white rounded-full p-3 transition-colors ${
                isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-blue-500 hover:bg-blue-600'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800`}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
          >
            <Mic size={20} />
          </button>
        )}
        <button
          type="submit"
          className="flex-shrink-0 bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors"
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
