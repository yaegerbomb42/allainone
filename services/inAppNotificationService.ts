import { NOTIFICATION_PRIORITY, NOTIFICATION_TYPES } from '@/context/NotificationContext';

class InAppNotificationService {
    private notificationContext: any = null;
    private isInitialized: boolean = false;

    init(notificationContext: any) {
        this.notificationContext = notificationContext;
        this.isInitialized = true;
    }

    isReady() {
        if (!this.isInitialized && typeof window !== 'undefined') {
            // Auto-init logic if needed, skipping for now to keep it simple
        }
        return this.isInitialized && this.notificationContext;
    }

    showInfo(message: string, options: any = {}) {
        if (!this.isReady()) return;
        this.notificationContext.showInfo(message, options);
    }

    showSuccess(message: string, options: any = {}) {
        if (!this.isReady()) return;
        this.notificationContext.showSuccess(message, options);
    }

    showWarning(message: string, options: any = {}) {
        if (!this.isReady()) return;
        this.notificationContext.showWarning(message, options);
    }

    showError(message: string, options: any = {}) {
        if (!this.isReady()) return;
        this.notificationContext.showError(message, options);
    }

    // Ported utility methods
    showDriftProgress(message: string, progressData: any = {}) {
        if (!this.isReady()) return;

        this.notificationContext.addNotification({
            type: NOTIFICATION_TYPES.DRIFT_PROGRESS,
            title: 'Drift Progress Update',
            message,
            priority: NOTIFICATION_PRIORITY.MEDIUM,
            timeout: 6000,
            actions: [
                {
                    label: 'View Chat',
                    primary: true,
                    callback: () => {
                        // Use Next.js router if possible, or fallback to window
                        window.location.href = '/ai-assistant-chat-drift';
                    }
                }
            ],
            data: progressData
        });
    }

    // Test notification for debugging
    showTest() {
        if (!this.isReady()) return;

        this.notificationContext.addNotification({
            type: NOTIFICATION_TYPES.INFO,
            title: '🧪 Test Notification',
            message: 'This is a test notification to verify the in-app notification system is working correctly.',
            priority: NOTIFICATION_PRIORITY.MEDIUM,
            timeout: 5000,
            actions: [
                {
                    label: 'Test Action',
                    primary: true,
                    callback: () => {
                        console.log('Test action clicked!');
                    }
                }
            ]
        });
    }
}

const inAppNotificationService = new InAppNotificationService();
export default inAppNotificationService;
