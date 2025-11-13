
import React, { useState, useEffect, useCallback } from 'react';
import { Contact, Message } from './types';
import { CONTACTS } from './constants';
import { generateReply } from './services/geminiService';
import ContactList from './components/ContactList';
import ChatWindow from './components/ChatWindow';
import SettingsPanel from './components/SettingsPanel';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(CONTACTS);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { nowPlayingId, playAudio, stopAudio } = useSpeechSynthesis();

  useEffect(() => {
    // Select the first contact by default on load
    if (contacts.length > 0) {
      setActiveContact(contacts[0]);
    }
  }, [contacts]);

  const handleSelectContact = (contact: Contact) => {
    setActiveContact(contact);
    stopAudio(); // Stop any playing audio when switching chats
    if (window.innerWidth < 768) { // md breakpoint in Tailwind
      setIsSidebarOpen(false);
    }
  };

  const handleSendMessage = useCallback(async (text: string) => {
    if (!activeContact) return;
    stopAudio(); // Stop any currently playing message before sending a new one

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    const updatedMessages = {
      ...messages,
      [activeContact.id]: [...(messages[activeContact.id] || []), userMessage],
    };
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      const conversationHistory = updatedMessages[activeContact.id] || [];
      const replyText = await generateReply(conversationHistory, activeContact.personality);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: replyText,
        sender: 'contact',
        timestamp: new Date(),
        avatarUrl: activeContact.avatarUrl
      };

      setMessages(prev => ({
        ...prev,
        [activeContact.id]: [...(prev[activeContact.id] || []), aiMessage],
      }));
      
      playAudio(aiMessage); // Automatically play the new AI message

    } catch (error) {
      console.error("Failed to get AI reply:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: 'contact',
        timestamp: new Date(),
        avatarUrl: activeContact.avatarUrl
      };
      setMessages(prev => ({
        ...prev,
        [activeContact.id]: [...(prev[activeContact.id] || []), errorMessage],
      }));
      playAudio(errorMessage);
    } finally {
      setIsTyping(false);
    }
  }, [activeContact, messages, playAudio, stopAudio]);

  const handleUpdateContact = (updatedContact: Contact) => {
    const newContacts = contacts.map(c => c.id === updatedContact.id ? updatedContact : c);
    setContacts(newContacts);
    if (activeContact?.id === updatedContact.id) {
      setActiveContact(updatedContact);
    }
  };

  const handlePlayMessage = (message: Message) => {
    if (nowPlayingId === message.id) {
      stopAudio();
    } else {
      playAudio(message);
    }
  };

  return (
    <div className="flex h-screen font-sans text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900">
      <div className={`
        ${isSidebarOpen ? 'w-full md:w-80' : 'w-0'}
        absolute md:relative z-20 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transition-all duration-300 ease-in-out overflow-hidden flex flex-col`
      }>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Chats</h1>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
             <X size={24} />
          </button>
        </div>
        <ContactList
          contacts={contacts}
          activeContactId={activeContact?.id}
          onSelectContact={handleSelectContact}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 md:hidden">
            <button onClick={() => setIsSidebarOpen(true)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mr-3">
              <Menu size={24} />
            </button>
            {activeContact && (
                 <div className="flex items-center">
                    <img src={activeContact.avatarUrl} alt={activeContact.name} className="w-10 h-10 rounded-full mr-3" />
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{activeContact.name}</p>
                    </div>
                </div>
            )}
        </header>

        <main className="flex-1 flex flex-col md:flex-row min-h-0">
          <div className="flex-1 flex flex-col min-w-0">
             {activeContact ? (
              <ChatWindow
                contact={activeContact}
                messages={messages[activeContact.id] || []}
                onSendMessage={handleSendMessage}
                isTyping={isTyping}
                nowPlayingId={nowPlayingId}
                onPlayMessage={handlePlayMessage}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <p>Select a contact to start chatting</p>
              </div>
            )}
          </div>
          {activeContact && (
            <SettingsPanel
              contact={activeContact}
              onUpdateContact={handleUpdateContact}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
