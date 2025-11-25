<template>
  <div class="protected-areas">
    <div class="container">
      <div class="page-header">
        <h1>Áreas Protegidas</h1>
        <p>Descubre los tesoros naturales de República Dominicana</p>
      </div>

      <!-- Barra de búsqueda y filtros -->
      <div class="search-filters">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Buscar áreas protegidas..." 
          />
        </div>
        
        <div class="filter-group">
          <select v-model="selectedType" class="filter-select">
            <option value="">Todos los tipos</option>
            <option 
              v-for="type in areaTypes" 
              :key="type.value"
              :value="type.value"
            >
              {{ type.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Grid de áreas protegidas -->
      <div class="areas-grid">
        <div 
          v-for="area in filteredAreas" 
          :key="area.id"
          class="area-card"
          @click="viewAreaDetails(area)"
        >
          <div class="area-image">
            <img :src="area.imagen" :alt="area.nombre" />
            <div class="area-type">{{ area.tipo }}</div>
          </div>
          <div class="area-content">
            <h3>{{ area.nombre }}</h3>
            <p class="area-location">
              <i class="fas fa-map-marker-alt"></i>
              {{ area.ubicacion }}
            </p>
            <p class="area-description">{{ area.descripcion }}</p>
            <div class="area-meta">
              <span class="area-size">
                <i class="fas fa-expand-arrows-alt"></i>
                {{ area.extension }}
              </span>
              <span class="area-flora">
                <i class="fas fa-leaf"></i>
                {{ area.flora?.length || 0 }} especies
              </span>
            </div>
            <div class="area-actions">
              <button class="btn-primary" @click.stop="viewAreaDetails(area)">
                Ver Detalles
              </button>
              <button class="btn-secondary" @click.stop="viewOnMap(area)">
                <i class="fas fa-map"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-if="filteredAreas.length === 0" class="empty-state">
        <i class="fas fa-tree"></i>
        <h3>No se encontraron áreas</h3>
        <p>Intenta con otros términos de búsqueda</p>
      </div>

      <!-- Modal de detalles -->
      <AreaDetailsModal 
        v-if="selectedArea"
        :area="selectedArea"
        @close="selectedArea = null"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AreaDetailsModal from '@/components/AreaDetailsModal.vue';
import type { ProtectedArea } from '@/types';

const router = useRouter();

const areas = ref<ProtectedArea[]>([]);
const searchQuery = ref('');
const selectedType = ref('');
const selectedArea = ref<ProtectedArea | null>(null);

const areaTypes = [
  { value: 'Parque Nacional', label: 'Parque Nacional' },
  { value: 'Reserva Científica', label: 'Reserva Científica' },
  { value: 'Reserva Forestal', label: 'Reserva Forestal' },
  { value: 'Área de Conservación', label: 'Área de Conservación' },
  { value: 'Monumento Natural', label: 'Monumento Natural' }
];

const filteredAreas = computed(() => {
  let filtered = areas.value;

  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(area => 
      area.nombre.toLowerCase().includes(query) ||
      area.ubicacion.toLowerCase().includes(query) ||
      area.descripcion.toLowerCase().includes(query)
    );
  }

  // Filtrar por tipo
  if (selectedType.value) {
    filtered = filtered.filter(area => area.tipo === selectedType.value);
  }

  return filtered;
});

const viewAreaDetails = (area: ProtectedArea) => {
  selectedArea.value = area;
};

const viewOnMap = (area: ProtectedArea) => {
  router.push({
    path: '/mapa-areas',
    query: { area: area.id.toString() }
  });
};

onMounted(async () => {
  try {
    // const response = await medioAmbienteAPI.getAreasProtegidas();
    // areas.value = response.data;
    
    // Datos de ejemplo
    areas.value = [
      {
        id: 1,
        nombre: 'Parque Nacional Los Haitises',
        descripcion: 'Una de las áreas protegidas más importantes de República Dominicana, conocida por sus mogotes y manglares.',
        latitud: 19.0333,
        longitud: -69.5833,
        imagen: '/images/los-haitises.jpg',
        ubicacion: 'Región Nordeste',
        extension: '1,600 km²',
        tipo: 'Parque Nacional',
        flora: ['Caoba', 'Ceiba', 'Helechos arborescentes'],
        fauna: ['Solendón', 'Jutía', 'Manatí antillano'],
        actividades: ['Observación de aves', 'Paseos en bote', 'Senderismo'],
        clima: 'Tropical húmedo',
        horario: '8:00 AM - 5:00 PM',
        contacto: '(809) 555-0123'
      },
      {
        id: 2,
        nombre: 'Reserva Científica Ébano Verde',
        descripcion: 'Protege una de las últimas poblaciones de ébano verde y numerosas especies endémicas.',
        latitud: 19.1167,
        longitud: -70.5333,
        imagen: '/images/ebano-verde.jpg',
        ubicacion: 'Cordillera Central',
        extension: '290 km²',
        tipo: 'Reserva Científica',
        flora: ['Ébano verde', 'Pinos criollos', 'Orquídeas'],
        fauna: ['Cotorra de La Hispaniola', 'Carpintero de sierra'],
        actividades: ['Investigación científica', 'Senderismo especializado'],
        clima: 'Templado de montaña',
        horario: 'Solo con permiso especial',
        contacto: '(809) 555-0124'
      }
    ];
  } catch (error) {
    console.error('Error loading protected areas:', error);
  }
});
</script>

<style scoped lang="scss">
.protected-areas {
  padding: 2rem 0;
  min-height: 100vh;
  background: #f8f9fa;
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

.search-filters {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1.5rem;
  margin-bottom: 3rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;

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
  font-size: 1rem;
  cursor: pointer;
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: #1b5e20;
  }
}

.areas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.area-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
}

.area-image {
  position: relative;
  height: 250px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .area-type {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: rgba(27, 94, 32, 0.9);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
  }
}

.area-content {
  padding: 1.5rem;

  h3 {
    color: #1b5e20;
    margin-bottom: 0.5rem;
    font-size: 1.3rem;
  }

  .area-location {
    color: #666;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .area-description {
    color: #666;
    line-height: 1.5;
    margin-bottom: 1.5rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .area-meta {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1.5rem;

    span {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      font-size: 0.9rem;
    }
  }

  .area-actions {
    display: flex;
    gap: 0.5rem;

    .btn-primary, .btn-secondary {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.3s ease;
    }

    .btn-primary {
      background: #1b5e20;
      color: white;
      flex: 1;

      &:hover {
        background: #144017;
      }
    }

    .btn-secondary {
      background: #e0e0e0;
      color: #333;
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: #d0d0d0;
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
    margin-bottom: 1rem;
    color: #333;
  }
}
</style>