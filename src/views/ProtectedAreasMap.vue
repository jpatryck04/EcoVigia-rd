<template>
  <div class="map-container">
    <div class="map-header">
      <h1>Mapa de Áreas Protegidas</h1>
      <p>Explora los parques nacionales y reservas de RD</p>
    </div>
    
    <div class="map-wrapper">
      <div id="map" style="height: 500px; width: 100%; border-radius: 12px;"></div>
    </div>

    <!-- Modal de detalles -->
    <div v-if="selectedArea" class="modal-overlay" @click="selectedArea = null">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="selectedArea = null">×</button>
        <h2>{{ selectedArea.nombre }}</h2>
        <div class="image-placeholder">
          <i class="fas fa-tree"></i>
          <span>Imagen de {{ selectedArea.nombre }}</span>
        </div>
        <p>{{ selectedArea.descripcion }}</p>
        <div class="area-details">
          <div class="detail-item">
            <strong>Ubicación:</strong> {{ selectedArea.ubicacion }}
          </div>
          <div class="detail-item">
            <strong>Extensión:</strong> {{ selectedArea.extension }}
          </div>
          <div class="detail-item">
            <strong>Tipo:</strong> {{ selectedArea.tipo }}
          </div>
          <div class="detail-item">
            <strong>Coordenadas:</strong> {{ selectedArea.latitud.toFixed(4) }}, {{ selectedArea.longitud.toFixed(4) }}
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-primary" @click="zoomToArea(selectedArea)">
            <i class="fas fa-search-location"></i>
            Centrar en Mapa
          </button>
          <button class="btn-secondary" @click="selectedArea = null">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet en producción
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ProtectedArea {
  id: number;
  nombre: string;
  descripcion: string;
  latitud: number;
  longitud: number;
  imagen: string;
  ubicacion: string;
  extension: string;
  tipo: string;
}

// Datos de ejemplo
const sampleAreas: ProtectedArea[] = [
  {
    id: 1,
    nombre: 'Parque Nacional Los Haitises',
    descripcion: 'Área protegida con manglares, bahías e islas kársticas. Hogar de una gran biodiversidad y formaciones geológicas únicas. Es una de las áreas protegidas más importantes de República Dominicana.',
    latitud: 19.0333,
    longitud: -69.5833,
    imagen: '/images/haitises.jpg',
    ubicacion: 'Región Nordeste',
    extension: '1,600 km²',
    tipo: 'Parque Nacional'
  },
  {
    id: 2,
    nombre: 'Parque Nacional Jaragua',
    descripcion: 'Reserva de biodiversidad en la región suroeste, conocida por sus playas vírgenes y ecosistemas únicos. Alberga especies endémicas y es crucial para la conservación costera.',
    latitud: 17.8000,
    longitud: -71.4667,
    imagen: '/images/jaragua.jpg',
    ubicacion: 'Provincia Pedernales',
    extension: '1,374 km²',
    tipo: 'Parque Nacional'
  },
  {
    id: 3,
    nombre: 'Parque Nacional Armando Bermúdez',
    descripcion: 'Protege las principales cuencas hidrográficas del país en la Cordillera Central. Incluye el Pico Duarte, la montaña más alta del Caribe.',
    latitud: 19.0833,
    longitud: -71.0833,
    imagen: '/images/bermudez.jpg',
    ubicacion: 'Cordillera Central',
    extension: '766 km²',
    tipo: 'Parque Nacional'
  },
  {
    id: 4,
    nombre: 'Parque Nacional del Este',
    descripcion: 'Importante reserva natural que incluye la Isla Saona. Protege ecosistemas costeros, arrecifes de coral y bosques secos.',
    latitud: 18.3000,
    longitud: -68.7000,
    imagen: '/images/este.jpg',
    ubicacion: 'Provincia La Altagracia',
    extension: '430 km²',
    tipo: 'Parque Nacional'
  }
];

const areas = ref<ProtectedArea[]>(sampleAreas);
const selectedArea = ref<ProtectedArea | null>(null);
let map: L.Map | null = null;
let markers: L.Marker[] = [];

// Crear icono personalizado
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: '<i class="fas fa-tree"></i>',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

