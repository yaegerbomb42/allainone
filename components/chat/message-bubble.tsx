'use client';

import React, { useState } from 'react';
import { Message } from '@/lib/types';
import { UserMessage } from './bubble/user-message';
import { AIMessage } from './bubble/ai-message';
import { SystemMessage } from './bubble/system-message';

interface MessageBubbleProps {
    message: Message;
    isProcessing?: boolean;
    onActionComplete?: (actionType: string, data: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const MessageBubble = ({ message, isProcessing = false, onActionComplete }: MessageBubbleProps) => {
    const isUser = message.sender === 'user';
    const isAI = message.sender === 'assistant' || message.sender === 'ai' || message.sender === 'drift';
    const [showInteractiveUI, setShowInteractiveUI] = useState(false);
    const [activeUIType, setActiveUIType] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const [initialUIData, setInitialUIData] = useState<any>({});

    const handleUIAction = (action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        setActiveUIType(action.type);
        setInitialUIData(action.data || {});
        setShowInteractiveUI(true);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleUISubmit = (data: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        setShowInteractiveUI(false);
        setActiveUIType(null);
        if (onActionComplete && activeUIType) {
            onActionComplete(activeUIType, data);
        }
    };

    const handleUICancel = () => { // eslint-disable-line @typescript-eslint/no-unused-vars
        setShowInteractiveUI(false);
        setActiveUIType(null);
        setInitialUIData({});
    };

    const renderInteractiveUI = () => {
        if (!showInteractiveUI) return null;
        // TODO: Port creation cards
        return <div className="p-4 bg-muted rounded-lg">Interactive UI Placeholder for {activeUIType}</div>;
    };

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (isUser) {
        return <UserMessage message={message} formatTime={formatTime} />;
    }

    if (isAI) {
        return (
            <AIMessage
                message={message}
                isProcessing={isProcessing}
                formatTime={formatTime}
                onUIAction={handleUIAction}
                renderInteractiveUI={renderInteractiveUI}
            />
        );
    }

    if (message.sender === 'system') {
        return <SystemMessage message={message} />;
    }

    return null;
};

export default MessageBubble;
