<template>
  <div class="admin-login" v-if="!isAuthenticated">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>Panel de Administración</h1>
          <p>Acceso restringido para administradores</p>
        </div>
        <form @submit.prevent="handleAdminLogin" class="login-form">
          <div class="form-group">
            <label for="adminUser">Usuario</label>
            <input 
              id="adminUser" 
              v-model="adminForm.username" 
              type="text" 
              required 
              placeholder="Usuario administrador" 
            />
          </div>
          <div class="form-group">
            <label for="adminPassword">Contraseña</label>
            <input 
              id="adminPassword" 
              v-model="adminForm.password" 
              type="password" 
              required 
              placeholder="Contraseña de administrador" 
            />
          </div>
          <button type="submit" :disabled="loading" class="login-btn">
            <span v-if="loading">
              <i class="fas fa-spinner fa-spin"></i> Verificando...
            </span>
            <span v-else>
              <i class="fas fa-lock"></i> Acceder al Panel
            </span>
          </button>
          <div class="demo-credentials">
            <h4>Credenciales de Demo:</h4>
            <p><strong>Usuario:</strong> admin</p>
            <p><strong>Contraseña:</strong> EcoVigia2024!</p>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="admin-panel" v-else>
    <!-- Header -->
    <div class="admin-header">
      <div class="container">
        <h1>Panel de Administración</h1>
        <div class="header-actions">
          <span class="welcome">Bienvenido, {{ authStore.user?.nombre || 'Administrador' }}</span>
          <button @click="logout" class="logout-btn">
            <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
          </button>
        </div>
      </div>
    </div>

    <!-- Navegación -->
    <div class="admin-nav">
      <div class="container">
        <nav class="nav-tabs">
          <button :class="['tab', { active: activeTab === 'volunteers' }]" @click="activeTab = 'volunteers'">
            <i class="fas fa-users"></i> Gestión de Voluntarios
            <span class="tab-badge" v-if="pendingVolunteers.length > 0">
              {{ pendingVolunteers.length }}
            </span>
          </button>
          <button :class="['tab', { active: activeTab === 'reports' }]" @click="activeTab = 'reports'">
            <i class="fas fa-exclamation-triangle"></i> Reportes Ambientales
            <span class="tab-badge" v-if="pendingReports.length > 0">
              {{ pendingReports.length }}
            </span>
          </button>
          <button :class="['tab', { active: activeTab === 'stats' }]" @click="activeTab = 'stats'">
            <i class="fas fa-chart-bar"></i> Estadísticas
          </button>
        </nav>
      </div>
    </div>

    <!-- Contenido -->
    <div class="admin-content">
      <div class="container">
        <!-- Estadísticas Rápidas -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon total-volunteers">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-info">
              <h3>{{ allVolunteers.length }}</h3>
              <p>Total Voluntarios</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon pending-volunteers">
              <i class="fas fa-user-clock"></i>
            </div>
            <div class="stat-info">
              <h3>{{ pendingVolunteers.length }}</h3>
              <p>Voluntarios Pendientes</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon total-reports">
              <i class="fas fa-flag"></i>
            </div>
            <div class="stat-info">
              <h3>{{ allReports.length }}</h3>
              <p>Total Reportes</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon pending-reports">
              <i class="fas fa-exclamation-circle"></i>
            </div>
            <div class="stat-info">
              <h3>{{ pendingReports.length }}</h3>
              <p>Reportes Pendientes</p>
            </div>
          </div>
        </div>

        <!-- Pestaña de Voluntarios -->
        <div v-if="activeTab === 'volunteers'" class="tab-content">
          <div class="section-header">
            <h2>Gestión de Voluntarios</h2>
            <p>Administra las solicitudes de voluntariado y aprueba nuevos miembros</p>
          </div>

          <!-- Filtros -->
          <div class="filters">
            <select v-model="volunteerFilter" class="filter-select">
              <option value="all">Todos los voluntarios</option>
              <option value="pending">Solo pendientes</option>
              <option value="approved">Solo aprobados</option>
            </select>
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input v-model="volunteerSearch" type="text" placeholder="Buscar voluntarios..." />
            </div>
          </div>

          <!-- Tabla de voluntarios -->
          <div class="table-container">
            <div class="table-header">
              <div class="col-name">Nombre</div>
              <div class="col-email">Email</div>
              <div class="col-cedula">Cédula</div>
              <div class="col-phone">Teléfono</div>
              <div class="col-date">Fecha</div>
              <div class="col-status">Estado</div>
              <div class="col-actions">Acciones</div>
            </div>
            <div class="table-body">
              <div v-for="volunteer in filteredVolunteers" :key="volunteer.id" class="table-row">
                <div class="col-name">{{ volunteer.nombre }}</div>
                <div class="col-email">{{ volunteer.email }}</div>
                <div class="col-cedula">{{ volunteer.cedula }}</div>
                <div class="col-phone">{{ volunteer.telefono }}</div>
                <div class="col-date">{{ formatDate(volunteer.fecha) }}</div>
                <div class="col-status">
                  <span :class="['status-badge', volunteer.status]">
                    {{ volunteer.status === 'approved' ? 'Aprobado' : 'Pendiente' }}
                  </span>
                </div>
                <div class="col-actions">
                  <button v-if="volunteer.status === 'pending'" @click="approveVolunteer(volunteer.id)" class="btn-approve" title="Aprobar voluntario">
                    <i class="fas fa-check"></i> Aprobar
                  </button>
                  <button @click="viewVolunteerDetails(volunteer)" class="btn-view" title="Ver detalles">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button @click="deleteVolunteer(volunteer.id)" class="btn-delete" title="Eliminar voluntario">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              <div v-if="filteredVolunteers.length === 0" class="empty-state">
                <i class="fas fa-users-slash"></i>
                <p>No se encontraron voluntarios</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Pestaña de Reportes -->
        <div v-if="activeTab === 'reports'" class="tab-content">
          <div class="section-header">
            <h2>Reportes Ambientales</h2>
            <p>Revisa y gestiona los reportes de daños ambientales</p>
          </div>

          <!-- Filtros de Reportes -->
          <div class="filters">
            <select v-model="reportFilter" class="filter-select">
              <option value="all">Todos los reportes</option>
              <option value="pendiente">Pendientes</option>
              <option value="en_proceso">En proceso</option>
              <option value="resuelto">Resueltos</option>
              <option value="rechazado">Rechazados</option>
            </select>
            <select v-model="reportUrgency" class="filter-select">
              <option value="all">Todas las urgencias</option>
              <option value="alta">Alta urgencia</option>
              <option value="media">Media urgencia</option>
              <option value="baja">Baja urgencia</option>
            </select>
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input v-model="reportSearch" type="text" placeholder="Buscar reportes..." />
            </div>
          </div>

          <!-- Lista de Reportes -->
          <div class="reports-list">
            <div v-for="report in filteredReports" :key="report.id" class="report-card">
              <div class="report-header">
                <div class="report-title-section">
                  <h3>{{ report.titulo }}</h3>
                  <div class="report-meta">
                    <span class="report-category">{{ getCategoryText(report.categoria) }}</span>
                    <span class="report-urgency" :class="report.urgencia">
                      {{ getUrgencyText(report.urgencia) }}
                    </span>
                  </div>
                </div>
                <div class="report-status-section">
                  <span class="report-date">{{ formatDate(report.fecha) }}</span>
                  <span :class="['status-badge', report.estado]">
                    {{ getStatusText(report.estado) }}
                  </span>
                </div>
              </div>
              <div class="report-content">
                <p class="report-description">{{ report.descripcion }}</p>
                <div class="report-image" v-if="report.foto">
                  <img :src="report.foto" :alt="report.titulo" @click="viewReportImage(report.foto)" />
                </div>
                <div class="report-location" v-if="report.latitud && report.longitud">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>Ubicación: {{ report.latitud.toFixed(4) }}, {{ report.longitud.toFixed(4) }}</span>
                </div>
              </div>
              <div class="report-actions">
                <div class="status-controls">
                  <label>Cambiar Estado:</label>
                  <div class="status-buttons">
                    <button :class="['status-btn', { active: report.estado === 'pendiente' }]" @click="updateReportStatus(report, 'pendiente')">
                      <i class="fas fa-clock"></i> Pendiente
                    </button>
                    <button :class="['status-btn', { active: report.estado === 'en_proceso' }]" @click="updateReportStatus(report, 'en_proceso')">
                      <i class="fas fa-play-circle"></i> En Curso
                    </button>
                    <button :class="['status-btn', { active: report.estado === 'resuelto' }]" @click="updateReportStatus(report, 'resuelto')">
                      <i class="fas fa-check-circle"></i> Completado
                    </button>
                    <button :class="['status-btn', { active: report.estado === 'rechazado' }]" @click="updateReportStatus(report, 'rechazado')">
                      <i class="fas fa-times-circle"></i> Rechazado
                    </button>
                  </div>
                </div>
                <div class="action-buttons">
                  <button @click="openCommentModal(report)" class="btn-comment" :class="{ active: report.comentario }">
                    <i class="fas fa-comment"></i> {{ report.comentario ? 'Editar Comentario' : 'Agregar Comentario' }}
                  </button>
                  <button @click="openReportDetailsModal(report)" class="btn-view">
                    <i class="fas fa-expand"></i> Ver Detalles
                  </button>
                </div>
              </div>
              <div class="report-comment" v-if="report.comentario">
                <strong>Comentario del Ministerio:</strong>
                <p>{{ report.comentario }}</p>
              </div>
            </div>
            <div v-if="filteredReports.length === 0" class="empty-state">
              <i class="fas fa-flag"></i>
              <p>No se encontraron reportes</p>
            </div>
          </div>
        </div>

        <!-- Pestaña de Estadísticas -->
        <div v-if="activeTab === 'stats'" class="tab-content">
          <div class="section-header">
            <h2>Estadísticas del Sistema</h2>
            <p>Resumen general de la actividad en la plataforma</p>
          </div>

          <!-- Estadísticas Principales -->
          <div class="stats-cards-large">
            <div class="stat-card-large">
              <h3><i class="fas fa-users"></i> Estadísticas de Voluntarios</h3>
              <div class="stats-content">
                <div class="stat-item">
                  <span class="stat-label">Total Registrados</span>
                  <span class="stat-value">{{ allVolunteers.length }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Aprobados</span>
                  <span class="stat-value approved">{{ approvedVolunteers.length }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Pendientes</span>
                  <span class="stat-value pending">{{ pendingVolunteers.length }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Tasa de Aprobación</span>
                  <span class="stat-value">
                    {{ allVolunteers.length > 0 ? Math.round((approvedVolunteers.length / allVolunteers.length) * 100) : 0 }}%
                  </span>
                </div>
              </div>
            </div>
            <div class="stat-card-large">
              <h3><i class="fas fa-flag"></i> Estadísticas de Reportes</h3>
              <div class="stats-content">
                <div class="stat-item">
                  <span class="stat-label">Total Reportes</span>
                  <span class="stat-value">{{ allReports.length }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Pendientes</span>
                  <span class="stat-value pending">{{ pendingReports.length }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">En Proceso</span>
                  <span class="stat-value in-progress">{{ inProgressReports.length }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Resueltos</span>
                  <span class="stat-value resolved">{{ resolvedReports.length }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Tasa de Resolución</span>
                  <span class="stat-value">
                    {{ allReports.length > 0 ? Math.round((resolvedReports.length / allReports.length) * 100) : 0 }}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Distribución por Categorías -->
          <div class="category-stats">
            <h3><i class="fas fa-chart-pie"></i> Reportes por Categoría</h3>
            <div class="categories-grid">
              <div v-for="category in reportCategories" :key="category.value" class="category-item">
                <div class="category-info">
                  <span class="category-name">{{ category.label }}</span>
                  <span class="category-count">{{ category.count }}</span>
                </div>
                <div class="category-bar">
                  <div class="category-progress" :style="{ width: `${(category.count / allReports.length) * 100 || 0}%` }"></div>
                </div>
                <span class="category-percent">
                  {{ allReports.length > 0 ? Math.round((category.count / allReports.length) * 100) : 0 }}%
                </span>
              </div>
            </div>
          </div>

          <!-- Distribución por Urgencia -->
          <div class="urgency-stats">
            <h3><i class="fas fa-exclamation-triangle"></i> Reportes por Urgencia</h3>
            <div class="urgency-grid">
              <div class="urgency-item alta">
                <i class="fas fa-fire"></i>
                <div class="urgency-info">
                  <span class="urgency-label">Alta Urgencia</span>
                  <span class="urgency-count">{{ urgencyCounts.alta }}</span>
                </div>
                <span class="urgency-percent">
                  {{ allReports.length > 0 ? Math.round((urgencyCounts.alta / allReports.length) * 100) : 0 }}%
                </span>
              </div>
              <div class="urgency-item media">
                <i class="fas fa-exclamation-circle"></i>
                <div class="urgency-info">
                  <span class="urgency-label">Media Urgencia</span>
                  <span class="urgency-count">{{ urgencyCounts.media }}</span>
                </div>
                <span class="urgency-percent">
                  {{ allReports.length > 0 ? Math.round((urgencyCounts.media / allReports.length) * 100) : 0 }}%
                </span>
              </div>
              <div class="urgency-item baja">
                <i class="fas fa-info-circle"></i>
                <div class="urgency-info">
                  <span class="urgency-label">Baja Urgencia</span>
                  <span class="urgency-count">{{ urgencyCounts.baja }}</span>
                </div>
                <span class="urgency-percent">
                  {{ allReports.length > 0 ? Math.round((urgencyCounts.baja / allReports.length) * 100) : 0 }}%
                </span>
              </div>
            </div>
          </div>

          <!-- Actividad Reciente -->
          <div class="recent-activity">
            <h3><i class="fas fa-history"></i> Actividad Reciente</h3>
            <div class="activity-list">
              <div v-for="activity in recentActivity" :key="activity.id" class="activity-item">
                <div class="activity-icon" :class="activity.type">
                  <i :class="activity.icon"></i>
                </div>
                <div class="activity-content">
                  <p>{{ activity.message }}</p>
                  <span class="activity-time">{{ activity.time }}</span>
                </div>
              </div>
              <div v-if="recentActivity.length === 0" class="empty-activity">
                <p>No hay actividad reciente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para comentarios -->
    <div v-if="showCommentModal" class="modal-overlay" @click="closeCommentModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Comentario del Ministerio</h3>
          <button @click="closeCommentModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <textarea v-model="commentText" placeholder="Escribe aquí el comentario o actualización sobre este reporte..." rows="4"></textarea>
        </div>
        <div class="modal-actions">
          <button @click="closeCommentModal" class="btn-cancel">Cancelar</button>
          <button @click="saveComment" class="btn-save">Guardar Comentario</button>
        </div>
      </div>
    </div>

    <!-- Modal para detalles de reportes -->
    <div v-if="showReportDetailsModal" class="modal-overlay" @click="closeReportDetailsModal">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h3>Detalles del Reporte</h3>
          <button @click="closeReportDetailsModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="report-details" v-if="selectedReport">
            <div class="detail-section">
              <h4>Información General</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>Título:</label>
                  <span>{{ selectedReport.titulo }}</span>
                </div>
                <div class="detail-item">
                  <label>Descripción:</label>
                  <span>{{ selectedReport.descripcion }}</span>
                </div>
                <div class="detail-item">
                  <label>Categoría:</label>
                  <span class="category-badge">{{ getCategoryText(selectedReport.categoria) }}</span>
                </div>
                <div class="detail-item">
                  <label>Urgencia:</label>
                  <span :class="['urgency-badge', selectedReport.urgencia]">
                    {{ getUrgencyText(selectedReport.urgencia) }}
                  </span>
                </div>
                <div class="detail-item">
                  <label>Estado:</label>
                  <span :class="['status-badge', selectedReport.estado]">
                    {{ getStatusText(selectedReport.estado) }}
                  </span>
                </div>
                <div class="detail-item">
                  <label>Fecha de Reporte:</label>
                  <span>{{ formatDate(selectedReport.fecha) }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section" v-if="selectedReport.latitud && selectedReport.longitud">
              <h4>Ubicación</h4>
              <div class="location-info">
                <i class="fas fa-map-marker-alt"></i>
                <span>Coordenadas: {{ selectedReport.latitud.toFixed(6) }}, {{ selectedReport.longitud.toFixed(6) }}</span>
              </div>
            </div>

            <div class="detail-section" v-if="selectedReport.foto">
              <h4>Evidencia Fotográfica</h4>
              <div class="image-container">
                <img :src="selectedReport.foto" :alt="selectedReport.titulo" @click="viewReportImage(selectedReport.foto)" />
              </div>
            </div>

            <div class="detail-section" v-if="selectedReport.comentario">
              <h4>Comentario del Ministerio</h4>
              <div class="comment-box">
                <p>{{ selectedReport.comentario }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="closeReportDetailsModal" class="btn-cancel">Cerrar</button>
          <button @click="openCommentModal(selectedReport)" class="btn-save" v-if="selectedReport">
            <i class="fas fa-comment"></i> {{ selectedReport?.comentario ? 'Editar Comentario' : 'Agregar Comentario' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useAppStore } from '@/stores/app';
import { formatDate } from '@/utils';

const authStore = useAuthStore();
const appStore = useAppStore();

// Usa el estado de autenticación del store en lugar del local
const isAuthenticated = computed(() => authStore.isAuthenticated && authStore.isAdmin());
const loading = ref(false);
const activeTab = ref('volunteers');
const showCommentModal = ref(false);
const showReportDetailsModal = ref(false);

// Filtros para voluntarios
const volunteerFilter = ref('all');
const volunteerSearch = ref('');

// Filtros para reportes
const reportFilter = ref('all');
const reportUrgency = ref('all');
const reportSearch = ref('');

// Modal de comentarios
const selectedReport = ref<any>(null);
const commentText = ref('');

const adminForm = ref({
  username: '',
  password: ''
});

// Computed properties
const allVolunteers = computed(() => {
  try {
    return JSON.parse(localStorage.getItem('eco_vigia_volunteer_applications') || '[]');
  } catch {
    return [];
  }
});

const pendingVolunteers = computed(() => 
  allVolunteers.value.filter((v: any) => v.status === 'pending')
);

const approvedVolunteers = computed(() => 
  allVolunteers.value.filter((v: any) => v.status === 'approved')
);

const allReports = computed(() => appStore.reports);

const pendingReports = computed(() => 
  allReports.value.filter((r: any) => r.estado === 'pendiente')
);

const inProgressReports = computed(() => 
  allReports.value.filter((r: any) => r.estado === 'en_proceso')
);

const resolvedReports = computed(() => 
  allReports.value.filter((r: any) => r.estado === 'resuelto')
);

// Estadísticas de categorías
const reportCategories = computed(() => {
  const categories = [
    { value: 'contaminacion', label: 'Contaminación' },
    { value: 'deforestacion', label: 'Deforestación' },
    { value: 'fauna', label: 'Fauna en Peligro' },
    { value: 'flora', label: 'Flora Amenazada' },
    { value: 'agua', label: 'Contaminación del Agua' },
    { value: 'residuos', label: 'Manejo de Residuos' },
    { value: 'otros', label: 'Otros' }
  ];

  return categories.map(category => ({
    ...category,
    count: allReports.value.filter((r: any) => r.categoria === category.value).length
  })).filter(cat => cat.count > 0);
});

// Estadísticas de urgencia
const urgencyCounts = computed(() => ({
  alta: allReports.value.filter((r: any) => r.urgencia === 'alta').length,
  media: allReports.value.filter((r: any) => r.urgencia === 'media').length,
  baja: allReports.value.filter((r: any) => r.urgencia === 'baja').length
}));

// Actividad reciente
const recentActivity = computed(() => {
  const activities = [];

  // Actividad de voluntarios
  if (pendingVolunteers.value.length > 0) {
    activities.push({
      id: 'volunteers-pending',
      type: 'warning',
      icon: 'fas fa-user-clock',
      message: `${pendingVolunteers.value.length} solicitudes de voluntariado pendientes`,
      time: 'Reciente'
    });
  }

  // Actividad de reportes
  if (pendingReports.value.length > 0) {
    activities.push({
      id: 'reports-pending',
      type: 'danger',
      icon: 'fas fa-exclamation-triangle',
      message: `${pendingReports.value.length} reportes ambientales pendientes de revisión`,
      time: 'Reciente'
    });
  }

  // Últimos reportes resueltos
  const recentResolved = resolvedReports.value
    .slice(0, 3)
    .map((report: any) => ({
      id: `resolved-${report.id}`,
      type: 'success',
      icon: 'fas fa-check-circle',
      message: `Reporte "${report.titulo}" marcado como resuelto`,
      time: formatDate(report.fecha)
    }));

  activities.push(...recentResolved);
  return activities.slice(0, 5); // Mostrar solo las 5 más recientes
});

// Filtros
const filteredVolunteers = computed(() => {
  let filtered = allVolunteers.value;

  if (volunteerFilter.value !== 'all') {
    filtered = filtered.filter((v: any) => v.status === volunteerFilter.value);
  }

  if (volunteerSearch.value) {
    const query = volunteerSearch.value.toLowerCase();
    filtered = filtered.filter((v: any) =>
      v.nombre.toLowerCase().includes(query) ||
      v.email.toLowerCase().includes(query) ||
      v.cedula.includes(query)
    );
  }

  return filtered;
});

const filteredReports = computed(() => {
  let filtered = allReports.value;

  if (reportFilter.value !== 'all') {
    filtered = filtered.filter((r: any) => r.estado === reportFilter.value);
  }

  if (reportUrgency.value !== 'all') {
    filtered = filtered.filter((r: any) => r.urgencia === reportUrgency.value);
  }

  if (reportSearch.value) {
    const query = reportSearch.value.toLowerCase();
    filtered = filtered.filter((r: any) =>
      r.titulo.toLowerCase().includes(query) ||
      r.descripcion.toLowerCase().includes(query) ||
      r.categoria.toLowerCase().includes(query)
    );
  }

  return filtered;
});

// Método de login actualizado para usar el store
const handleAdminLogin = async () => {
  loading.value = true;
  
  try {
    const success = authStore.loginAdmin(
      adminForm.value.username, 
      adminForm.value.password
    );
    
    if (success) {
      adminForm.value = { username: '', password: '' };
    } else {
      alert('❌ Credenciales de administrador incorrectas');
    }
  } catch (error) {
    alert('❌ Error al iniciar sesión');
  } finally {
    loading.value = false;
  }
};

const logout = () => {
  authStore.logout();
  adminForm.value = { username: '', password: '' };
};

// Método para aprobar voluntarios
const approveVolunteer = (volunteerId: number) => {
  try {
    const volunteers = allVolunteers.value.map((volunteer: any) => {
      if (volunteer.id === volunteerId) {
        return { ...volunteer, status: 'approved' };
      }
      return volunteer;
    });
    
    localStorage.setItem('eco_vigia_volunteer_applications', JSON.stringify(volunteers));
    
    alert(`✅ Voluntario aprobado exitosamente`);
  } catch (error) {
    console.error('Error approving volunteer:', error);
    alert('❌ Error al aprobar voluntario');
  }
};

const deleteVolunteer = (id: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar este voluntario? Esta acción NO se puede deshacer y el usuario no podrá iniciar sesión.')) {
    try {
      const volunteers = allVolunteers.value.filter((v: any) => v.id !== id);
      localStorage.setItem('eco_vigia_volunteer_applications', JSON.stringify(volunteers));
      
      alert('✅ Voluntario eliminado exitosamente. El usuario no podrá iniciar sesión.');
    } catch (error) {
      alert('❌ Error al eliminar voluntario');
    }
  }
};

const viewVolunteerDetails = (volunteer: any) => {
  alert(`Detalles del voluntario:\n\nNombre: ${volunteer.nombre}\nEmail: ${volunteer.email}\nCédula: ${volunteer.cedula}\nTeléfono: ${volunteer.telefono}\nFecha: ${formatDate(volunteer.fecha)}\nEstado: ${volunteer.status === 'approved' ? 'Aprobado' : 'Pendiente'}`);
};

// Métodos para reportes
const getCategoryText = (category: string) => {
  const categories: any = {
    contaminacion: 'Contaminación',
    deforestacion: 'Deforestación',
    fauna: 'Fauna en Peligro',
    flora: 'Flora Amenazada',
    agua: 'Contaminación del Agua',
    residuos: 'Manejo de Residuos',
    otros: 'Otros'
  };
  return categories[category] || category;
};

const getUrgencyText = (urgency: string) => {
  const urgencies: any = {
    baja: 'Baja',
    media: 'Media',
    alta: 'Alta'
  };
  return urgencies[urgency] || urgency;
};

const getStatusText = (status: string) => {
  const statuses: any = {
    pendiente: 'Pendiente',
    en_proceso: 'En Curso',
    resuelto: 'Completado',
    rechazado: 'Rechazado'
  };
  return statuses[status] || status;
};

type ReportStatus = "pendiente" | "en_proceso" | "resuelto" | "rechazado";

const updateReportStatus = (report: any, newStatus: ReportStatus) => {
  appStore.updateReport(report.id, {
    estado: newStatus
  });
  alert(`✅ Reporte marcado como: ${getStatusText(newStatus)}`);
};

const openCommentModal = (report: any) => {
  selectedReport.value = report;
  commentText.value = report.comentario || '';
  showCommentModal.value = true;
  showReportDetailsModal.value = false;
};

const closeCommentModal = () => {
  showCommentModal.value = false;
  selectedReport.value = null;
  commentText.value = '';
};

const saveComment = () => {
  if (selectedReport.value) {
    appStore.updateReport(selectedReport.value.id, {
      comentario: commentText.value
    });
    alert('✅ Comentario guardado exitosamente');
    closeCommentModal();
  }
};

const openReportDetailsModal = (report: any) => {
  selectedReport.value = report;
  showReportDetailsModal.value = true;
};

const closeReportDetailsModal = () => {
  showReportDetailsModal.value = false;
  selectedReport.value = null;
};

const viewReportImage = (imageUrl: string) => {
  window.open(imageUrl, '_blank');
};

</script>



<style scoped lang="scss">
/* Estilos del login */
.admin-login {
  min-height: 100vh;
  background: linear-gradient(135deg, #1b5e20 0%, #4caf50 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  max-width: 400px;
  width: 100%;
}

.login-card {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    color: #1b5e20;
    margin-bottom: 0.5rem;
    font-size: 2rem;
  }
  
  p {
    color: #666;
  }
}

.login-form {
  .form-group {
    margin-bottom: 1.5rem;
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: 500;
    }
    
    input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
      
      &:focus {
        outline: none;
        border-color: #1b5e20;
      }
    }
  }
}

.login-btn {
  width: 100%;
  background: #1b5e20;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover:not(:disabled) {
    background: #144017;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}

.demo-credentials {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #e8f5e8;
  border-radius: 8px;
  border-left: 4px solid #1b5e20;
  
  h4 {
    color: #1b5e20;
    margin-bottom: 1rem;
  }
  
  p {
    margin: 0.5rem 0;
    color: #666;
  }
}

/* Panel de administración */
.admin-panel {
  min-height: 100vh;
  background: #f8f9fa;
}

.admin-header {
  background: #1b5e20;
  color: white;
  padding: 1.5rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  h1 {
    margin: 0;
    font-size: 1.8rem;
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.welcome {
  font-weight: 500;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
}

/* Navegación */
.admin-nav {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-tabs {
  display: flex;
  gap: 0;
}

.tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background: #f8f9fa;
    color: #1b5e20;
  }
  
  &.active {
    color: #1b5e20;
    border-bottom-color: #1b5e20;
    background: #f8f9fa;
  }
}

.tab-badge {
  background: #f44336;
  color: white;
  border-radius: 10px;
  padding: 0.2rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

/* Contenido principal */
.admin-content {
  padding: 2rem 0;
}

/* Estadísticas rápidas */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 2rem;
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
  
  &.total-volunteers {
    background: #e3f2fd;
    color: #2196f3;
  }
  
  &.pending-volunteers {
    background: #fff3e0;
    color: #ff9800;
  }
  
  &.total-reports {
    background: #e8f5e8;
    color: #4caf50;
  }
  
  &.pending-reports {
    background: #ffebee;
    color: #f44336;
  }
}

.stat-info {
  h3 {
    font-size: 2rem;
    margin: 0;
    color: #333;
  }
  
  p {
    margin: 0;
    color: #666;
    font-weight: 500;
  }
}

/* Contenido de pestañas */
.tab-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.section-header {
  margin-bottom: 2rem;
  
  h2 {
    color: #1b5e20;
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }
  
  p {
    color: #666;
  }
}

/* Filtros */
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-select {
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

.search-box {
  position: relative;
  flex: 1;
  min-width: 250px;
  
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
    border-radius: 8px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #1b5e20;
    }
  }
}

/* Tablas */
.table-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr auto;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
}

.table-body {
  .table-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr auto;
    gap: 1rem;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #f0f0f0;
    align-items: center;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:hover {
      background: #f8f9fa;
    }
  }
}

.col-name {
  font-weight: 500;
}

.col-email {
  color: #666;
}

.col-cedula, .col-phone {
  font-family: monospace;
}

.col-date {
  color: #666;
  font-size: 0.9rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  
  &.pending {
    background: #fff3e0;
    color: #ff9800;
  }
  
  &.approved {
    background: #e8f5e8;
    color: #4caf50;
  }
  
  &.pendiente {
    background: #fff3e0;
    color: #ff9800;
  }
  
  &.en_proceso {
    background: #e3f2fd;
    color: #2196f3;
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

.col-actions {
  display: flex;
  gap: 0.5rem;
  
  button {
    padding: 0.5rem 0.75rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
  }
  
  .btn-approve {
    background: #e8f5e8;
    color: #4caf50;
    
    &:hover {
      background: #4caf50;
      color: white;
    }
  }
  
  .btn-view {
    background: #e3f2fd;
    color: #2196f3;
    
    &:hover {
      background: #2196f3;
      color: white;
    }
  }
  
  .btn-delete {
    background: #ffebee;
    color: #f44336;
    
    &:hover {
      background: #f44336;
      color: white;
    }
  }
}

/* Lista de reportes */
.reports-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.report-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #e0e0e0;
  
  &.pendiente {
    border-left-color: #ff9800;
  }
  
  &.en_proceso {
    border-left-color: #2196f3;
  }
  
  &.resuelto {
    border-left-color: #4caf50;
  }
  
  &.rechazado {
    border-left-color: #f44336;
  }
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.report-title-section {
  flex: 1;
  
  h3 {
    color: #1b5e20;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }
}

.report-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  
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
  
  .report-urgency {
    &.alta {
      background: #ffebee;
      color: #f44336;
    }
    
    &.media {
      background: #fff3e0;
      color: #ff9800;
    }
    
    &.baja {
      background: #e8f5e8;
      color: #4caf50;
    }
  }
}

.report-status-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  
  .report-date {
    color: #666;
    font-size: 0.8rem;
  }
}

.report-content {
  .report-description {
    color: #666;
    line-height: 1.5;
    margin-bottom: 1rem;
  }
  
  .report-image {
    margin-bottom: 1rem;
    
    img {
      width: 100%;
      max-height: 200px;
      object-fit: cover;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.3s ease;
      
      &:hover {
        transform: scale(1.02);
      }
    }
  }
  
  .report-location {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #666;
    font-size: 0.9rem;
    
    i {
      color: #1b5e20;
    }
  }
}

.report-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
  
  .status-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    label {
      font-size: 0.9rem;
      color: #666;
      font-weight: 500;
    }
  }
  
  .status-buttons {
    display: flex;
    gap: 0.5rem;
  }
  
  .status-btn {
    padding: 0.5rem 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    background: white;
    color: #666;
    cursor: pointer;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: #1b5e20;
      color: #1b5e20;
    }
    
    &.active {
      border-color: #1b5e20;
      background: #1b5e20;
      color: white;
    }
    
    &.active.pendiente {
      border-color: #ff9800;
      background: #ff9800;
    }
    
    &.active.en_proceso {
      border-color: #2196f3;
      background: #2196f3;
    }
    
    &.active.resuelto {
      border-color: #4caf50;
      background: #4caf50;
    }
    
    &.active.rechazado {
      border-color: #f44336;
      background: #f44336;
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 0.5rem;
  }
}

.btn-comment {
  background: #e3f2fd;
  color: #1976d2;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: #bbdefb;
  }
  
  &.active {
    background: #1976d2;
    color: white;
  }
}

.report-comment {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #1b5e20;
  
  strong {
    color: #1b5e20;
    display: block;
    margin-bottom: 0.5rem;
  }
  
  p {
    margin: 0;
    color: #666;
    line-height: 1.5;
  }
}

/* Estadísticas */
.stats-cards-large {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.stat-card-large {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  h3 {
    color: #1b5e20;
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}

.stats-content {
  .stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .stat-label {
      color: #666;
    }
    
    .stat-value {
      font-weight: 600;
      color: #333;
      
      &.approved {
        color: #4caf50;
      }
      
      &.pending {
        color: #ff9800;
      }
      
      &.in-progress {
        color: #2196f3;
      }
      
      &.resolved {
        color: #4caf50;
      }
    }
  }
}

/* Categorías */
.category-stats {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  
  h3 {
    color: #1b5e20;
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.category-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-name {
  font-weight: 500;
  color: #333;
}

.category-count {
  background: #1b5e20;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.category-bar {
  flex: 2;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.category-progress {
  height: 100%;
  background: #1b5e20;
  transition: width 0.5s ease;
}

.category-percent {
  font-weight: 600;
  color: #1b5e20;
  min-width: 40px;
  text-align: right;
}

/* Urgencias */
.urgency-stats {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  
  h3 {
    color: #1b5e20;
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}

.urgency-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.urgency-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 8px;
  color: white;
  
  &.alta {
    background: linear-gradient(135deg, #f44336, #e53935);
  }
  
  &.media {
    background: linear-gradient(135deg, #ff9800, #f57c00);
  }
  
  &.baja {
    background: linear-gradient(135deg, #4caf50, #43a047);
  }
  
  i {
    font-size: 2rem;
  }
}

.urgency-info {
  flex: 1;
}

.urgency-label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.urgency-count {
  font-size: 1.5rem;
  font-weight: 600;
}

.urgency-percent {
  font-size: 1.2rem;
  font-weight: 600;
}

/* Actividad reciente */
.recent-activity {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  h3 {
    color: #1b5e20;
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}

.activity-list {
  .activity-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
  }
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  &.warning {
    background: #fff3e0;
    color: #ff9800;
  }
  
  &.danger {
    background: #ffebee;
    color: #f44336;
  }
  
  &.success {
    background: #e8f5e8;
    color: #4caf50;
  }
}

.activity-content {
  flex: 1;
  
  p {
    margin: 0 0 0.25rem 0;
    color: #333;
  }
  
  .activity-time {
    color: #666;
    font-size: 0.8rem;
  }
}

.empty-activity {
  text-align: center;
  padding: 2rem;
  color: #666;
}

/* Estados vacíos */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
  
  i {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  p {
    margin: 0;
  }
}

/* Modal */
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
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  
  &.large {
    max-width: 700px;
    max-height: 90vh;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  
  h3 {
    margin: 0;
    color: #1b5e20;
  }
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  
  &:hover {
    color: #333;
  }
}

.modal-body {
  padding: 1.5rem;
  max-height: calc(80vh - 140px);
  overflow-y: auto;
  
  .large & {
    max-height: calc(90vh - 140px);
  }
  
  textarea {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    resize: vertical;
    min-height: 120px;
    
    &:focus {
      outline: none;
      border-color: #1b5e20;
    }
  }
}

/* Estilos para detalles de reportes */
.report-details {
  .detail-section {
    margin-bottom: 2rem;
    
    h4 {
      color: #1b5e20;
      margin-bottom: 1rem;
      font-size: 1.1rem;
      border-bottom: 2px solid #e8f5e8;
      padding-bottom: 0.5rem;
    }
  }
  
  .detail-grid {
    display: grid;
    gap: 1rem;
  }
  
  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    
    label {
      font-weight: 600;
      color: #666;
      font-size: 0.9rem;
    }
    
    span {
      color: #333;
    }
  }
  
  .category-badge {
    background: #e3f2fd;
    color: #1976d2;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
    display: inline-block;
  }
  
  .urgency-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
    display: inline-block;
    
    &.alta {
      background: #ffebee;
      color: #f44336;
    }
    
    &.media {
      background: #fff3e0;
      color: #ff9800;
    }
    
    &.baja {
      background: #e8f5e8;
      color: #4caf50;
    }
  }
  
  .location-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 3px solid #1b5e20;
    
    i {
      color: #1b5e20;
    }
  }
  
  .image-container {
    text-align: center;
    
    img {
      max-width: 100%;
      max-height: 300px;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.3s ease;
      
      &:hover {
        transform: scale(1.02);
      }
    }
  }
  
  .comment-box {
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 3px solid #1b5e20;
    
    p {
      margin: 0;
      color: #666;
      line-height: 1.5;
    }
  }
}

.modal-actions {
  padding: 1.5rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  
  button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .btn-cancel {
    background: #e0e0e0;
    color: #333;
    
    &:hover {
      background: #d0d0d0;
    }
  }
  
  .btn-save {
    background: #1b5e20;
    color: white;
    
    &:hover {
      background: #144017;
    }
  }
}

/* Responsive */
@media (max-width: 1200px) {
  .stats-cards-large {
    grid-template-columns: 1fr;
  }
  
  .table-header, .table-row {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.5rem;
  }
  
  .col-cedula, .col-phone, .col-date {
    display: none;
  }
}

@media (max-width: 768px) {
  .nav-tabs {
    flex-direction: column;
  }
  
  .tab {
    justify-content: center;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .report-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .report-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .status-controls {
    flex-direction: column;
    align-items: stretch !important;
  }
  
  .status-buttons {
    flex-wrap: wrap;
  }
  
  .categories-grid, .urgency-grid {
    grid-template-columns: 1fr;
  }
  
  .table-header, .table-row {
    grid-template-columns: 1fr 1fr;
  }
  
  .col-email {
    display: none;
  }
  
  .modal-overlay {
    padding: 1rem;
  }
  
  .modal-content {
    width: 95%;
    
    &.large {
      max-width: 95%;
    }
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>