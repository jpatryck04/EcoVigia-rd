<template>
  <div class="admin-volunteers">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Gestión de Solicitudes de Voluntarios</h1>
          <p>Revisa y aprueba las solicitudes de voluntarios registrados</p>
        </div>
        <button class="btn-back" @click="$router.push('/admin')">
          <i class="fas fa-arrow-left"></i>
          Volver al Dashboard
        </button>
      </div>

      <!-- Estadísticas en tiempo real -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-user-clock"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.pending }}</div>
            <div class="stat-label">Solicitudes Pendientes</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-user-check"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.approved }}</div>
            <div class="stat-label">Voluntarios Aprobados</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-user-times"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.rejected }}</div>
            <div class="stat-label">Solicitudes Rechazadas</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-calendar-week"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.thisMonth }}</div>
            <div class="stat-label">Registros este Mes</div>
          </div>
        </div>
      </div>

      <!-- Filtros y Búsqueda -->
      <div class="filters-section">
        <div class="filters-row">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input 
              v-model="filters.search"
              type="text" 
              placeholder="Buscar por nombre, cédula o correo..." 
              @input="applyFilters"
            >
          </div>

          <div class="filter-group">
            <select v-model="filters.estado" @change="applyFilters">
              <option value="">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="approved">Aprobados</option>
              <option value="rejected">Rechazados</option>
            </select>
          </div>

          <button class="btn-refresh" @click="loadVolunteers">
            <i class="fas fa-sync-alt"></i>
            Actualizar
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando solicitudes...</p>
      </div>

      <!-- Contenido Principal -->
      <div v-else class="volunteers-content">
        <!-- Sección de Pendientes (visible por defecto) -->
        <div class="pending-section">
          <div class="section-header">
            <h2>Solicitudes Pendientes de Aprobación</h2>
            <span class="badge">{{ pendingVolunteers.length }} solicitudes</span>
          </div>

          <!-- Empty State para pendientes -->
          <div v-if="pendingVolunteers.length === 0" class="empty-state">
            <i class="fas fa-check-circle"></i>
            <h3>No hay solicitudes pendientes</h3>
            <p>Todas las solicitudes han sido revisadas</p>
          </div>

          <!-- Lista de pendientes -->
          <div v-else class="pending-grid">
            <div 
              v-for="volunteer in pendingVolunteers" 
              :key="volunteer.id"
              class="volunteer-card"
            >
              <div class="card-header">
                <div class="volunteer-info">
                  <div class="volunteer-avatar">
                    {{ getInitials(volunteer.nombre) }}
                  </div>
                  <div class="volunteer-details">
                    <h3>{{ volunteer.nombre }}</h3>
                    <div class="volunteer-meta">
                      <span class="meta-item">
                        <i class="fas fa-id-card"></i>
                        {{ formatCedula(volunteer.cedula) }}
                      </span>
                      <span class="meta-item">
                        <i class="fas fa-envelope"></i>
                        {{ volunteer.email }}
                      </span>
                      <span class="meta-item">
                        <i class="fas fa-phone"></i>
                        {{ volunteer.telefono }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="volunteer-date">
                  <i class="fas fa-calendar"></i>
                  {{ formatDate(volunteer.fecha_registro) }}
                </div>
              </div>

              <div class="card-content">
                <div class="info-section">
                  <h4>Información de Contacto</h4>
                  <div class="info-grid">
                    <div class="info-item">
                      <strong>Cédula:</strong>
                      <span>{{ volunteer.cedula }}</span>
                    </div>
                    <div class="info-item">
                      <strong>Email:</strong>
                      <span>{{ volunteer.email }}</span>
                    </div>
                    <div class="info-item">
                      <strong>Teléfono:</strong>
                      <span>{{ volunteer.telefono }}</span>
                    </div>
                    <div class="info-item">
                      <strong>Fecha de Solicitud:</strong>
                      <span>{{ formatDateTime(volunteer.fecha_registro) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Notas del administrador (si las hay) -->
                <div v-if="volunteer.notas" class="notes-section">
                  <h4>Notas</h4>
                  <p>{{ volunteer.notas }}</p>
                </div>
              </div>

              <div class="card-actions">
                <button 
                  class="btn-action approve" 
                  @click="approveVolunteer(volunteer)"
                  title="Aprobar solicitud"
                >
                  <i class="fas fa-check"></i>
                  Aprobar
                </button>
                
                <button 
                  class="btn-action reject" 
                  @click="rejectVolunteer(volunteer)"
                  title="Rechazar solicitud"
                >
                  <i class="fas fa-times"></i>
                  Rechazar
                </button>
                
                <button 
                  class="btn-action view" 
                  @click="viewVolunteerDetails(volunteer)"
                  title="Ver detalles completos"
                >
                  <i class="fas fa-eye"></i>
                  Ver Detalles
                </button>

                <button 
                  class="btn-action notes" 
                  @click="openNotesModal(volunteer)"
                  title="Agregar notas"
                >
                  <i class="fas fa-edit"></i>
                  Notas
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pestañas para otros estados -->
        <div class="tabs-section">
          <div class="tabs">
            <button 
              :class="['tab', { active: activeTab === 'approved' }]"
              @click="activeTab = 'approved'"
            >
              <i class="fas fa-user-check"></i>
              Aprobados ({{ approvedVolunteers.length }})
            </button>
            <button 
              :class="['tab', { active: activeTab === 'rejected' }]"
              @click="activeTab = 'rejected'"
            >
              <i class="fas fa-user-times"></i>
              Rechazados ({{ rejectedVolunteers.length }})
            </button>
            <button 
              :class="['tab', { active: activeTab === 'all' }]"
              @click="activeTab = 'all'"
            >
              <i class="fas fa-users"></i>
              Todos ({{ allVolunteers.length }})
            </button>
          </div>

          <!-- Contenido de las pestañas -->
          <div class="tab-content">
            <!-- Aprobados -->
            <div v-if="activeTab === 'approved'" class="approved-list">
              <div v-if="approvedVolunteers.length === 0" class="empty-tab">
                <i class="fas fa-user-check"></i>
                <p>No hay voluntarios aprobados</p>
              </div>
              
              <div v-else>
                <div 
                  v-for="volunteer in approvedVolunteers" 
                  :key="volunteer.id"
                  class="volunteer-item approved"
                >
                  <div class="item-avatar">{{ getInitials(volunteer.nombre) }}</div>
                  <div class="item-details">
                    <strong>{{ volunteer.nombre }}</strong>
                    <span>{{ volunteer.email }}</span>
                    <small v-if="volunteer.fecha_aprobacion">Aprobado el {{ formatDate(volunteer.fecha_aprobacion) }}</small>
                  </div>
                  <div class="item-actions">
                    <button @click="viewVolunteerDetails(volunteer)" title="Ver detalles">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button @click="deactivateVolunteer(volunteer)" title="Desactivar">
                      <i class="fas fa-user-slash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Rechazados -->
            <div v-if="activeTab === 'rejected'" class="rejected-list">
              <div v-if="rejectedVolunteers.length === 0" class="empty-tab">
                <i class="fas fa-user-times"></i>
                <p>No hay solicitudes rechazadas</p>
              </div>
              
              <div v-else>
                <div 
                  v-for="volunteer in rejectedVolunteers" 
                  :key="volunteer.id"
                  class="volunteer-item rejected"
                >
                  <div class="item-avatar">{{ getInitials(volunteer.nombre) }}</div>
                  <div class="item-details">
                    <strong>{{ volunteer.nombre }}</strong>
                    <span>{{ volunteer.email }}</span>
                    <small v-if="volunteer.fecha_rechazo">Rechazado el {{ formatDate(volunteer.fecha_rechazo) }}</small>
                  </div>
                  <div class="item-actions">
                    <button @click="viewVolunteerDetails(volunteer)" title="Ver detalles">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button @click="restoreVolunteer(volunteer)" title="Restaurar">
                      <i class="fas fa-redo"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Todos -->
            <div v-if="activeTab === 'all'" class="all-list">
              <div v-if="filteredVolunteers.length === 0" class="empty-tab">
                <i class="fas fa-users"></i>
                <p>No hay voluntarios registrados</p>
              </div>
              <div v-else class="volunteers-table">
                <table>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Cédula</th>
                      <th>Email</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="volunteer in filteredVolunteers" :key="volunteer.id">
                      <td>{{ volunteer.nombre }}</td>
                      <td>{{ formatCedula(volunteer.cedula) }}</td>
                      <td>{{ volunteer.email }}</td>
                      <td>
                        <span class="status-badge" :class="volunteer.status">
                          {{ getStatusText(volunteer.status) }}
                        </span>
                      </td>
                      <td>{{ formatDate(volunteer.fecha_registro) }}</td>
                      <td>
                        <button @click="viewVolunteerDetails(volunteer)" title="Ver detalles">
                          <i class="fas fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Notas -->
    <NotesModal 
      v-if="selectedVolunteerForNotes"
      :volunteer="selectedVolunteerForNotes"
      @save="saveNotes"
      @close="selectedVolunteerForNotes = null"
    />

    <!-- Modal de Confirmación -->
    <ConfirmationModal 
      v-if="showConfirmationModal"
      :title="confirmationData.title"
      :message="confirmationData.message"
      :confirmText="confirmationData.confirmText"
      :cancelText="confirmationData.cancelText"
      :type="confirmationData.type"
      @confirm="executeAction"
      @cancel="cancelAction"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useAppStore } from '@/stores/app';
import { formatDate, formatDateTime } from '@/utils';
import NotesModal from '@/components/admin/NotesModal.vue';
import ConfirmationModal from '@/components/common/ConfirmationModal.vue';

const router = useRouter();
const authStore = useAuthStore();
const appStore = useAppStore();

// Estado
const loading = ref(true);
const volunteers = ref<any[]>([]);
const selectedVolunteerForNotes = ref<any>(null);
const showConfirmationModal = ref(false);
const activeTab = ref<'approved' | 'rejected' | 'all'>('approved');

const confirmationData = ref({
  title: '',
  message: '',
  confirmText: '',
  cancelText: 'Cancelar',
  type: 'info' as 'info' | 'warning' | 'danger',
  action: '' as 'approve' | 'reject' | 'deactivate' | 'restore',
  volunteerId: ''
});

// Filtros
const filters = ref({
  search: '',
  estado: ''
});

// Estadísticas
const stats = computed(() => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  return {
    pending: pendingVolunteers.value.length,
    approved: approvedVolunteers.value.length,
    rejected: rejectedVolunteers.value.length,
    thisMonth: volunteers.value.filter(v => 
      new Date(v.fecha_registro) >= startOfMonth
    ).length
  };
});

// Voluntarios filtrados por estado
const allVolunteers = computed(() => volunteers.value);
const pendingVolunteers = computed(() => 
  volunteers.value.filter(v => v.status === 'pending')
);
const approvedVolunteers = computed(() => 
  volunteers.value.filter(v => v.status === 'approved')
);
const rejectedVolunteers = computed(() => 
  volunteers.value.filter(v => v.status === 'rejected')
);

const filteredVolunteers = computed(() => {
  let filtered = volunteers.value;

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    filtered = filtered.filter(v =>
      v.nombre.toLowerCase().includes(search) ||
      v.cedula.toLowerCase().includes(search) ||
      v.email.toLowerCase().includes(search)
    );
  }

  if (filters.value.estado) {
    filtered = filtered.filter(v => v.status === filters.value.estado);
  }

  return filtered;
});

