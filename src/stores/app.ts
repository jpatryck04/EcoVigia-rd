import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, EnvironmentalReport } from '@/types';

// Definir interface para Notification corregida
interface AppNotification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: Date;
}

export const useAppStore = defineStore('app', () => {
  // State
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const isLoading = ref(false);
  const online = ref(navigator.onLine);
  const currentLocation = ref<{ lat: number; lng: number } | null>(null);
  const reports = ref<EnvironmentalReport[]>([]);
  const notifications = ref<AppNotification[]>([]);

  // Getters
  const userInitials = computed(() => {
    if (!user.value) return '';
    return user.value.nombre
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  });

  const pendingReports = computed(() => 
    reports.value.filter(r => r.estado === 'pendiente')
  );

  const unreadNotifications = computed(() =>
    notifications.value.filter(n => !n.read).length
  );

  // Actions
  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  const setLocation = (lat: number, lng: number) => {
    currentLocation.value = { lat, lng };
  };

  const addReport = (report: EnvironmentalReport) => {
    reports.value.unshift(report);
  };

  const updateReport = (id: string, updates: Partial<EnvironmentalReport>) => {
    const index = reports.value.findIndex(r => r.id === id);
    if (index !== -1) {
      reports.value[index] = { ...reports.value[index], ...updates };
    }
  };

  const addNotification = (notification: { message: string; type: 'info' | 'success' | 'warning' | 'error' }) => {
    const newNotification: AppNotification = {
      id: Date.now().toString(),
      message: notification.message,
      type: notification.type,
      read: false,
      timestamp: new Date()
    };
    notifications.value.unshift(newNotification);
  };

  const markNotificationAsRead = (id: string) => {
    const notification = notifications.value.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
  };

  const clearNotifications = () => {
    notifications.value = [];
  };

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    online,
    currentLocation,
    reports,
    notifications,
    
    // Getters
    userInitials,
    pendingReports,
    unreadNotifications,
    
    // Actions
    setLoading,
    setLocation,
    addReport,
    updateReport,
    addNotification,
    markNotificationAsRead,
    clearNotifications,
  };
});