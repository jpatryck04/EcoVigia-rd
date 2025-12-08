<template>
  <div class="admin-areas">
    <div class="container">
      <div class="page-header">
        <div class="header-content">
          <h1>Gestión de Áreas Protegidas</h1>
          <p>Administra la información de las áreas protegidas del sistema</p>
        </div>
        <div class="header-actions">
          <button class="btn-back" @click="$router.push('/admin')">
            <i class="fas fa-arrow-left"></i>
            Volver al Dashboard
          </button>
          <button class="btn-primary" @click="showAddModal = true">
            <i class="fas fa-plus"></i>
            Nueva Área
          </button>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-tree"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ areasStore.areaCount }}</div>
            <div class="stat-label">Áreas Totales</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-mountain"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ areasStore.parkCount }}</div>
            <div class="stat-label">Parques Nacionales</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-flask"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ areasStore.reserveCount }}</div>
            <div class="stat-label">Reservas Científicas</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-landmark"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ areasStore.monumentCount }}</div>
            <div class="stat-label">Monumentos Naturales</div>
          </div>
        </div>
      </div>

      <!-- Barra de búsqueda -->
      <div class="search-bar">
        <div class="search-input">
          <i class="fas fa-search"></i>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Buscar áreas por nombre, ubicación o tipo..." 
          />
        </div>
        <div class="search-actions">
          <select v-model="filterType" class="filter-select">
            <option value="">Todos los tipos</option>
            <option value="Parque Nacional">Parque Nacional</option>
            <option value="Reserva Científica">Reserva Científica</option>
            <option value="Monumento Natural">Monumento Natural</option>
            <option value="Reserva Forestal">Reserva Forestal</option>
            <option value="Área de Conservación">Área de Conservación</option>
          </select>
        </div>
      </div>

      <!-- Lista de áreas -->
      <div class="areas-table-container">
        <div v-if="filteredAreas.length === 0" class="empty-state">
          <i class="fas fa-tree"></i>
          <h3>No hay áreas protegidas registradas</h3>
          <p>Comienza agregando tu primera área protegida</p>
          <button class="btn-primary" @click="showAddModal = true">
            <i class="fas fa-plus"></i>
            Agregar Primera Área
          </button>
        </div>

        <div v-else class="areas-table">
          <div class="table-header">
            <div class="table-row">
              <div class="table-cell" style="width: 60px">ID</div>
              <div class="table-cell" style="flex: 2">Nombre</div>
              <div class="table-cell" style="flex: 1">Tipo</div>
              <div class="table-cell" style="flex: 1">Ubicación</div>
              <div class="table-cell" style="flex: 1">Extensión</div>
              <div class="table-cell" style="width: 120px">Acciones</div>
            </div>
          </div>
          
          <div class="table-body">
            <div 
              v-for="area in filteredAreas" 
              :key="area.id"
              class="table-row"
            >
              <div class="table-cell" style="width: 60px">
                <span class="area-id">#{{ area.id }}</span>
              </div>
              
              <div class="table-cell" style="flex: 2">
                <div class="area-info">
                  <div class="area-name">{{ area.nombre }}</div>
                  <div class="area-desc">{{ area.descripcion.substring(0, 80) }}...</div>
                </div>
              </div>
              
              <div class="table-cell" style="flex: 1">
                <span class="area-type-badge" :class="getTypeClass(area.tipo)">
                  {{ area.tipo }}
                </span>
              </div>
              
              <div class="table-cell" style="flex: 1">
                <div class="area-location">
                  <i class="fas fa-map-marker-alt"></i>
                  {{ area.ubicacion }}
                </div>
              </div>
              
              <div class="table-cell" style="flex: 1">
                <span class="area-size">{{ area.extension }}</span>
              </div>
              
              <div class="table-cell" style="width: 120px">
                <div class="action-buttons">
                  <button 
                    class="btn-icon btn-view"
                    @click="viewArea(area)"
                    title="Ver detalles"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  
                  <button 
                    class="btn-icon btn-edit"
                    @click="editArea(area)"
                    title="Editar"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  
                  <button 
                    class="btn-icon btn-delete"
                    @click="confirmDelete(area)"
                    title="Eliminar"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Paginación -->
      <div v-if="filteredAreas.length > 0" class="pagination">
        <div class="pagination-info">
          Mostrando {{ filteredAreas.length }} de {{ areasStore.areas.length }} áreas
        </div>
      </div>
    </div>

    <!-- Modal para agregar/editar área -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ editingArea ? 'Editar Área Protegida' : 'Nueva Área Protegida' }}</h2>
          <button class="modal-close" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="saveArea" class="modal-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="nombre">Nombre del Área *</label>
              <input
                id="nombre"
                v-model="form.nombre"
                type="text"
                required
                placeholder="Ej: Parque Nacional Los Haitises"
              />
            </div>
            
            <div class="form-group">
              <label for="tipo">Tipo de Área *</label>
              <select id="tipo" v-model="form.tipo" required>
                <option value="">Seleccionar tipo</option>
                <option value="Parque Nacional">Parque Nacional</option>
                <option value="Reserva Científica">Reserva Científica</option>
                <option value="Monumento Natural">Monumento Natural</option>
                <option value="Reserva Forestal">Reserva Forestal</option>
                <option value="Área de Conservación">Área de Conservación</option>
                <option value="Refugio de Vida Silvestre">Refugio de Vida Silvestre</option>
                <option value="Parque Nacional Submarino">Parque Nacional Submarino</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="ubicacion">Ubicación *</label>
              <input
                id="ubicacion"
                v-model="form.ubicacion"
                type="text"
                required
                placeholder="Ej: Región Nordeste"
              />
            </div>
            
            <div class="form-group">
              <label for="extension">Extensión *</label>
              <input
                id="extension"
                v-model="form.extension"
                type="text"
                required
                placeholder="Ej: 1,600 km²"
              />
            </div>
            
            <div class="form-group full-width">
              <label for="descripcion">Descripción *</label>
              <textarea
                id="descripcion"
                v-model="form.descripcion"
                required
                rows="4"
                placeholder="Describe el área protegida, su importancia, características principales..."
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="latitud">Latitud *</label>
              <input
                id="latitud"
                v-model.number="form.latitud"
                type="number"
                step="0.0001"
                required
                placeholder="Ej: 19.0333"
              />
            </div>
            
            <div class="form-group">
              <label for="longitud">Longitud *</label>
              <input
                id="longitud"
                v-model.number="form.longitud"
                type="number"
                step="0.0001"
                required
                placeholder="Ej: -69.5833"
              />
            </div>
            
            <div class="form-group">
              <label for="imagen">URL de la Imagen</label>
              <input
                id="imagen"
                v-model="form.imagen"
                type="text"
                placeholder="URL de la imagen (puede ser local o externa)"
              />
              <small>Ej: /images/areas/nombre-del-area.jpg</small>
            </div>
            
            <div class="form-group">
              <label for="clima">Clima</label>
              <input
                id="clima"
                v-model="form.clima"
                type="text"
                placeholder="Ej: Tropical húmedo"
              />
            </div>
            
            <div class="form-group">
              <label for="horario">Horario de Visita</label>
              <input
                id="horario"
                v-model="form.horario"
                type="text"
                placeholder="Ej: 8:00 AM - 5:00 PM"
              />
            </div>
            
            <div class="form-group">
              <label for="contacto">Contacto</label>
              <input
                id="contacto"
                v-model="form.contacto"
                type="text"
                placeholder="Ej: (809) 555-0123"
              />
            </div>
            
            <div class="form-group full-width">
              <label for="flora">Flora Representativa (separada por comas)</label>
              <textarea
                id="flora"
                v-model="form.floraText"
                rows="2"
                placeholder="Ej: Caoba, Ceiba, Helechos arborescentes, Orquídeas"
              ></textarea>
            </div>
            
            <div class="form-group full-width">
              <label for="fauna">Fauna Representativa (separada por comas)</label>
              <textarea
                id="fauna"
                v-model="form.faunaText"
                rows="2"
                placeholder="Ej: Solendón, Jutía, Manatí antillano, Cotorra"
              ></textarea>
            </div>
            
            <div class="form-group full-width">
              <label for="actividades">Actividades Permitidas (separadas por comas)</label>
              <textarea
                id="actividades"
                v-model="form.actividadesText"
                rows="2"
                placeholder="Ej: Observación de aves, Paseos en bote, Senderismo"
              ></textarea>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="closeModal">
              Cancelar
            </button>
            <button type="submit" class="btn-primary" :disabled="loading">
              <i v-if="loading" class="fas fa-spinner fa-spin"></i>
              {{ editingArea ? 'Actualizar Área' : 'Crear Área' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="delete-modal">
        <div class="modal-header">
          <h2>Confirmar Eliminación</h2>
          <button class="modal-close" @click="showDeleteModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <i class="fas fa-exclamation-triangle"></i>
          <p>¿Estás seguro de que deseas eliminar el área protegida <strong>{{ areaToDelete?.nombre }}</strong>?</p>
          <p class="warning-text">Esta acción no se puede deshacer.</p>
        </div>
        
        <div class="modal-actions">
          <button class="btn-secondary" @click="showDeleteModal = false">
            Cancelar
          </button>
          <button class="btn-danger" @click="deleteArea" :disabled="loading">
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            Sí, Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para ver detalles -->
    <div v-if="showViewModal" class="modal-overlay" @click.self="showViewModal = false">
      <div class="view-modal">
        <div class="modal-header">
          <h2>{{ viewingArea?.nombre }}</h2>
          <button class="modal-close" @click="showViewModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="area-preview">
            <div class="area-image" v-if="viewingArea?.imagen">
              <img :src="viewingArea.imagen" :alt="viewingArea.nombre" />
            </div>
            
            <div class="area-details">
              <div class="detail-item">
                <strong>Tipo:</strong>
                <span class="area-type-badge" :class="getTypeClass(viewingArea?.tipo || '')">
                  {{ viewingArea?.tipo }}
                </span>
              </div>
              
              <div class="detail-item">
                <strong>Ubicación:</strong>
                <span>{{ viewingArea?.ubicacion }}</span>
              </div>
              
              <div class="detail-item">
                <strong>Extensión:</strong>
                <span>{{ viewingArea?.extension }}</span>
              </div>
              
              <div class="detail-item" v-if="viewingArea?.clima">
                <strong>Clima:</strong>
                <span>{{ viewingArea.clima }}</span>
              </div>
              
              <div class="detail-item" v-if="viewingArea?.horario">
                <strong>Horario:</strong>
                <span>{{ viewingArea.horario }}</span>
              </div>
              
              <div class="detail-item" v-if="viewingArea?.contacto">
                <strong>Contacto:</strong>
                <span>{{ viewingArea.contacto }}</span>
              </div>
              
              <div class="detail-item full-width">
                <strong>Descripción:</strong>
                <p>{{ viewingArea?.descripcion }}</p>
              </div>
              
              <div class="detail-item full-width" v-if="viewingArea?.flora && viewingArea.flora.length > 0">
                <strong>Flora:</strong>
                <div class="tags">
                  <span v-for="plant in viewingArea.flora" :key="plant" class="tag">
                    {{ plant }}
                  </span>
                </div>
              </div>
              
              <div class="detail-item full-width" v-if="viewingArea?.fauna && viewingArea.fauna.length > 0">
                <strong>Fauna:</strong>
                <div class="tags">
                  <span v-for="animal in viewingArea.fauna" :key="animal" class="tag">
                    {{ animal }}
                  </span>
                </div>
              </div>
              
              <div class="detail-item full-width" v-if="viewingArea?.actividades && viewingArea.actividades.length > 0">
                <strong>Actividades:</strong>
                <div class="tags">
                  <span v-for="activity in viewingArea.actividades" :key="activity" class="tag">
                    {{ activity }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="btn-secondary" @click="showViewModal = false">
            Cerrar
          </button>
          <button class="btn-primary" @click="editArea(viewingArea!)">
            <i class="fas fa-edit"></i>
            Editar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useAreasStore } from '@/stores/areas';
import type { ProtectedArea } from '@/types';

const router = useRouter();
const authStore = useAuthStore();
const areasStore = useAreasStore();

// Estados
const searchQuery = ref('');
const filterType = ref('');
const showAddModal = ref(false);
const showDeleteModal = ref(false);
const showViewModal = ref(false);
const loading = ref(false);
const editingArea = ref<ProtectedArea | null>(null);
const viewingArea = ref<ProtectedArea | null>(null);
const areaToDelete = ref<ProtectedArea | null>(null);

// Formulario
const form = ref({
  nombre: '',
  descripcion: '',
  latitud: 0,
  longitud: 0,
  imagen: '',
  ubicacion: '',
  extension: '',
  tipo: '',
  clima: '',
  horario: '',
  contacto: '',
  floraText: '',
  faunaText: '',
  actividadesText: ''
});

// Computed
const filteredAreas = computed(() => {
  let filtered = areasStore.areas;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(area => 
      area.nombre.toLowerCase().includes(query) ||
      area.ubicacion.toLowerCase().includes(query) ||
      area.tipo.toLowerCase().includes(query) ||
      area.descripcion.toLowerCase().includes(query)
    );
  }

  if (filterType.value) {
    filtered = filtered.filter(area => area.tipo === filterType.value);
  }

  return filtered.sort((a, b) => b.id - a.id); // Más recientes primero
});

// Métodos
const getTypeClass = (type: string) => {
  const classes: Record<string, string> = {
    'Parque Nacional': 'park',
    'Reserva Científica': 'reserve',
    'Monumento Natural': 'monument',
    'Reserva Forestal': 'forest',
    'Área de Conservación': 'conservation',
    'Refugio de Vida Silvestre': 'wildlife',
    'Parque Nacional Submarino': 'marine'
  };
  return classes[type] || 'default';
};

const resetForm = () => {
  form.value = {
    nombre: '',
    descripcion: '',
    latitud: 0,
    longitud: 0,
    imagen: '',
    ubicacion: '',
    extension: '',
    tipo: '',
    clima: '',
    horario: '',
    contacto: '',
    floraText: '',
    faunaText: '',
    actividadesText: ''
  };
  editingArea.value = null;
};

const openAddModal = () => {
  resetForm();
  showAddModal.value = true;
};

const editArea = (area: ProtectedArea) => {
  editingArea.value = area;
  form.value = {
    nombre: area.nombre,
    descripcion: area.descripcion,
    latitud: area.latitud,
    longitud: area.longitud,
    imagen: area.imagen,
    ubicacion: area.ubicacion,
    extension: area.extension,
    tipo: area.tipo,
    clima: area.clima || '',
    horario: area.horario || '',
    contacto: area.contacto || '',
    floraText: area.flora?.join(', ') || '',
    faunaText: area.fauna?.join(', ') || '',
    actividadesText: area.actividades?.join(', ') || ''
  };
  showAddModal.value = true;
};

const viewArea = (area: ProtectedArea) => {
  viewingArea.value = area;
  showViewModal.value = true;
};

const confirmDelete = (area: ProtectedArea) => {
  areaToDelete.value = area;
  showDeleteModal.value = true;
};

const deleteArea = () => {
  if (areaToDelete.value) {
    areasStore.deleteArea(areaToDelete.value.id);
    showDeleteModal.value = false;
    areaToDelete.value = null;
  }
};

const closeModal = () => {
  showAddModal.value = false;
  resetForm();
};

const saveArea = () => {
  loading.value = true;
  
  try {
    // Procesar arrays
    const flora = form.value.floraText
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    const fauna = form.value.faunaText
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    const actividades = form.value.actividadesText
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    const areaData = {
      nombre: form.value.nombre,
      descripcion: form.value.descripcion,
      latitud: form.value.latitud,
      longitud: form.value.longitud,
      imagen: form.value.imagen || '/images/areas/default.jpg',
      ubicacion: form.value.ubicacion,
      extension: form.value.extension,
      tipo: form.value.tipo,
      clima: form.value.clima,
      horario: form.value.horario,
      contacto: form.value.contacto,
      flora,
      fauna,
      actividades
    };
    
    if (editingArea.value) {
      // Actualizar área existente
      areasStore.updateArea(editingArea.value.id, areaData);
    } else {
      // Crear nueva área
      areasStore.addArea(areaData);
    }
    
    closeModal();
    
  } catch (error) {
    console.error('Error saving area:', error);
  } finally {
    loading.value = false;
  }
};

// Verificar autenticación y permisos
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
  }
});
</script>

