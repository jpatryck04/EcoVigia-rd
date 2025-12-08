import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('eco_vigia_token'));
  const isAuthenticated = ref(!!token.value);
  const userType = ref<'volunteer' | 'admin' | null>(null);

  // ===================== CONFIGURACIÓN FIJA =====================
  // ÚNICO ADMIN PERMITIDO (NO SE PUEDEN CREAR MÁS)
  const ADMIN_CONFIG = {
    email: 'admin@medioambiente.gob.do',
    password: 'AdminMedioAmbiente2024!', // Contraseña segura por defecto
    userData: {
      id: 'admin-001',
      cedula: '00000000000',
      nombre: 'Administrador Ministerio',
      email: 'admin@medioambiente.gob.do',
      telefono: '(809) 567-4300',
      avatar: '/images/logo-ministerio.png'
    }
  };

  // ===================== FUNCIONES DE VOLUNTARIOS =====================
  // Obtener todos los voluntarios desde localStorage
  const getAllVolunteers = () => {
    try {
      return JSON.parse(localStorage.getItem('eco_vigia_volunteer_applications') || '[]');
    } catch {
      return [];
    }
  };

  // Obtener voluntarios aprobados
  const getApprovedVolunteers = () => {
    const volunteers = getAllVolunteers();
    return volunteers.filter((v: any) => v.status === 'approved');
  };

  // Verificar si un voluntario está aprobado
  const isVolunteerApproved = (email: string) => {
    const approvedVolunteers = getApprovedVolunteers();
    return approvedVolunteers.some((v: any) => v.email === email);
  };

  // Verificar si un email ya está registrado
  const isEmailRegistered = (email: string) => {
    const allVolunteers = getAllVolunteers();
    return allVolunteers.some((v: any) => v.email === email);
  };

  // ===================== FUNCIONES DE LOGIN =====================
  
  const login = async (email: string, password: string, type: 'volunteer' | 'admin') => {
    if (type === 'admin') {
      return loginAdmin(email, password);
    } else {
      return loginVolunteer(email, password);
    }
  };

  const loginVolunteer = (email: string, password: string): boolean => {
    const approvedVolunteers = getApprovedVolunteers();
    const volunteer = approvedVolunteers.find((v: any) => 
      v.email === email && v.password === password
    );
    
    if (volunteer && volunteer.status === 'approved') {
      const volunteerData: User = {
        id: volunteer.id || 'vol-' + Date.now(),
        cedula: volunteer.cedula,
        nombre: volunteer.nombre,
        email: volunteer.email,
        telefono: volunteer.telefono,
        avatar: volunteer.avatar
      };
      
      user.value = volunteerData;
      isAuthenticated.value = true;
      userType.value = 'volunteer';
      token.value = 'volunteer_token_' + Date.now();
      
      localStorage.setItem('eco_vigia_token', token.value);
      localStorage.setItem('eco_vigia_user', JSON.stringify(volunteerData));
      localStorage.setItem('eco_vigia_user_type', 'volunteer');
      
      return true;
    }
    return false;
  };

  const loginAdmin = (email: string, password: string): boolean => {
    if (email === ADMIN_CONFIG.email && password === ADMIN_CONFIG.password) {
      user.value = ADMIN_CONFIG.userData;
      isAuthenticated.value = true;
      userType.value = 'admin';
      token.value = 'admin_token_' + Date.now();
      
      localStorage.setItem('eco_vigia_token', token.value);
      localStorage.setItem('eco_vigia_user', JSON.stringify(ADMIN_CONFIG.userData));
      localStorage.setItem('eco_vigia_user_type', 'admin');
      
      return true;
    }
    return false;
  };

  // ===================== FUNCIONES DE REGISTRO =====================
  const registerVolunteer = (volunteerData: {
    cedula: string;
    nombre: string;
    email: string;
    password: string;
    telefono: string;
  }): { success: boolean; message: string } => {
    try {
      const allVolunteers = getAllVolunteers();
      
      // Verificar si ya existe
      if (allVolunteers.some((v: any) => v.email === volunteerData.email)) {
        return { success: false, message: 'Este correo ya está registrado' };
      }
      
      if (allVolunteers.some((v: any) => v.cedula === volunteerData.cedula)) {
        return { success: false, message: 'Esta cédula ya está registrada' };
      }
      
      const newVolunteer = {
        id: 'vol-' + Date.now(),
        cedula: volunteerData.cedula.trim(),
        nombre: volunteerData.nombre.trim(),
        email: volunteerData.email.trim().toLowerCase(),
        password: volunteerData.password, // Guardar contraseña
        telefono: volunteerData.telefono.trim(),
        status: 'pending',
        fecha_registro: new Date().toISOString(),
        fecha_aprobacion: null,
        fecha_rechazo: null,
        actividades_completadas: 0,
        horas_voluntariado: 0,
        notas: ''
      };
      
      allVolunteers.push(newVolunteer);
      localStorage.setItem('eco_vigia_volunteer_applications', JSON.stringify(allVolunteers));
      
      console.log('Voluntario registrado:', newVolunteer);
      console.log('Total voluntarios:', allVolunteers.length);
      
      return { success: true, message: 'Solicitud enviada exitosamente' };
    } catch (error) {
      console.error('Error registering volunteer:', error);
      return { success: false, message: 'Error al registrar voluntario' };
    }
  };

  // ===================== FUNCIONES DE ADMIN =====================
  const approveVolunteer = (volunteerId: string): boolean => {
    if (!isAdmin()) return false;
    
    try {
      const allVolunteers = getAllVolunteers();
      const volunteerIndex = allVolunteers.findIndex((v: any) => v.id === volunteerId);
      
      if (volunteerIndex !== -1) {
        allVolunteers[volunteerIndex].status = 'approved';
        allVolunteers[volunteerIndex].fecha_aprobacion = new Date().toISOString();
        allVolunteers[volunteerIndex].fecha_rechazo = null;
        localStorage.setItem('eco_vigia_volunteer_applications', JSON.stringify(allVolunteers));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error approving volunteer:', error);
      return false;
    }
  };

  const rejectVolunteer = (volunteerId: string): boolean => {
    if (!isAdmin()) return false;
    
    try {
      const allVolunteers = getAllVolunteers();
      const volunteerIndex = allVolunteers.findIndex((v: any) => v.id === volunteerId);
      
      if (volunteerIndex !== -1) {
        allVolunteers[volunteerIndex].status = 'rejected';
        allVolunteers[volunteerIndex].fecha_rechazo = new Date().toISOString();
        localStorage.setItem('eco_vigia_volunteer_applications', JSON.stringify(allVolunteers));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error rejecting volunteer:', error);
      return false;
    }
  };

  // ===================== FUNCIONES DE VERIFICACIÓN =====================
  const isAdmin = (): boolean => userType.value === 'admin';
  const isVolunteer = (): boolean => userType.value === 'volunteer';

  // ===================== LOGOUT =====================
  const logout = () => {
    user.value = null;
    token.value = null;
    isAuthenticated.value = false;
    userType.value = null;
    
    localStorage.removeItem('eco_vigia_token');
    localStorage.removeItem('eco_vigia_user');
    localStorage.removeItem('eco_vigia_user_type');
  };

  // ===================== RESTAURAR SESIÓN =====================
  const restoreSession = () => {
    const storedToken = localStorage.getItem('eco_vigia_token');
    const storedUser = localStorage.getItem('eco_vigia_user');
    const storedUserType = localStorage.getItem('eco_vigia_user_type') as 'volunteer' | 'admin' | null;
    
    if (storedToken && storedUser && storedUserType) {
      user.value = JSON.parse(storedUser);
      isAuthenticated.value = true;
      userType.value = storedUserType;
      token.value = storedToken;
    }
  };

  // ===================== INICIALIZACIÓN =====================
  const initializeStorage = () => {
    if (!localStorage.getItem('eco_vigia_volunteer_applications')) {
      localStorage.setItem('eco_vigia_volunteer_applications', JSON.stringify([]));
    }
  };

  initializeStorage();

  return {
    // State
    user,
    token,
    isAuthenticated,
    userType,
    
    // Admin config
    ADMIN_CONFIG: ADMIN_CONFIG,
    
    // Login functions
    login,
    loginVolunteer,
    loginAdmin,
    logout,
    
    // Registration
    registerVolunteer,
    approveVolunteer,
    rejectVolunteer,
    
    // Verification functions
    isAdmin,
    isVolunteer,
    isVolunteerApproved,
    isEmailRegistered,
    getApprovedVolunteers,
    getAllVolunteers,
    
    // Session management
    restoreSession
  };
});