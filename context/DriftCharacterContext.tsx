'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import inAppNotificationService from '@/services/inAppNotificationService';
import { Achievement, Item } from '@/lib/types';

interface DriftCharacterContextType {
    isChatOpen: boolean;
    isVisible: boolean;
    characterMood: string;
    hasUnreadMessages: boolean;
    lastInteraction: number | null;
    openChat: () => void;
    closeChat: () => void;
    setMood: (mood: string) => void;
    markAsUnread: () => void;
    showHelpfulTip: (tip: string) => void;
    showAchievement: (achievement: Achievement) => void;
    showGoalReminder: (goal: Item) => void;
}

const DriftCharacterContext = createContext<DriftCharacterContextType | null>(null);

export const useDriftCharacter = () => {
    const context = useContext(DriftCharacterContext);
    if (!context) {
        throw new Error('useDriftCharacter must be used within a DriftCharacterProvider');
    }
    return context;
};

export const DriftCharacterProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastInteraction, setLastInteraction] = useState<number | null>(null);
    const [characterMood, setCharacterMood] = useState('happy'); // happy, thinking, excited, helpful
    const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

    // Show welcome message on first visit
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const hasSeenWelcome = localStorage.getItem('drift-welcome-seen');
        if (!hasSeenWelcome && user) {
            setTimeout(() => {
                inAppNotificationService.showInfo(
                    "👋 Welcome! Meet Drift, your AI assistant. Click the floating character in the bottom right for help!",
                    { duration: 5000 }
                );
                localStorage.setItem('drift-welcome-seen', 'true');
            }, 3000);
        }
    }, [user]);

    // Track user activity to show/hide character
    useEffect(() => {
        if (typeof window === 'undefined') return;

        let timeout: NodeJS.Timeout;

        const handleActivity = () => {
            setIsVisible(true);
            setLastInteraction(Date.now());

            // Hide character after 30 seconds of inactivity
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (!isChatOpen) {
                    setIsVisible(false);
                }
            }, 30000);
        };

        // Show character on mouse movement or clicks
        document.addEventListener('mousemove', handleActivity);
        document.addEventListener('click', handleActivity);
        document.addEventListener('keydown', handleActivity);

        return () => {
            document.removeEventListener('mousemove', handleActivity);
            document.removeEventListener('click', handleActivity);
            document.removeEventListener('keydown', handleActivity);
            clearTimeout(timeout);
        };
    }, [isChatOpen]);

    // Show character when chat is opened
    useEffect(() => {
        if (isChatOpen) {
            setIsVisible(true);
        }
    }, [isChatOpen]);

    const openChat = () => {
        setIsChatOpen(true);
        setCharacterMood('excited');
        setHasUnreadMessages(false);
        // In Next.js, we might want to use router or just state if it's an overlay
        // For now, let's assume it's an overlay or navigate to home if we are not there
        // window.location.href = '/'; 
    };

    const closeChat = () => {
        setIsChatOpen(false);
        setCharacterMood('happy');
    };

    const setMood = (mood: string) => {
        setCharacterMood(mood);
    };

    const markAsUnread = () => {
        setHasUnreadMessages(true);
    };

    const showHelpfulTip = (tip: string) => {
        setCharacterMood('helpful');
        inAppNotificationService.showInfo(tip, { duration: 4000 });
    };

    const showAchievement = (achievement: Achievement) => {
        setCharacterMood('excited');
        inAppNotificationService.showSuccess(
            `🎉 ${achievement.title}! ${achievement.description}`,
            { duration: 5000 }
        );
    };

    const showGoalReminder = (goal: Item) => {
        setCharacterMood('thinking');
        inAppNotificationService.showWarning(
            `📝 Don't forget about your goal: "${goal.title}"`,
            { duration: 4000 }
        );
    };

    const value = {
        isChatOpen,
        isVisible,
        characterMood,
        hasUnreadMessages,
        lastInteraction,
        openChat,
        closeChat,
        setMood,
        markAsUnread,
        showHelpfulTip,
        showAchievement,
        showGoalReminder,
    };

    return (
        <DriftCharacterContext.Provider value={value}>
            {children}
        </DriftCharacterContext.Provider>
    );
};
