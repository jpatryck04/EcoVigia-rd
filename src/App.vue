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
          <router-link to="/equipo">Nuestro Equipo</router-link>   
          <router-link to="/acerca-de">Acerca de</router-link>

          <!-- Menú de usuario según tipo de autenticación -->
          <div class="user-menu-container">
            <template v-if="authStore.isAuthenticated">
              <div class="user-menu">
                <span class="welcome-text">Hola, {{ authStore.user?.nombre }}</span>
                
                <!-- Enlace a Mis Reportes para voluntarios -->
                <router-link 
                  v-if="authStore.isVolunteer()" 
                  to="/mis-reportes" 
                  class="reports-link"
                >
                  Mis Reportes
                </router-link>
                
                <!-- Enlace a Panel Admin para administradores -->
                <router-link 
                  v-if="authStore.isAdmin()" 
                  to="/admin" 
                  class="admin-link"
                >
                  Panel Admin
                </router-link>
                
                <button @click="handleLogout" class="logout-btn">
                  <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                </button>
              </div>
            </template>
            <template v-else>
              <div class="auth-buttons">
                <router-link to="/login" class="login-btn">
                  <i class="fas fa-sign-in-alt"></i>
                  Ingresar
                </router-link>
                <router-link to="/voluntariado" class="register-btn">
                  <i class="fas fa-user-plus"></i>
                  Ser Voluntario
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

    <!-- Footer -->
    <footer class="app-footer">
      <div class="container">
        <p>&copy; 2025 EcoVigía RD - Ministerio de Medio Ambiente</p>
        <p>Desarrollado por estudiantes del ITLA</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

// Restaurar sesión al cargar la aplicación
onMounted(() => {
  authStore.restoreSession();
});

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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-menu a:hover,
.nav-menu a.router-link-active {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

/* Contenedor del menú de usuario */
.user-menu-container {
  display: flex;
  align-items: center;
  margin-left: 1rem;
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
  font-size: 0.9rem;
}

.reports-link,
.admin-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
}

.reports-link {
  background: rgba(76, 175, 80, 0.3);
  border: 1px solid rgba(76, 175, 80, 0.5);
}

.admin-link {
  background: rgba(255, 152, 0, 0.3);
  border: 1px solid rgba(255, 152, 0, 0.5);
}

.reports-link:hover {
  background: rgba(76, 175, 80, 0.5);
  transform: translateY(-1px);
}

.admin-link:hover {
  background: rgba(255, 152, 0, 0.5);
  transform: translateY(-1px);
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
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 0.9rem;
}

.login-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.register-btn {
  background: #2e7d32;
  border: 1px solid #2e7d32;
}

.login-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.register-btn:hover {
  background: #1b5e20;
  transform: translateY(-1px);
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(244, 67, 54, 0.2);
  color: white;
  border: 1px solid rgba(244, 67, 54, 0.4);
  padding: 0.6rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
}

.logout-btn:hover {
  background: rgba(244, 67, 54, 0.3);
  transform: translateY(-1px);
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

.app-footer .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.app-footer p {
  margin: 0.25rem 0;
  color: #ccc;
}

.app-footer p:first-child {
  font-weight: 500;
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .nav-menu {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    text-align: center;
  }
  
  .user-menu,
  .auth-buttons {
    flex-direction: column;
    width: 100%;
    gap: 0.75rem;
  }
  
  .user-menu-container {
    width: 100%;
    margin-left: 0;
    justify-content: center;
  }
  
  .main-content {
    margin-top: 120px;
  }
}

@media (max-width: 480px) {
  .nav-menu a {
    padding: 0.75rem 1rem;
    width: 100%;
    text-align: center;
  }
  
  .login-btn,
  .register-btn,
  .reports-link,
  .admin-link,
  .logout-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>