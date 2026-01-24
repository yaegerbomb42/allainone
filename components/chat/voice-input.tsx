'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils'; // Assuming generic utility exists
import logger from '@/lib/services/logger';

interface VoiceInputProps {
    onTranscript: (text: string) => void;
    disabled?: boolean;
}

export default function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // @ts-expect-error - Vendor prefixes not in standard types
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = false;
                recognitionRef.current.lang = 'en-US';

                recognitionRef.current.onstart = () => {
                    setIsListening(true);
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                };

                recognitionRef.current.onresult = (event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                    const transcript = event.results[0][0].transcript;
                    if (transcript) {
                        onTranscript(transcript);
                    }
                };

                recognitionRef.current.onerror = (event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                    logger.error('Speech recognition error', event.error);
                    setIsListening(false);
                };
            }
        }
    }, [onTranscript]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Voice input not supported in this browser.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    };

    return (
        <div className="relative">
            <AnimatePresence>
                {isListening && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 0.5 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="absolute inset-0 bg-red-500 rounded-full blur-md"
                    />
                )}
            </AnimatePresence>
            <button
                type="button"
                onClick={toggleListening}
                disabled={disabled}
                title={isListening ? "Stop listening" : "Start voice input"}
                aria-label={isListening ? "Stop listening" : "Start voice input"}
                className={cn(
                    "relative z-10 p-2 rounded-xl transition-all",
                    isListening
                        ? "bg-red-500 text-white shadow-lg"
                        : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                )}
            >
                <Icon name={isListening ? "MicOff" : "Mic"} className="w-5 h-5" />
            </button>
        </div>
    );
}
