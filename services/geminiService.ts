
import { GoogleGenAI, Chat } from "@google/genai";
import { Message } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// We use a cache for chat sessions to maintain conversation history.
// A more robust solution might use a proper caching library or state management.
const chatSessionCache: Record<string, Chat> = {};

const getChatSession = (contactId: string, personality: string): Chat => {
    // A unique key for the contact and their current personality
    const cacheKey = `${contactId}-${personality}`;
    
    if (!chatSessionCache[cacheKey]) {
        chatSessionCache[cacheKey] = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: personality,
            },
        });
    }
    return chatSessionCache[cacheKey];
};


export const generateReply = async (messageHistory: Message[], personality: string): Promise<string> => {
    if (messageHistory.length === 0) {
        return "Hello! What can I help you with today?";
    }

    // Assuming the last message is from the user, which triggers the reply.
    const lastUserMessage = messageHistory[messageHistory.length - 1];

    // For simplicity, we'll re-establish the chat session based on the contact's ID from the message history.
    // In a real app, you would pass the contact ID directly.
    // This is a placeholder as we don't store contact ID in message object.
    const contactId = "current_contact";

    const chat = getChatSession(contactId, personality);
    
    try {
        const result = await chat.sendMessage({ message: lastUserMessage.text });
        return result.text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        return "I encountered an error. Could you please rephrase that?";
    }
};
