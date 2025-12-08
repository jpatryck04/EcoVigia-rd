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
import { useAreasStore } from '@/stores/areas'; // <-- IMPORTAR STORE
import AreaDetailsModal from '@/components/AreaDetailsModal.vue';
import type { ProtectedArea } from '@/types';

const router = useRouter();
const areasStore = useAreasStore(); // <-- USAR STORE

// Usar áreas desde el store en lugar de datos fijos
const areas = computed(() => areasStore.areas); // <-- CAMBIAR ESTO

const searchQuery = ref('');
const selectedType = ref('');
const selectedArea = ref<ProtectedArea | null>(null);
const hoverCard = ref<number | null>(null);
const currentSlide = ref(0);
const autoPlayInterval = ref<number | null>(null);
const areasSection = ref<HTMLElement | null>(null);
const highlightedArea = ref<number | null>(null);

const areaTypes = [
  { value: 'Parque Nacional', label: 'Parque Nacional' },
  { value: 'Reserva Científica', label: 'Reserva Científica' },
  { value: 'Reserva Forestal', label: 'Reserva Forestal' },
  { value: 'Área de Conservación', label: 'Área de Conservación' },
  { value: 'Monumento Natural', label: 'Monumento Natural' },
  { value: 'Refugio de Vida Silvestre', label: 'Refugio de Vida Silvestre' },
  { value: 'Parque Nacional Submarino', label: 'Parque Nacional Submarino' } 
];

// Carrusel dinámico basado en las áreas existentes
const carouselSlides = computed(() => {
  return areasStore.areas.slice(0, 10).map(area => ({
    image: area.imagen,
    title: area.nombre,
    description: area.descripcion.substring(0, 100) + '...',
    areaId: area.id
  }));
});

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
    // Las áreas ya están cargadas desde el store
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