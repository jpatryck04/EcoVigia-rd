import { useAppStore } from '@/stores/app';

export class NotificationService {
  private static instance: NotificationService;
  
  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  showNotification(title: string, options: NotificationOptions = {}) {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    }
  }

  addInAppNotification(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
    const appStore = useAppStore();
    appStore.addNotification({
      message,
      type
      // Removemos 'read: false' porque no está en la interfaz
    });
  }
}

export const notificationService = NotificationService.getInstance();