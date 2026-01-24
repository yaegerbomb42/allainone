'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { Message } from '@/lib/types';
import { ActionButtons } from './action-buttons';
import { Card, CardContent } from '@/components/ui/card';

interface AIMessageProps {
    message: Message;
    isProcessing?: boolean;
    formatTime: (timestamp: number) => string;
    onUIAction: (action: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
    renderInteractiveUI: () => React.ReactNode;
}

export const AIMessage = ({ message, isProcessing, formatTime, onUIAction, renderInteractiveUI }: AIMessageProps) => {
    const hasUIActions = message.metadata?.actions?.some((action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        ['create_goal', 'edit_goal', 'create_habit', 'edit_habit', 'show_goal_ui', 'show_habit_ui', 'create_item'].includes(action.type)
    );

    const createdItems = message.metadata?.actions?.filter((a: any) => a.type === 'create_item') || []; // eslint-disable-line @typescript-eslint/no-explicit-any
    const suggestions = message.metadata?.suggestions || [];

    return (
        <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            className="flex flex-col mb-4"
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
                            <div className="space-y-3">
                                <p className="text-sm leading-relaxed text-card-foreground whitespace-pre-wrap">
                                    {message.content}
                                </p>

                                {createdItems.length > 0 && (
                                    <div className="space-y-2 mt-2">
                                        {createdItems.map((item: any, idx: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                                            <Card key={idx} className="bg-muted/30 border-dashed">
                                                <CardContent className="p-3">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                                            <Icon name="Plus" className="w-3.5 h-3.5" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-xs font-semibold truncate">{item.data?.title || item.itemType}</div>
                                                            <div className="text-[10px] text-muted-foreground capitalize">{item.itemType} created</div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}

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

            {/* Suggestions */}
            {!isProcessing && suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 ml-12">
                    {suggestions.map((suggestion: string, idx: number) => (
                        <button
                            key={idx}
                            className="px-3 py-1.5 rounded-full bg-background border border-border hover:border-primary/50 hover:bg-primary/5 text-xs text-muted-foreground hover:text-primary transition-all shadow-sm"
                            onClick={() => onUIAction({ type: 'suggestion', data: { text: suggestion } })}
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}

            {renderInteractiveUI()}
        </motion.div>
    );
};
