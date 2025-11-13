
export interface Contact {
  id: string;
  name: string;
  avatarUrl: string;
  personality: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'contact';
  timestamp: Date;
  avatarUrl?: string;
}
