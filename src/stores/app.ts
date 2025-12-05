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

  const inProgressReports = computed(() => 
    reports.value.filter(r => r.estado === 'en-progreso')
  );

  const resolvedReports = computed(() => 
    reports.value.filter(r => r.estado === 'resuelto')
  );

  const unreadNotifications = computed(() =>
    notifications.value.filter(n => !n.read).length
  );

  const reportStats = computed(() => ({
    totalReports: reports.value.length,
    pendingReports: pendingReports.value.length,
    inProgressReports: inProgressReports.value.length,
    resolvedReports: reports.value.filter(r => 
      r.estado === 'resuelto' || r.estado === 'rechazado'
    ).length
  }));

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

  // Nuevas funciones para AdminReports.vue
  const updateReportStatus = (id: string, status: string) => {
    const index = reports.value.findIndex(r => r.id === id);
    if (index !== -1) {
      reports.value[index].estado = status;
      // Si el estado cambia a resuelto o rechazado, agregar fecha de resolución
      if (status === 'resuelto' || status === 'rechazado') {
        reports.value[index].fechaResolucion = new Date().toISOString();
      }
    }
  };

  const deleteReport = (id: string) => {
    const index = reports.value.findIndex(r => r.id === id);
    if (index !== -1) {
      reports.value.splice(index, 1);
    }
  };

  const getReportById = (id: string): EnvironmentalReport | undefined => {
    return reports.value.find(r => r.id === id);
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

  // Simular carga inicial de reportes (para testing)
  const loadSampleReports = () => {
    if (reports.value.length === 0) {
      const sampleReports: EnvironmentalReport[] = [
        {
          id: '1',
          titulo: 'Tala ilegal en bosque protegido',
          descripcion: 'Se observa tala ilegal de árboles en el área protegida del parque nacional. Se necesitan autoridades ambientales.',
          categoria: 'deforestacion',
          urgencia: 'alta',
          foto: '',
          latitud: 18.7357,
          longitud: -70.1627,
          fecha: new Date(Date.now() - 86400000).toISOString(), // Ayer
          estado: 'pendiente'
        },
        {
          id: '2',
          titulo: 'Contaminación en río local',
          descripcion: 'Vertido de desechos industriales en el río principal de la comunidad.',
          categoria: 'agua',
          urgencia: 'media',
          foto: '',
          latitud: 18.4568,
          longitud: -69.9512,
          fecha: new Date(Date.now() - 172800000).toISOString(), // Hace 2 días
          estado: 'en-progreso'
        },
        {
          id: '3',
          titulo: 'Acumulación de basura en playa',
          descripcion: 'Grandes cantidades de plástico y basura en la playa principal.',
          categoria: 'residuos',
          urgencia: 'baja',
          foto: '',
          latitud: 18.4821,
          longitud: -69.9292,
          fecha: new Date(Date.now() - 259200000).toISOString(), // Hace 3 días
          estado: 'resuelto'
        }
      ];
      reports.value.push(...sampleReports);
    }
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
    inProgressReports,
    resolvedReports,
    unreadNotifications,
    reportStats,
    
    // Actions
    setLoading,
    setLocation,
    addReport,
    updateReport,
    updateReportStatus,
    deleteReport,
    getReportById,
    addNotification,
    markNotificationAsRead,
    clearNotifications,
    loadSampleReports,
  };
});