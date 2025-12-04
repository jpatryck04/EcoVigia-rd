<template>
  <div id="app">
    <!-- Header -->
    <header class="app-header">
      <div class="header-content">
        <!-- Logo con diseño mejorado -->
        <router-link to="/" class="logo-link">
          <div class="logo-container">
            <span class="logo-icon">🌿</span>
            <div class="logo-text">
              <h1 class="logo-title">EcoVigía</h1>
              <p class="logo-subtitle">República Dominicana</p>
            </div>
          </div>
        </router-link>

        <!-- Navegación principal con diseño mejorado -->
        <nav class="main-nav" aria-label="Navegación principal">
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/" class="nav-link" exact-active-class="active">
                <i class="fas fa-home"></i>
                <span>Inicio</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/sobre-nosotros" class="nav-link" active-class="active">
                <i class="fas fa-info-circle"></i>
                <span>Sobre Nosotros</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/areas-protegidas" class="nav-link" active-class="active">
                <i class="fas fa-tree"></i>
                <span>Áreas Protegidas</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/servicios" class="nav-link" active-class="active">
                <i class="fas fa-concierge-bell"></i>
                <span>Servicios</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/noticias" class="nav-link" active-class="active">
                <i class="fas fa-newspaper"></i>
                <span>Noticias</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/voluntariado" class="nav-link" active-class="active">
                <i class="fas fa-hands-helping"></i>
                <span>Voluntariado</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/equipo" class="nav-link" active-class="active">
                <i class="fas fa-users"></i>
                <span>Nuestro Equipo</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/acerca-de" class="nav-link" active-class="active">
                <i class="fas fa-address-card"></i>
                <span>Acerca de</span>
              </router-link>
            </li>
          </ul>
        </nav>

        <!-- Menú de usuario con diseño mejorado -->
        <div class="user-section">
          <div v-if="authStore.isAuthenticated" class="user-profile">
            <div class="user-avatar" @click="toggleUserMenu">
              <i class="fas fa-user-circle"></i>
              <span class="user-name">{{ getUserInitials(authStore.user?.nombre) }}</span>
            </div>
            
            <div v-if="showUserMenu" class="user-menu-card">
              <div class="user-info">
                <p class="welcome-message">¡Hola, {{ authStore.user?.nombre }}!</p>
              </div>
              
              <div class="user-menu-actions">
                <!-- Enlace a Mis Reportes para voluntarios -->
                <router-link 
                  v-if="authStore.isVolunteer()" 
                  to="/mis-reportes" 
                  class="menu-action"
                  @click="closeUserMenu"
                >
                  <i class="fas fa-clipboard-list"></i>
                  <span>Mis Reportes</span>
                </router-link>
                
                <!-- Enlace a Panel Admin para administradores -->
                <router-link 
                  v-if="authStore.isAdmin()" 
                  to="/admin" 
                  class="menu-action admin-action"
                  @click="closeUserMenu"
                >
                  <i class="fas fa-cog"></i>
                  <span>Panel Admin</span>
                </router-link>
                
                <button @click="handleLogout" class="menu-action logout-action">
                  <i class="fas fa-sign-out-alt"></i>
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </div>
          
          <div v-else class="auth-options">
            <router-link to="/login" class="auth-btn login-btn">
              <i class="fas fa-sign-in-alt"></i>
              <span>Ingresar</span>
            </router-link>
            <router-link to="/voluntariado" class="auth-btn register-btn">
              <i class="fas fa-user-plus"></i>
              <span>Ser Voluntario</span>
            </router-link>
          </div>
        </div>

        <!-- Botón de menú móvil -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu" aria-label="Abrir menú">
          <i :class="['fas', showMobileMenu ? 'fa-times' : 'fa-bars']"></i>
        </button>
      </div>

      <!-- Menú móvil mejorado con el mismo estilo -->
      <div v-if="showMobileMenu" class="mobile-menu-overlay">
        <div class="mobile-menu-container">
          <!-- Header del menú móvil -->
          <div class="mobile-menu-header">
            <div class="mobile-logo">
              <span class="mobile-logo-icon">🌿</span>
              <div class="mobile-logo-text">
                <h2>EcoVigía</h2>
                <p>República Dominicana</p>
              </div>
            </div>
            <button @click="closeMobileMenu" class="mobile-close-btn" aria-label="Cerrar menú">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Perfil de usuario en móvil -->
          <div v-if="authStore.isAuthenticated" class="mobile-user-profile">
            <div class="mobile-user-avatar">
              <i class="fas fa-user-circle"></i>
              <div class="mobile-user-info">
                <p class="mobile-welcome">¡Hola, {{ authStore.user?.nombre }}!</p>
                <p class="mobile-user-role">
                  <span v-if="authStore.isAdmin()" class="role-badge admin-badge">Administrador</span>
                  <span v-else-if="authStore.isVolunteer()" class="role-badge volunteer-badge">Voluntario</span>
                  <span v-else class="role-badge user-badge">Usuario</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Navegación móvil -->
          <nav class="mobile-nav">
            <ul class="mobile-nav-list">
              <li class="mobile-nav-item">
                <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">
                  <i class="fas fa-home"></i>
                  <span>Inicio</span>
                </router-link>
              </li>
              <li class="mobile-nav-item">
                <router-link to="/sobre-nosotros" class="mobile-nav-link" @click="closeMobileMenu">
                  <i class="fas fa-info-circle"></i>
                  <span>Sobre Nosotros</span>
                </router-link>
              </li>
              <li class="mobile-nav-item">
                <router-link to="/areas-protegidas" class="mobile-nav-link" @click="closeMobileMenu">
                  <i class="fas fa-tree"></i>
                  <span>Áreas Protegidas</span>
                </router-link>
              </li>
              <li class="mobile-nav-item">
                <router-link to="/servicios" class="mobile-nav-link" @click="closeMobileMenu">
                  <i class="fas fa-concierge-bell"></i>
                  <span>Servicios</span>
                </router-link>
              </li>
              <li class="mobile-nav-item">
                <router-link to="/noticias" class="mobile-nav-link" @click="closeMobileMenu">
                  <i class="fas fa-newspaper"></i>
                  <span>Noticias</span>
                </router-link>
              </li>
              <li class="mobile-nav-item">
                <router-link to="/voluntariado" class="mobile-nav-link" @click="closeMobileMenu">
                  <i class="fas fa-hands-helping"></i>
                  <span>Voluntariado</span>
                </router-link>
              </li>
              <li class="mobile-nav-item">
                <router-link to="/equipo" class="mobile-nav-link" @click="closeMobileMenu">
                  <i class="fas fa-users"></i>
                  <span>Nuestro Equipo</span>
                </router-link>
              </li>
              <li class="mobile-nav-item">
                <router-link to="/acerca-de" class="mobile-nav-link" @click="closeMobileMenu">
                  <i class="fas fa-address-card"></i>
                  <span>Acerca de</span>
                </router-link>
              </li>
            </ul>

            <!-- Sección de acciones del usuario en móvil -->
            <div v-if="authStore.isAuthenticated" class="mobile-user-actions">
              <div class="mobile-actions-header">
                <h3>Mi Cuenta</h3>
              </div>
              <ul class="mobile-actions-list">
                <li v-if="authStore.isVolunteer()">
                  <router-link to="/mis-reportes" class="mobile-action-link" @click="closeMobileMenu">
                    <i class="fas fa-clipboard-list"></i>
                    <span>Mis Reportes</span>
                    <i class="fas fa-chevron-right"></i>
                  </router-link>
                </li>
                <li v-if="authStore.isAdmin()">
                  <router-link to="/admin" class="mobile-action-link" @click="closeMobileMenu">
                    <i class="fas fa-cog"></i>
                    <span>Panel Admin</span>
                    <i class="fas fa-chevron-right"></i>
                  </router-link>
                </li>
                <li>
                  <router-link to="/perfil" class="mobile-action-link" @click="closeMobileMenu">
                    <i class="fas fa-user-edit"></i>
                    <span>Mi Perfil</span>
                    <i class="fas fa-chevron-right"></i>
                  </router-link>
                </li>
                <li>
                  <button @click="handleMobileLogout" class="mobile-action-link logout-action">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Cerrar Sesión</span>
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </div>

            <!-- Sección de autenticación en móvil -->
            <div v-else class="mobile-auth-section">
              <div class="mobile-auth-buttons">
                <router-link to="/login" class="mobile-auth-btn login-btn" @click="closeMobileMenu">
                  <i class="fas fa-sign-in-alt"></i>
                  <span>Ingresar</span>
                </router-link>
                <router-link to="/voluntariado" class="mobile-auth-btn register-btn" @click="closeMobileMenu">
                  <i class="fas fa-user-plus"></i>
                  <span>Ser Voluntario</span>
                </router-link>
              </div>
            </div>

            <!-- Consejos y normas (como en tu imagen) -->
            <div class="mobile-tips-section">
              <div class="mobile-section-header">
                <i class="fas fa-lightbulb"></i>
                <h3>Consejos</h3>
              </div>
              <ul class="mobile-tips-list">
                <li class="mobile-tip-item">
                  <i class="fas fa-check-circle"></i>
                  <span>Reporta incidentes ambientales</span>
                </li>
                <li class="mobile-tip-item">
                  <i class="fas fa-check-circle"></i>
                  <span>Respeta las áreas protegidas</span>
                </li>
                <li class="mobile-tip-item">
                  <i class="fas fa-check-circle"></i>
                  <span>Participa en voluntariados</span>
                </li>
                <li class="mobile-tip-item">
                  <i class="fas fa-check-circle"></i>
                  <span>Consulta las normativas</span>
                </li>
              </ul>
            </div>
          </nav>

          <!-- Footer del menú móvil -->
          <div class="mobile-menu-footer">
            <p class="mobile-footer-text">
              <i class="fas fa-info-circle"></i>
              Sistema de monitoreo ambiental
            </p>
            <p class="mobile-copyright">
              &copy; 2025 EcoVigía RD - Ministerio de Medio Ambiente
            </p>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenido Principal -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- Footer mejorado -->
    <footer class="app-footer">
      <div class="footer-container">
        <div class="footer-section">
          <div class="footer-logo">
            <span class="footer-logo-icon">🌿</span>
            <div>
              <h3>EcoVigía RD</h3>
              <p>Protegiendo nuestro patrimonio natural</p>
            </div>
          </div>
          <p class="footer-description">
            Sistema oficial de vigilancia ambiental para proteger y conservar 
            nuestro patrimonio natural. <strong>Reporte, monitoreo y acción colectiva.</strong>
          </p>
        </div>
        
        <div class="footer-section">
          <h4>Enlaces Rápidos</h4>
          <ul class="footer-links">
            <li><router-link to="/">Inicio</router-link></li>
            <li><router-link to="/areas-protegidas">Áreas Protegidas</router-link></li>
            <li><router-link to="/voluntariado">Ser Voluntario</router-link></li>
            <li><router-link to="/acerca-de">Acerca de</router-link></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Contacto</h4>
          <div class="contact-info">
            <p><i class="fas fa-envelope"></i> info@ecovigia.gob.do</p>
            <p><i class="fas fa-phone"></i> (809) 123-4567</p>
            <p><i class="fas fa-map-marker-alt"></i> Santo Domingo, RD</p>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2025 EcoVigía RD - Ministerio de Medio Ambiente</p>
        <p>Desarrollado por estudiantes del ITLA</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

