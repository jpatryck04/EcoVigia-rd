import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('eco_vigia_token'));
  const isAuthenticated = ref(!!token.value);
  const userRole = ref<'volunteer' | 'admin' | null>(null);
  const userType = ref<'volunteer' | 'admin' | null>(null);

  // Obtener voluntarios aprobados desde localStorage
  const getApprovedVolunteers = () => {
    try {
      const volunteers = JSON.parse(localStorage.getItem('eco_vigia_volunteer_applications') || '[]');
      return volunteers.filter((v: any) => v.status === 'approved');
    } catch {
      return [];
    }
  };

  // Verificar si un voluntario está aprobado
  const isVolunteerApproved = (email: string) => {
    const approvedVolunteers = getApprovedVolunteers();
    return approvedVolunteers.some((v: any) => v.email === email);
  };

  // Verificar si un email ya está registrado
  const isEmailRegistered = (email: string) => {
    const allVolunteers = JSON.parse(localStorage.getItem('eco_vigia_volunteer_applications') || '[]');
    return allVolunteers.some((v: any) => v.email === email);
  };

  // Login de voluntario
  const loginVolunteer = (email: string, password: string) => {
    const approvedVolunteers = getApprovedVolunteers();
    const volunteer = approvedVolunteers.find((v: any) => v.email === email);
    
    if (volunteer && volunteer.password === password) {
      user.value = volunteer;
      isAuthenticated.value = true;
      userType.value = 'volunteer';
      userRole.value = 'volunteer';
      token.value = 'volunteer_token_' + Date.now();
      
      localStorage.setItem('eco_vigia_token', token.value);
      localStorage.setItem('eco_vigia_user', JSON.stringify(volunteer));
      localStorage.setItem('eco_vigia_user_type', 'volunteer');
      localStorage.setItem('eco_vigia_role', 'volunteer');
      
      return true;
    }
    return false;
  };

  // Login de admin
  const loginAdmin = (username: string, password: string) => {
    if (username === 'admin' && password === 'EcoVigia2024!') {
      const adminUser = {
        id: 'admin',
        cedula: 'admin',
        nombre: 'Administrador',
        email: 'admin@mediambiente.gob.do',
        telefono: 'N/A'
      };
      
      user.value = adminUser;
      isAuthenticated.value = true;
      userType.value = 'admin';
      userRole.value = 'admin';
      token.value = 'admin_token_' + Date.now();
      
      localStorage.setItem('eco_vigia_token', token.value);
      localStorage.setItem('eco_vigia_user', JSON.stringify(adminUser));
      localStorage.setItem('eco_vigia_user_type', 'admin');
      localStorage.setItem('eco_vigia_role', 'admin');
      
      return true;
    }
    return false;
  };

  // Login genérico (del primer código)
  const login = (userData: User, userToken: string, role: 'volunteer' | 'admin' = 'volunteer') => {
    user.value = userData;
    token.value = userToken;
    isAuthenticated.value = true;
    userRole.value = role;
    userType.value = role;
    
    localStorage.setItem('eco_vigia_token', userToken);
    localStorage.setItem('eco_vigia_role', role);
    localStorage.setItem('eco_vigia_user', JSON.stringify(userData));
    localStorage.setItem('eco_vigia_user_type', role);
  };

  // Logout
  const logout = () => {
    user.value = null;
    token.value = null;
    isAuthenticated.value = false;
    userRole.value = null;
    userType.value = null;
    
    localStorage.removeItem('eco_vigia_token');
    localStorage.removeItem('eco_vigia_role');
    localStorage.removeItem('eco_vigia_user');
    localStorage.removeItem('eco_vigia_user_type');
  };

  // Métodos de verificación de rol
  const isAdmin = () => userRole.value === 'admin';
  const isVolunteer = () => userRole.value === 'volunteer';

  // Restaurar sesión al recargar (del primer código)
  const restoreSession = () => {
    const storedToken = localStorage.getItem('eco_vigia_token');
    const storedRole = localStorage.getItem('eco_vigia_role') as 'volunteer' | 'admin' | null;
    const storedUser = localStorage.getItem('eco_vigia_user');
    
    if (storedToken && storedUser && storedRole) {
      user.value = JSON.parse(storedUser);
      token.value = storedToken;
      isAuthenticated.value = true;
      userRole.value = storedRole;
      userType.value = storedRole;
    }
  };

  // Verificar autenticación al cargar la app (del segundo código)
  const checkAuth = () => {
    const storedToken = localStorage.getItem('eco_vigia_token');
    const storedUser = localStorage.getItem('eco_vigia_user');
    const storedUserType = localStorage.getItem('eco_vigia_user_type');
    
    if (storedToken && storedUser && storedUserType) {
      user.value = JSON.parse(storedUser);
      isAuthenticated.value = true;
      userType.value = storedUserType as 'volunteer' | 'admin';
      userRole.value = storedUserType as 'volunteer' | 'admin';
      token.value = storedToken;
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    userRole,
    userType,
    login,
    loginVolunteer,
    loginAdmin,
    logout,
    isAdmin,
    isVolunteer,
    restoreSession,
    checkAuth,
    isVolunteerApproved,
    isEmailRegistered,
    getApprovedVolunteers
  };
});