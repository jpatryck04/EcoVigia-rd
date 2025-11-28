<template>
  <div class="protected-areas">
    <div class="container">
      <!-- Carrusel de fotos -->
      <div class="hero-carousel">
        <div class="carousel-container">
          <div 
            class="carousel-track" 
            :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
          >
            <div 
              v-for="(slide, index) in carouselSlides" 
              :key="index"
              class="carousel-slide"
            >
              <img :src="slide.image" :alt="slide.title" />
              <div class="carousel-overlay">
                <div class="carousel-content">
                  <h2>{{ slide.title }}</h2>
                  <p>{{ slide.description }}</p>
                  <button class="carousel-btn" @click="exploreArea(slide.areaId)">
                    Explorar Área
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Controles del carrusel -->
          <button class="carousel-control prev" @click="prevSlide">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="carousel-control next" @click="nextSlide">
            <i class="fas fa-chevron-right"></i>
          </button>
          
          <!-- Indicadores -->
          <div class="carousel-indicators">
            <button
              v-for="(slide, index) in carouselSlides"
              :key="index"
              :class="['indicator', { active: currentSlide === index }]"
              @click="goToSlide(index)"
            ></button>
          </div>
        </div>
      </div>

      <div class="page-header" ref="areasSection">
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
          :class="{ 'highlighted': highlightedArea === area.id }"
          @click="viewAreaDetails(area)"
          @mouseenter="hoverCard = area.id"
          @mouseleave="hoverCard = null"
        >
          <div class="area-image">
            <img :src="area.imagen" :alt="area.nombre" />
            <div class="area-type">{{ area.tipo }}</div>
            <div class="image-overlay" :class="{ active: hoverCard === area.id }"></div>
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
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import AreaDetailsModal from '@/components/AreaDetailsModal.vue';
import type { ProtectedArea } from '@/types';

// Importar todas las imágenes desde src/assets
import losHaitisesImg from '@/assets/areas/los-haitises.png';
import ebanoVerdeImg from '@/assets/areas/ebano-verde.png';
import jaraguaImg from '@/assets/areas/jaragua.png';
import bermudezImg from '@/assets/areas/bermudez.png';
import parqueEsteImg from '@/assets/areas/parque-este.png';
import damajaguaImg from '@/assets/areas/damajagua.png';
import cuevasBorbonImg from '@/assets/areas/cuevas-boborn.png';
import parqueCaletaImg from '@/assets/areas/parque-caleta.png';
import manglaresYunaImg from '@/assets/areas/manglares-yuna.png';
import bahorucoImg from '@/assets/areas/bahoruco.png';

// Imágenes del carrusel
import carruselHaitises from '@/assets/carrusel/los-haitises.png';
import carruselEbanoVerde from '@/assets/carrusel/ebano-verde.png';
import carruselJaragua from '@/assets/carrusel/jaragua.png';
import carruselBermudez from '@/assets/carrusel/bermudez.png';
import carruselParqueEste from '@/assets/carrusel/parque-este.png';
import carruselDamajagua from '@/assets/carrusel/damajagua.png';
import carruselCuevasBorbon from '@/assets/carrusel/cuevas-boborn.png';
import carruselParqueCaleta from '@/assets/carrusel/parque-caleta.png';
import carruselManglaresYuna from '@/assets/carrusel/manglares-yuna.png';
import carruselBahoruco from '@/assets/carrusel/bahoruco.png';

const router = useRouter();

const areas = ref<ProtectedArea[]>([]);
const searchQuery = ref('');
const selectedType = ref('');
const selectedArea = ref<ProtectedArea | null>(null);
const hoverCard = ref<number | null>(null);
const currentSlide = ref(0);
const autoPlayInterval = ref<NodeJS.Timeout | null>(null);
const areasSection = ref<HTMLElement | null>(null);
const highlightedArea = ref<number | null>(null);

