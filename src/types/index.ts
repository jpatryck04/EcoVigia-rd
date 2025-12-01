export * from './services';


// Tipos básicos para empezar
export interface User {
  id: string;
  cedula: string;
  nombre: string;
  email: string;
  telefono: string;
  avatar?: string;
  role?: 'volunteer' | 'admin'; // ✅ Agregar esta propiedad
}

export interface ProtectedArea {
  id: number;
  nombre: string;
  descripcion: string;
  latitud: number;
  longitud: number;
  imagen: string;
  ubicacion: string;
  extension: string;
  tipo: string;
  flora?: string[]; 
  fauna?: string[]; 
  actividades?: string[]; 
  clima?: string; 
  horario?: string; 
  contacto?: string; 
}

export interface EnvironmentalReport {
  id: string;
  titulo: string;
  descripcion: string;
  foto: string;
  latitud: number;
  longitud: number;
  fecha: string; 
  estado: 'pendiente' | 'en_proceso' | 'resuelto' | 'rechazado';
  comentario?: string;
  categoria: string;
  urgencia: 'baja' | 'media' | 'alta';
}

export interface News {
  id: number;
  titulo: string;
  contenido: string;
  imagen: string;
  fecha: string;
  autor: string;
  categoria: string;
  vistas: number;
  likes: number;
estado?: 'publicada' | 'borrador' | 'archivada';
}


// Nueva interfaz para medidas ambientales
export interface EnvironmentalMeasure {
  id: number;
  titulo: string;
  descripcionCorta: string;
  descripcionLarga: string;
  categoria: string;
  icon: string;
  dificultad: 'facil' | 'medio' | 'dificil';
  impacto: number;
  pasos: string[];
  beneficios: string[];
  recursos?: string[];
}

// Tipo para la respuesta de la API de noticias
export interface NewsApiResponse {
  data: News[];
  message?: string;
  status?: string;
}

export interface SingleNewsApiResponse {
  data: News;
  message?: string;
  status?: string;
}

export interface Regulation {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  tipo: string; // ✅ AGREGAR ESTA PROPIEDAD
  fecha: string;
  numero: string;
  archivo?: string;
}