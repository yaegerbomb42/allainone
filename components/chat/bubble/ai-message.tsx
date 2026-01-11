'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { Message } from '@/lib/types';
import { ActionButtons } from './action-buttons';

interface AIMessageProps {
    message: Message;
    isProcessing?: boolean;
    formatTime: (timestamp: number) => string;
    onUIAction: (action: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
    renderInteractiveUI: () => React.ReactNode;
}

export const AIMessage = ({ message, isProcessing, formatTime, onUIAction, renderInteractiveUI }: AIMessageProps) => {
    const hasUIActions = message.metadata?.actions?.some((action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        ['create_goal', 'edit_goal', 'create_habit', 'edit_habit', 'show_goal_ui', 'show_habit_ui'].includes(action.type)
    );

    return (
        <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            className="flex justify-start mb-4"
        >
            <div className="flex items-start space-x-3 max-w-[85%] md:max-w-[70%]">
                {/* AI Avatar */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                    className="flex-shrink-0"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full blur-sm opacity-50" />
                        <div className="relative w-9 h-9 bg-gradient-to-br from-primary via-secondary to-accent rounded-full flex items-center justify-center shadow-lg">
                            <Icon name="Sparkles" className="w-4 h-4 text-white" />
                        </div>
                    </div>
                </motion.div>

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                    <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                        {isProcessing ? (
                            <div className="flex items-center space-x-2">
                                <div className="flex space-x-1">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ y: [0, -6, 0] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                                            className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full"
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">Drift is thinking...</span>
                            </div>
                        ) : (
                            <div>
                                <p className="text-sm leading-relaxed text-card-foreground whitespace-pre-wrap">
                                    {message.content}
                                </p>

                                {hasUIActions && message.metadata?.actions && (
                                    <ActionButtons
                                        actions={message.metadata.actions}
                                        onAction={onUIAction}
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {!isProcessing && (
                        <div className="flex items-center mt-1.5 space-x-2">
                            <span className="text-[10px] text-muted-foreground">{formatTime(message.timestamp)}</span>
                            <span className="text-[10px] text-muted-foreground">•</span>
                            <span className="text-[10px] text-primary font-medium">Drift</span>
                        </div>
                    )}
                </div>
            </div>

            {renderInteractiveUI()}
        </motion.div>
    );
};
