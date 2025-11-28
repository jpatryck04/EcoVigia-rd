<template>
  <div class="reports-map-page">
    <div class="container">
      <div class="page-header">
        <h1>Mapa de Reportes</h1>
        <p>Visualiza tus reportes ambientales en el mapa</p>
      </div>

      <div class="map-container">
        <div class="map-wrapper">
          <!-- Aquí iría el mapa con Leaflet -->
          <div class="map-placeholder">
            <i class="fas fa-map-marked-alt"></i>
            <h3>Mapa de Reportes</h3>
            <p>Aquí se mostrarían tus reportes en un mapa interactivo</p>
            <div class="reports-summary">
              <div class="summary-item">
                <span class="count">{{ pendingReports.length }}</span>
                <span class="label">Pendientes</span>
              </div>
              <div class="summary-item">
                <span class="count">{{ inProgressReports.length }}</span>
                <span class="label">En Proceso</span>
              </div>
              <div class="summary-item">
                <span class="count">{{ resolvedReports.length }}</span>
                <span class="label">Resueltos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/stores/app';

const appStore = useAppStore();

const pendingReports = computed(() => 
  appStore.reports.filter(r => r.estado === 'pendiente')
);

const inProgressReports = computed(() => 
  appStore.reports.filter(r => r.estado === 'en_proceso')
);

const resolvedReports = computed(() => 
  appStore.reports.filter(r => r.estado === 'resuelto')
);
</script>

<style scoped lang="scss">
.reports-map-page {
  padding: 2rem 0;
  background: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    color: #1b5e20;
    margin-bottom: 1rem;
    font-size: 2.5rem;
  }

  p {
    color: #666;
    font-size: 1.2rem;
  }
}

.map-container {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.map-wrapper {
  height: 600px;
}

.map-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  color: #1b5e20;

  i {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  h3 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  p {
    margin-bottom: 2rem;
    color: #666;
  }
}

.reports-summary {
  display: flex;
  gap: 2rem;

  .summary-item {
    text-align: center;
    
    .count {
      display: block;
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .label {
      font-size: 0.9rem;
      color: #666;
    }
  }
}

@media (max-width: 768px) {
  .reports-summary {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>