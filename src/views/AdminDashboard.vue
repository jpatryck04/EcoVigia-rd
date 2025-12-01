<template>
  <div class="admin-dashboard">
    <div class="container">
      <!-- Header del Admin -->
      <div class="admin-header">
        <div class="admin-info">
          <h1>Panel de Administración</h1>
          <p>Bienvenido, {{ authStore.user?.nombre }}</p>
        </div>
        <div class="admin-actions">
          <button class="btn-logout" @click="handleLogout">
            <i class="fas fa-sign-out-alt"></i>
            Cerrar Sesión
          </button>
        </div>
      </div>

      <!-- Estadísticas Rápidas -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon total-reports">
            <i class="fas fa-flag"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.totalReports }}</div>
            <div class="stat-label">Reportes Totales</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon pending-reports">
            <i class="fas fa-clock"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.pendingReports }}</div>
            <div class="stat-label">Pendientes</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon resolved-reports">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.resolvedReports }}</div>
            <div class="stat-label">Resueltos</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon volunteers">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.totalVolunteers }}</div>
            <div class="stat-label">Voluntarios</div>
          </div>
        </div>
      </div>

      <!-- Navegación Rápida -->
      <div class="admin-nav">
        <h2>Acciones Rápidas</h2>
        <div class="nav-grid">
          <router-link to="/admin/reportes" class="nav-card">
            <div class="nav-icon">
              <i class="fas fa-list-alt"></i>
            </div>
            <div class="nav-content">
              <h3>Gestionar Reportes</h3>
              <p>Revisar y administrar todos los reportes ambientales</p>
            </div>
            <i class="fas fa-chevron-right nav-arrow"></i>
          </router-link>

          <router-link to="/admin/voluntarios" class="nav-card">
            <div class="nav-icon">
              <i class="fas fa-user-friends"></i>
            </div>
            <div class="nav-content">
              <h3>Gestionar Voluntarios</h3>
              <p>Administrar usuarios y permisos de voluntarios</p>
            </div>
            <i class="fas fa-chevron-right nav-arrow"></i>
          </router-link>

          <router-link to="/admin/areas" class="nav-card">
            <div class="nav-icon">
              <i class="fas fa-tree"></i>
            </div>
            <div class="nav-content">
              <h3>Áreas Protegidas</h3>
              <p>Gestionar información de áreas protegidas</p>
            </div>
            <i class="fas fa-chevron-right nav-arrow"></i>
          </router-link>

          <router-link to="/admin/noticias" class="nav-card">
            <div class="nav-icon">
              <i class="fas fa-newspaper"></i>
            </div>
            <div class="nav-content">
              <h3>Gestionar Noticias</h3>
              <p>Crear y editar noticias ambientales</p>
            </div>
            <i class="fas fa-chevron-right nav-arrow"></i>
          </router-link>
        </div>
      </div>

      <!-- Reportes Recientes -->
      <div class="recent-reports">
        <div class="section-header">
          <h2>Reportes Recientes</h2>
          <router-link to="/admin/reportes" class="view-all">
            Ver Todos <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>

        <div class="reports-list">
          <div v-for="report in recentReports" :key="report.id" class="report-item">
            <div class="report-info">
              <h4>{{ report.titulo }}</h4>
              <p>{{ report.descripcion }}</p>
              <div class="report-meta">
                <span class="report-category">{{ report.categoria }}</span>
                <span class="report-date">{{ formatDate(report.fecha) }}</span>
                <span :class="['report-status', `status-${report.estado}`]">
                  {{ getStatusText(report.estado) }}
                </span>
              </div>
            </div>
            <div class="report-actions">
              <button class="btn-action" @click="viewReport(report)">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn-action" @click="editReport(report)">
                <i class="fas fa-edit"></i>
              </button>
            </div>
          </div>
        </div>

        <div v-if="recentReports.length === 0" class="empty-state">
          <i class="fas fa-inbox"></i>
          <p>No hay reportes recientes</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useAppStore } from '@/stores/app';
import { formatDate } from '@/utils';
import type { EnvironmentalReport } from '@/types';

const router = useRouter();
const authStore = useAuthStore();
const appStore = useAppStore();

const stats = ref({
  totalReports: 0,
  pendingReports: 0,
  resolvedReports: 0,
  totalVolunteers: 0
});

