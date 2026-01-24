
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { useDriftCharacter } from '@/context/DriftCharacterContext';
import { useNotificationContext } from '@/context/NotificationContext';
import { Message } from '@/lib/types';
import { generateAIResponse } from '@/app/actions';
import logger from '@/lib/services/logger';

export function useChat() {
    const { user } = useAuth();
    const { settings } = useSettings();
    const { setMood } = useDriftCharacter();
    const { showError } = useNotificationContext();

    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const [attachments, setAttachments] = useState<string[]>([]);

    const attachFile = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setAttachments(prev => [...prev, base64String]);
        };
        reader.readAsDataURL(file);
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim() && attachments.length === 0) return;

        // Check for API key
        if (!settings.geminiApiKey) {
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now(),
                    content: content,
                    sender: 'user',
                    timestamp: Date.now(),
                },
                {
                    id: Date.now() + 1,
                    content: "I need a Gemini API key to start helping you. Please configure it in settings.",
                    sender: 'system',
                    timestamp: Date.now(),
                }
            ]);
            setShowSettings(true);
            return;
        }

        const newMessage: Message = {
            id: Date.now(),
            content: content,
            sender: 'user',
            timestamp: Date.now(),
        };

        if (attachments.length > 0) {
            // Simplified metadata for resizing/display logic in UI not fully implemented yet
            // Just marking that it has an image
            // We'll trust the UI to assume the last uploaded image corresponds to the message if needed, 
            // or just rely on 'content' mentioning it. 
            // Better: Add attachment metadata to Message type? 
            // For now, simpler is fine.
        }

        setMessages(prev => [...prev, newMessage]);
        setIsLoading(true);
        setMood('thinking');

        // Clear attachments immediately from input state
        const currentAttachments = [...attachments];
        setAttachments([]);

        try {
            // Build context
            const context = {
                user: user || { name: 'Guest' },
                conversationHistory: messages.slice(-5).map(m => ({
                    role: m.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: m.content }]
                })),
                currentGoals: [],
            };

            const response = await generateAIResponse(settings.geminiApiKey, content, context, currentAttachments);

            const aiMessage: Message = {
                id: Date.now() + 1,
                content: response.message,
                sender: 'assistant',
                timestamp: Date.now(),
                metadata: {
                    actions: response.actions as any,
                    suggestions: response.suggestions,
                }
            };

            setMessages(prev => [...prev, aiMessage]);
            setMood('happy');
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            logger.error('Chat error:', error);
            showError(error.message || 'Failed to get response');

            const errorMessage: Message = {
                id: Date.now() + 1,
                content: "I'm having trouble connecting right now. Please check your API key or try again later.",
                sender: 'system',
                timestamp: Date.now(),
            };
            setMessages(prev => [...prev, errorMessage]);
            setMood('helpful');
        } finally {
            setIsLoading(false);
        }
    }, [settings.geminiApiKey, user, messages, setMood, showError, attachments]);

    const clearChat = useCallback(() => {
        setMessages([]);
    }, []);

    return {
        messages,
        isLoading,
        showSettings,
        setShowSettings,
        sendMessage,
        setMessages,
        clearChat,
        attachments,
        attachFile,
        removeAttachment
    };
}
