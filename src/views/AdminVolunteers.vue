<template>
  <div class="admin-volunteers">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Gestión de Voluntarios</h1>
          <p>Administra los voluntarios registrados en el sistema</p>
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
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.total }}</div>
            <div class="stat-label">Voluntarios Totales</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-user-check"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.active }}</div>
            <div class="stat-label">Voluntarios Activos</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-user-plus"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.pending }}</div>
            <div class="stat-label">Pendientes de Aprobación</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-calendar-alt"></i>
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
              placeholder="Buscar voluntarios por nombre, cédula o correo..." 
              @input="applyFilters"
            >
          </div>

          <div class="filter-group">
            <select v-model="filters.estado" @change="applyFilters">
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="pendiente">Pendiente</option>
              <option value="inactivo">Inactivo</option>
              <option value="rechazado">Rechazado</option>
            </select>
          </div>

          <div class="filter-group">
            <select v-model="filters.orden" @change="applyFilters">
              <option value="fecha_desc">Más recientes primero</option>
              <option value="fecha_asc">Más antiguos primero</option>
              <option value="nombre_asc">Nombre A-Z</option>
              <option value="nombre_desc">Nombre Z-A</option>
            </select>
          </div>
        </div>

        <div class="date-filters">
          <div class="date-input">
            <label>Desde:</label>
            <input type="date" v-model="filters.fechaDesde" @change="applyFilters">
          </div>
          <div class="date-input">
            <label>Hasta:</label>
            <input type="date" v-model="filters.fechaHasta" @change="applyFilters">
          </div>
          <button class="btn-clear" @click="clearFilters">
            <i class="fas fa-times"></i>
            Limpiar Filtros
          </button>
        </div>
      </div>

      <!-- Exportar Datos -->
      <div class="export-section">
        <button class="btn-export" @click="exportToExcel">
          <i class="fas fa-file-excel"></i>
          Exportar a Excel
        </button>
        <button class="btn-export" @click="exportToPDF">
          <i class="fas fa-file-pdf"></i>
          Exportar a PDF
        </button>
        <button class="btn-export" @click="exportToCSV">
          <i class="fas fa-file-csv"></i>
          Exportar a CSV
        </button>
        <button class="btn-export" @click="exportStatistics">
          <i class="fas fa-chart-bar"></i>
          Exportar Estadísticas
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando voluntarios...</p>
      </div>

      <!-- Tabla de Voluntarios -->
      <div v-else class="volunteers-table">
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th @click="sortBy('nombre')" class="sortable">
                  Nombre
                  <i class="fas fa-sort"></i>
                </th>
                <th>Cédula</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th @click="sortBy('fecha_registro')" class="sortable">
                  Fecha Registro
                  <i class="fas fa-sort"></i>
                </th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(volunteer, index) in paginatedVolunteers" :key="volunteer.id">
                <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td>
                  <div class="user-info">
                    <div class="user-avatar">
                      {{ getInitials(volunteer.nombre) }}
                    </div>
                    <div class="user-details">
                      <strong>{{ volunteer.nombre }}</strong>
                      <span class="user-email">{{ volunteer.email }}</span>
                    </div>
                  </div>
                </td>
                <td>{{ formatCedula(volunteer.cedula) }}</td>
                <td>{{ volunteer.email }}</td>
                <td>{{ volunteer.telefono }}</td>
                <td>{{ formatDate(volunteer.fecha_registro) }}</td>
                <td>
                  <span class="status-badge" :class="volunteer.estado">
                    {{ getStatusText(volunteer.estado) }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button 
                      class="btn-action view" 
                      @click="viewVolunteer(volunteer)"
                      title="Ver detalles"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    
                    <button 
                      v-if="volunteer.estado === 'pendiente'"
                      class="btn-action approve" 
                      @click="approveVolunteer(volunteer)"
                      title="Aprobar voluntario"
                    >
                      <i class="fas fa-check"></i>
                    </button>
                    
                    <button 
                      v-if="volunteer.estado === 'pendiente'"
                      class="btn-action reject" 
                      @click="rejectVolunteer(volunteer)"
                      title="Rechazar solicitud"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                    
                    <button 
                      v-if="volunteer.estado === 'activo'"
                      class="btn-action deactivate" 
                      @click="deactivateVolunteer(volunteer)"
                      title="Desactivar voluntario"
                    >
                      <i class="fas fa-user-slash"></i>
                    </button>
                    
                    <button 
                      v-if="volunteer.estado === 'inactivo'"
                      class="btn-action activate" 
                      @click="activateVolunteer(volunteer)"
                      title="Reactivar voluntario"
                    >
                      <i class="fas fa-user-check"></i>
                    </button>
                    
                    <button 
                      class="btn-action delete" 
                      @click="deleteVolunteer(volunteer)"
                      title="Eliminar voluntario"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div class="pagination" v-if="totalPages > 1">
          <button 
            class="pagination-btn" 
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <button 
            v-for="page in visiblePages" 
            :key="page"
            class="pagination-btn" 
            :class="{ active: page === currentPage }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
          
          <button 
            class="pagination-btn" 
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredVolunteers.length === 0" class="empty-state">
        <i class="fas fa-users-slash"></i>
        <h3>No se encontraron voluntarios</h3>
        <p v-if="hasActiveFilters">Intenta ajustar los filtros de búsqueda</p>
        <p v-else>No hay voluntarios registrados aún</p>
      </div>

      <!-- Modal de Detalles -->
      <div v-if="selectedVolunteer">
        <!-- Modal de detalles del voluntario -->
        <div class="modal-overlay">
          <div class="modal-content">
            <!-- Contenido del modal -->
          </div>
        </div>
      </div>

      <!-- Modal de Confirmación -->
      <div v-if="showConfirmationModal" class="modal-overlay">
        <div class="modal-content confirmation-modal">
          <h3>{{ confirmationData.title }}</h3>
          <p>{{ confirmationData.message }}</p>
          <div class="modal-actions">
            <button class="btn-secondary" @click="cancelAction">
              {{ confirmationData.cancelText }}
            </button>
            <button 
              class="btn-primary" 
              :class="{ 'btn-danger': confirmationData.type === 'danger' }"
              @click="executeAction"
            >
              {{ confirmationData.confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { exportService } from '@/services/exportService';
import { formatDate } from '@/utils';


const router = useRouter();
const authStore = useAuthStore();

// Definir tipo Volunteer
interface Volunteer {
  id: string;
  nombre: string;
  cedula: string;
  email: string;
  telefono: string;
  fecha_registro: string;
  estado: 'activo' | 'pendiente' | 'inactivo' | 'rechazado';
  fecha_aprobacion?: string;
  fecha_rechazo?: string;
}

// Estado
const loading = ref(true);
const volunteers = ref<Volunteer[]>([]);
const selectedVolunteer = ref<Volunteer | null>(null);
const showConfirmationModal = ref(false);
const confirmationData = ref({
  title: '',
  message: '',
  confirmText: '',
  cancelText: 'Cancelar',
  type: 'info' as 'info' | 'warning' | 'danger',
  action: '' as 'approve' | 'reject' | 'activate' | 'deactivate' | 'delete',
  volunteerId: ''
});

// Filtros
const filters = ref({
  search: '',
  estado: '',
  orden: 'fecha_desc',
  fechaDesde: '',
  fechaHasta: ''
});

// Paginación
const currentPage = ref(1);
const itemsPerPage = 10;

// Estadísticas
const stats = computed(() => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  return {
    total: volunteers.value.length,
    active: volunteers.value.filter(v => v.estado === 'activo').length,
    pending: volunteers.value.filter(v => v.estado === 'pendiente').length,
    thisMonth: volunteers.value.filter(v => 
      new Date(v.fecha_registro) >= startOfMonth
    ).length
  };
});

// Voluntarios filtrados
const filteredVolunteers = computed(() => {
  let filtered = [...volunteers.value];

  // Búsqueda
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    filtered = filtered.filter(v =>
      v.nombre.toLowerCase().includes(search) ||
      v.cedula.includes(search) ||
      v.email.toLowerCase().includes(search) ||
      v.telefono.includes(search)
    );
  }

  // Filtro por estado
  if (filters.value.estado) {
    filtered = filtered.filter(v => v.estado === filters.value.estado);
  }

  // Filtro por fecha
  if (filters.value.fechaDesde) {
    const desde = new Date(filters.value.fechaDesde);
    filtered = filtered.filter(v => new Date(v.fecha_registro) >= desde);
  }

  if (filters.value.fechaHasta) {
    const hasta = new Date(filters.value.fechaHasta);
    hasta.setHours(23, 59, 59, 999); // Fin del día
    filtered = filtered.filter(v => new Date(v.fecha_registro) <= hasta);
  }

  // Ordenamiento
  filtered.sort((a, b) => {
    switch (filters.value.orden) {
      case 'nombre_asc':
        return a.nombre.localeCompare(b.nombre);
      case 'nombre_desc':
        return b.nombre.localeCompare(a.nombre);
      case 'fecha_asc':
        return new Date(a.fecha_registro).getTime() - new Date(b.fecha_registro).getTime();
      case 'fecha_desc':
        return new Date(b.fecha_registro).getTime() - new Date(a.fecha_registro).getTime();
      default:
        return 0;
    }
  });

  return filtered;
});

// Paginación
const totalPages = computed(() => 
  Math.ceil(filteredVolunteers.value.length / itemsPerPage)
);

const paginatedVolunteers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredVolunteers.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

const hasActiveFilters = computed(() => {
  return Object.values(filters.value).some(value => value !== '');
});

// Métodos
const applyFilters = () => {
  currentPage.value = 1; // Resetear a primera página
};

const clearFilters = () => {
  filters.value = {
    search: '',
    estado: '',
    orden: 'fecha_desc',
    fechaDesde: '',
    fechaHasta: ''
  };
  currentPage.value = 1;
};

const sortBy = (field: string) => {
  // Implementar lógica de ordenamiento
  console.log('Sort by:', field);
};

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

const getStatusText = (estado: string) => {
  const statusMap: Record<string, string> = {
    'activo': 'Activo',
    'pendiente': 'Pendiente',
    'inactivo': 'Inactivo',
    'rechazado': 'Rechazado'
  };
  return statusMap[estado] || estado;
};

// Función para mapear los estados del auth.ts a AdminVolunteers.vue
const mapStatus = (status: string): 'activo' | 'pendiente' | 'inactivo' | 'rechazado' => {
  const statusMap: Record<string, any> = {
    'pending': 'pendiente',
    'approved': 'activo',
    'rejected': 'rechazado',
    'inactive': 'inactivo'
  };
  return statusMap[status] || 'pendiente';
};

// Función para mapear de vuelta cuando se actualice el estado
const mapStatusReverse = (estado: string): string => {
  const statusMap: Record<string, string> = {
    'pendiente': 'pending',
    'activo': 'approved',
    'rechazado': 'rejected',
    'inactivo': 'inactive'
  };
  return statusMap[estado] || 'pending';
};

const loadVolunteers = async () => {
  try {
    loading.value = true;
    
    // Simular carga de API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Obtener voluntarios desde el store auth
    const allVolunteers = authStore.getAllVolunteers();
    
    // Convertir al formato que necesita el componente
    volunteers.value = allVolunteers.map((vol: any) => ({
      id: vol.id,
      nombre: vol.nombre,
      cedula: vol.cedula,
      email: vol.email,
      telefono: vol.telefono,
      fecha_registro: vol.fecha_registro || vol.created_at,
      fecha_aprobacion: vol.fecha_aprobacion,
      fecha_rechazo: vol.fecha_rechazo,
      estado: mapStatus(vol.status) // Mapear estado
    }));
    
    console.log('Voluntarios cargados:', volunteers.value);
    
  } catch (error) {
    console.error('Error loading volunteers:', error);
  } finally {
    loading.value = false;
  }
};

// Función para actualizar el estado en localStorage
const updateVolunteerStatus = (volunteerId: string, status: string) => {
  try {
    const allVolunteers = authStore.getAllVolunteers();
    const volunteerIndex = allVolunteers.findIndex((v: any) => v.id === volunteerId);
    
    if (volunteerIndex !== -1) {
      allVolunteers[volunteerIndex].status = status;
      if (status === 'approved') {
        allVolunteers[volunteerIndex].fecha_aprobacion = new Date().toISOString();
        // Limpiar fecha de rechazo si existe
        delete allVolunteers[volunteerIndex].fecha_rechazo;
      } else if (status === 'rejected') {
        allVolunteers[volunteerIndex].fecha_rechazo = new Date().toISOString();
        // Limpiar fecha de aprobación si existe
        delete allVolunteers[volunteerIndex].fecha_aprobacion;
      }
      
      // Guardar cambios
      localStorage.setItem('eco_vigia_volunteer_applications', JSON.stringify(allVolunteers));
    }
  } catch (error) {
    console.error('Error updating volunteer status:', error);
  }
};

// Función para eliminar voluntario del almacenamiento
const deleteVolunteerFromStorage = (volunteerId: string) => {
  try {
    const allVolunteers = authStore.getAllVolunteers();
    const updatedVolunteers = allVolunteers.filter((v: any) => v.id !== volunteerId);
    localStorage.setItem('eco_vigia_volunteer_applications', JSON.stringify(updatedVolunteers));
  } catch (error) {
    console.error('Error deleting volunteer:', error);
  }
};

// Acciones sobre voluntarios
const viewVolunteer = (volunteer: Volunteer) => {
  selectedVolunteer.value = volunteer;
};

const showConfirmation = (
  volunteer: Volunteer,
  action: typeof confirmationData.value.action,
  title: string,
  message: string,
  type: typeof confirmationData.value.type = 'warning'
) => {
  confirmationData.value = {
    title,
    message,
    confirmText: action === 'delete' ? 'Eliminar' : 'Confirmar',
    cancelText: 'Cancelar',
    type,
    action,
    volunteerId: volunteer.id
  };
  showConfirmationModal.value = true;
};

const approveVolunteer = (volunteer: Volunteer) => {
  showConfirmation(
    volunteer,
    'approve',
    'Aprobar Voluntario',
    `¿Estás seguro de aprobar a ${volunteer.nombre} como voluntario?`,
    'info'
  );
};

const rejectVolunteer = (volunteer: Volunteer) => {
  showConfirmation(
    volunteer,
    'reject',
    'Rechazar Voluntario',
    `¿Estás seguro de rechazar la solicitud de ${volunteer.nombre}?`,
    'warning'
  );
};

const activateVolunteer = (volunteer: Volunteer) => {
  showConfirmation(
    volunteer,
    'activate',
    'Activar Voluntario',
    `¿Activar a ${volunteer.nombre} como voluntario?`,
    'info'
  );
};

const deactivateVolunteer = (volunteer: Volunteer) => {
  showConfirmation(
    volunteer,
    'deactivate',
    'Desactivar Voluntario',
    `¿Desactivar a ${volunteer.nombre} como voluntario?`,
    'warning'
  );
};

const deleteVolunteer = (volunteer: Volunteer) => {
  showConfirmation(
    volunteer,
    'delete',
    'Eliminar Voluntario',
    `¿Eliminar permanentemente a ${volunteer.nombre}? Esta acción no se puede deshacer.`,
    'danger'
  );
};

const executeAction = () => {
  const { action, volunteerId } = confirmationData.value;
  const volunteer = volunteers.value.find(v => v.id === volunteerId);
  
  if (!volunteer) return;
  
  switch (action) {
    case 'approve':
      volunteer.estado = 'activo';
      volunteer.fecha_aprobacion = new Date().toISOString();
      // Actualizar en localStorage
      updateVolunteerStatus(volunteerId, 'approved');
      break;
    case 'reject':
      volunteer.estado = 'rechazado';
      volunteer.fecha_rechazo = new Date().toISOString();
      updateVolunteerStatus(volunteerId, 'rejected');
      break;
    case 'activate':
      volunteer.estado = 'activo';
      updateVolunteerStatus(volunteerId, 'approved');
      break;
    case 'deactivate':
      volunteer.estado = 'inactivo';
      updateVolunteerStatus(volunteerId, 'inactive');
      break;
    case 'delete':
      deleteVolunteerFromStorage(volunteerId);
      volunteers.value = volunteers.value.filter(v => v.id !== volunteerId);
      break;
  }
  
  showConfirmationModal.value = false;
};

const cancelAction = () => {
  showConfirmationModal.value = false;
};

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Funciones de exportación actualizadas
const exportToExcel = () => {
  if (filteredVolunteers.value.length === 0) {
    showToast('No hay datos para exportar', 'warning');
    return;
  }

  const result = exportService.exportVolunteersToExcel(
    filteredVolunteers.value,
    {
      filename: `voluntarios_${getCurrentDate()}.xlsx`,
      title: `Listado de Voluntarios - ${new Date().toLocaleDateString('es-DO')}`,
      includeAllData: true
    }
  );

  if (result.success) {
    showToast(`✅ ${result.message} - ${filteredVolunteers.value.length} registros`, 'success');
  } else {
    showToast(`❌ ${result.message}`, 'error');
  }
};

const exportToPDF = () => {
  if (filteredVolunteers.value.length === 0) {
    showToast('No hay datos para exportar', 'warning');
    return;
  }

  const result = exportService.exportVolunteersToPDF(
    filteredVolunteers.value,
    {
      filename: `voluntarios_${getCurrentDate()}.pdf`,
      title: `Listado de Voluntarios - ${new Date().toLocaleDateString('es-DO')}`
    }
  );

  if (result.success) {
    showToast(`✅ ${result.message} - ${filteredVolunteers.value.length} registros`, 'success');
  } else {
    showToast(`❌ ${result.message}`, 'error');
  }
};

const exportToCSV = () => {
  if (filteredVolunteers.value.length === 0) {
    showToast('No hay datos para exportar', 'warning');
    return;
  }

  const result = exportService.exportToCSV(
    filteredVolunteers.value,
    `voluntarios_${getCurrentDate()}.csv`
  );

  if (result.success) {
    showToast(`✅ ${result.message} - ${filteredVolunteers.value.length} registros`, 'success');
  } else {
    showToast(`❌ ${result.message}`, 'error');
  }
};

// Agregar también botón para exportar estadísticas
const exportStatistics = () => {
  if (volunteers.value.length === 0) {
    showToast('No hay datos para generar estadísticas', 'warning');
    return;
  }

  const result = exportService.exportStatisticsToPDF(volunteers.value);
  
  if (result.success) {
    showToast(`✅ ${result.message}`, 'success');
  } else {
    showToast(`❌ ${result.message}`, 'error');
  }
};

// Función para mostrar toasts/notificaciones
const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  // Crear elemento de toast
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 
                  type === 'error' ? 'exclamation-circle' : 
                  type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;
  
  // Agregar estilos
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    z-index: 9999;
    animation: slideIn 0.3s ease;
    ${type === 'success' ? 'background: #4caf50;' :
     type === 'error' ? 'background: #f44336;' :
     type === 'warning' ? 'background: #ff9800;' : 'background: #2196f3;'}
  `;
  
  // Agregar al documento
  document.body.appendChild(toast);
  
  // Remover después de 5 segundos
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 5000);
};

// Agregar estilos CSS para las animaciones
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;

document.head.appendChild(style);
const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0].replace(/-/g, '');
};

onMounted(() => {
  console.log('AdminVolunteers mounted');
  console.log('Current user:', authStore.user);
  console.log('Is admin:', authStore.isAdmin());
  
  // Verificar permisos de administrador
  if (!authStore.isAdmin()) {
    console.log('No admin permissions, redirecting...');
    router.push('/');
    return;
  }
  
  // Verificar storage
  console.log('Available volunteers in storage:', authStore.getAllVolunteers());
  
  loadVolunteers();
});
</script>

<style scoped lang="scss">
.admin-volunteers {
  padding: 2rem 0;
  min-height: 100vh;
  background: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
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
  background: #e8f5e8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #1b5e20;
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
  margin-bottom: 1rem;
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
    min-width: 180px;
    
    &:focus {
      outline: none;
      border-color: #1b5e20;
    }
  }
}

.date-filters {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.date-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  label {
    color: #666;
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  input {
    padding: 0.5rem;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-size: 0.9rem;
    
    &:focus {
      outline: none;
      border-color: #1b5e20;
    }
  }
}

.btn-clear {
  background: #f8f9fa;
  color: #666;
  border: 2px solid #e0e0e0;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  margin-left: auto;
  
  &:hover {
    background: #e0e0e0;
    color: #333;
  }
}

.export-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.btn-export {
  background: white;
  color: #666;
  border: 2px solid #e0e0e0;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f8f9fa;
    border-color: #1b5e20;
    color: #1b5e20;
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

.volunteers-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.table-responsive {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  
  thead {
    background: #1b5e20;
    
    th {
      color: white;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      white-space: nowrap;
      
      &.sortable {
        cursor: pointer;
        user-select: none;
        
        &:hover {
          background: #144017;
        }
      }
    }
  }
  
  tbody {
    tr {
      border-bottom: 1px solid #e0e0e0;
      
      &:hover {
        background: #f8f9fa;
      }
      
      &:last-child {
        border-bottom: none;
      }
      
      td {
        padding: 1rem;
        color: #333;
      }
    }
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1b5e20, #4caf50);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.user-details {
  strong {
    display: block;
    margin-bottom: 0.25rem;
  }
  
  .user-email {
    font-size: 0.8rem;
    color: #666;
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

.action-buttons {
  display: flex;
  gap: 0.5rem;
  
  .btn-action {
    width: 35px;
    height: 35px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    
    &.view {
      background: #e3f2fd;
      color: #1976d2;
      
      &:hover {
        background: #1976d2;
        color: white;
      }
    }
    
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
    
    &.activate {
      background: #e8f5e8;
      color: #4caf50;
      
      &:hover {
        background: #4caf50;
        color: white;
      }
    }
    
    &.deactivate {
      background: #fff3e0;
      color: #ff9800;
      
      &:hover {
        background: #ff9800;
        color: white;
      }
    }
    
    &.delete {
      background: #f5f5f5;
      color: #666;
      
      &:hover {
        background: #f44336;
        color: white;
      }
    }
  }
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.pagination-btn {
  min-width: 40px;
  height: 40px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    border-color: #1b5e20;
    color: #1b5e20;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.active {
    background: #1b5e20;
    color: white;
    border-color: #1b5e20;
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
    margin-bottom: 0.5rem;
    color: #333;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
}

.confirmation-modal {
  text-align: center;
  
  h3 {
    color: #333;
    margin-bottom: 1rem;
  }
  
  p {
    color: #666;
    margin-bottom: 2rem;
  }
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    background: #5a6268;
  }
}

.btn-primary {
  background: #1b5e20;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    background: #144017;
  }
  
  &.btn-danger {
    background: #f44336;
    
    &:hover {
      background: #d32f2f;
    }
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
  
  .date-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .btn-clear {
    margin-left: 0;
  }
  
  .export-section {
    flex-direction: column;
  }
  
  .btn-export {
    width: 100%;
    justify-content: center;
  }
  
  .action-buttons {
    flex-wrap: wrap;
  }
}
</style>