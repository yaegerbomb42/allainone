'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Message } from '@/lib/types';

interface UserMessageProps {
    message: Message;
    formatTime: (timestamp: number) => string;
}

export const UserMessage = ({ message, formatTime }: UserMessageProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            className="flex justify-end mb-4"
        >
            <div className="max-w-[85%] md:max-w-[70%]">
                <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl rounded-br-md blur opacity-30" />
                    <div className="relative bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3 shadow-lg">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                </div>
                <div className="flex justify-end mt-1.5">
                    <span className="text-[10px] text-muted-foreground">{formatTime(message.timestamp)}</span>
                </div>
            </div>
        </motion.div>
    );
};