// Datos del carrusel - AHORA CON IMPORTACIONES DESDE ASSETS
const carouselSlides = ref([
  {
    image: carruselHaitises,
    title: 'Parque Nacional Los Haitises',
    description: 'Un ecosistema diverso con mogotes, manglares y fauna endémica',
    areaId: 1
  },
  {
    image: carruselEbanoVerde,
    title: 'Reserva Científica Ébano Verde',
    description: 'Bosque nublado esencial para la conservación y la investigación',
    areaId: 2
  },
  {
    image: carruselJaragua,
    title: 'Parque Nacional Jaragua',
    description: 'Ecosistemas marinos y terrestres con flamencos y tortugas marinas',
    areaId: 3
  },
  {
    image: carruselBermudez,
    title: 'Parque Nacional Armando Bermúdez',
    description: 'Paisajes montañosos que conducen al Pico Duarte',
    areaId: 4
  },
  {
    image: carruselParqueEste,
    title: 'Parque Nacional del Este',
    description: 'Bosques, playas y una biodiversidad marina de alta importancia',
    areaId: 5
  },
  {
    image: carruselDamajagua,
    title: 'Monumento Natural Saltos de la Damajagua',
    description: 'Cascadas y formaciones rocosas ideales para ecoturismo',
    areaId: 6
  },
  {
    image: carruselCuevasBorbon,
    title: 'Reserva Antropológica Cuevas de Borbón',
    description: 'Arte rupestre taíno y formaciones geológicas únicas',
    areaId: 7
  },
  {
    image: carruselParqueCaleta,
    title: 'Parque Nacional Submarino La Caleta',
    description: 'Ecosistema marino con arrecifes de coral y un pecio histórico',
    areaId: 8
  },
  {
    image: carruselManglaresYuna,
    title: 'Parque Nacional Manglares del Bajo Yuna',
    description: 'Humedal crucial para aves acuáticas y especies marino-costeras',
    areaId: 9
  },
  {
    image: carruselBahoruco,
    title: 'Parque Nacional Sierra de Bahoruco',
    description: 'Hotspot de biodiversidad con ecosistemas variados y especies endémicas',
    areaId: 10
  }
]);

const areaTypes = [
  { value: 'Parque Nacional', label: 'Parque Nacional' },
  { value: 'Reserva Científica', label: 'Reserva Científica' },
  { value: 'Reserva Forestal', label: 'Reserva Forestal' },
  { value: 'Área de Conservación', label: 'Área de Conservación' },
  { value: 'Monumento Natural', label: 'Monumento Natural' },
  { value: 'Refugio de Vida Silvestre', label: 'Refugio de Vida Silvestre' },
  { value: 'Parque Nacional Submarino', label: 'Parque Nacional Submarino' } 
];

const filteredAreas = computed(() => {
  let filtered = areas.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(area => 
      area.nombre.toLowerCase().includes(query) ||
      area.ubicacion.toLowerCase().includes(query) ||
      area.descripcion.toLowerCase().includes(query)
    );
  }

  if (selectedType.value) {
    filtered = filtered.filter(area => area.tipo === selectedType.value);
  }

  return filtered;
});

// Métodos del carrusel
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % carouselSlides.value.length;
};

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 
    ? carouselSlides.value.length - 1 
    : currentSlide.value - 1;
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
};

const startAutoPlay = () => {
  autoPlayInterval.value = setInterval(() => {
    nextSlide();
  }, 5000);
};

const stopAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value);
    autoPlayInterval.value = null;
  }
};

