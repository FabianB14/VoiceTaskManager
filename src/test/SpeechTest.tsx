'use client';
import { useState, useRef } from 'react';

// Declare the webkitSpeechRecognition type
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}
import { motion } from 'framer-motion';

export default function SpeechTest() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    setError('');
    setTranscript('');

    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new webkitSpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        console.log('Started listening...');
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        
        // Loop through results to get both interim and final results
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript = event.results[i][0].transcript;
        }
        
        console.log('Current transcript:', currentTranscript);
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Error:', event.error);
        setError(`Error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };

      recognition.start();
    } else {
      setError('Speech recognition not supported in this browser. Please use Chrome.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isListening ? stopListening : startListening}
          className={`
            px-6 py-3 rounded-full font-medium
            ${isListening 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-blue-500 hover:bg-blue-600'
            } 
            text-white shadow-lg transition-all
          `}
        >
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </motion.button>
      </div>

      {transcript && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-750 rounded-xl p-6 shadow-lg"
        >
          <h2 className="font-semibold mb-3 text-blue-600 dark:text-blue-400">Transcript:</h2>
          <p className="text-gray-700 dark:text-gray-300">{transcript}</p>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      {isListening && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-gray-500"
        >
          🎤 Listening...
        </motion.div>
      )}
    </div>
  );
}