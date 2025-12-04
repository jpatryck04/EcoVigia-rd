<template>
  <div class="admin-reports">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Gestión de Reportes</h1>
          <p>Administra los reportes de daños ambientales recibidos</p>
        </div>
        <div class="header-actions">
          <button class="btn-back" @click="$router.push('/admin')">
              <i class="fas fa-arrow-left"></i>
            Volver al Dashboard
          </button>
          <button class="btn-primary" @click="exportReports">
            <i class="fas fa-download"></i>
            Exportar Reportes
          </button>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon total">
            <i class="fas fa-flag"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.totalReports }}</div>
            <div class="stat-label">Reportes Totales</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon pending">
            <i class="fas fa-clock"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.pendingReports }}</div>
            <div class="stat-label">Pendientes</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon in-progress">
            <i class="fas fa-tools"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.inProgressReports }}</div>
            <div class="stat-label">En Progreso</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon resolved">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.resolvedReports }}</div>
            <div class="stat-label">Resueltos</div>
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
              placeholder="Buscar reportes..." 
              @input="applyFilters"
            >
          </div>

          <div class="filter-group">
            <select v-model="filters.estado" @change="applyFilters">
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en-progreso">En Progreso</option>
              <option value="resuelto">Resuelto</option>
              <option value="rechazado">Rechazado</option>
            </select>
          </div>

          <div class="filter-group">
            <select v-model="filters.categoria" @change="applyFilters">
              <option value="">Todas las categorías</option>
              <option value="contaminacion">Contaminación</option>
              <option value="deforestacion">Deforestación</option>
              <option value="fauna">Fauna en Peligro</option>
              <option value="flora">Flora Amenazada</option>
              <option value="agua">Contaminación del Agua</option>
              <option value="residuos">Manejo de Residuos</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          <div class="filter-group">
            <select v-model="filters.urgencia" @change="applyFilters">
              <option value="">Todas las urgencias</option>
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando reportes...</p>
      </div>

      <!-- Lista de Reportes -->
      <div v-else class="reports-table-container">
        <table class="reports-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Categoría</th>
              <th>Urgencia</th>
              <th>Ubicación</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="report in filteredReports" :key="report.id">
              <td class="report-id">#{{ report.id.slice(-6) }}</td>
              <td class="report-title">
                <div class="title-wrapper">
                  <strong>{{ report.titulo }}</strong>
                  <p class="report-excerpt">{{ truncateText(report.descripcion, 50) }}</p>
                </div>
              </td>
              <td>
                <span class="category-badge">{{ report.categoria }}</span>
              </td>
              <td>
                <span class="urgency-badge" :class="report.urgencia">
                  {{ report.urgencia }}
                </span>
              </td>
              <td class="location-cell">
                <i class="fas fa-map-marker-alt"></i>
                {{ report.latitud.toFixed(4) }}, {{ report.longitud.toFixed(4) }}
              </td>
              <td>{{ formatDate(report.fecha) }}</td>
              <td>
                <span class="status-badge" :class="report.estado">
                  {{ getStatusText(report.estado) }}
                </span>
              </td>
              <td class="actions-cell">
                <button 
                  class="btn-action view" 
                  @click="viewReport(report)"
                  title="Ver detalles"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button 
                  v-if="report.estado === 'pendiente'"
                  class="btn-action approve" 
                  @click="updateStatus(report, 'en-progreso')"
                  title="Aprobar reporte"
                >
                  <i class="fas fa-check"></i>
                </button>
                <button 
                  v-if="report.estado === 'en-progreso'"
                  class="btn-action resolve" 
                  @click="updateStatus(report, 'resuelto')"
                  title="Marcar como resuelto"
                >
                  <i class="fas fa-check-double"></i>
                </button>
                <button 
                  v-if="report.estado === 'pendiente' || report.estado === 'en-progreso'"
                  class="btn-action reject" 
                  @click="updateStatus(report, 'rechazado')"
                  title="Rechazar reporte"
                >
                  <i class="fas fa-times"></i>
                </button>
                <button 
                  class="btn-action delete" 
                  @click="deleteReport(report)"
                  title="Eliminar reporte"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredReports.length === 0" class="empty-state">
        <i class="fas fa-flag"></i>
        <h3>No se encontraron reportes</h3>
        <p v-if="hasActiveFilters">Intenta ajustar los filtros de búsqueda</p>
        <p v-else>No hay reportes recibidos aún</p>
      </div>

      <!-- Modal de Detalles -->
      <div v-if="selectedReport" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>Detalles del Reporte #{{ selectedReport.id.slice(-6) }}</h2>
            <button class="modal-close" @click="closeModal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="report-details">
              <div class="detail-row">
                <div class="detail-label">Título:</div>
                <div class="detail-value">{{ selectedReport.titulo }}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Descripción:</div>
                <div class="detail-value">{{ selectedReport.descripcion }}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Categoría:</div>
                <div class="detail-value">{{ selectedReport.categoria }}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Urgencia:</div>
                <div class="detail-value">
                  <span class="urgency-badge" :class="selectedReport.urgencia">
                    {{ selectedReport.urgencia }}
                  </span>
                </div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Ubicación:</div>
                <div class="detail-value">
                  <i class="fas fa-map-marker-alt"></i>
                  Lat: {{ selectedReport.latitud.toFixed(6) }}, 
                  Lng: {{ selectedReport.longitud.toFixed(6) }}
                </div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Fecha de Reporte:</div>
                <div class="detail-value">{{ formatDate(selectedReport.fecha) }}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Estado Actual:</div>
                <div class="detail-value">
                  <span class="status-badge" :class="selectedReport.estado">
                    {{ getStatusText(selectedReport.estado) }}
                  </span>
                </div>
              </div>
              
              <div v-if="selectedReport.foto" class="detail-row">
                <div class="detail-label">Evidencia Fotográfica:</div>
                <div class="detail-value">
                  <img 
                    :src="selectedReport.foto" 
                    alt="Evidencia del reporte"
                    class="evidence-image"
                  />
                </div>
              </div>
            </div>
            
            <div class="modal-actions">
              <div class="status-actions">
                <h3>Cambiar Estado:</h3>
                <div class="status-buttons">
                  <button 
                    v-if="selectedReport.estado === 'pendiente'"
                    class="btn-status in-progress"
                    @click="updateStatus(selectedReport, 'en-progreso')"
                  >
                    <i class="fas fa-play-circle"></i>
                    Iniciar Proceso
                  </button>
                  
                  <button 
                    v-if="selectedReport.estado === 'en-progreso'"
                    class="btn-status resolved"
                    @click="updateStatus(selectedReport, 'resuelto')"
                  >
                    <i class="fas fa-check-circle"></i>
                    Marcar como Resuelto
                  </button>
                  
                  <button 
                    v-if="selectedReport.estado !== 'rechazado'"
                    class="btn-status rejected"
                    @click="updateStatus(selectedReport, 'rechazado')"
                  >
                    <i class="fas fa-times-circle"></i>
                    Rechazar Reporte
                  </button>
                  
                  <button 
                    v-if="selectedReport.estado === 'resuelto' || selectedReport.estado === 'rechazado'"
                    class="btn-status pending"
                    @click="updateStatus(selectedReport, 'pendiente')"
                  >
                    <i class="fas fa-redo"></i>
                    Reabrir Reporte
                  </button>
                </div>
              </div>
            </div>
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
import { useAppStore } from '@/stores/app';
import { formatDate, truncateText } from '@/utils';
import type { EnvironmentalReport } from '@/types';