// NUEVO MÉTODO: Explorar área desde el carrusel
const exploreArea = async (areaId: number) => {
  // Primero nos aseguramos de que las áreas estén cargadas
  await nextTick();
  
  // Buscar el área por ID
  const area = areas.value.find(a => a.id === areaId);
  
  if (area) {
    // Hacer scroll a la sección de áreas
    areasSection.value?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
    
    // Resaltar el área específica
    highlightedArea.value = areaId;
    
    // Quitar el resaltado después de 3 segundos
    setTimeout(() => {
      highlightedArea.value = null;
    }, 3000);
    
    // Opcional: Abrir el modal de detalles automáticamente después de un delay
    setTimeout(() => {
      viewAreaDetails(area);
    }, 1000);
  }
};

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
    // DATOS COMPLETOS DE LAS 10 ÁREAS PROTEGIDAS - AHORA CON IMPORTACIONES
    areas.value = [
      {
        id: 1,
        nombre: 'Parque Nacional Los Haitises',
        descripcion: 'Una de las áreas protegidas más importantes y biodiversas de República Dominicana, caracterizada por sus impresionantes mogotes (colinas cársticas), densos bosques de manglares y numerosas cuevas con pictografías taínas. Este parque alberga más de 700 especies de plantas, incluyendo orquídeas endémicas, y es hogar de especies emblemáticas como el solenodón y la jutía. Sus bahías y cayos constituyen un ecosistema único en el Caribe que sirve como refugio para aves migratorias y residentes.',
        latitud: 19.0333,
        longitud: -69.5833,
        imagen: losHaitisesImg, // ← USANDO IMPORT
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
        imagen: ebanoVerdeImg, // ← USANDO IMPORT
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
        latitud: 17.8000,
        longitud: -71.2833,
        imagen: jaraguaImg, // ← USANDO IMPORT
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
        imagen: bermudezImg, // ← USANDO IMPORT
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
        imagen: parqueEsteImg, // ← USANDO IMPORT
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
        latitud: 19.6167,
        longitud: -70.9833,
        imagen: damajaguaImg, // ← USANDO IMPORT
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
        latitud: 18.4833,
        longitud: -69.9167,
        imagen: cuevasBorbonImg, // ← USANDO IMPORT
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
        imagen: parqueCaletaImg, // ← USANDO IMPORT
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
        id: 9, // ← CORREGIDO: Cambiado de 8 a 9
        nombre: 'Parque Nacional Manglares del Bajo Yuna',
        descripcion: 'Este extenso sistema de manglares en la desembocadura del río Yuna constituye uno de los humedales más importantes del Caribe para la conservación de aves acuáticas y especies marino-costeras. Los manglares sirven como criadero natural para peces, crustáceos y moluscos, sustentando las pesquerías locales. El parque protege cuatro tipos de mangle y es un sitio crucial para aves migratorias neotropicales. Durante la temporada de migración, miles de aves utilizan este humedal como área de descanso y alimentación en su ruta entre Norte y Sur América.',
        latitud: 19.2000,
        longitud: -69.5667,
        imagen: manglaresYunaImg, // ← USANDO IMPORT
        ubicacion: 'Bahía de Samaná',
        extension: '110 km²',
        tipo: 'Parque Nacional',
        flora: ['Mangle rojo', 'Mangle negro', 'Mangle blanco', 'Mangle botón', 'Lianas mangleras'],
        fauna: ['Flamencos', 'Garzas', 'Pelícanos', 'Cocodrilos americanos', 'Manatíes', 'Cangrejos azules'],
        actividades: ['Paseos en bote', 'Observación de aves', 'Fotografía de naturaleza', 'Pesca deportiva regulada'],
        clima: 'Tropical húmedo',
        horario: '7:00 AM - 6:00 PM',
        contacto: '(809) 555-0130'
      },
      {
        id: 10,
        nombre: 'Parque Nacional Sierra de Bahoruco',
        descripcion: 'Esta sierra constituye un hotspot de biodiversidad con ecosistemas que van desde bosques secos a nivel del mar hasta bosques nublados en las alturas. El parque protege numerosas especies endémicas de plantas y animales, incluyendo orquídeas únicas y anfibios que no se encuentran en ningún otro lugar del mundo. La variación altitudinal crea microclimas distintos que albergan comunidades biológicas especializadas. La sierra también contiene importantes formaciones geológicas como el Hoyo de Pelempito, un impresionante valle intramontañoso.',
        latitud: 18.1667,
        longitud: -71.5833,
        imagen: bahorucoImg, // ← USANDO IMPORT
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
    ];

    // Iniciar carrusel automático
    startAutoPlay();
  } catch (error) {
    console.error('Error loading protected areas:', error);
  }
});

onUnmounted(() => {
  stopAutoPlay();
});
</script>

<style scoped lang="scss">
/* TODOS LOS ESTILOS SE MANTIENEN IGUAL */
.area-card.highlighted {
  border: 3px solid #1b5e20;
  box-shadow: 0 0 25px rgba(27, 94, 32, 0.5);
  animation: pulseHighlight 2s ease-in-out;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(27, 94, 32, 0.1), transparent);
    z-index: 1;
    border-radius: 16px;
  }
}

@keyframes pulseHighlight {
  0% {
    box-shadow: 0 0 0 0 rgba(27, 94, 32, 0.7);
  }
  50% {
    box-shadow: 0 0 0 15px rgba(27, 94, 32, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(27, 94, 32, 0);
  }
}

.protected-areas {
  padding: 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

// Estilos del carrusel
.hero-carousel {
  position: relative;
  height: 70vh;
  min-height: 500px;
  overflow: hidden;
  background: #000;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    height: 50vh;
    min-height: 400px;
  }
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.carousel-slide {
  position: relative;
  min-width: 100%;
  height: 100%;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    animation: zoomIn 15s linear infinite;
  }
}

.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    rgba(0, 0, 0, 0.6) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-content {
  text-align: center;
  color: white;
  max-width: 800px;
  padding: 2rem;
  animation: fadeInUp 1s ease-out;

  h2 {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
    font-weight: 700;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.7);
    opacity: 0.9;

    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }
}

.carousel-btn {
  background: linear-gradient(135deg, #1b5e20, #2e7d32);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(27, 94, 32, 0.4);

  &:hover {
    background: linear-gradient(135deg, #144017, #1b5e20);
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(27, 94, 32, 0.6);
  }

  &:active {
    transform: translateY(-1px);
  }
}

.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-50%) scale(1.1);
  }

  &.prev {
    left: 2rem;
  }

  &.next {
    right: 2rem;
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;

    &.prev {
      left: 1rem;
    }

    &.next {
      right: 1rem;
    }
  }
}

