import { useState, useCallback, useRef, useEffect } from 'react';
import { Message } from '../types';
import { generateSpeech } from '../services/geminiService';

// Helper function to decode base64 string to Uint8Array
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper function to decode raw audio data into an AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const hasAudioContext = !!(window.AudioContext || (window as any).webkitAudioContext);

export const useSpeechSynthesis = () => {
  const [nowPlayingId, setNowPlayingId] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  // Initialize AudioContext once when the hook is used.
  useEffect(() => {
    if (hasAudioContext && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.onended = null; // Prevent onended from firing on manual stop
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
    setNowPlayingId(null);
  }, []);

  const playAudio = useCallback(async (message: Message) => {
    const audioContext = audioContextRef.current;
    if (!hasAudioContext || !audioContext) {
      console.warn('Web Audio API is not supported in this browser.');
      return;
    }
    stopAudio();
    
    setNowPlayingId(message.id);

    try {
      const base64Audio = await generateSpeech(message.text);
      const audioData = decode(base64Audio);
      const audioBuffer = await decodeAudioData(audioData, audioContext, 24000, 1);
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      
      source.onended = () => {
        if (sourceNodeRef.current === source) {
            setNowPlayingId(null);
            sourceNodeRef.current = null;
        }
      };

      source.start();
      sourceNodeRef.current = source;
    } catch (error) {
      console.error("Failed to play audio:", error);
      setNowPlayingId(null); // Reset state on error
    }
  }, [stopAudio]);

  // Cleanup effect to stop audio on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  return {
    nowPlayingId,
    isPlaying: !!nowPlayingId,
    playAudio,
    stopAudio,
    hasSynthesisSupport: hasAudioContext,
  };
};