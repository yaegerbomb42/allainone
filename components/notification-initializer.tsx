'use client';

import { useEffect } from 'react';
import { useNotificationContext } from '@/context/NotificationContext';
import inAppNotificationService from '@/services/inAppNotificationService';

export function NotificationInitializer() {
    const notificationContext = useNotificationContext();

    useEffect(() => {
        if (notificationContext) {
            inAppNotificationService.init(notificationContext);
        }
    }, [notificationContext]);

    return null;
}
