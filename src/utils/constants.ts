export const APP_CONSTANTS = {
  APP_NAME: 'EcoVigía RD',
  VERSION: '1.0.0',
  DEVELOPERS: [
    {
      name: 'Patryck Yandell Jiménez Ogando',
      role: 'Líder del Proyecto',
      matricula: '2023-1953',
      phone: '(829) 429-1048',
      telegram: ''
    },
    {
      name: 'Yordalis Estefany Herrera Encarnacion',
      role: 'Desarrollador Frontend',
      matricula: '2023-1719',
      phone: '(809) 994-0927',
      telegram: ''
    }, 
    {
      name: 'Anthony Enmanuel Feliz De La Rosa',
      role: 'Desarrollador Frontend',
      matricula: '2021-0615',
      phone: '(809) 418-3162',
      telegram: ''
    }, 
    {
      name: 'Edward Neftalí Liriano Gómez',
      role: 'Desarrollador Frontend',
      matricula: '2022-0437',
      phone: '(809) 777-0697',
      telegram: ''
    }, 
    {
      name: 'Reynaldo Sebastian Lopez Terrero',
      role: 'Desarrollador Frontend',
      matricula: '2023-0201',
      phone: '(829) 380-1726',
      telegram: ''
    }, 
    {
      name: 'Enmanuel De Jesus Pichardo Salas',
      role: 'Desarrollador Frontend',
      matricula: '2022-1341',
      phone: '(849) 343-0203',
      telegram: ''
    },
    
  ],
  INSTITUTION: 'Instituto Tecnológico de Las Américas (ITLA)',
  COURSE: 'Desarrollo de Aplicaciones Móviles',
  PERIOD: 'C3-2025',
  API_BASE_URL: 'https://adamix.net/medioambiente',
  MAP: {
    DEFAULT_CENTER: [18.7357, -70.1627] as [number, number],
    DEFAULT_ZOOM: 8,
    MAX_ZOOM: 18,
    MIN_ZOOM: 6
  },
  REPORT_CATEGORIES: [
    { value: 'contaminacion', label: 'Contaminación', icon: 'fas fa-smog' },
    { value: 'deforestacion', label: 'Deforestación', icon: 'fas fa-tree' },
    { value: 'fauna', label: 'Fauna en Peligro', icon: 'fas fa-paw' },
    { value: 'flora', label: 'Flora Amenazada', icon: 'fas fa-leaf' },
    { value: 'agua', label: 'Contaminación del Agua', icon: 'fas fa-tint' },
    { value: 'residuos', label: 'Manejo de Residuos', icon: 'fas fa-trash' },
    { value: 'otros', label: 'Otros', icon: 'fas fa-exclamation-triangle' }
  ] as const,
  URGENCY_LEVELS: [
    { value: 'baja', label: 'Baja', color: '#4caf50' },
    { value: 'media', label: 'Media', color: '#ff9800' },
    { value: 'alta', label: 'Alta', color: '#f44336' }
  ] as const,
  REPORT_STATUS: {
    PENDIENTE: { value: 'pendiente', label: 'Pendiente', color: '#ff9800' },
    EN_PROCESO: { value: 'en_proceso', label: 'En Proceso', color: '#2196f3' },
    RESUELTO: { value: 'resuelto', label: 'Resuelto', color: '#4caf50' },
    RECHAZADO: { value: 'rechazado', label: 'Rechazado', color: '#f44336' }
  } as const,
  STORAGE_KEYS: {
    USER_TOKEN: 'eco_vigia_token',
    USER_DATA: 'eco_vigia_user',
    APP_SETTINGS: 'eco_vigia_settings',
    LAST_LOCATION: 'eco_vigia_last_location'
  } as const
};

export const AREA_TYPES = {
  PARQUE_NACIONAL: 'Parque Nacional',
  RESERVA_CIENTIFICA: 'Reserva Científica',
  RESERVA_FORESTAL: 'Reserva Forestal',
  AREA_CONSERVACION: 'Área de Conservación',
  MONUMENTO_NATURAL: 'Monumento Natural',
  REFUGIO_VIDA_SILVESTRE: 'Refugio de Vida Silvestre'
} as const;