const router = useRouter();
const authStore = useAuthStore();
const appStore = useAppStore();

const loading = ref(true);
const selectedReport = ref<EnvironmentalReport | null>(null);

const stats = ref({
  totalReports: 0,
  pendingReports: 0,
  inProgressReports: 0,
  resolvedReports: 0
});

const filters = ref({
  search: '',
  estado: '',
  categoria: '',
  urgencia: ''
});

// Obtener reportes del store
const reports = computed(() => {
  return appStore.reports || [];
});

// Reportes filtrados
const filteredReports = computed(() => {
  let filtered = reports.value;

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    filtered = filtered.filter(r => 
      r.titulo.toLowerCase().includes(search) ||
      r.descripcion.toLowerCase().includes(search)
    );
  }

  if (filters.value.estado) {
    filtered = filtered.filter(r => r.estado === filters.value.estado);
  }

  if (filters.value.categoria) {
    filtered = filtered.filter(r => r.categoria === filters.value.categoria);
  }

  if (filters.value.urgencia) {
    filtered = filtered.filter(r => r.urgencia === filters.value.urgencia);
  }

  // Ordenar por fecha (más recientes primero)
  return filtered.sort((a, b) => 
    new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
});

const hasActiveFilters = computed(() => {
  return filters.value.search || filters.value.estado || 
         filters.value.categoria || filters.value.urgencia;
});

