'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { settingsService } from '@/lib/firestore';

interface SettingsContextType {
    settings: any;
    updateSettings: (updates: any) => void;
    updateApiKey: (apiKey: string) => void;
    isMusicMuted: boolean;
    setMusicMuted: (muted: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, isAuthenticated } = useAuth();
    const [settings, setSettings] = useState({
        appearance: {
            theme: 'system',
            accentColor: 'indigo',
            backgroundEffect: 'none',
            backgroundMusic: 'none',
            backgroundMusicVolume: 0.5,
        },
        // Default null to force user to input it or load from storage
        geminiApiKey: '',
    });
    const [, setIsLoaded] = useState(false);
    const [isMusicMuted, setMusicMuted] = useState(false);

    // Initialize from localStorage
    useEffect(() => {
        const savedSettings = localStorage.getItem('justgoals-settings');
        if (savedSettings) {
            try {
                setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
            } catch { }
        }
        setIsLoaded(true);
    }, []);

    // Sync with Firestore
    useEffect(() => {
        async function loadSettings() {
            if (isAuthenticated && user && user.id) {
                try {
                    const remoteSettings = await settingsService.getAppSettings(user.id);
                    if (remoteSettings && Object.keys(remoteSettings).length > 0) {
                        setSettings(prev => ({ ...prev, ...remoteSettings }));
                        localStorage.setItem('justgoals-settings', JSON.stringify(remoteSettings));
                    }
                } catch (error) {
                    // Fallback to localStorage
                    console.error("Failed to load settings from Firestore", error);
                }
            }
        }
        loadSettings();
    }, [isAuthenticated, user]);

    const updateSettings = (updates: any) => {
        setSettings(prev => {
            const newSettings = { ...prev, ...updates };
            localStorage.setItem('justgoals-settings', JSON.stringify(newSettings));
            // Sync to firestore if user exists
            if (isAuthenticated && user && user.id) {
                settingsService.saveAppSettings(user.id, newSettings).catch(console.error);
            }
            return newSettings;
        });
    };

    const updateApiKey = (apiKey: string) => {
        setSettings(prev => {
            const updated = { ...prev, geminiApiKey: apiKey };
            localStorage.setItem('justgoals-settings', JSON.stringify(updated));
            if (isAuthenticated && user && user.id) {
                settingsService.saveAppSettings(user.id, updated).catch(console.error);
            }
            return updated;
        });
    };

    const value = {
        settings,
        updateSettings,
        updateApiKey,
        isMusicMuted,
        setMusicMuted,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
