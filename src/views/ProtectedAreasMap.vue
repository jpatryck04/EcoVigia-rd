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
          <div v-if="selectedArea.flora" class="detail-item">
            <strong>Flora destacada:</strong> {{ selectedArea.flora.slice(0, 3).join(', ') }}...
          </div>
          <div v-if="selectedArea.fauna" class="detail-item">
            <strong>Fauna destacada:</strong> {{ selectedArea.fauna.slice(0, 3).join(', ') }}...
          </div>
          <div v-if="selectedArea.actividades" class="detail-item">
            <strong>Actividades:</strong> {{ selectedArea.actividades.slice(0, 3).join(', ') }}...
          </div>
          <div v-if="selectedArea.clima" class="detail-item">
            <strong>Clima:</strong> {{ selectedArea.clima }}
          </div>
          <div v-if="selectedArea.horario" class="detail-item">
            <strong>Horario:</strong> {{ selectedArea.horario }}
          </div>
          <div v-if="selectedArea.contacto" class="detail-item">
            <strong>Contacto:</strong> {{ selectedArea.contacto }}
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
  flora?: string[];
  fauna?: string[];
  actividades?: string[];
  clima?: string;
  horario?: string;
  contacto?: string;
}

// DATOS COMPLETOS DE LAS 10 ÁREAS PROTEGIDAS
const areas = ref<ProtectedArea[]>([
  {
    id: 1,
    nombre: 'Parque Nacional Los Haitises',
    descripcion: 'Una de las áreas protegidas más importantes y biodiversas de República Dominicana, caracterizada por sus impresionantes mogotes (colinas cársticas), densos bosques de manglares y numerosas cuevas con pictografías taínas. Este parque alberga más de 700 especies de plantas, incluyendo orquídeas endémicas, y es hogar de especies emblemáticas como el solenodón y la jutía. Sus bahías y cayos constituyen un ecosistema único en el Caribe que sirve como refugio para aves migratorias y residentes.',
    latitud: 19.0333,
    longitud: -69.5833,
    imagen: '@/assets/areas/los-haitises.png',
    ubicacion: 'Región Nordeste',
    extension: '1,600 km²',
    tipo: 'Parque Nacional',
    flora: ['Caoba', 'Ceiba', 'Helechos arborescentes', 'Orquídeas endémicas', 'Mangles rojos'],
    fauna: ['Solendón', 'Jutía', 'Manatí antillano', 'Peregrino', 'Cotorra de La Hispaniola'],
    actividades: ['Observación de aves', 'Paseos en bote', 'Senderismo', 'Exploración de cuevas'],
    clima: 'Tropical húmedo',
    horario: '8:00 AM - 5:00 PM',
    contacto: '(809) 555-0123'
  },
  {
    id: 2,
    nombre: 'Reserva Científica Ébano Verde',
    descripcion: 'Situada en la Cordillera Central, esta reserva protege una de las últimas poblaciones del ébano verde, árbol endémico en peligro de extinción. El bosque nublado presenta una biodiversidad excepcional con numerosas especies de orquídeas, bromelias y helechos. La reserva funciona como una esponja natural que captura la humedad de las nubes, alimentando importantes ríos como el Camú y el Yaque del Norte. Su ecosistema es vital para la investigación científica y la conservación de especies únicas de la isla.',
    latitud: 19.1167,
    longitud: -70.5333,
    imagen: '@/assets/areas/ebano-verde.png',
    ubicacion: 'Cordillera Central',
    extension: '290 km²',
    tipo: 'Reserva Científica',
    flora: ['Ébano verde', 'Pinos criollos', 'Orquídeas endémicas', 'Bromelias', 'Helechos arborescentes'],
    fauna: ['Cotorra de La Hispaniola', 'Carpintero de sierra', 'Anfibios endémicos', 'Mariposas unique'],
    actividades: ['Investigación científica', 'Senderismo especializado', 'Observación de flora'],
    clima: 'Templado de montaña',
    horario: 'Solo con permiso especial',
    contacto: '(809) 555-0124'
  },
  {
    id: 3,
    nombre: 'Parque Nacional Jaragua',
    descripcion: 'Considerado el parque nacional más grande del Caribe, Jaragua abarca ecosistemas terrestres y marinos de extraordinaria importancia. Incluye la laguna de Oviedo, con su población de flamencos rosados, playas de anidación de tortugas marinas y la isla Beata con sus formaciones coralinas. El parque protege importantes sitios arqueológicos taínos y presenta una vegetación adaptada a condiciones semiáridas, incluyendo cactus gigantes y bosques secos. Sus aguas cristalinas albergan arrecifes de coral entre los más saludables del Caribe.',
    latitud: 17.785598427771042,
    longitud: -71.50071176413003,
    imagen: '@/assets/areas/jaragua.png',
    ubicacion: 'Península de Barahona',
    extension: '1,374 km²',
    tipo: 'Parque Nacional',
    flora: ['Cactus gigante', 'Guayacán', 'Bayahonda', 'Orquídeas del desierto'],
    fauna: ['Flamenco rosado', 'Tortugas marinas', 'Iguanas rinoceronte', 'Manatíes'],
    actividades: ['Observación de flamencos', 'Buceo', 'Snorkeling', 'Avistamiento de tortugas'],
    clima: 'Semiárido',
    horario: '7:00 AM - 6:00 PM',
    contacto: '(809) 555-0125'
  },
  {
    id: 4,
    nombre: 'Parque Nacional Armando Bermúdez',
    descripcion: 'Ubicado en el corazón de la Cordillera Central, este parque protege las cuencas altas de los principales ríos del país y alberga el Pico Duarte, la montaña más alta del Caribe. Sus bosques de pinos criollos y latifoliados presentan una biodiversidad única con especies adaptadas a las altas elevaciones. El parque es fundamental para la regulación hídrica del país y ofrece espectaculares paisajes de montaña, cascadas y valles profundos. Durante el invierno, las temperaturas pueden descender bajo cero en las cumbres más altas.',
    latitud: 19.0333,
    longitud: -70.9833,
    imagen: '@/assets/areas/bermudez.png',
    ubicacion: 'Cordillera Central',
    extension: '766 km²',
    tipo: 'Parque Nacional',
    flora: ['Pino criollo', 'Sabina', 'Palma de montaña', 'Helechos', 'Líquenes'],
    fauna: ['Cotorra de La Hispaniola', 'Carpintero', 'Jilguero', 'Anfibios endémicos'],
    actividades: ['Escalada de montañas', 'Senderismo', 'Camping', 'Observación de aves'],
    clima: 'Alpino tropical',
    horario: '6:00 AM - 5:00 PM',
    contacto: '(809) 555-0126'
  },
  {
    id: 5,
    nombre: 'Parque Nacional del Este',
    descripcion: 'Este importante parque costero-marino protege ecosistemas únicos que incluyen bosques secos, playas de anidación de tortugas, arrecifes de coral y la famosa Isla Saona. El parque alberga importantes poblaciones de aves marinas y terrestres, así como sitios arqueológicos taínos de gran valor cultural. Sus aguas cristalinas son hogar de delfines, manatíes y numerosas especies de peces tropicales. La variedad de ecosistemas presentes lo convierte en un laboratorio natural para el estudio de la biodiversidad caribeña.',
    latitud: 18.3000,
    longitud: -68.7000,
    imagen: '@/assets/areas/parque-este.png',
    ubicacion: 'Sureste',
    extension: '430 km²',
    tipo: 'Parque Nacional',
    flora: ['Uva de playa', 'Cactus', 'Mangle botón', 'Orquídeas silvestres'],
    fauna: ['Tortugas marinas', 'Delfines', 'Manatíes', 'Fragatas', 'Pelícanos'],
    actividades: ['Snorkeling', 'Observación de tortugas', 'Visita a Isla Saona', 'Tour arqueológico'],
    clima: 'Tropical seco',
    horario: '8:00 AM - 5:00 PM',
    contacto: '(809) 555-0127'
  },
  {
    id: 6,
    nombre: 'Monumento Natural Saltos de la Damajagua',
    descripcion: 'Famoso por sus 27 cascadas y pozos de agua cristalina, este monumento natural ofrece una experiencia única de ecoturismo en medio de un bosque tropical húmedo. Los visitantes pueden escalar, saltar y deslizarse por las cascadas mientras admiran la exuberante vegetación y la fauna local. El sistema fluvial forma piscinas naturales de aguas turquesas rodeadas de rocas calizas erosionadas. Este ecosistema es vital para la recarga acuífera y la conservación de especies endémicas de anfibios e insectos.',
    latitud: 19.73221360252721,
    longitud: -70.82391930947641,
    imagen: '@/assets/areas/damajagua.png',
    ubicacion: 'Puerto Plata',
    extension: '4.5 km²',
    tipo: 'Monumento Natural',
    flora: ['Helechos gigantes', 'Bromelias', 'Orquídeas de río', 'Árboles de sombra'],
    fauna: ['Cangrejos de río', 'Anfibios endémicos', 'Mariposas', 'Aves ribereñas'],
    actividades: ['Salto de cascadas', 'Natación', 'Senderismo acuático', 'Fotografía'],
    clima: 'Tropical húmedo',
    horario: '8:30 AM - 4:00 PM',
    contacto: '(809) 555-0128'
  },
  {
    id: 7,
    nombre: 'Reserva Antropológica Cuevas de Borbón',
    descripcion: 'Este sistema de cuevas conserva uno de los conjuntos más importantes de arte rupestre taíno en el Caribe, con pictografías y petroglifos que datan de hace más de 1,000 años. Las cuevas también albergan formaciones geológicas espectaculares como estalactitas, estalagmitas y columnas. El área circundante protege un bosque seco con especies vegetales adaptadas a las condiciones kársticas. Este sitio es fundamental para entender la cultura precolombina y la relación de los taínos con su entorno natural.',
    latitud: 18.4659748,
    longitud: -70.1349274,
    imagen: '@/assets/areas/cuevas-borbon.png',
    ubicacion: 'Santo Domingo',
    extension: '2.8 km²',
    tipo: 'Reserva Científica',
    flora: ['Árboles caducifolios', 'Cactus', 'Plantas rupícolas', 'Lianas'],
    fauna: ['Murciélagos', 'Arañas de cueva', 'Insectos trogloditas', 'Reptiles'],
    actividades: ['Tour arqueológico', 'Espeleología', 'Fotografía histórica', 'Estudios culturales'],
    clima: 'Tropical húmedo',
    horario: '9:00 AM - 4:00 PM',
    contacto: '(809) 555-0129'
  },
  {
    id: 8,
    nombre: 'Parque Nacional Submarino La Caleta',
    descripcion: 'Este parque nacional submarino es uno de los sitios de buceo más importantes del Caribe, protegiendo un ecosistema marino excepcional que incluye arrecifes de coral, praderas de pastos marinos y un pecio histórico. El parque alberga el famoso barco hundido "Hickory" que sirve como arrecife artificial, atraendo una gran diversidad de vida marina. Las aguas cristalinas permiten una visibilidad excepcional para observar morenas, tortugas marinas, rayas y numerosas especies de peces tropicales. Este santuario marino es vital para la reproducción de especies comerciales y la protección de la biodiversidad costera.',
    latitud: 18.4167,
    longitud: -69.6833,
    imagen: '@/assets/areas/parque-caleta.png',
    ubicacion: 'Costa Sur, cerca de Santo Domingo',
    extension: '10 km² marinos',
    tipo: 'Parque Nacional Submarino',
    flora: ['Corales cuernos de alce', 'Corales cerebro', 'Abanicos de mar', 'Pastos marinos', 'Algas coralinas'],
    fauna: ['Tortugas marinas', 'Morenas', 'Rayas águila', 'Pez ángel', 'Pez loro', 'Cangrejos ermitaños'],
    actividades: ['Buceo recreativo', 'Snorkeling', 'Fotografía submarina', 'Investigación marina', 'Educación ambiental'],
    clima: 'Tropical costero',
    horario: '8:00 AM - 5:00 PM',
    contacto: '(809) 555-0130'
  },
  {
    id: 9,
    nombre: 'Refugio de Vida Silvestre Laguna Redonda y Limón',
    descripcion: 'Este complejo de humedales costeros constituye uno de los sistemas lagunares más importantes del país para la conservación de aves acuáticas y especies marino-costeras. Las lagunas están rodeadas de manglares y bosques de transición que sirven como corredores biológicos para numerosas especies. Durante los meses de invierno, el refugio recibe miles de aves migratorias provenientes de Norteamérica. Las comunidades locales participan activamente en la conservación del área mediante programas de ecoturismo y monitoreo de especies.',
    latitud: 19.011621826169023,
    longitud: -68.93883855319285,
    imagen: '@/assets/areas/laguna-redonda.png',
    ubicacion: 'Región Nordeste',
    extension: '62 km²',
    tipo: 'Refugio de Vida Silvestre',
    flora: ['Mangle rojo', 'Mangle negro', 'Uva de playa', 'Hierbas acuáticas'],
    fauna: ['Aves migratorias', 'Garzas', 'Cocodrilos americanos', 'Cangrejos'],
    actividades: ['Observación de aves', 'Paseos en bote', 'Fotografía de naturaleza', 'Tour comunitario'],
    clima: 'Tropical húmedo',
    horario: '7:00 AM - 5:00 PM',
    contacto: '(809) 555-0131'
  },
  {
    id: 10,
    nombre: 'Parque Nacional Sierra de Bahoruco',
    descripcion: 'Esta sierra constituye un hotspot de biodiversidad con ecosistemas que van desde bosques secos a nivel del mar hasta bosques nublados en las alturas. El parque protege numerosas especies endémicas de plantas y animales, incluyendo orquídeas únicas y anfibios que no se encuentran en ningún otro lugar del mundo. La variación altitudinal crea microclimas distintos que albergan comunidades biológicas especializadas. La sierra también contiene importantes formaciones geológicas como el Hoyo de Pelempito, un impresionante valle intramontañoso.',
    latitud: 18.1667,
    longitud: -71.5833,
    imagen: '@/assets/areas/bahoruco.png',
    ubicacion: 'Suroeste',
    extension: '1,100 km²',
    tipo: 'Parque Nacional',
    flora: ['Pinos endémicos', 'Orquídeas únicas', 'Helechos gigantes', 'Palmas de montaña'],
    fauna: ['Solendón', 'Jutía', 'Anfibios endémicos', 'Mariposas raras'],
    actividades: ['Senderismo especializado', 'Observación de orquídeas', 'Fotografía científica', 'Investigación'],
    clima: 'Variable según altitud',
    horario: '7:00 AM - 4:00 PM',
    contacto: '(809) 555-0132'
  }
]);

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
        <p><strong>Tipo:</strong> ${area.tipo}</p>
        <p><strong>Ubicación:</strong> ${area.ubicacion}</p>
        <p><strong>Extensión:</strong> ${area.extension}</p>
        <p>${area.descripcion.substring(0, 120)}...</p>
        <button class="popup-btn" onclick="this.dispatchEvent(new CustomEvent('showDetails', { detail: ${area.id}, bubbles: true }))">
          Ver Detalles Completos
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
    min-width: 280px;
    
    h3 {
      color: #1b5e20;
      margin-bottom: 0.75rem;
      font-size: 1.1rem;
      line-height: 1.3;
    }
    
    p {
      color: #666;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      line-height: 1.4;
    }
    
    .popup-btn {
      background: #2e7d32;
      color: white;
      border: none;
      padding: 0.6rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.3s ease;
      width: 100%;
      margin-top: 0.5rem;
      
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
  max-width: 700px;
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
        min-width: 140px;
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