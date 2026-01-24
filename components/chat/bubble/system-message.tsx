'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Message } from '@/lib/types';

interface SystemMessageProps {
    message: Message;
}

export const SystemMessage = ({ message }: SystemMessageProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center my-3"
        >
            <div className="px-4 py-2 bg-muted/50 border border-border/30 rounded-full">
                <p className="text-xs text-muted-foreground">{message.content}</p>
            </div>
        </motion.div>
    );
};