const recentReports = ref<EnvironmentalReport[]>([]);

const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    pendiente: 'Pendiente',
    en_proceso: 'En Proceso',
    resuelto: 'Resuelto',
    rechazado: 'Rechazado'
  };
  return statusMap[status] || status;
};

const loadDashboardData = async () => {
  try {
    // Simular carga de datos
    stats.value = {
      totalReports: 156,
      pendingReports: 23,
      resolvedReports: 89,
      totalVolunteers: 45
    };

    recentReports.value = [
      {
        id: '1',
        titulo: 'Deforestación en zona protegida',
        descripcion: 'Tala ilegal de árboles en área de reserva',
        foto: '',
        latitud: 18.7357,
        longitud: -70.1627,
        fecha: new Date().toISOString(),
        estado: 'pendiente',
        categoria: 'deforestacion',
        urgencia: 'alta'
      },
      {
        id: '2',
        titulo: 'Contaminación de río',
        descripcion: 'Vertido de químicos en afluente principal',
        foto: '',
        latitud: 18.7357,
        longitud: -70.1627,
        fecha: new Date(Date.now() - 86400000).toISOString(),
        estado: 'en_proceso',
        categoria: 'contaminacion',
        urgencia: 'media'
      }
    ];
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};

const viewReport = (report: EnvironmentalReport) => {
  // Navegar a vista de detalle del reporte
  console.log('View report:', report);
};

const editReport = (report: EnvironmentalReport) => {
  // Navegar a edición del reporte
  console.log('Edit report:', report);
};

onMounted(() => {
  // Verificar que sea admin
  if (!authStore.isAdmin()) {
    router.push('/');
    return;
  }
  
  loadDashboardData();
});
</script>

<style scoped lang="scss">
.admin-dashboard {
  padding: 2rem 0;
  background: #f8f9fa;
  min-height: 100vh;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  .admin-info {
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

  .btn-logout {
    background: #f44336;
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
      background: #d32f2f;
    }
  }
}

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

  .stat-icon {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;

    &.total-reports {
      background: #e3f2fd;
      color: #1976d2;
    }

    &.pending-reports {
      background: #fff3e0;
      color: #f57c00;
    }

    &.resolved-reports {
      background: #e8f5e8;
      color: #4caf50;
    }

    &.volunteers {
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

.admin-nav {
  margin-bottom: 3rem;

  h2 {
    color: #1b5e20;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.nav-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    border-color: #1b5e20;
  }

  .nav-icon {
    width: 60px;
    height: 60px;
    background: #e8f5e8;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: #1b5e20;
  }

  .nav-content {
    flex: 1;

    h3 {
      color: #1b5e20;
      margin-bottom: 0.5rem;
      font-size: 1.2rem;
    }

    p {
      color: #666;
      font-size: 0.9rem;
      line-height: 1.4;
    }
  }

  .nav-arrow {
    color: #1b5e20;
    font-size: 1.2rem;
  }
}

.recent-reports {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h2 {
    color: #1b5e20;
    font-size: 1.5rem;
  }

  .view-all {
    color: #1b5e20;
    text-decoration: none;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
      text-decoration: underline;
    }
  }
}

.reports-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.report-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: background 0.3s ease;

  &:hover {
    background: #f8f9fa;
  }

  .report-info {
    flex: 1;

    h4 {
      color: #333;
      margin-bottom: 0.5rem;
      font-size: 1.1rem;
    }

    p {
      color: #666;
      margin-bottom: 1rem;
      line-height: 1.4;
    }
  }

  .report-meta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;

    span {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .report-category {
      background: #e3f2fd;
      color: #1976d2;
    }

    .report-date {
      background: #f5f5f5;
      color: #666;
    }

    .report-status {
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

  .report-actions {
    display: flex;
    gap: 0.5rem;

    .btn-action {
      background: none;
      border: 1px solid #e0e0e0;
      padding: 0.5rem;
      border-radius: 6px;
      cursor: pointer;
      color: #666;
      transition: all 0.3s ease;

      &:hover {
        background: #1b5e20;
        color: white;
        border-color: #1b5e20;
      }
    }
  }
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #666;

  i {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
}

@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .nav-grid {
    grid-template-columns: 1fr;
  }

  .report-item {
    flex-direction: column;
    gap: 1rem;
  }

  .report-actions {
    align-self: flex-end;
  }
}
</style>