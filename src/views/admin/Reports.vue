<template>
  <div class="admin-reports">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Gestión de Reportes Ambientales</h1>
          <p>Administra todos los reportes recibidos de daños ambientales</p>
        </div>
        <div class="header-actions">
          <button class="btn-back" @click="$router.push('/admin')">
            <i class="fas fa-arrow-left"></i>
            Volver al Dashboard
          </button>
        </div>
      </div>

      <!-- Filtros y Estadísticas -->
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
              <option value="en_proceso">En Proceso</option>
              <option value="resuelto">Resuelto</option>
              <option value="rechazado">Rechazado</option>
            </select>
          </div>

          <div class="filter-group">
            <select v-model="filters.categoria" @change="applyFilters">
              <option value="">Todas las categorías</option>
              <option value="contaminacion">Contaminación</option>
              <option value="deforestacion">Deforestación</option>
              <option value="fauna">Fauna</option>
              <option value="flora">Flora</option>
              <option value="otros">Otros</option>
            </select>
          </div>
        </div>

        <div class="stats-row">
          <div class="stat-badge" @click="setFilter('estado', 'pendiente')">
            <span class="stat-count">{{ stats.pendientes }}</span>
            <span class="stat-label">Pendientes</span>
          </div>
          <div class="stat-badge" @click="setFilter('estado', 'en_proceso')">
            <span class="stat-count">{{ stats.en_proceso }}</span>
            <span class="stat-label">En Proceso</span>
          </div>
          <div class="stat-badge" @click="setFilter('estado', 'resuelto')">
            <span class="stat-count">{{ stats.resueltos }}</span>
            <span class="stat-label">Resueltos</span>
          </div>
          <div class="stat-badge" @click="setFilter('estado', 'rechazado')">
            <span class="stat-count">{{ stats.rechazados }}</span>
            <span class="stat-label">Rechazados</span>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando reportes...</p>
      </div>

      <!-- Tabla de Reportes -->
      <div v-else class="reports-table">
        <div class="table-header">
          <div class="table-col col-small">ID</div>
          <div class="table-col">Título</div>
          <div class="table-col col-medium">Categoría</div>
          <div class="table-col col-medium">Estado</div>
          <div class="table-col col-medium">Fecha</div>
          <div class="table-col col-small">Acciones</div>
        </div>

        <div class="table-body">
          <div 
            v-for="report in filteredReports" 
            :key="report.id"
            class="table-row"
            @click="viewReportDetails(report)"
          >
            <div class="table-col col-small">
              <span class="report-id">#{{ report.id }}</span>
            </div>
            <div class="table-col">
              <div class="report-title">{{ report.titulo }}</div>
              <div class="report-excerpt">{{ truncateText(report.descripcion, 60) }}</div>
            </div>
            <div class="table-col col-medium">
              <span :class="['category-tag', `category-${report.categoria}`]">
                {{ getCategoryText(report.categoria) }}
              </span>
            </div>
            <div class="table-col col-medium">
              <span :class="['status-tag', `status-${report.estado}`]">
                {{ getStatusText(report.estado) }}
              </span>
            </div>
            <div class="table-col col-medium">
              <span class="date-text">{{ formatDate(report.fecha) }}</span>
            </div>
            <div class="table-col col-small" @click.stop>
              <div class="action-buttons">
                <button 
                  class="btn-action view" 
                  @click="viewReportDetails(report)"
                  title="Ver detalles"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button 
                  class="btn-action edit" 
                  @click="editReport(report)"
                  title="Editar reporte"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  class="btn-action delete" 
                  @click="deleteReport(report)"
                  title="Eliminar reporte"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredReports.length === 0" class="empty-state">
        <i class="fas fa-inbox"></i>
        <h3>No se encontraron reportes</h3>
        <p v-if="hasActiveFilters">Intenta ajustar los filtros de búsqueda</p>
        <p v-else>No hay reportes registrados</p>
      </div>

      <!-- Paginación -->
      <div v-if="filteredReports.length > 0" class="pagination">
        <button 
          class="pagination-btn" 
          :disabled="currentPage === 1"
          @click="prevPage"
        >
          <i class="fas fa-chevron-left"></i> Anterior
        </button>
        
        <span class="page-info">
          Página {{ currentPage }} de {{ totalPages }}
        </span>
        
        <button 
          class="pagination-btn" 
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          Siguiente <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Modal de Detalles -->
    <ReportDetailsModal 
      v-if="selectedReport"
      :report="selectedReport"
      @close="selectedReport = null"
      @status-change="handleStatusChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { formatDate, truncateText } from '@/utils';
import ReportDetailsModal from '@/components/admin/ReportDetailsModal.vue';
import type { EnvironmentalReport } from '@/types';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(true);
const currentPage = ref(1);
const pageSize = 10;
const selectedReport = ref<EnvironmentalReport | null>(null);

const reports = ref<EnvironmentalReport[]>([]);

const filters = ref({
  search: '',
  estado: '',
  categoria: ''
});

const stats = ref({
  pendientes: 0,
  en_proceso: 0,
  resueltos: 0,
  rechazados: 0
});

// Filtrado y paginación
const filteredReports = computed(() => {
  let filtered = reports.value;

  // Aplicar filtros
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    filtered = filtered.filter(r => 
      r.titulo.toLowerCase().includes(search) ||
      r.descripcion.toLowerCase().includes(search) ||
      r.id.toLowerCase().includes(search)
    );
  }

  if (filters.value.estado) {
    filtered = filtered.filter(r => r.estado === filters.value.estado);
  }

  if (filters.value.categoria) {
    filtered = filtered.filter(r => r.categoria === filters.value.categoria);
  }

  // Paginación
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return filtered.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(reports.value.length / pageSize);
});

