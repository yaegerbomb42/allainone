'use client';


import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { useNotificationContext } from '@/context/NotificationContext';
import MessageBubble from '@/components/chat/message-bubble';
import MessageInput from '@/components/chat/message-input';
import WelcomeScreen from '@/components/chat/welcome-screen';
import Icon from '@/components/ui/icon';
import { useChat } from '@/hooks/use-chat';

import { GoalsWidget } from '@/components/dashboard/goals-widget';
import { HabitsWidget } from '@/components/dashboard/habits-widget';
import { JournalWidget } from '@/components/dashboard/journal-widget';
import { AnalyticsWidget } from '@/components/dashboard/analytics-widget';
import { SmartSuggestions } from '@/components/dashboard/smart-suggestions';

export default function Home() {
  const { user } = useAuth();
  const { settings, updateApiKey } = useSettings();
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
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (showChat) scrollToBottom();
  }, [messages, isLoading, showChat]);

  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };

  const { showSuccess } = useNotificationContext();

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      updateApiKey(apiKeyInput.trim());
      showSuccess('API Key saved successfully!');
      setShowSettings(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-x-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 via-purple-500/5 to-transparent opacity-60" />
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-40 animate-pulse-slow" />
        <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] opacity-30 animate-pulse-slow delay-2000" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass-card-vibrant border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center shadow-xl shadow-primary/20">
            <Icon name="Target" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tighter leading-none">
              All<span className="text-primary">In</span>One
            </h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Life Assistant</p>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
            title="Settings"
          >
            <Icon name="Settings" className="w-5 h-5" />
          </button>

          <Link 
            href="/settings"
            className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/50 dark:bg-white/5 border border-white/20 hover:border-primary/50 transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                {user?.name?.[0] || 'U'}
            </div>
            <span className="text-sm font-bold hidden sm:inline-block">{user?.name?.split(' ')[0] || 'User'}</span>
          </Link>
        </div>
      </header>

      {/* Main Content: Dashboard */}
      <main className="flex-1 z-10 pt-28 pb-20 px-4 sm:px-6">
        <div className="container max-w-7xl mx-auto">
          {/* Hero Welcome */}
          <div className="mb-10">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl sm:text-5xl font-black tracking-tight mb-2"
            >
              Good morning, <span className="text-gradient">{user?.name?.split(' ')[0] || 'Achiever'}</span>
            </motion.h2>
            <p className="text-muted-foreground text-lg font-medium">
              You're on a 7-day streak! Here's what's happening today.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Goals & Habits */}
            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GoalsWidget />
                <HabitsWidget />
              </div>
              
              <AnalyticsWidget />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <JournalWidget />
                <div className="glass-card p-6 flex flex-col items-center justify-center text-center gap-4 min-h-[300px]">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                        <Icon name="Zap" className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Focus Mode</h3>
                        <p className="text-sm text-muted-foreground">Ready for a deep work session?</p>
                    </div>
                    <Link 
                        href="/focus"
                        className="px-6 py-3 bg-foreground text-background font-bold rounded-2xl hover:scale-105 transition-transform"
                    >
                        Start Focus Timer
                    </Link>
                </div>
              </div>
            </div>

            {/* Right Column: AI Suggestions */}
            <div className="lg:col-span-4 space-y-6">
              <SmartSuggestions />
              
              {/* Quick Actions Card */}
              <Card className="glass-card border-none overflow-hidden">
                <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 p-4 border-b border-white/10">
                    <h3 className="font-bold text-sm">Quick Actions</h3>
                </div>
                <CardContent className="p-2">
                    <div className="grid grid-cols-2 gap-2">
                        {[{
                            icon: 'Target', label: 'New Goal', color: 'text-primary' },
                            { icon: 'Plus', label: 'Add Todo', color: 'text-blue-500' },
                            { icon: 'Repeat', label: 'Track Habit', color: 'text-orange-500' },
                            { icon: 'BookOpen', label: 'Journal', color: 'text-purple-500' }
                        ].map((action) => (
                            <button 
                                key={action.label}
                                className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors group"
                            >
                                <Icon name={action.icon as any} className={cn("w-6 h-6 transition-transform group-hover:scale-110", action.color)} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Drift Assistant */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
            {showChat && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: 'bottom right' }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="absolute bottom-20 right-0 w-[380px] h-[500px] glass-card-vibrant border-primary/20 shadow-2xl flex flex-col overflow-hidden rounded-3xl"
                >
                    <div className="p-4 border-b border-white/10 bg-primary/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                                <Icon name="Sparkles" className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Drift</h3>
                                <p className="text-[10px] text-primary font-bold uppercase">AI Assistant</p>
                            </div>
                        </div>
                        <button onClick={() => setShowChat(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                            <Icon name="X" className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-4">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-bounce">
                                    <Icon name="Sparkles" className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-bold">How can I help today?</h4>
                                    <p className="text-xs text-muted-foreground mt-1">I can help you add goals, track habits, or analyze your progress.</p>
                                </div>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <MessageBubble key={msg.id} message={msg} />
                            ))
                        )}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-muted/50 rounded-2xl rounded-tl-sm px-4 py-2 text-xs">Drift is thinking...</div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    
                    <div className="p-4 border-t border-white/10 bg-white/5">
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
                </motion.div>
            )}
        </AnimatePresence>
        
        <button 
            onClick={() => setShowChat(!showChat)}
            className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95",
                showChat ? "bg-white dark:bg-zinc-800 text-primary" : "bg-primary text-white"
            )}
        >
            {showChat ? <Icon name="X" className="w-8 h-8" /> : <Icon name="Sparkles" className="w-8 h-8" />}
            {!showChat && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold">1</span>
            )}
        </button>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card-vibrant border-white/20 rounded-3xl shadow-2xl p-8 max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black">Settings</h2>
                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <Icon name="X" className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Gemini API Key</label>
                  <div className="relative">
                    <input
                        type="password"
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        placeholder="Enter your API key..."
                        className="w-full pl-4 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Icon name="Key" className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 font-medium">
                    Your key is stored locally and used for AI features.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-8">
                <button
                  onClick={handleSaveApiKey}
                  className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 active:scale-95"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full py-4 text-sm font-bold text-muted-foreground hover:bg-white/5 rounded-2xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