.carousel-indicators {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  z-index: 10;

  .indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid white;
    background: transparent;
    cursor: pointer;
    transition: all 0.3s ease;
    opacity: 0.7;

    &:hover {
      opacity: 1;
      transform: scale(1.2);
    }

    &.active {
      background: white;
      opacity: 1;
      transform: scale(1.2);
    }
  }

  @media (max-width: 768px) {
    bottom: 1rem;
    
    .indicator {
      width: 10px;
      height: 10px;
    }
  }
}

// Animaciones específicas del carrusel
@keyframes zoomIn {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Ajustes para el contenido existente
.page-header {
  text-align: center;
  margin-bottom: 3rem;
  animation: fadeInDown 0.8s ease-out;
  padding: 0 1rem;

  h1 {
    color: #1b5e20;
    margin-bottom: 1rem;
    font-size: 2.5rem;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  p {
    color: #666;
    font-size: 1.2rem;
    animation: fadeIn 1s ease-out 0.3s both;
  }
}

.search-filters {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1.5rem;
  margin-bottom: 3rem;
  align-items: center;
  animation: slideInUp 0.6s ease-out;
  padding: 0 1rem;

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
    transition: color 0.3s ease;
  }

  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);

    &:focus {
      outline: none;
      border-color: #1b5e20;
      box-shadow: 0 4px 15px rgba(27, 94, 32, 0.2);
      transform: translateY(-2px);
    }

    &:focus + i {
      color: #1b5e20;
    }
  }
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  font-size: 1rem;
  cursor: pointer;
  min-width: 200px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #1b5e20;
    box-shadow: 0 4px 15px rgba(27, 94, 32, 0.2);
    transform: translateY(-2px);
  }
}

.areas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
  animation: fadeIn 0.8s ease-out;
  padding: 0 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.area-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  animation: cardEntrance 0.6s ease-out;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }

  &:nth-child(even) {
    animation-delay: 0.1s;
  }

  &:nth-child(odd) {
    animation-delay: 0.2s;
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
    transition: transform 0.6s ease;
  }

  .area-card:hover & img {
    transform: scale(1.1);
  }

  .area-type {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: rgba(27, 94, 32, 0.95);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    z-index: 2;
    backdrop-filter: blur(10px);
  }

  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(27, 94, 32, 0.3), transparent);
    opacity: 0;
    transition: opacity 0.4s ease;

    &.active {
      opacity: 1;
    }
  }
}

.area-content {
  padding: 1.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, transparent, #1b5e20, transparent);
    transition: left 0.6s ease;
  }

  .area-card:hover &::before {
    left: 100%;
  }

  h3 {
    color: #1b5e20;
    margin-bottom: 0.5rem;
    font-size: 1.3rem;
    transition: color 0.3s ease;
  }

  .area-card:hover & h3 {
    color: #144017;
  }

  .area-location {
    color: #666;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: color 0.3s ease;
  }

  .area-description {
    color: #666;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .area-card:hover & .area-description {
    color: #555;
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
      transition: color 0.3s ease;
    }

    .area-card:hover & span {
      color: #1b5e20;
    }
  }

  .area-actions {
    display: flex;
    gap: 0.5rem;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.4s ease;

    .area-card:hover & {
      opacity: 1;
      transform: translateY(0);
    }

    .btn-primary, .btn-secondary {
      padding: 0.6rem 1.2rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .btn-primary {
      background: linear-gradient(135deg, #1b5e20, #2e7d32);
      color: white;
      flex: 1;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s ease;
      }

      &:hover {
        background: linear-gradient(135deg, #144017, #1b5e20);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(27, 94, 32, 0.3);

        &::before {
          left: 100%;
        }
      }
    }

    .btn-secondary {
      background: linear-gradient(135deg, #e0e0e0, #f5f5f5);
      color: #333;
      width: 45px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: linear-gradient(135deg, #d0d0d0, #e8e8e8);
        transform: translateY(-2px) rotate(5deg);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
    }
  }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
  animation: fadeIn 0.8s ease-out;

  i {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
    animation: bounce 2s infinite;
  }

  h3 {
    margin-bottom: 1rem;
    color: #333;
  }
}

// Animaciones existentes
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cardEntrance {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

// Efectos de carga progresiva
.area-card {
  animation-fill-mode: both;
}

// Responsive improvements
@media (max-width: 768px) {
  .area-card {
    margin: 0 1rem;
    
    &:hover {
      transform: translateY(-5px) scale(1.01);
    }
  }
  
  .area-actions {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
}
</style>