const hasActiveFilters = computed(() => {
  return filters.value.search || filters.value.estado || filters.value.categoria;
});

// Funciones auxiliares
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

const applyFilters = () => {
  currentPage.value = 1; // Resetear a primera página al filtrar
};

const setFilter = (type: 'estado' | 'categoria', value: string) => {
  filters.value[type] = filters.value[type] === value ? '' : value;
  applyFilters();
};

const loadReports = async () => {
  try {
    loading.value = true;
    
    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    reports.value = [
      {
        id: 'REP-001',
        titulo: 'Deforestación ilegal en Los Haitises',
        descripcion: 'Se observa tala indiscriminada de árboles en zona protegida',
        foto: '',
        latitud: 19.0333,
        longitud: -69.5833,
        fecha: new Date().toISOString(),
        estado: 'pendiente',
        categoria: 'deforestacion',
        urgencia: 'alta'
      },
      {
        id: 'REP-002',
        titulo: 'Contaminación del río Yaque del Norte',
        descripcion: 'Vertido de químicos industriales en el río',
        foto: '',
        latitud: 19.4833,
        longitud: -70.7000,
        fecha: new Date(Date.now() - 86400000).toISOString(),
        estado: 'en_proceso',
        categoria: 'contaminacion',
        urgencia: 'media'
      },
      {
        id: 'REP-003',
        titulo: 'Fauna herida en Parque del Este',
        descripcion: 'Manatí encontrado con heridas cerca de la costa',
        foto: '',
        latitud: 18.3500,
        longitud: -68.8333,
        fecha: new Date(Date.now() - 172800000).toISOString(),
        estado: 'resuelto',
        categoria: 'fauna',
        urgencia: 'alta'
      }
    ];

    // Calcular estadísticas
    stats.value = {
      pendientes: reports.value.filter(r => r.estado === 'pendiente').length,
      en_proceso: reports.value.filter(r => r.estado === 'en_proceso').length,
      resueltos: reports.value.filter(r => r.estado === 'resuelto').length,
      rechazados: reports.value.filter(r => r.estado === 'rechazado').length
    };

  } catch (error) {
    console.error('Error loading reports:', error);
  } finally {
    loading.value = false;
  }
};

const viewReportDetails = (report: EnvironmentalReport) => {
  selectedReport.value = report;
};

const editReport = (report: EnvironmentalReport) => {
  // Implementar edición de reporte
  console.log('Edit report:', report);
  alert(`Editar reporte: ${report.titulo}`);
};

const deleteReport = (report: EnvironmentalReport) => {
  if (confirm(`¿Estás seguro de eliminar el reporte "${report.titulo}"?`)) {
    reports.value = reports.value.filter(r => r.id !== report.id);
  }
};

const handleStatusChange = (reportId: string, newStatus: string) => {
  const report = reports.value.find(r => r.id === reportId);
  if (report) {
    report.estado = newStatus;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
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

.filters-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.filters-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  margin-bottom: 1.5rem;
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

.stats-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.stat-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;

  &:hover {
    background: #e8f5e8;
    transform: translateY(-2px);
  }

  .stat-count {
    font-size: 2rem;
    font-weight: 700;
    color: #1b5e20;
  }

  .stat-label {
    color: #666;
    font-size: 0.9rem;
    margin-top: 0.5rem;
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

.reports-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.table-header {
  display: grid;
  grid-template-columns: 100px 1fr 150px 150px 150px 120px;
  background: #1b5e20;
  color: white;
  font-weight: 600;
  padding: 1rem 1.5rem;
}

.table-body {
  .table-row {
    display: grid;
    grid-template-columns: 100px 1fr 150px 150px 150px 120px;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e0e0e0;
    cursor: pointer;
    transition: background 0.3s ease;

    &:hover {
      background: #f8f9fa;
    }

    &:last-child {
      border-bottom: none;
    }
  }
}

.table-col {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
}

.col-small {
  min-width: 100px;
}

.col-medium {
  min-width: 150px;
}

.report-id {
  background: #f8f9fa;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9rem;
  color: #333;
}

.report-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.report-excerpt {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

.category-tag, .status-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
}

.category-tag {
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

.status-tag {
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

.date-text {
  color: #666;
  font-size: 0.9rem;
}

.action-buttons {
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

    &.edit {
      background: #fff3e0;
      color: #f57c00;

      &:hover {
        background: #f57c00;
        color: white;
      }
    }

    &.delete {
      background: #ffebee;
      color: #f44336;

      &:hover {
        background: #f44336;
        color: white;
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
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;

  .pagination-btn {
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

    &:hover:not(:disabled) {
      background: #144017;
    }

    &:disabled {
      background: #cccccc;
      cursor: not-allowed;
    }
  }

  .page-info {
    color: #666;
    font-weight: 600;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
  .table-header,
  .table-row {
    grid-template-columns: 80px 1fr 120px 120px 120px 100px;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
  }

  .filters-row {
    grid-template-columns: 1fr;
  }

  .table-header {
    display: none;
  }

  .table-row {
    grid-template-columns: 1fr !important;
    padding: 1.5rem;
    margin-bottom: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
  }

  .table-col {
    margin-bottom: 0.75rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }

  .action-buttons {
    justify-content: flex-end;
    margin-top: 1rem;
  }

  .pagination {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>