'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDriftCharacter } from '@/context/DriftCharacterContext';
import Icon from '@/components/ui/icon';
import { useRouter, usePathname } from 'next/navigation';

export const DriftAvatar = () => {
    const { isVisible, characterMood } = useDriftCharacter();
    const router = useRouter();
    const pathname = usePathname();

    // Hide on the main chat page to avoid duplication, unless we want it as a "companion"
    // For now, let's keep it visible everywhere as a "fab" except maybe the chat page if it interferes?
    // Actually, on mobile it might interfere with the input.
    // If pathname === '/', maybe we minimize it or hide it?
    // Let's hide it on '/' since that IS the chat interface.
    if (!isVisible || pathname === '/') return null;

    const moodConfig = {
        happy: { icon: 'Smile', color: 'from-primary to-secondary', scale: 1 },
        thinking: { icon: 'MoreHorizontal', color: 'from-blue-500 to-indigo-500', scale: 1.1 },
        excited: { icon: 'Zap', color: 'from-yellow-400 to-orange-500', scale: 1.2 },
        helpful: { icon: 'Heart', color: 'from-pink-500 to-rose-500', scale: 1.1 }
    }[characterMood] || { icon: 'Smile', color: 'from-primary to-secondary', scale: 1 };

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50 pointer-events-auto"
        >
            <motion.button
                onClick={() => router.push('/')}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className={`w-14 h-14 rounded-full bg-gradient-to-br ${moodConfig.color} shadow-2xl flex items-center justify-center relative group`}
            >
                {/* Glow effect */}
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${moodConfig.color} blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500`} />

                <div className="relative z-10 text-white">
                    {/* @ts-ignore */}
                    <Icon name={moodConfig.icon} className="w-7 h-7" />
                </div>

                {/* Status Indicator */}
                <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
            </motion.button>
        </motion.div>
    );
};
