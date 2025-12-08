import { useAuthStore } from '@/stores/auth';

export const adminAuthGuard = (to: any, from: any, next: any) => {
  const authStore = useAuthStore();
  
  // Si no está autenticado, redirigir a login
  if (!authStore.isAuthenticated) {
    next('/login');
    return;
  }
  
  // Si no es admin, redirigir a home
  if (!authStore.isAdmin()) {
    next('/');
    return;
  }
  
  // Permitir acceso
  next();
};