<style scoped lang="scss">
.admin-areas {
  padding: 2rem 0;
  min-height: 100vh;
  background: #f8f9fa;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

.header-content h1 {
  color: #1b5e20;
  margin-bottom: 0.5rem;
}

.header-content p {
  color: #666;
}

.header-actions {
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
}

.btn-back, .btn-primary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-back {
  background: #6c757d;
  color: white;

  &:hover {
    background: #5a6268;
  }
}

.btn-primary {
  background: #1b5e20;
  color: white;

  &:hover {
    background: #144017;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #a5d6a7;
    cursor: not-allowed;
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
  gap: 1rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-3px);
  }
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #1b5e20, #4caf50);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    font-size: 1.8rem;
    color: white;
  }
}

.stat-content {
  .stat-number {
    font-size: 2rem;
    font-weight: bold;
    color: #1b5e20;
    line-height: 1;
  }

  .stat-label {
    color: #666;
    font-size: 0.9rem;
  }
}

.search-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.search-input {
  flex: 1;
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
    border-radius: 8px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: #1b5e20;
    }
  }
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: #1b5e20;
  }
}

.areas-table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
}

.empty-state {
  padding: 4rem 2rem;
  text-align: center;
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
    margin-bottom: 1.5rem;
  }
}

.areas-table {
  .table-header {
    background: #f8f9fa;
    border-bottom: 2px solid #e0e0e0;
  }

  .table-row {
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #f0f0f0;

    &:hover {
      background: #f8f9fa;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  .table-cell {
    padding: 0 0.5rem;
  }
}

.area-id {
  font-weight: bold;
  color: #666;
}

.area-info {
  .area-name {
    font-weight: 600;
    color: #333;
    margin-bottom: 0.25rem;
  }

  .area-desc {
    color: #666;
    font-size: 0.9rem;
    line-height: 1.3;
  }
}

.area-type-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;

  &.park {
    background: #e8f5e8;
    color: #1b5e20;
  }

  &.reserve {
    background: #e3f2fd;
    color: #1976d2;
  }

  &.monument {
    background: #f3e5f5;
    color: #7b1fa2;
  }

  &.forest {
    background: #e8f5e9;
    color: #2e7d32;
  }

  &.conservation {
    background: #fff3e0;
    color: #f57c00;
  }

  &.wildlife {
    background: #fce4ec;
    color: #c2185b;
  }

  &.marine {
    background: #e1f5fe;
    color: #0288d1;
  }
}