// Inicializar mapa
const initializeMap = () => {
  if (map) {
    map.remove();
  }

  map = L.map('map').setView([18.7357, -70.1627], 8);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map);

  // Agregar marcadores
  areas.value.forEach(area => {
    const marker = L.marker([area.latitud, area.longitud], {
      icon: createCustomIcon()
    }).addTo(map!);

    marker.bindPopup(`
      <div class="popup-content">
        <h3>${area.nombre}</h3>
        <p>${area.descripcion.substring(0, 100)}...</p>
        <button onclick="this.dispatchEvent(new CustomEvent('showDetails', { detail: ${area.id}, bubbles: true }))">
          Ver Detalles
        </button>
      </div>
    `);

    marker.on('click', () => {
      showAreaDetails(area);
    });

    markers.push(marker);
  });

  // Escuchar eventos personalizados del popup
  map.getContainer().addEventListener('showDetails', ((event: CustomEvent) => {
    const areaId = event.detail;
    const area = areas.value.find(a => a.id === areaId);
    if (area) {
      showAreaDetails(area);
    }
  }) as EventListener);
};

const showAreaDetails = (area: ProtectedArea) => {
  selectedArea.value = area;
};

const zoomToArea = (area: ProtectedArea) => {
  if (map) {
    map.setView([area.latitud, area.longitud], 12);
    selectedArea.value = null;
  }
};

onMounted(() => {
  // Pequeño delay para asegurar que el DOM esté listo
  setTimeout(() => {
    initializeMap();
  }, 100);
});

onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
  markers = [];
});
</script>

<style scoped lang="scss">
.map-container {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.map-header {
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    color: #1b5e20;
    margin-bottom: 0.5rem;
    font-size: 2.5rem;
  }
  
  p {
    color: #666;
    font-size: 1.2rem;
  }
}

.map-wrapper {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  margin-bottom: 2rem;
}

// Estilos para los marcadores personalizados (Leaflet)
:deep(.custom-marker) {
  background: #2e7d32;
  border: 3px solid white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  text-align: center;
  
  i {
    margin: 0;
    line-height: 1;
  }
}

// Estilos para los popups de Leaflet
:deep(.leaflet-popup-content) {
  margin: 15px;
  
  .popup-content {
    min-width: 250px;
    
    h3 {
      color: #1b5e20;
      margin-bottom: 0.75rem;
      font-size: 1.1rem;
      line-height: 1.3;
    }
    
    p {
      color: #666;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      line-height: 1.4;
    }
    
    button {
      background: #2e7d32;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.3s ease;
      width: 100%;
      
      &:hover {
        background: #1b5e20;
        transform: translateY(-1px);
      }
    }
  }
}

:deep(.leaflet-popup-tip) {
  background: white;
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

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
  backdrop-filter: blur(5px);
}

.modal-content {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  
  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: #f8f9fa;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
    
    &:hover {
      color: #333;
      background: #e9ecef;
      transform: rotate(90deg);
    }
  }
  
  h2 {
    color: #1b5e20;
    margin-bottom: 1.5rem;
    padding-right: 3rem;
    font-size: 1.8rem;
    line-height: 1.3;
  }
  
  .image-placeholder {
    width: 100%;
    height: 200px;
    background: linear-gradient(135deg, #e8f5e8, #c8e6c9);
    border-radius: 12px;
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #2e7d32;
    font-size: 3rem;
    border: 2px dashed #a5d6a7;
    
    span {
      font-size: 1rem;
      margin-top: 0.5rem;
      color: #4caf50;
    }
  }
  
  p {
    color: #555;
    line-height: 1.7;
    margin-bottom: 2rem;
    font-size: 1.05rem;
  }
  
  .area-details {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    
    .detail-item {
      margin-bottom: 1rem;
      padding: 0.75rem 1rem;
      background: white;
      border-radius: 8px;
      border-left: 4px solid #2e7d32;
      display: flex;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      strong {
        color: #1b5e20;
        min-width: 120px;
        margin-right: 1rem;
      }
    }
  }
  
  .modal-actions {
    display: flex;
    gap: 1rem;
    
    .btn-primary, .btn-secondary {
      flex: 1;
      padding: 1rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    
    .btn-primary {
      background: #2e7d32;
      color: white;
      
      &:hover {
        background: #1b5e20;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(27, 94, 32, 0.3);
      }
    }
    
    .btn-secondary {
      background: #6c757d;
      color: white;
      
      &:hover {
        background: #5a6268;
        transform: translateY(-2px);
      }
    }
  }
}

@media (max-width: 768px) {
  .map-container {
    padding: 0.5rem;
  }
  
  .map-header {
    h1 {
      font-size: 2rem;
    }
    
    p {
      font-size: 1.1rem;
    }
  }
  
  .modal-content {
    padding: 1.5rem;
    margin: 0.5rem;
    
    h2 {
      font-size: 1.5rem;
    }
    
    .modal-actions {
      flex-direction: column;
    }
    
    .area-details .detail-item {
      flex-direction: column;
      
      strong {
        min-width: auto;
        margin-right: 0;
        margin-bottom: 0.25rem;
      }
    }
  }
}
</style>