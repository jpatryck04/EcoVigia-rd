<template>
  <div class="modal-overlay" @click.self="emitClose">
    <div class="modal-content">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-content">
          <h2>Detalles del Voluntario</h2>
          <span class="volunteer-id">ID: {{ volunteer.id }}</span>
        </div>
        <button class="close-btn" @click="emitClose">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Contenido Principal -->
      <div class="modal-body">
        <!-- Información Básica -->
        <div class="section">
          <h3 class="section-title">
            <i class="fas fa-user"></i>
            Información Personal
          </h3>
          
          <div class="info-grid">
            <div class="info-item">
              <label>Nombre Completo:</label>
              <span>{{ volunteer.nombre }}</span>
            </div>
            
            <div class="info-item">
              <label>Cédula:</label>
              <span>{{ formatCedula(volunteer.cedula) }}</span>
            </div>
            
            <div class="info-item">
              <label>Correo Electrónico:</label>
              <span>{{ volunteer.email }}</span>
            </div>
            
            <div class="info-item">
              <label>Teléfono:</label>
              <span>{{ volunteer.telefono }}</span>
            </div>
            
            <div class="info-item">
              <label>Fecha de Registro:</label>
              <span>{{ formatDate(volunteer.fecha_registro) }}</span>
            </div>
            
            <div v-if="volunteer.fecha_aprobacion" class="info-item">
              <label>Fecha de Aprobación:</label>
              <span>{{ formatDate(volunteer.fecha_aprobacion) }}</span>
            </div>
          </div>
        </div>

        <!-- Estado y Estadísticas -->
        <div class="section">
          <h3 class="section-title">
            <i class="fas fa-chart-bar"></i>
            Estado y Estadísticas
          </h3>
          
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-icon">
                <i class="fas fa-user-check"></i>
              </div>
              <div class="stat-content">
                <div class="stat-label">Estado</div>
                <div class="stat-value">
                  <span class="status-badge" :class="volunteer.estado">
                    {{ getStatusText(volunteer.estado) }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon">
                <i class="fas fa-tasks"></i>
              </div>
              <div class="stat-content">
                <div class="stat-label">Actividades Completadas</div>
                <div class="stat-value">{{ volunteer.actividades_completadas || 0 }}</div>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon">
                <i class="fas fa-clock"></i>
              </div>
              <div class="stat-content">
                <div class="stat-label">Horas de Voluntariado</div>
                <div class="stat-value">{{ volunteer.horas_voluntariado || 0 }} hrs</div>
              </div>
            </div>
            
            <div class="stat-item" v-if="volunteer.ultima_actividad">
              <div class="stat-icon">
                <i class="fas fa-calendar-check"></i>
              </div>
              <div class="stat-content">
                <div class="stat-label">Última Actividad</div>
                <div class="stat-value">{{ formatDate(volunteer.ultima_actividad) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notas -->
        <div class="section" v-if="volunteer.notas || editMode">
          <h3 class="section-title">
            <i class="fas fa-sticky-note"></i>
            Notas y Observaciones
          </h3>
          
          <div v-if="!editMode" class="notes-content">
            <p>{{ volunteer.notas || 'Sin notas adicionales' }}</p>
            <button class="btn-edit-notes" @click="editMode = true">
              <i class="fas fa-edit"></i>
              Editar Notas
            </button>
          </div>
          
          <div v-else class="notes-edit">
            <textarea 
              v-model="editedNotes"
              placeholder="Agregar notas u observaciones sobre el voluntario..."
              rows="4"
            ></textarea>
            <div class="notes-actions">
              <button class="btn-cancel" @click="cancelEdit">
                Cancelar
              </button>
              <button class="btn-save" @click="saveNotes">
                Guardar Notas
              </button>
            </div>
          </div>
        </div>

        <!-- Historial de Actividades (Placeholder) -->
        <div class="section">
          <h3 class="section-title">
            <i class="fas fa-history"></i>
            Historial de Actividades
          </h3>
          
          <div class="activities-placeholder">
            <i class="fas fa-calendar-alt"></i>
            <p>El sistema de seguimiento de actividades está en desarrollo</p>
          </div>
        </div>
      </div>

      <!-- Footer con Acciones -->
      <div class="modal-footer">
        <div class="footer-actions">
          <button class="btn-secondary" @click="emitClose">
            Cerrar
          </button>
          
          <div class="action-group">
            <button 
              v-if="volunteer.estado === 'pendiente'"
              class="btn-success" 
              @click="emitAction('approve')"
            >
              <i class="fas fa-check"></i>
              Aprobar
            </button>
            
            <button 
              v-if="volunteer.estado === 'pendiente'"
              class="btn-danger" 
              @click="emitAction('reject')"
            >
              <i class="fas fa-times"></i>
              Rechazar
            </button>
            
            <button 
              v-if="volunteer.estado === 'activo'"
              class="btn-warning" 
              @click="emitAction('deactivate')"
            >
              <i class="fas fa-user-slash"></i>
              Desactivar
            </button>
            
            <button 
              v-if="volunteer.estado === 'inactivo'"
              class="btn-success" 
              @click="emitAction('activate')"
            >
              <i class="fas fa-user-check"></i>
              Activar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { formatDate } from '@/utils';
import type { Volunteer } from '@/types';

interface Props {
  volunteer: Volunteer;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  update: [volunteer: Volunteer];
  action: [type: string];
}>();

const editMode = ref(false);
const editedNotes = ref(props.volunteer.notas || '');

const formatCedula = (cedula: string) => {
  if (!cedula) return '';
  if (cedula.length === 11) {
    return cedula.replace(/(\d{3})(\d{7})(\d{1})/, '$1-$2-$3');
  }
  return cedula;
};

const getStatusText = (estado: string) => {
  const statusMap: Record<string, string> = {
    'activo': 'Activo',
    'pendiente': 'Pendiente',
    'inactivo': 'Inactivo',
    'rechazado': 'Rechazado'
  };
  return statusMap[estado] || estado;
};

const emitClose = () => {
  emit('close');
};

const emitAction = (actionType: string) => {
  emit('action', actionType);
};

const saveNotes = () => {
  const updatedVolunteer = {
    ...props.volunteer,
    notas: editedNotes.value.trim()
  };
  emit('update', updatedVolunteer);
  editMode.value = false;
};

const cancelEdit = () => {
  editedNotes.value = props.volunteer.notas || '';
  editMode.value = false;
};

// Resetear modo edición cuando cambia el voluntario
watch(() => props.volunteer, (newVolunteer) => {
  editedNotes.value = newVolunteer.notas || '';
  editMode.value = false;
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
  z-index: 2000;
  padding: 1rem;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  
  .header-content {
    h2 {
      color: #1b5e20;
      margin-bottom: 0.5rem;
      font-size: 1.8rem;
    }
    
    .volunteer-id {
      color: #666;
      font-size: 0.9rem;
      font-family: monospace;
      background: #f5f5f5;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }
  }
}

.close-btn {
  background: #f5f5f5;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #e0e0e0;
  }
  
  i {
    color: #666;
    font-size: 1.2rem;
  }
}

.modal-body {
  padding: 0;
}

.section {
  padding: 2rem;
  border-bottom: 1px solid #e0e0e0;
  
  &:last-child {
    border-bottom: none;
  }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #1b5e20;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  
  i {
    font-size: 1.2rem;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.info-item {
  label {
    display: block;
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
    font-weight: 500;
  }
  
  span {
    display: block;
    color: #333;
    font-size: 1rem;
    font-weight: 500;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  background: #e8f5e8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1b5e20;
  font-size: 1.2rem;
}

.stat-content {
  .stat-label {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 0.25rem;
  }
  
  .stat-value {
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
  }
}

.status-badge {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  
  &.activo {
    background: #e8f5e8;
    color: #4caf50;
  }
  
  &.pendiente {
    background: #fff3e0;
    color: #ff9800;
  }
  
  &.inactivo {
    background: #f5f5f5;
    color: #666;
  }
  
  &.rechazado {
    background: #ffebee;
    color: #f44336;
  }
}

.notes-content {
  p {
    color: #333;
    line-height: 1.6;
    margin-bottom: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    white-space: pre-wrap;
  }
}

.btn-edit-notes {
  background: #e3f2fd;
  color: #1976d2;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s ease;
  
  &:hover {
    background: #bbdefb;
  }
}

.notes-edit {
  textarea {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-family: inherit;
    font-size: 1rem;
    resize: vertical;
    margin-bottom: 1rem;
    
    &:focus {
      outline: none;
      border-color: #1b5e20;
    }
  }
}

.notes-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  
  button {
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;
  }
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
  
  &:hover {
    background: #e0e0e0;
  }
}

.btn-save {
  background: #1b5e20;
  color: white;
  
  &:hover {
    background: #144017;
  }
}

.activities-placeholder {
  text-align: center;
  padding: 2rem;
  color: #666;
  
  i {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
  }
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e0e0e0;
}

.footer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #e0e0e0;
  }
}

.action-group {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-success, .btn-danger, .btn-warning {
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-success {
  background: #4caf50;
  color: white;
  
  &:hover {
    background: #388e3c;
  }
}

.btn-danger {
  background: #f44336;
  color: white;
  
  &:hover {
    background: #d32f2f;
  }
}

.btn-warning {
  background: #ff9800;
  color: white;
  
  &:hover {
    background: #f57c00;
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

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .modal-content {
    max-width: 95%;
    max-height: 95vh;
  }
  
  .modal-header {
    padding: 1.5rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .section {
    padding: 1.5rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .action-group {
    flex-direction: column;
  }
  
  .btn-success, .btn-danger, .btn-warning {
    width: 100%;
    justify-content: center;
  }
}
</style>