// Métodos de utilidad
const getInitials = (nombre: string) => {
  return nombre
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const formatCedula = (cedula: string) => {
  if (!cedula) return '';
  if (cedula.length === 11) {
    return cedula.replace(/(\d{3})(\d{7})(\d{1})/, '$1-$2-$3');
  }
  return cedula;
};

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'pending': 'Pendiente',
    'approved': 'Aprobado',
    'rejected': 'Rechazado'
  };
  return statusMap[status] || status;
};

// Cargar solicitudes desde localStorage
const loadVolunteers = async () => {
  try {
    loading.value = true;
    
    // Cargar de localStorage (esto se llena automáticamente desde el formulario de voluntariado)
    const storedVolunteers = localStorage.getItem('eco_vigia_volunteer_applications');
    volunteers.value = storedVolunteers ? JSON.parse(storedVolunteers) : [];
    
    // Si no hay datos, mostrar mensaje
    if (volunteers.value.length === 0) {
      console.log('No hay solicitudes de voluntarios aún');
    }
    
  } catch (error) {
    console.error('Error loading volunteers:', error);
    appStore.addNotification({
      message: 'Error al cargar las solicitudes',
      type: 'error'
    });
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  // Los filtros se aplican automáticamente mediante computed
};

// Acciones sobre voluntarios
const viewVolunteerDetails = (volunteer: any) => {
  // Aquí podrías implementar un modal de detalles más completo
  alert(`Detalles de ${volunteer.nombre}\n\n` +
        `Cédula: ${volunteer.cedula}\n` +
        `Email: ${volunteer.email}\n` +
        `Teléfono: ${volunteer.telefono}\n` +
        `Estado: ${getStatusText(volunteer.status)}\n` +
        `Fecha: ${formatDateTime(volunteer.fecha_registro)}`);
};

const openNotesModal = (volunteer: any) => {
  selectedVolunteerForNotes.value = volunteer;
};

const saveNotes = (volunteerId: string, notes: string) => {
  const volunteerIndex = volunteers.value.findIndex(v => v.id === volunteerId);
  if (volunteerIndex !== -1) {
    volunteers.value[volunteerIndex].notas = notes;
    saveToStorage();
    selectedVolunteerForNotes.value = null;
    
    appStore.addNotification({
      message: 'Notas guardadas exitosamente',
      type: 'success'
    });
  }
};

// Mostrar confirmación
const showConfirmation = (
  volunteer: any,
  action: typeof confirmationData.value.action,
  title: string,
  message: string,
  type: typeof confirmationData.value.type = 'warning'
) => {
  const actionTexts: Record<string, string> = {
    'approve': 'Aprobar',
    'reject': 'Rechazar',
    'deactivate': 'Desactivar',
    'restore': 'Restaurar'
  };
  
  confirmationData.value = {
    title,
    message,
    confirmText: actionTexts[action] || 'Confirmar',
    cancelText: 'Cancelar',
    type,
    action,
    volunteerId: volunteer.id
  };
  showConfirmationModal.value = true;
};

// Acciones específicas
const approveVolunteer = (volunteer: any) => {
  showConfirmation(
    volunteer,
    'approve',
    'Aprobar Voluntario',
    `¿Estás seguro de aprobar a ${volunteer.nombre} como voluntario?`,
    'info'
  );
};

const rejectVolunteer = (volunteer: any) => {
  showConfirmation(
    volunteer,
    'reject',
    'Rechazar Solicitud',
    `¿Estás seguro de rechazar la solicitud de ${volunteer.nombre}?`,
    'warning'
  );
};

const deactivateVolunteer = (volunteer: any) => {
  showConfirmation(
    volunteer,
    'deactivate',
    'Desactivar Voluntario',
    `¿Desactivar a ${volunteer.nombre} como voluntario?`,
    'warning'
  );
};

const restoreVolunteer = (volunteer: any) => {
  showConfirmation(
    volunteer,
    'restore',
    'Restaurar Solicitud',
    `¿Restaurar la solicitud de ${volunteer.nombre} a pendiente?`,
    'info'
  );
};

// Ejecutar acción confirmada
const executeAction = () => {
  const { action, volunteerId } = confirmationData.value;
  const volunteerIndex = volunteers.value.findIndex(v => v.id === volunteerId);
  
  if (volunteerIndex === -1) return;
  
  const volunteer = volunteers.value[volunteerIndex];
  
  switch (action) {
    case 'approve':
      volunteer.status = 'approved';
      volunteer.fecha_aprobacion = new Date().toISOString();
      appStore.addNotification({
        message: `Voluntario ${volunteer.nombre} aprobado`,
        type: 'success'
      });
      break;
      
    case 'reject':
      volunteer.status = 'rejected';
      volunteer.fecha_rechazo = new Date().toISOString();
      appStore.addNotification({
        message: `Solicitud de ${volunteer.nombre} rechazada`,
        type: 'warning'
      });
      break;
      
    case 'deactivate':
      volunteer.status = 'rejected';
      volunteer.fecha_rechazo = new Date().toISOString();
      appStore.addNotification({
        message: `Voluntario ${volunteer.nombre} desactivado`,
        type: 'warning'
      });
      break;
      
    case 'restore':
      volunteer.status = 'pending';
      delete volunteer.fecha_rechazo;
      delete volunteer.fecha_aprobacion;
      appStore.addNotification({
        message: `Solicitud de ${volunteer.nombre} restaurada`,
        type: 'info'
      });
      break;
  }
  
  // Guardar cambios
  saveToStorage();
  showConfirmationModal.value = false;
};

const cancelAction = () => {
  showConfirmationModal.value = false;
};

// Guardar en localStorage
const saveToStorage = () => {
  try {
    localStorage.setItem('eco_vigia_volunteer_applications', JSON.stringify(volunteers.value));
  } catch (error) {
    console.error('Error saving volunteers:', error);
  }
};

onMounted(() => {
  if (!authStore.isAdmin()) {
    router.push('/');
    return;
  }
  loadVolunteers();
});
</script>

<style scoped lang="scss">
.admin-volunteers {
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

.header-content {
  h1 {
    color: #1b5e20;
    margin-bottom: 0.5rem;
    font-size: 2rem;
  }
  
  p {
    color: #666;
    font-size: 1.1rem;
  }
}

.btn-back {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  
  &:nth-child(1) i { background: #ff9800; }
  &:nth-child(2) i { background: #4caf50; }
  &:nth-child(3) i { background: #f44336; }
  &:nth-child(4) i { background: #2196f3; }
}

.stat-content {
  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
    line-height: 1;
  }
  
  .stat-label {
    color: #666;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }
}

.filters-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.filters-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  align-items: center;
}

.search-box {
  position: relative;
  
  i {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
  }
  
  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #1b5e20;
    }
  }
}

.filter-group {
  select {
    padding: 0.75rem 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    background: white;
    font-size: 1rem;
    cursor: pointer;
    min-width: 150px;
    
    &:focus {
      outline: none;
      border-color: #1b5e20;
    }
  }
}

.btn-refresh {
  background: #1b5e20;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s ease;
  
  &:hover {
    background: #144017;
  }
}

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #1b5e20;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }
  
  p {
    color: #666;
  }
}

.volunteers-content {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
  
  h2 {
    color: #1b5e20;
    margin: 0;
    font-size: 1.3rem;
  }
  
  .badge {
    background: #ff9800;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
  }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
  
  i {
    font-size: 4rem;
    margin-bottom: 1rem;
    color: #4caf50;
  }
  
  h3 {
    margin-bottom: 0.5rem;
    color: #333;
  }
}

.pending-grid {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 1.5rem;
}

.volunteer-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.volunteer-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.volunteer-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1b5e20, #4caf50);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.2rem;
}

.volunteer-details {
  h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
    font-size: 1.2rem;
  }
}