// Estados reactivos
const showUserMenu = ref(false);
const showMobileMenu = ref(false);

// Restaurar sesión al cargar la aplicación
onMounted(() => {
  authStore.restoreSession();
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleEscapeKey);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleEscapeKey);
});

// Funciones de utilidad
const getUserInitials = (name: string | undefined): string => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Funciones de menú
const toggleUserMenu = (event: Event) => {
  event.stopPropagation();
  showUserMenu.value = !showUserMenu.value;
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
  if (showMobileMenu.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const closeUserMenu = () => {
  showUserMenu.value = false;
};

const closeMobileMenu = () => {
  showMobileMenu.value = false;
  document.body.style.overflow = '';
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.user-profile') && !target.closest('.user-menu-card')) {
    showUserMenu.value = false;
  }
};

const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeMobileMenu();
    closeUserMenu();
  }
};

const handleLogout = () => {
  authStore.logout();
  showUserMenu.value = false;
  router.push('/');
};

const handleMobileLogout = () => {
  authStore.logout();
  closeMobileMenu();
  router.push('/');
};
</script>

<style scoped>
/* Estilos base */
.app-header {
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
  color: white;
  padding: 0.75rem 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-bottom: 3px solid #4caf50;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

/* Logo */
.logo-link {
  text-decoration: none;
  color: inherit;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  font-size: 2rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem;
  border-radius: 50%;
  backdrop-filter: blur(10px);
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.5px;
  color: white;
}

.logo-subtitle {
  font-size: 0.75rem;
  opacity: 0.9;
  margin: 0;
  font-weight: 500;
  color: #e8f5e9;
}

/* Navegación principal */
.main-nav {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.25rem;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 0.9rem;
  white-space: nowrap;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.nav-link.active {
  background: rgba(76, 175, 80, 0.25);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Sección de usuario */
.user-section {
  position: relative;
}

.user-profile {
  position: relative;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.user-avatar:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.user-avatar i {
  font-size: 1.5rem;
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;
  background: #4caf50;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Menú de usuario */
.user-menu-card {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  min-width: 280px;
  z-index: 1000;
  margin-top: 0.75rem;
  overflow: hidden;
  animation: slideDown 0.2s ease-out;
}

.user-info {
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  color: white;
  padding: 1.5rem;
}

.welcome-message {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.user-menu-actions {
  padding: 1rem 0;
}

.menu-action {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.5rem;
  color: #333;
  text-decoration: none;
  transition: all 0.3s ease;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  font-size: 0.9rem;
  cursor: pointer;
}

.menu-action:hover {
  background: #f5f5f5;
  padding-left: 2rem;
}

.menu-action i {
  width: 20px;
  color: #4caf50;
}

.admin-action i {
  color: #ff9800;
}

.logout-action i {
  color: #f44336;
}

.logout-action {
  color: #f44336;
  border-top: 1px solid #eee;
  margin-top: 0.5rem;
  padding-top: 1rem;
}

/* Botones de autenticación */
.auth-options {
  display: flex;
  gap: 1rem;
}

.auth-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.login-btn {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.register-btn {
  background: #4caf50;
  color: white;
  border: 1px solid #4caf50;
}

.auth-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.login-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.register-btn:hover {
  background: #45a049;
}

/* Botón de menú móvil */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.mobile-menu-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* MENÚ MÓVIL MEJORADO */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 2000;
  animation: fadeIn 0.3s ease-out;
}

.mobile-menu-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 320px;
  background: linear-gradient(135deg, #263238 0%, #37474f 100%);
  color: white;
  display: flex;
  flex-direction: column;
  animation: slideInRight 0.3s ease-out;
  overflow-y: auto;
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
  border-bottom: 3px solid #4caf50;
}

.mobile-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mobile-logo-icon {
  font-size: 2rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem;
  border-radius: 50%;
}

.mobile-logo-text h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
}

.mobile-logo-text p {
  margin: 0.25rem 0 0 0;
  font-size: 0.8rem;
  opacity: 0.9;
}

.mobile-close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.mobile-close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(90deg);
}

/* Perfil de usuario móvil */
.mobile-user-profile {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-user-avatar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mobile-user-avatar i {
  font-size: 2.5rem;
  color: #4caf50;
}

.mobile-user-info {
  flex: 1;
}

.mobile-welcome {
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  font-size: 1rem;
}

.mobile-user-role {
  margin: 0;
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.admin-badge {
  background: rgba(255, 152, 0, 0.2);
  color: #ff9800;
  border: 1px solid rgba(255, 152, 0, 0.3);
}

.volunteer-badge {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.user-badge {
  background: rgba(33, 150, 243, 0.2);
  color: #2196f3;
  border: 1px solid rgba(33, 150, 243, 0.3);
}

/* Navegación móvil */
.mobile-nav {
  flex: 1;
  padding: 1rem 0;
}

.mobile-nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mobile-nav-item {
  margin-bottom: 0.25rem;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
  border-left: 4px solid transparent;
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.05);
  border-left-color: #4caf50;
  padding-left: 2rem;
}

.mobile-nav-link i {
  width: 24px;
  text-align: center;
  font-size: 1.1rem;
  color: #4caf50;
}

/* Acciones de usuario móvil */
.mobile-user-actions {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-actions-header {
  margin-bottom: 1rem;
}

.mobile-actions-header h3 {
  margin: 0;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #b0bec5;
}

.mobile-actions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mobile-actions-list li {
  margin-bottom: 0.5rem;
}

.mobile-action-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  width: 100%;
  text-align: left;
  font-size: 0.9rem;
  cursor: pointer;
}

.mobile-action-link:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.mobile-action-link i:first-child {
  width: 20px;
  color: #4caf50;
}

.mobile-action-link i:last-child {
  font-size: 0.8rem;
  opacity: 0.7;
}

.logout-action i:first-child {
  color: #f44336;
}

/* Autenticación móvil */
.mobile-auth-section {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-auth-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mobile-auth-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
  text-align: center;
}

.mobile-auth-btn.login-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.mobile-auth-btn.register-btn {
  background: #4caf50;
  color: white;
  border: 1px solid #4caf50;
}

.mobile-auth-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.mobile-auth-btn.login-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.mobile-auth-btn.register-btn:hover {
  background: #45a049;
}

/* Sección de consejos */
.mobile-tips-section {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
}

.mobile-section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.mobile-section-header i {
  color: #ffeb3b;
  font-size: 1.25rem;
}

.mobile-section-header h3 {
  margin: 0;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #ffeb3b;
}

.mobile-tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mobile-tip-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  color: #b0bec5;
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.mobile-tip-item:last-child {
  border-bottom: none;
}

.mobile-tip-item i {
  color: #4caf50;
  font-size: 0.8rem;
}

/* Footer del menú móvil */
.mobile-menu-footer {
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-footer-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 0 0.75rem 0;
  color: #b0bec5;
  font-size: 0.85rem;
}

.mobile-footer-text i {
  color: #4caf50;
}

.mobile-copyright {
  margin: 0;
  font-size: 0.75rem;
  color: #90a4ae;
  line-height: 1.4;
}

/* Footer mejorado */
.app-footer {
  background: linear-gradient(135deg, #263238 0%, #37474f 100%);
  color: white;
  padding: 3rem 0 1.5rem;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
}

.footer-section {
  margin-bottom: 1.5rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.footer-logo-icon {
  font-size: 2.5rem;
}

.footer-logo h3 {
  margin: 0;
  color: #4caf50;
  font-size: 1.5rem;
}

.footer-description {
  color: #b0bec5;
  line-height: 1.6;
  margin: 0;
}

.footer-section h4 {
  color: white;
  margin-bottom: 1.25rem;
  font-size: 1.1rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.footer-section h4::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: #4caf50;
  border-radius: 2px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.75rem;
}

.footer-links a {
  color: #b0bec5;
  text-decoration: none;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-links a:hover {
  color: #4caf50;
  padding-left: 0.25rem;
}

.contact-info {
  color: #b0bec5;
}

.contact-info p {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.75rem 0;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid #455a64;
  color: #90a4ae;
  font-size: 0.9rem;
}

.footer-bottom p {
  margin: 0.5rem 0;
}

/* Contenido principal */
.main-content {
  margin-top: 80px;
  min-height: calc(100vh - 400px);
}

/* Animaciones */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

/* Responsive */
@media (max-width: 1200px) {
  .header-content {
    padding: 0 1.5rem;
  }
  
  .nav-link {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 992px) {
  .main-nav {
    display: none;
  }
  
  .user-section .auth-options {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .mobile-menu-container {
    width: 100%;
    max-width: 320px;
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 1rem;
  }
  
  .logo-title {
    font-size: 1.2rem;
  }
  
  .footer-container {
    padding: 0 1rem;
  }
  
  .main-content {
    margin-top: 70px;
  }
}

@media (max-width: 480px) {
  .header-content {
    gap: 1rem;
  }
  
  .logo-container {
    gap: 0.5rem;
  }
  
  .logo-icon {
    font-size: 1.5rem;
  }
  
  .logo-title {
    font-size: 1rem;
  }
  
  .logo-subtitle {
    font-size: 0.7rem;
  }
  
  .user-avatar {
    padding: 0.4rem 0.8rem;
  }
  
  .user-name {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }
  
  .auth-options {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .auth-btn {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }
  
  .mobile-menu-container {
    width: 100%;
    max-width: 100%;
  }
}
</style>