.area-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;

  i {
    color: #1b5e20;
  }
}

.area-size {
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  i {
    font-size: 0.9rem;
  }

  &:hover {
    transform: translateY(-2px);
  }
}

.btn-view {
  background: #e3f2fd;
  color: #1976d2;

  &:hover {
    background: #bbdefb;
  }
}

.btn-edit {
  background: #fff3e0;
  color: #f57c00;

  &:hover {
    background: #ffe0b2;
  }
}

.btn-delete {
  background: #ffebee;
  color: #f44336;

  &:hover {
    background: #ffcdd2;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.pagination-info {
  color: #666;
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

.modal-content, .delete-modal, .view-modal {
  background: white;
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e0e0e0;

  h2 {
    color: #1b5e20;
    margin: 0;
  }
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;

  &:hover {
    background: #f5f5f5;
  }
}

.modal-form {
  padding: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.form-group {
  &.full-width {
    grid-column: 1 / -1;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: 500;
  }

  input, select, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: #1b5e20;
    }
  }

  textarea {
    resize: vertical;
  }

  small {
    display: block;
    margin-top: 0.25rem;
    color: #666;
    font-size: 0.8rem;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: #d0d0d0;
  }
}

.btn-danger {
  background: #f44336;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;

  &:hover:not(:disabled) {
    background: #d32f2f;
  }

  &:disabled {
    background: #ffcdd2;
    cursor: not-allowed;
  }
}

.delete-modal, .view-modal {
  max-width: 500px;
}

.modal-body {
  padding: 2rem;
  text-align: center;

  i {
    font-size: 3rem;
    color: #f44336;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
    margin-bottom: 0.5rem;
  }

  .warning-text {
    color: #f44336;
    font-weight: 600;
  }
}

.area-preview {
  .area-image {
    margin-bottom: 1.5rem;

    img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 12px;
    }
  }
}

.area-details {
  text-align: left;

  .detail-item {
    margin-bottom: 1rem;

    strong {
      display: block;
      color: #333;
      margin-bottom: 0.25rem;
    }

    span, p {
      color: #666;
    }

    &.full-width {
      grid-column: 1 / -1;
    }
  }
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag {
  background: #e8f5e8;
  color: #1b5e20;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
}
</style>