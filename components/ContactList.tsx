
import React from 'react';
import { Contact } from '../types';

interface ContactListProps {
  contacts: Contact[];
  activeContactId?: string;
  onSelectContact: (contact: Contact) => void;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, activeContactId, onSelectContact }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => onSelectContact(contact)}
              className={`w-full flex items-center p-4 text-left transition-colors duration-200 ${
                activeContactId === contact.id
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <img
                src={contact.avatarUrl}
                alt={contact.name}
                className="w-12 h-12 rounded-full mr-4 border-2 border-transparent"
              />
              <div className="flex-1 min-w-0">
                <p className={`font-semibold truncate ${
                  activeContactId === contact.id ? 'text-white' : 'text-gray-800 dark:text-gray-200'
                }`}>{contact.name}</p>
                <p className={`text-sm truncate ${
                  activeContactId === contact.id ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                }`}>AI Personality Active</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;
