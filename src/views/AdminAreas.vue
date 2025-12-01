<template>
  <div class="admin-areas">
    <div class="container">
      <div class="page-header">
        <div class="header-content">
          <h1>Gestión de Áreas Protegidas</h1>
          <p>Administra la información de las áreas protegidas</p>
        </div>
        <button class="btn-back" @click="$router.push('/admin')">
          <i class="fas fa-arrow-left"></i>
          Volver al Dashboard
        </button>
      </div>

      <div class="content">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">128</div>
            <div class="stat-label">Áreas Protegidas</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">25</div>
            <div class="stat-label">Parques Nacionales</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">18</div>
            <div class="stat-label">Reservas Científicas</div>
          </div>
        </div>

        <div class="info-message">
          <i class="fas fa-info-circle"></i>
          <p>Panel de gestión de áreas protegidas - En desarrollo</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

if (!authStore.isAdmin()) {
  router.push('/');
}
</script>

<style scoped lang="scss">
.admin-areas {
  padding: 2rem 0;
  min-height: 100vh;
  background: #f8f9fa;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  color: #1b5e20;
  margin-bottom: 0.5rem;
}

.header-content p {
  color: #666;
}

.btn-back {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s ease;

  &:hover {
    background: #5a6268;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1b5e20;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #666;
}

.info-message {
  background: #e8f5e8;
  border: 1px solid #c8e6c9;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  color: #1b5e20;

  i {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  p {
    margin: 0;
    font-size: 1.1rem;
  }
}
</style>