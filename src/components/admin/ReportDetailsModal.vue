<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <button class="close-btn" @click="$emit('close')">
        <i class="fas fa-times"></i>
      </button>
      
      <div class="modal-header">
        <h2>Detalles del Reporte</h2>
        <div class="report-status">
          <span :class="['status-badge', `status-${report.estado}`]">
            {{ getStatusText(report.estado) }}
          </span>
        </div>
      </div>

      <div class="modal-body">
        <div class="report-info">
          <div class="info-row">
            <label>ID del Reporte:</label>
            <span class="report-id">{{ report.id }}</span>
          </div>
          
          <div class="info-row">
            <label>Título:</label>
            <h3>{{ report.titulo }}</h3>
          </div>
          
          <div class="info-row">
            <label>Descripción:</label>
            <p>{{ report.descripcion }}</p>
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <label>Categoría:</label>
              <span :class="['category-badge', `category-${report.categoria}`]">
                {{ getCategoryText(report.categoria) }}
              </span>
            </div>
            
            <div class="info-item">
              <label>Urgencia:</label>
              <span :class="['urgency-badge', `urgency-${report.urgencia}`]">
                {{ getUrgencyText(report.urgencia) }}
              </span>
            </div>
            
            <div class="info-item">
              <label>Fecha:</label>
              <span>{{ formatDate(report.fecha) }}</span>
            </div>
            
            <div class="info-item">
              <label>Ubicación:</label>
              <span>
                {{ report.latitud.toFixed(4) }}, {{ report.longitud.toFixed(4) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Imagen del Reporte -->
        <div v-if="report.foto" class="report-image">
          <img :src="report.foto" :alt="report.titulo" />
        </div>

        <!-- Comentarios del Ministerio -->
        <div class="comments-section">
          <h3>Comentarios del Ministerio</h3>
          <textarea 
            v-model="comentario"
            placeholder="Agregar comentario sobre el estado del reporte..."
            rows="4"
          ></textarea>
          
          <div class="status-actions">
            <h4>Cambiar Estado:</h4>
            <div class="status-buttons">
              <button 
                v-for="status in statusOptions" 
                :key="status.value"
                :class="['status-btn', { active: report.estado === status.value }]"
                @click="updateStatus(status.value)"
              >
                {{ status.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn-secondary" @click="$emit('close')">
          Cerrar
        </button>
        <button class="btn-primary" @click="saveChanges">
          Guardar Cambios
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { formatDate } from '@/utils';
import type { EnvironmentalReport } from '@/types';

interface Props {
  report: EnvironmentalReport;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  statusChange: [reportId: string, newStatus: string];
}>();

const comentario = ref('');
const statusOptions = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en_proceso', label: 'En Proceso' },
  { value: 'resuelto', label: 'Resuelto' },
  { value: 'rechazado', label: 'Rechazado' }
];

const getCategoryText = (category: string) => {
  const categories: { [key: string]: string } = {
    contaminacion: 'Contaminación',
    deforestacion: 'Deforestación',
    fauna: 'Fauna',
    flora: 'Flora',
    otros: 'Otros'
  };
  return categories[category] || category;
};

const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    pendiente: 'Pendiente',
    en_proceso: 'En Proceso',
    resuelto: 'Resuelto',
    rechazado: 'Rechazado'
  };
  return statusMap[status] || status;
};

const getUrgencyText = (urgency: string) => {
  const urgencyMap: { [key: string]: string } = {
    baja: 'Baja',
    media: 'Media',
    alta: 'Alta'
  };
  return urgencyMap[urgency] || urgency;
};

const updateStatus = (newStatus: string) => {
  emit('statusChange', props.report.id, newStatus);
};

const saveChanges = () => {
  // Aquí iría la lógica para guardar los cambios
  console.log('Guardando cambios:', { comentario: comentario.value });
  alert('Cambios guardados exitosamente');
  emit('close');
};

watch(() => props.report, (newReport) => {
  comentario.value = newReport.comentario || '';
}, { immediate: true });
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e0e0e0;

  h2 {
    color: #1b5e20;
    margin: 0;
    font-size: 1.8rem;
  }

  .status-badge {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;

    &.status-pendiente {
      background: #fff3e0;
      color: #f57c00;
    }
    &.status-en_proceso {
      background: #e3f2fd;
      color: #1976d2;
    }
    &.status-resuelto {
      background: #e8f5e8;
      color: #4caf50;
    }
    &.status-rechazado {
      background: #ffebee;
      color: #f44336;
    }
  }
}

.modal-body {
  padding: 1rem 2rem;
}

.info-row {
  margin-bottom: 1.5rem;

  label {
    display: block;
    color: #666;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .report-id {
    font-family: monospace;
    background: #f8f9fa;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    display: inline-block;
  }

  h3 {
    color: #333;
    margin: 0;
    font-size: 1.3rem;
  }

  p {
    color: #666;
    line-height: 1.6;
    margin: 0;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-item {
  label {
    display: block;
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  span:not(.category-badge, .urgency-badge) {
    color: #333;
    font-weight: 500;
  }
}

.category-badge, .urgency-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-block;
}

.category-badge {
  &.category-contaminacion {
    background: #e3f2fd;
    color: #1976d2;
  }
  &.category-deforestacion {
    background: #f3e5f5;
    color: #7b1fa2;
  }
  &.category-fauna {
    background: #fff3e0;
    color: #f57c00;
  }
  &.category-flora {
    background: #e8f5e8;
    color: #4caf50;
  }
  &.category-otros {
    background: #f5f5f5;
    color: #666;
  }
}

.urgency-badge {
  &.urgency-baja {
    background: #e8f5e8;
    color: #4caf50;
  }
  &.urgency-media {
    background: #fff3e0;
    color: #ff9800;
  }
  &.urgency-alta {
    background: #ffebee;
    color: #f44336;
  }
}

.report-image {
  margin-bottom: 2rem;
  
  img {
    width: 100%;
    max-height: 300px;
    object-fit: cover;
    border-radius: 8px;
  }
}

.comments-section {
  h3 {
    color: #1b5e20;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  textarea {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    resize: vertical;
    margin-bottom: 2rem;

    &:focus {
      outline: none;
      border-color: #1b5e20;
    }
  }
}

.status-actions {
  h4 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }
}

.status-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.status-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  color: #666;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f8f9fa;
  }

  &.active {
    border-color: #1b5e20;
    background: #1b5e20;
    color: white;
  }
}

.modal-actions {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;

  button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-primary {
    background: #1b5e20;
    color: white;

    &:hover {
      background: #144017;
    }
  }

  .btn-secondary {
    background: #e0e0e0;
    color: #333;

    &:hover {
      background: #d0d0d0;
    }
  }
}

@media (max-width: 768px) {
  .modal-content {
    margin: 0;
    max-height: 100vh;
    border-radius: 0;
  }

  .modal-header,
  .modal-body {
    padding: 1rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .status-buttons {
    flex-direction: column;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }
}
</style>