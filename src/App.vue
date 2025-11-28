<template>
  <div id="app">
    <!-- Header -->
    <header class="app-header">
      <div class="header-content">
        <router-link to="/" class="logo">
          <span>🌱 EcoVigía RD</span>
        </router-link>

        <nav class="nav-menu">
          <router-link to="/">Inicio</router-link>
          <router-link to="/sobre-nosotros">Sobre Nosotros</router-link>
          <router-link to="/areas-protegidas">Áreas Protegidas</router-link>
          <router-link to="/servicios">Servicios</router-link>          
          <router-link to="/noticias">Noticias</router-link>
          <router-link to="/voluntariado">Voluntariado</router-link>    
          <router-link to="/acerca-de">Acerca de</router-link>
          <router-link to="/admin" class="admin-link">Panel de Administración</router-link>

          <!-- Menú de usuario según tipo de autenticación -->
          <div class="user-menu-container">
            <template v-if="authStore.isAuthenticated && authStore.userType === 'volunteer'">
              <div class="user-menu">
                <span class="welcome-text">Hola, {{ authStore.user?.nombre }}</span>
                <button @click="handleLogout" class="logout-btn">
                  <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                </button>
              </div>
            </template>
            <template v-else-if="authStore.isAuthenticated">
              <div class="user-menu">
                <span class="welcome-text">Hola, {{ authStore.user?.nombre }}</span>
                <router-link to="/mis-reportes" class="reports-link">Mis Reportes</router-link>
                <button @click="handleLogout" class="logout-btn">
                  Cerrar Sesión
                </button>
              </div>
            </template>
            <template v-else>
              <div class="auth-buttons">
                <router-link to="/login-voluntario" class="login-btn">
                  <i class="fas fa-sign-in-alt"></i> Voluntario
                </router-link>
                <router-link to="/voluntariado" class="register-btn">
                  <i class="fas fa-user-plus"></i> Ser Voluntario
                </router-link>
                <router-link to="/login" class="login-link">
                  <i class="fas fa-sign-in-alt"></i>
                  Ingresar
                </router-link>
              </div>
            </template>
          </div>
        </nav>
      </div>
    </header>

    <!-- Contenido Principal -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- Footer ADAPTADO -->
    <footer class="app-footer">
      <div class="container">
        <p>&copy; 2025 EcoVigía RD - Ministerio de Medio Ambiente</p>
        <p>Desarrollado por estudiantes del ITLA</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const isAuthenticated = computed(() => authStore.isAuthenticated);

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};
</script>

<style scoped>
.app-header {
  background: #1b5e20;
  color: white;
  padding: 1rem 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.nav-menu {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.nav-menu a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s ease;
}

.nav-menu a:hover,
.nav-menu a.router-link-active {
  background: rgba(255, 255, 255, 0.1);
}

/* Contenedor del menú de usuario */
.user-menu-container {
  display: flex;
  align-items: center;
}

/* Menú de usuario autenticado */
.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.welcome-text {
  color: white;
  font-weight: 500;
}

.reports-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
}

.reports-link:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Botones de autenticación */
.auth-buttons {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.login-btn,
.register-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s ease;
}

.login-btn {
  background: rgba(255, 255, 255, 0.2);
}

.register-btn {
  background: #2e7d32;
}

.login-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.register-btn:hover {
  background: #1b5e20;
}

.login-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem !important;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
  font-size: 0.9rem;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.main-content {
  margin-top: 80px;
  min-height: calc(100vh - 160px);
}

.app-footer {
  background: #333;
  color: white;
  padding: 2rem 0;
  text-align: center;
}

.admin-link {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  text-decoration: none;
  margin-top: 0.5rem;
  display: inline-block;
}

.admin-link:hover {
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-menu {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }
  
  .user-menu,
  .auth-buttons {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }
  
  .user-menu-container {
    width: 100%;
  }
}
</style>