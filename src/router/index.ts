import { createRouter, createWebHistory } from 'vue-router';

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
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  // Ruta de fallback para 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;