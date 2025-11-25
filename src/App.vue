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
          <router-link to="/noticias">Noticias</router-link>
          <router-link to="/servicios">Servicios</router-link>
          <router-link to="/areas-protegidas">Áreas Protegidas</router-link>
          <router-link to="/voluntariado">Voluntariado</router-link>
          <router-link to="/acerca-de">Acerca de</router-link>
        </nav>
      </div>
    </header>

    <!-- Contenido Principal -->
    <main class="main-content">
      <router-view></router-view>
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
// El router-view se encarga de mostrar las vistas
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

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
}

.nav-menu {
  display: flex;
  gap: 1.5rem;
}

.nav-menu a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background 0.3s ease;
  font-weight: 500;
}

.nav-menu a:hover,
.nav-menu a.router-link-active {
  background: rgba(255, 255, 255, 0.15);
}

.main-content {
  flex: 1;
  margin-top: 80px; /* Altura del header */
  padding: 0;
}

.app-footer {
  background: #333;
  color: white;
  padding: 2rem 0;
  text-align: center;
  margin-top: auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-menu {
    gap: 1rem;
  }
  
  .main-content {
    margin-top: 120px;
  }
}
</style>