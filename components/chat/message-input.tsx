'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Icon from '@/components/ui/icon';
import VoiceInput from './voice-input';

interface MessageInputProps {
    onSendMessage: (message: string) => void;
    isLoading: boolean;
    placeholder?: string;
    onClearChat?: () => void;
    onClearAllHistory?: () => void;
    hasMessages?: boolean;
    attachments?: string[];
    onAttach?: (file: File) => void;
    onRemoveAttachment?: (index: number) => void;
}

const MessageInput = ({
    onSendMessage,
    isLoading,
    placeholder = "Ask Drift anything...",
    onClearChat,
    onClearAllHistory,
    hasMessages = false,
    attachments = [],
    onAttach,
    onRemoveAttachment
}: MessageInputProps) => {
    const [message, setMessage] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (message.trim() && !isLoading && onSendMessage) {
            onSendMessage(message.trim());
            setMessage('');
            if (textareaRef.current) {
                textareaRef.current.style.height = '52px';
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const adjustHeight = () => {
        const target = textareaRef.current;
        if (target) {
            target.style.height = 'auto';
            target.style.height = Math.min(Math.max(target.scrollHeight, 52), 150) + 'px';
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [message]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && onAttach) {
            onAttach(e.target.files[0]);
        }
    };

    return (
        <div className="relative w-full">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

            <form onSubmit={handleSubmit}>
                <div className="relative">
                    {/* Attachments Preview */}
                    {attachments.length > 0 && (
                        <div className="flex gap-2 mb-2 overflow-x-auto pb-2 px-1">
                            {attachments.map((src, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative flex-shrink-0"
                                >
                                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-border/50 relative">
                                        <Image src={src} alt="Attachment" fill className="object-cover" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => onRemoveAttachment?.(index)}
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs shadow-md transform hover:scale-110 transition-transform"
                                        title="Remove attachment"
                                        aria-label="Remove attachment"
                                    >
                                        <Icon name="X" className="w-3 h-3" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Focus glow effect */}
                    <motion.div
                        initial={false}
                        animate={{
                            opacity: isFocused ? 1 : 0,
                            scale: isFocused ? 1 : 0.98,
                        }}
                        className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 rounded-2xl blur-sm pointer-events-none"
                    />

                    <div className="relative flex items-end gap-2 bg-surface-700/50 backdrop-blur-sm border border-border/30 rounded-2xl p-2 focus-within:border-primary/30 transition-all">
                        {/* Options button */}
                        <button
                            type="button"
                            onClick={() => setShowOptions(!showOptions)}
                            className="flex-shrink-0 p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all"
                            title="More options"
                            aria-label="More options"
                        >
                            <Icon name="Plus" className="w-5 h-5" />
                        </button>

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isLoading}
                            className="flex-shrink-0 p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all"
                            title="Attach image"
                            aria-label="Attach image"
                        >
                            <Icon name="Image" className="w-5 h-5" />
                        </button>

                        <VoiceInput
                            onTranscript={(text) => setMessage(prev => prev + (prev ? ' ' : '') + text)}
                            disabled={isLoading}
                        />

                        {/* Text input */}
                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder={placeholder}
                            disabled={isLoading}
                            rows={1}
                            className="flex-1 resize-none bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm py-2 min-h-[36px] max-h-[150px] overflow-hidden scrollbar-hide"
                            style={{ height: '36px' }}
                        />

                        {/* Send Button */}
                        <motion.button
                            type="submit"
                            disabled={!message.trim() || isLoading}
                            className={`flex-shrink-0 p-2.5 rounded-xl flex items-center justify-center transition-all ${message.trim() && !isLoading
                                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl'
                                : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
                                }`}
                            whileHover={message.trim() && !isLoading ? { scale: 1.05 } : {}}
                            whileTap={message.trim() && !isLoading ? { scale: 0.95 } : {}}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Icon name="Send" className="w-5 h-5" />
                            )}
                        </motion.button>
                    </div>
                </div>
            </form>

            {/* Options Panel */}
            <AnimatePresence>
                {showOptions && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full left-0 mb-2 p-2 glass-card w-full"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                                <span className="text-xs text-muted-foreground">{message.length}/2000</span>
                                {message.length > 1800 && (
                                    <span className="text-xs text-warning">Approaching limit</span>
                                )}
                            </div>

                            {hasMessages && (
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => { onClearChat?.(); setShowOptions(false); }}
                                        className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <Icon name="Eraser" className="w-3 h-3" />
                                        <span>Clear Display</span>
                                    </button>
                                    <button
                                        onClick={() => { onClearAllHistory?.(); setShowOptions(false); }}
                                        className="flex items-center space-x-1 text-xs text-destructive hover:text-destructive/80 px-2 py-1 rounded-lg hover:bg-destructive/10 transition-colors"
                                    >
                                        <Icon name="Trash2" className="w-3 h-3" />
                                        <span>Clear Memory</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom hint */}
            <div className="flex items-center justify-center mt-2">
                <div className="flex items-center space-x-2 text-[10px] text-muted-foreground">
                    <span>Press</span>
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-muted-foreground">Enter</kbd>
                    <span>to send,</span>
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-muted-foreground">Shift + Enter</kbd>
                    <span>for new line</span>
                </div>
            </div>
        </div>
    );
};

export default MessageInput;
