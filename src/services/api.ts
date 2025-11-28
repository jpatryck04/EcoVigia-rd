import axios from 'axios';

const API_BASE_URL = 'https://adamix.net/medioambiente';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Call: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Success: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`);
    console.error('Error details:', error.response?.data);
    return Promise.reject(error);
  }
);

export const medioAmbienteAPI = {
  // Servicios públicos
  getServicios: () => api.get('/servicios'),
  getNoticias: () => api.get('/noticias'),
  getNoticiaById: (id: number) => api.get(`/noticias/${id}`),
  getVideos: () => api.get('/videos'),
  getAreasProtegidas: () => api.get('/areas_protegidas'),
  getMedidas: () => api.get('/medidas'),
  getEquipo: () => api.get('/equipo'),

  // Voluntariado - ENDPOINT PRINCIPAL
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

  // Login de voluntarios (si la API lo tiene)
  loginVoluntario: (email: string, password: string) =>
    api.post('/login', { email, password }),
};