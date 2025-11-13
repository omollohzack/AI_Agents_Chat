
import { useState, useEffect, useRef } from 'react';

// FIX: Cast window to `any` to access experimental SpeechRecognition APIs which may not be in the default TS Window type.
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const hasRecognitionSupport = !!SpeechRecognition;

export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  // FIX: Use `any` for the ref's type. The `SpeechRecognition` type might not be available
  // in the TypeScript scope, and the variable on line 4 shadows the type name.
  const recognitionRef = useRef<any | null>(null);

  useEffect(() => {
    if (!hasRecognitionSupport) {
      console.warn('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    // FIX: Use `any` for the event type as `SpeechRecognitionEvent` may not be available.
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(t => t + finalTranscript);
    };

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onend = () => {
      setIsListening(false);
    };
    
    // FIX: Use `any` for the event type as `SpeechRecognitionErrorEvent` may not be available.
    recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
    };

    recognitionRef.current = recognition;
    
    return () => {
        recognition.stop();
    };

  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
  };
};
