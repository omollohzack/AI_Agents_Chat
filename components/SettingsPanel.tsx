
import React, { useState, useEffect } from 'react';
import { Contact } from '../types';
import { Bot, Save, Edit, X } from 'lucide-react';

interface SettingsPanelProps {
  contact: Contact;
  onUpdateContact: (contact: Contact) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ contact, onUpdateContact }) => {
  const [personality, setPersonality] = useState(contact.personality);
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setPersonality(contact.personality);
    setIsEditing(false); // Reset editing state on contact change
  }, [contact]);

  const handleSave = () => {
    onUpdateContact({ ...contact, personality });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setPersonality(contact.personality);
    setIsEditing(false);
  };
  
  if (!isOpen) {
    return (
        <div className="hidden lg:flex items-center justify-center w-16 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
            <button 
                onClick={() => setIsOpen(true)}
                className="p-2 text-gray-500 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                aria-label="Open settings panel"
            >
                <Bot size={24} />
            </button>
        </div>
    );
  }

  return (
    <div className="w-full md:w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6 flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Bot className="mr-3 text-blue-500" />
            AI Settings
        </h3>
        <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
             <X size={24} />
        </button>
      </div>

      <div className="mb-4 text-center">
        <img src={contact.avatarUrl} alt={contact.name} className="w-24 h-24 rounded-full mx-auto mb-2 border-4 border-blue-400" />
        <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">{contact.name}</p>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-2">
            <label htmlFor="personality" className="font-semibold text-gray-700 dark:text-gray-300">
            Personality Prompt
            </label>
            {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="flex items-center text-sm text-blue-500 hover:text-blue-600 font-medium">
                    <Edit size={14} className="mr-1" /> Edit
                </button>
            )}
        </div>

        <div className="flex-1 min-h-0">
          <textarea
            id="personality"
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            readOnly={!isEditing}
            className={`w-full h-full p-3 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700 dark:text-gray-300 transition-colors ${
              isEditing ? 'border-blue-400 focus:ring-2 focus:ring-blue-300' : 'border-gray-300 dark:border-gray-600'
            } resize-none focus:outline-none`}
          />
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center transition-colors"
            >
              <Save size={16} className="mr-2" /> Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;
