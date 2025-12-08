// Utilidades generales
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('es-DO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('es-DO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Validaciones
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+1)?\s*\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
};

export const isValidCedula = (cedula: string): boolean => {
  // Validación básica de cédula dominicana
  if (!cedula || cedula.length !== 11) return false;
  return /^\d{11}$/.test(cedula);
};

// Geo utilities
export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Storage utilities
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// Image utilities
export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const validateImageFile = (file: File): { valid: boolean; message?: string } => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return { 
      valid: false, 
      message: 'Formato no válido. Use JPEG, PNG o GIF.' 
    };
  }

  if (file.size > maxSize) {
    return { 
      valid: false, 
      message: 'La imagen no debe superar los 5MB.' 
    };
  }

  return { valid: true };
};

// API utilities
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Error del servidor
    switch (error.response.status) {
      case 400:
        return 'Datos inválidos. Por favor verifique la información.';
      case 401:
        return 'No autorizado. Por favor inicie sesión.';
      case 403:
        return 'Acceso denegado. No tiene permisos para esta acción.';
      case 404:
        return 'Recurso no encontrado.';
      case 500:
        return 'Error interno del servidor. Por favor intente más tarde.';
      default:
        return `Error ${error.response.status}: ${error.response.data?.message || 'Error desconocido'}`;
    }
  } else if (error.request) {
    // Error de red
    return 'Error de conexión. Verifique su internet.';
  } else {
    // Error del cliente
    return error.message || 'Error inesperado.';
  }
};

// Debounce utility - CORREGIDO: Usar number en lugar de NodeJS.Timeout
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: number | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(() => func.apply(this, args), wait);
  };
};

// Throttle utility - CORREGIDO: Usar number en lugar de NodeJS.Timeout
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  let timeoutId: number | null = null;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      timeoutId = window.setTimeout(() => {
        inThrottle = false;
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
      }, limit);
    }
  };
};

// Nuevas utilidades adicionales útiles
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP'
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-DO').format(num);
};

export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

export const generateRandomColor = (): string => {
  const colors = [
    '#1b5e20', '#4caf50', '#388e3c', '#81c784', '#a5d6a7',
    '#1976d2', '#2196f3', '#64b5f6', '#90caf9', '#bbdefb',
    '#7b1fa2', '#9c27b0', '#ba68c8', '#ce93d8', '#e1bee7',
    '#d32f2f', '#f44336', '#e57373', '#ef9a9a', '#ffcdd2'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const isValidPassword = (password: string): boolean => {
  // Al menos 8 caracteres, una mayúscula, una minúscula y un número
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

export const isImageFile = (filename: string): boolean => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  const ext = getFileExtension(filename).toLowerCase();
  return imageExtensions.includes(`.${ext}`);
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Eliminar < y >
    .replace(/javascript:/gi, '') // Eliminar javascript:
    .trim();
};

export const cloneObject = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

export const isObjectEmpty = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length === 0;
};

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Helper para manejar errores de API específicos de tu aplicación
export const handleMedioAmbienteApiError = (error: any): { success: boolean; message: string; data?: any } => {
  if (error.code === 'NETWORK_ERROR') {
    return {
      success: false,
      message: 'Error de conexión. Verifica tu internet e intenta nuevamente.'
    };
  }

  if (error.response?.status === 404) {
    return {
      success: false,
      message: 'El recurso solicitado no fue encontrado.'
    };
  }

  // Manejar errores específicos de la API del Ministerio
  if (error.response?.data?.error) {
    return {
      success: false,
      message: error.response.data.error,
      data: error.response.data
    };
  }

  return {
    success: false,
    message: handleApiError(error),
    data: error.response?.data
  };
};

// Formatear cédula dominicana con guiones
export const formatCedula = (cedula: string): string => {
  if (!cedula || cedula.length !== 11) return cedula;
  return cedula.replace(/(\d{3})(\d{7})(\d{1})/, '$1-$2-$3');
};

// Validar si es un día hábil (lunes a viernes)
export const isBusinessDay = (date: Date = new Date()): boolean => {
  const day = date.getDay();
  return day >= 1 && day <= 5; // 1 = lunes, 5 = viernes
};

// Calcular días entre fechas
export const daysBetween = (date1: Date, date2: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000; // horas * minutos * segundos * milisegundos
  const diffDays = Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
  return diffDays;
};

// Convertir string a slug (para URLs amigables)
export const stringToSlug = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // eliminar acentos
    .replace(/[^a-z0-9\s-]/g, '') // eliminar caracteres especiales
    .replace(/\s+/g, '-') // reemplazar espacios con guiones
    .replace(/-+/g, '-') // eliminar guiones múltiples
    .trim();
};

// Verificar si el navegador está en línea
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Obtener parámetros de URL
export const getUrlParams = (): Record<string, string> => {
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  
  return result;
};

// Establecer parámetros en URL
export const setUrlParams = (params: Record<string, string>): void => {
  const url = new URL(window.location.href);
  
  Object.keys(params).forEach(key => {
    if (params[key]) {
      url.searchParams.set(key, params[key]);
    } else {
      url.searchParams.delete(key);
    }
  });
  
  window.history.replaceState({}, '', url.toString());
};

// Verificar si es dispositivo móvil
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Generar código de verificación
export const generateVerificationCode = (length: number = 6): string => {
  const chars = '0123456789';
  let code = '';
  
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return code;
};

// Capitalizar cada palabra
export const capitalizeWords = (text: string): string => {
  return text
    .split(' ')
    .map(word => capitalizeFirst(word))
    .join(' ');
};

// Validar URL
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Extraer dominio de URL
export const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
};