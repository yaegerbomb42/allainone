'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export const NOTIFICATION_TYPES = {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    DRIFT_PROGRESS: 'drift_progress',
    HABIT_REMINDER: 'habit_reminder',
    HABIT_STREAK: 'habit_streak',
    GOAL_DEADLINE: 'goal_deadline',
    GOAL_MILESTONE: 'goal_milestone',
    ACHIEVEMENT: 'achievement',
    MEAL_REMINDER: 'meal_reminder',
    JOURNAL_REMINDER: 'journal_reminder',
    FOCUS_REMINDER: 'focus_reminder',
    DAILY_MOTIVATION: 'daily_motivation',
    SYSTEM: 'system',
};

export const NOTIFICATION_PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent',
};

export interface NotificationAction {
    label: string;
    primary?: boolean;
    callback: () => void;
}

export interface Notification {
    id: string;
    type: string;
    title?: string;
    message: string;
    priority: string;
    timeout?: number;
    persistent?: boolean;
    actions?: NotificationAction[];
    data?: any;
    timestamp: number;
}

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (notification: Partial<Notification>) => void;
    removeNotification: (id: string) => void;
    showSuccess: (message: string, options?: any) => void;
    showError: (message: string, options?: any) => void;
    showInfo: (message: string, options?: any) => void;
    showWarning: (message: string, options?: any) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const addNotification = useCallback((notification: Partial<Notification>) => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const newNotification: Notification = {
            id,
            type: notification.type || NOTIFICATION_TYPES.INFO,
            message: notification.message || '',
            priority: notification.priority || NOTIFICATION_PRIORITY.LOW,
            timestamp: Date.now(),
            timeout: notification.timeout || 5000,
            ...notification,
        };

        setNotifications((prev) => [...prev, newNotification]);

        if (!newNotification.persistent && newNotification.timeout && newNotification.timeout > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, newNotification.timeout);
        }
    }, [removeNotification]);

    const showSuccess = useCallback((message: string, options: any = {}) => {
        addNotification({
            type: NOTIFICATION_TYPES.SUCCESS,
            message,
            priority: NOTIFICATION_PRIORITY.MEDIUM,
            ...options,
        });
    }, [addNotification]);

    const showError = useCallback((message: string, options: any = {}) => {
        addNotification({
            type: NOTIFICATION_TYPES.ERROR,
            message,
            priority: NOTIFICATION_PRIORITY.HIGH,
            ...options,
        });
    }, [addNotification]);

    const showInfo = useCallback((message: string, options: any = {}) => {
        addNotification({
            type: NOTIFICATION_TYPES.INFO,
            message,
            priority: NOTIFICATION_PRIORITY.LOW,
            ...options,
        });
    }, [addNotification]);

    const showWarning = useCallback((message: string, options: any = {}) => {
        addNotification({
            type: NOTIFICATION_TYPES.WARNING,
            message,
            priority: NOTIFICATION_PRIORITY.MEDIUM,
            ...options,
        });
    }, [addNotification]);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                addNotification,
                removeNotification,
                showSuccess,
                showError,
                showInfo,
                showWarning,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotificationContext = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotificationContext must be used within a NotificationProvider');
    }
    return context;
};
