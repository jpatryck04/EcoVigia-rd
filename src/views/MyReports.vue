<template>
  <div class="my-reports-page">
    <div class="container">
      <div class="page-header">
        <h1>Mis Reportes</h1>
        <p>Revisa el estado de los reportes ambientales que has enviado</p>
      </div>

      <!-- Filtros -->
      <div class="reports-filters">
        <select v-model="selectedStatus" class="status-filter">
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="en-progreso">En Progreso</option>
          <option value="resuelto">Resueltos</option>
          <option value="rechazado">Rechazados</option>
        </select>
      </div>

      <!-- Lista de Reportes -->
      <div class="reports-list">
        <div 
          v-for="report in filteredReports" 
          :key="report.id"
          class="report-card"
          @click="viewReportDetails(report)"
        >
          <div class="report-status" :class="report.estado.replace('-', '_')">
            <i :class="getStatusIcon(report.estado)"></i>
            <span>{{ getStatusText(report.estado) }}</span>
          </div>
          
          <div class="report-content">
            <h3>{{ report.titulo }}</h3>
            <p class="report-description">{{ report.descripcion }}</p>
            
            <div class="report-meta">
              <span class="report-category">{{ getCategoryText(report.categoria) }}</span>
              <span class="report-date">{{ formatDate(report.fecha) }}</span>
              <span class="report-urgency" :class="report.urgencia">
                {{ getUrgencyText(report.urgencia) }}
              </span>
            </div>

            <div v-if="report.comentario" class="report-comment">
              <strong>Comentario del Ministerio:</strong>
              <p>{{ report.comentario }}</p>
            </div>
          </div>

          <div class="report-image" v-if="report.foto">
            <img :src="report.foto" :alt="report.titulo" />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredReports.length === 0" class="empty-state">
        <i class="fas fa-clipboard-list"></i>
        <h3>No tienes reportes</h3>
        <p>Cuando envíes reportes ambientales, aparecerán aquí.</p>
        <router-link to="/reportar-dano" class="btn-primary">
          <i class="fas fa-plus"></i>
          Crear Primer Reporte
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAppStore } from '@/stores/app';
import { formatDate } from '@/utils';
import type { EnvironmentalReport } from '@/types';

const appStore = useAppStore();
const selectedStatus = ref('');

const filteredReports = computed(() => {
  if (!selectedStatus.value) {
    return appStore.reports;
  }
  return appStore.reports.filter(report => report.estado === selectedStatus.value);
});

const getStatusIcon = (status: string) => {
  const icons = {
    pendiente: 'fas fa-clock',
    'en-progreso': 'fas fa-cog',
    resuelto: 'fas fa-check-circle',
    rechazado: 'fas fa-times-circle'
  };
  return icons[status as keyof typeof icons];
};

const getStatusText = (status: string) => {
  const texts = {
    pendiente: 'Pendiente',
    'en-progreso': 'En Progreso',
    resuelto: 'Resuelto',
    rechazado: 'Rechazado'
  };
  return texts[status as keyof typeof texts];
};

const getCategoryText = (category: string) => {
  const categories = {
    contaminacion: 'Contaminación',
    deforestacion: 'Deforestación',
    fauna: 'Fauna en Peligro',
    flora: 'Flora Amenazada',
    agua: 'Contaminación del Agua',
    residuos: 'Manejo de Residuos',
    otros: 'Otros'
  };
  return categories[category as keyof typeof categories];
};

const getUrgencyText = (urgency: string) => {
  const urgencies = {
    baja: 'Baja',
    media: 'Media',
    alta: 'Alta'
  };
  return urgencies[urgency as keyof typeof urgencies];
};

const viewReportDetails = (report: EnvironmentalReport) => {
  // Aquí podrías navegar a una página de detalles o abrir un modal
  alert(`Detalles del reporte: ${report.titulo}\n\nEstado: ${getStatusText(report.estado)}`);
};
</script>

<style scoped lang="scss">
.my-reports-page {
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

.reports-filters {
  margin-bottom: 2rem;

  .status-filter {
    padding: 0.75rem 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    background: white;
    font-size: 1rem;
    cursor: pointer;
    min-width: 200px;

    &:focus {
      outline: none;
      border-color: #1b5e20;
    }
  }
}

.reports-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.report-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  gap: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
}

.report-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 8px;
  min-width: 100px;
  flex-shrink: 0;

  i {
    font-size: 1.5rem;
  }

  span {
    font-size: 0.8rem;
    font-weight: 600;
    text-align: center;
  }

  &.pendiente {
    background: #fff3e0;
    color: #ff9800;

    i {
      color: #ff9800;
    }
  }

  &.en_progreso {
    background: #e3f2fd;
    color: #2196f3;

    i {
      color: #2196f3;
    }
  }

  &.resuelto {
    background: #e8f5e8;
    color: #4caf50;

    i {
      color: #4caf50;
    }
  }

  &.rechazado {
    background: #ffebee;
    color: #f44336;

    i {
      color: #f44336;
    }
  }
}

.report-content {
  flex: 1;

  h3 {
    color: #1b5e20;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
  }

  .report-description {
    color: #666;
    line-height: 1.5;
    margin-bottom: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .report-meta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;

    span {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .report-category {
      background: #e3f2fd;
      color: #1976d2;
    }

    .report-date {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .report-urgency {
      &.baja {
        background: #e8f5e8;
        color: #4caf50;
      }
      &.media {
        background: #fff3e0;
        color: #ff9800;
      }
      &.alta {
        background: #ffebee;
        color: #f44336;
      }
    }
  }

  .report-comment {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
    border-left: 4px solid #1b5e20;

    strong {
      color: #1b5e20;
      display: block;
      margin-bottom: 0.5rem;
    }

    p {
      color: #666;
      margin: 0;
      line-height: 1.5;
    }
  }
}

.report-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;

  i {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  h3 {
    margin-bottom: 1rem;
    color: #333;
  }

  p {
    margin-bottom: 2rem;
  }

  .btn-primary {
    background: #1b5e20;
    color: white;
    text-decoration: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: background 0.3s ease;

    &:hover {
      background: #144017;
    }
  }
}
</style>