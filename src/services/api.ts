import axios from 'axios';

const API_BASE_URL = 'https://adamix.net/medioambiente';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const medioAmbienteAPI = {
  // Servicios públicos
  getServicios: () => api.get('/servicios'),
  
  // Noticias
  getNoticias: () => api.get('/noticias'),
  getNoticiaById: (id: number) => api.get(`/noticias/${id}`),

  // Videos
  getVideos: () => api.get('/videos'),

  // Áreas protegidas
  getAreasProtegidas: () => api.get('/areas_protegidas'),

  // Medidas
  getMedidas: () => api.get('/medidas'),

  // Equipo
  getEquipo: () => api.get('/equipo'),

  
  
  // Voluntariado
  solicitarVoluntariado: (data: any) => api.post('/voluntariado', data),
  
  // Endpoints que requieren autenticación
  getNormativas: (token: string) =>
    api.get('/normativas', {
      headers: { Authorization: `Bearer ${token}` },
    }),

  reportarDano: (data: any, token: string) =>
    api.post('/reportar_dano', data, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getMisReportes: (token: string) =>
    api.get('/mis_reportes', {
      headers: { Authorization: `Bearer ${token}` },
    }),
};


