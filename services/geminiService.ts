import { GoogleGenAI, Modality } from "@google/genai";
import { Message } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateReply = async (messageHistory: Message[], personality: string): Promise<string> => {
    if (messageHistory.length === 0) {
        // This case might not be hit if the UI always sends at least one message.
        // Returning a default greeting if it is empty.
        return "Hello! What can I help you with today?";
    }

    // Convert the message history into the format required by the Gemini API.
    // The roles must be 'user' and 'model'.
    const contents = messageHistory.map(message => ({
        role: message.sender === 'user' ? 'user' : 'model',
        parts: [{ text: message.text }],
    }));

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents, // Pass the entire conversation history.
            config: {
                systemInstruction: personality,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        return "I encountered an error. Could you please rephrase that?";
    }
};

export const generateSpeech = async (text: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        // Using a high-quality voice for a more natural sound
                        prebuiltVoiceConfig: { voiceName: 'Kore' }, 
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data received from Gemini TTS API.");
        }
        return base64Audio;
    } catch (error) {
        console.error("Gemini TTS API call failed:", error);
        // Re-throw the error so the hook can handle it, e.g., by not playing anything.
        throw error;
    }
};