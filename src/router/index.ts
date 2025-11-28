import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/sobre-nosotros',
    name: 'AboutUs',
    component: () => import('@/views/AboutUs.vue')
  },
  {
    path: '/servicios', 
    name: 'Services',
    component: () => import('@/views/Services.vue')
  },
  {
    path: '/noticias',
    name: 'News',
    component: () => import('@/views/News.vue')
  },
  {
    path: '/noticias/:id',
    name: 'NewsDetail',
    component: () => import('@/views/NewsDetail.vue')
  },
  {
    path: '/videos',
    name: 'Videos',
    component: () => import('@/views/EducationalVideos.vue')
  },
  {
    path: '/areas-protegidas',
    name: 'ProtectedAreas',
    component: () => import('@/views/ProtectedAreas.vue')
  },
  {
    path: '/mapa-areas',
    name: 'AreasMap',
    component: () => import('@/views/ProtectedAreasMap.vue')
  },
  {
    path: '/medidas',
    name: 'Measures',
    component: () => import('@/views/EnvironmentalMeasures.vue')
  },
  {
    path: '/equipo',
    name: 'Team',
    component: () => import('@/views/MinistryTeam.vue')
  },
  {
    path: '/voluntariado',
    name: 'Volunteer',
    component: () => import('@/views/Volunteer.vue')
  },
  {
    path: '/acerca-de',
    name: 'About',
    component: () => import('@/views/AboutDevelopers.vue')
  },

  /* ----------------------------
     🔐 RUTAS DE AUTENTICACIÓN
  -----------------------------*/
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/recuperar-contrasena',
    name: 'ForgotPassword',
    component: () => import('@/views/ForgotPassword.vue'),
    meta: { requiresGuest: true }
  },

  /* ----------------------------
     🛡️ RUTAS PROTEGIDAS
  -----------------------------*/
  {
    path: '/normativas',
    name: 'Regulations',
    component: () => import('@/views/Regulations.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reportar-dano',
    name: 'ReportDamage',
    component: () => import('@/views/ReportDamage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mis-reportes',
    name: 'MyReports',
    component: () => import('@/views/MyReports.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mapa-reportes',
    name: 'ReportsMap',
    component: () => import('@/views/ReportsMap.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cambiar-contrasena',
    name: 'ChangePassword',
    component: () => import('@/views/ChangePassword.vue'),
    meta: { requiresAuth: true }
  },

  /* ----------------------------
     👑 RUTAS DE ADMINISTRADOR
  -----------------------------*/
{
  path: '/admin',
  name: 'Admin',
  component: () => import('@/views/AdminPanel.vue'),
  meta: { requiresAuth: true, requiresAdmin: true }
},

  // Ruta de fallback
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

/* ----------------------------
   🔒 GUARD DE NAVEGACIÓN MEJORADO
-----------------------------*/
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Restaurar sesión si existe al inicio de cada navegación
  if (!authStore.isAuthenticated) {
    authStore.restoreSession();
  }

  // Verificar rutas que requieren autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } 
  // Verificar rutas que requieren ser administrador
  else if (to.meta.requiresAdmin && !authStore.isAdmin()) {
    next('/');
  }
  // Verificar rutas que requieren ser invitado (no autenticado)
  else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/');
  } 
  // Permitir acceso en todos los otros casos
  else {
    next();
  }
});

export default router;