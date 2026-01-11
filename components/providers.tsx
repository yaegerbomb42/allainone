'use client';

import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { DriftCharacterProvider } from '@/context/DriftCharacterContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { NotificationInitializer } from '@/components/notification-initializer';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <SettingsProvider>
                <NotificationProvider>
                    <NotificationInitializer />
                    <DriftCharacterProvider>
                        {children}
                    </DriftCharacterProvider>
                </NotificationProvider>
            </SettingsProvider>
        </AuthProvider>
    );
}