const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'pendiente': 'Pendiente',
    'en-progreso': 'En Progreso',
    'resuelto': 'Resuelto',
    'rechazado': 'Rechazado'
  };
  return statusMap[status] || status;
};

const applyFilters = () => {
  // Los filtros se aplican automáticamente mediante computed
};

const loadReports = () => {
  try {
    loading.value = true;
    
    // Los reportes ya están en el store desde ReportDamage.vue
    // Si necesitas cargar de API, aquí iría esa lógica
    
    // Calcular estadísticas
    const reportsData = reports.value;
    stats.value = {
      totalReports: reportsData.length,
      pendingReports: reportsData.filter(r => r.estado === 'pendiente').length,
      inProgressReports: reportsData.filter(r => r.estado === 'en-progreso').length,
      resolvedReports: reportsData.filter(r => r.estado === 'resuelto' || r.estado === 'rechazado').length
    };
  } catch (error) {
    console.error('Error loading reports:', error);
  } finally {
    loading.value = false;
  }
};

const viewReport = (report: EnvironmentalReport) => {
  selectedReport.value = { ...report };
};

const closeModal = () => {
  selectedReport.value = null;
};

const updateStatus = (report: EnvironmentalReport, newStatus: string) => {
  if (confirm(`¿Estás seguro de cambiar el estado a "${getStatusText(newStatus)}"?`)) {
    // Actualizar en el store
    appStore.updateReportStatus(report.id, newStatus);
    
    if (selectedReport.value && selectedReport.value.id === report.id) {
      selectedReport.value.estado = newStatus;
    }
    
    // Recargar estadísticas
    loadReports();
  }
};

const deleteReport = (report: EnvironmentalReport) => {
  if (confirm('¿Estás seguro de eliminar este reporte? Esta acción no se puede deshacer.')) {
    // Eliminar del store
    appStore.deleteReport(report.id);
    
    if (selectedReport.value && selectedReport.value.id === report.id) {
      closeModal();
    }
    
    // Recargar estadísticas
    loadReports();
  }
};

const exportReports = () => {
  // Lógica para exportar reportes a CSV o PDF
  alert('Función de exportación en desarrollo...');
};

onMounted(() => {
  if (!authStore.isAdmin()) {
    router.push('/');
    return;
  }
  loadReports();
});
</script>

