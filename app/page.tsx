'use client';


import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { useNotificationContext } from '@/context/NotificationContext';
import MessageBubble from '@/components/chat/message-bubble';
import MessageInput from '@/components/chat/message-input';
import WelcomeScreen from '@/components/chat/welcome-screen';
import Icon from '@/components/ui/icon';
import { useChat } from '@/hooks/use-chat';

export default function Home() {
  const { user } = useAuth();
  const { updateApiKey } = useSettings();
  const {
    messages,
    isLoading,
    showSettings,
    setShowSettings,
    sendMessage,
    setMessages,
    attachments,
    attachFile,
    removeAttachment
  } = useChat();

  const [apiKeyInput, setApiKeyInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };

  const handleQuickAction = (actionId: string, prompt?: string) => {
    if (prompt) {
      handleSendMessage(prompt);
      return;
    }

    // Map quick actions to prompts
    const actionPrompts: Record<string, string> = {
      create_goal: "I want to create a new goal.",
      check_progress: "Can you analyze my progress?",
      add_milestone: "I want to break down a goal into milestones.",
      journal_entry: "I'd like to write a journal entry.",
      focus_session: "Start a focus session.",
      habit_tracker: "Help me track my habits.",
    };

    const actionPrompt = actionPrompts[actionId];
    if (actionPrompt) {
      handleSendMessage(actionPrompt);
    }
  };


  const { showSuccess } = useNotificationContext();

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      updateApiKey(apiKeyInput.trim());
      showSuccess('API Key saved successfully!');
      setShowSettings(false);
      // The useChat hook will automatically pick up the new key and initialize
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent opacity-50" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-30 animate-pulse-slow" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-30 animate-pulse-slow delay-1000" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 glass-card border-b border-border/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <Icon name="Target" className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold text-lg tracking-tight">
            All<span className="text-primary">In</span>One
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
            title="Settings"
            aria-label="Settings"
          >
            <Icon name="Settings" className="w-5 h-5" />
          </button>

          <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center">
            {user ? (
              <span className="text-xs font-medium">{user.name?.[0] || 'U'}</span>
            ) : (
              <Icon name="User" className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 z-0 pt-20 pb-24 overflow-y-auto scrollbar-hide">
        <div className="container max-w-4xl mx-auto px-4">
          {messages.length === 0 ? (
            <WelcomeScreen onQuickAction={handleQuickAction} />
          ) : (
            <div className="space-y-2 py-4">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isProcessing={false} // Can be refined
                />
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  className="flex justify-start mb-4"
                >
                  <div className="flex items-start space-x-3 max-w-[85%]">
                    <div className="w-9 h-9 bg-gradient-to-br from-primary via-secondary to-accent rounded-full flex items-center justify-center shadow-lg">
                      <Icon name="Sparkles" className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
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
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Footer / Input Area */}
      <div className="fixed bottom-0 left-0 right-0 z-10 glass-card border-t border-border/40 pb-6 pt-4 px-4 bg-background/80 backdrop-blur-xl">
        <div className="container max-w-3xl mx-auto">
          <MessageInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            hasMessages={messages.length > 0}
            onClearChat={() => setMessages([])}
            attachments={attachments}
            onAttach={attachFile}
            onRemoveAttachment={removeAttachment}
          />
        </div>
      </div>

      {/* Settings Modal (Primitive) */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card border border-border rounded-2xl shadow-2xl p-6 max-w-md w-full"
            >
              <h2 className="text-xl font-bold mb-4">Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Gemini API Key</label>
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="Enter your API key..."
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Required for AI features.</p>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveApiKey}
                  className="px-4 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors shadow-lg shadow-primary/20"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