.volunteer-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
  
  i {
    color: #1b5e20;
  }
}

.volunteer-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
  
  i {
    color: #1b5e20;
  }
}

.card-content {
  padding: 1.5rem;
}

.info-section {
  margin-bottom: 1.5rem;
  
  h4 {
    color: #1b5e20;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-item {
  strong {
    display: block;
    color: #333;
    margin-bottom: 0.25rem;
    font-size: 0.9rem;
  }
  
  span {
    color: #666;
    font-size: 0.9rem;
  }
}

.notes-section {
  background: #fff3e0;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #ff9800;
  
  h4 {
    color: #ff9800;
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }
  
  p {
    color: #666;
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.4;
  }
}

.card-actions {
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.btn-action {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &.approve {
    background: #e8f5e8;
    color: #4caf50;
    
    &:hover {
      background: #4caf50;
      color: white;
    }
  }
  
  &.reject {
    background: #ffebee;
    color: #f44336;
    
    &:hover {
      background: #f44336;
      color: white;
    }
  }
  
  &.view {
    background: #e3f2fd;
    color: #1976d2;
    
    &:hover {
      background: #1976d2;
      color: white;
    }
  }
  
  &.notes {
    background: #fff3e0;
    color: #ff9800;
    
    &:hover {
      background: #ff9800;
      color: white;
    }
  }
}

.tabs-section {
  border-top: 1px solid #e0e0e0;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
}

.tab {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  background: transparent;
  color: #666;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &.active {
    background: #1b5e20;
    color: white;
  }
  
  &:hover:not(.active) {
    background: #f8f9fa;
    color: #1b5e20;
  }
}

.tab-content {
  padding: 1.5rem;
  min-height: 200px;
}

.empty-tab {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
  
  i {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
}

.volunteer-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  
  &:last-child {
    border-bottom: none;
  }
  
  &.approved {
    .item-avatar {
      background: #e8f5e8;
      color: #4caf50;
    }
  }
  
  &.rejected {
    .item-avatar {
      background: #ffebee;
      color: #f44336;
    }
  }
}

.item-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.item-details {
  flex: 1;
  
  strong {
    display: block;
    color: #333;
    margin-bottom: 0.25rem;
  }
  
  span {
    display: block;
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }
  
  small {
    color: #999;
    font-size: 0.8rem;
  }
}

.item-actions {
  display: flex;
  gap: 0.5rem;
  
  button {
    width: 35px;
    height: 35px;
    border: none;
    border-radius: 6px;
    background: #f5f5f5;
    color: #666;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    
    &:hover {
      background: #e0e0e0;
      color: #333;
    }
  }
}

.volunteers-table {
  overflow-x: auto;
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    thead {
      background: #f8f9fa;
      
      th {
        padding: 1rem;
        text-align: left;
        color: #333;
        font-weight: 600;
        border-bottom: 2px solid #e0e0e0;
        white-space: nowrap;
      }
    }
    
    tbody {
      tr {
        border-bottom: 1px solid #e0e0e0;
        
        &:hover {
          background: #f8f9fa;
        }
        
        td {
          padding: 1rem;
          color: #666;
        }
      }
    }
  }
}

.status-badge {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  
  &.pending {
    background: #fff3e0;
    color: #ff9800;
  }
  
  &.approved {
    background: #e8f5e8;
    color: #4caf50;
  }
  
  &.rejected {
    background: #ffebee;
    color: #f44336;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .filters-row {
    grid-template-columns: 1fr;
  }
  
  .pending-grid {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .card-actions {
    flex-wrap: wrap;
  }
  
  .btn-action {
    min-width: calc(50% - 0.375rem);
  }
  
  .tabs {
    flex-direction: column;
  }
}
</style>