<style scoped lang="scss">
.admin-reports {
  padding: 2rem 0;
  background: #f8f9fa;
  min-height: 100vh;
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

  .header-actions {
    display: flex;
    gap: 1rem;
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

.btn-primary {
  background: #1b5e20;
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
    background: #144017;
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
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1.5rem;

  .stat-icon {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;

    &.total {
      background: #e3f2fd;
      color: #1976d2;
    }

    &.pending {
      background: #fff3e0;
      color: #ff9800;
    }

    &.in-progress {
      background: #e8f5e8;
      color: #4caf50;
    }

    &.resolved {
      background: #f3e5f5;
      color: #7b1fa2;
    }
  }

  .stat-content {
    .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      color: #333;
      line-height: 1;
    }

    .stat-label {
      color: #666;
      font-size: 1rem;
      margin-top: 0.5rem;
    }
  }
}

.filters-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.filters-row {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 1rem;
  align-items: end;
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

.reports-table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.reports-table {
  width: 100%;
  border-collapse: collapse;

  th {
    background: #f8f9fa;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #333;
    border-bottom: 2px solid #e0e0e0;
  }

  td {
    padding: 1rem;
    border-bottom: 1px solid #e0e0e0;
  }

  tr:hover {
    background: #f8f9fa;
  }

  .report-id {
    font-family: monospace;
    color: #666;
    font-weight: 600;
  }

  .report-title {
    .title-wrapper {
      strong {
        display: block;
        color: #333;
        margin-bottom: 0.25rem;
      }
      
      .report-excerpt {
        color: #666;
        font-size: 0.9rem;
        line-height: 1.4;
      }
    }
  }

  .category-badge {
    background: #e3f2fd;
    color: #1976d2;
    padding: 0.3rem 0.8rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .urgency-badge {
    padding: 0.3rem 0.8rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
    
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

  .location-cell {
    font-size: 0.9rem;
    color: #666;
    
    i {
      color: #1b5e20;
      margin-right: 0.5rem;
    }
  }

  .status-badge {
    padding: 0.4rem 0.8rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
    
    &.pendiente {
      background: #fff3e0;
      color: #ff9800;
    }
    
    &.en-progreso {
      background: #e3f2fd;
      color: #1976d2;
    }
    
    &.resuelto {
      background: #e8f5e8;
      color: #4caf50;
    }
    
    &.rechazado {
      background: #ffebee;
      color: #f44336;
    }
  }

  .actions-cell {
    display: flex;
    gap: 0.5rem;
    
    .btn-action {
      width: 32px;
      height: 32px;
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
      
      &.approve, &.resolve {
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
      
      &.delete {
        background: #f5f5f5;
        color: #666;
        
        &:hover {
          background: #666;
          color: white;
        }
      }
    }
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

  p {
    margin-bottom: 2rem;
  }
}

/* Modal Styles */
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
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  
  h2 {
    color: #1b5e20;
    margin: 0;
    font-size: 1.5rem;
  }
  
  .modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #666;
    cursor: pointer;
    padding: 0.5rem;
    
    &:hover {
      color: #333;
    }
  }
}

.modal-body {
  padding: 1.5rem;
}

.report-details {
  .detail-row {
    display: grid;
    grid-template-columns: 150px 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
    align-items: start;
    
    .detail-label {
      font-weight: 600;
      color: #333;
    }
    
    .detail-value {
      color: #666;
      line-height: 1.5;
    }
    
    .evidence-image {
      max-width: 300px;
      max-height: 200px;
      border-radius: 8px;
      margin-top: 0.5rem;
    }
  }
}

.modal-actions {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
  
  .status-actions {
    h3 {
      margin-bottom: 1rem;
      color: #333;
    }
    
    .status-buttons {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .btn-status {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      
      &.in-progress {
        background: #e3f2fd;
        color: #1976d2;
        
        &:hover {
          background: #1976d2;
          color: white;
        }
      }
      
      &.resolved {
        background: #e8f5e8;
        color: #4caf50;
        
        &:hover {
          background: #4caf50;
          color: white;
        }
      }
      
      &.rejected {
        background: #ffebee;
        color: #f44336;
        
        &:hover {
          background: #f44336;
          color: white;
        }
      }
      
      &.pending {
        background: #fff3e0;
        color: #ff9800;
        
        &:hover {
          background: #ff9800;
          color: white;
        }
      }
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
  .filters-row {
    grid-template-columns: 1fr;
  }
  
  .reports-table {
    display: block;
    overflow-x: auto;
  }
  
  .detail-row {
    grid-template-columns: 1fr !important;
    gap: 0.5rem !important;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .header-actions {
    width: 100%;
    flex-direction: column;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .status-buttons {
    flex-direction: column;
  }
  
  .btn-status {
    width: 100%;
  }
}
</style>