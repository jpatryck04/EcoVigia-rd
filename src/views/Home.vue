<template>
  <div class="home">
    <!-- Hero Section con Parallax -->
    <section class="hero-section">
      <div class="hero-background" :style="parallaxStyle"></div>
      <div class="hero-content">
        <div class="container">
          <div class="hero-text">
            <h1 class="hero-title">
              <span class="title-line">Protegiendo Nuestra</span>
              <span class="title-line accent">Herencia Natural</span>
            </h1>
            <p class="hero-description">
              Únete al Ministerio de Medio Ambiente en la conservación 
              de los recursos naturales de República Dominicana
            </p>
            <div class="hero-actions">
              <button class="btn-primary" @click="scrollToFeatures">
                <i class="fas fa-leaf"></i>
                Explorar Acciones
              </button>
              <router-link to="/voluntariado" class="btn-secondary">
                <i class="fas fa-hands-helping"></i>
                Ser Voluntario
              </router-link>
            </div>
          </div>
          
          <!-- Stats Cards -->
          <div class="hero-stats">
            <div class="stat-card" v-for="stat in stats" :key="stat.id">
              <div class="stat-icon">
                <i :class="stat.icon"></i>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Scroll Indicator -->
      <div class="scroll-indicator" @click="scrollToFeatures">
        <div class="scroll-arrow"></div>
      </div>
    </section>

    <!-- Features Grid -->
    <section ref="featuresSection" class="features-section">
      <div class="container">
        <div class="section-header">
          <h2>Nuestras Áreas de Acción</h2>
          <p>Descubre cómo trabajamos para proteger el medio ambiente</p>
        </div>
        
        <div class="features-grid">
          <div v-for="feature in features" :key="feature.id" 
               class="feature-card" @click="navigateTo(feature.route)">
                <div class="feature-icon">
              <i :class="feature.icon"></i>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
            <div class="feature-actions">
              <span class="feature-link">
                Explorar
                <i class="fas fa-arrow-right"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Interactive Map Preview -->
    <section class="map-preview-section">
      <div class="container">
        <div class="section-header">
          <h2>Explora Nuestras Áreas Protegidas</h2>
          <p>Descubre los tesoros naturales de República Dominicana</p>
        </div>
        
        <div class="map-preview">
          <div class="map-container">
            <!-- Mapa simplificado para evitar errores -->
            <div class="map-placeholder">
              <i class="fas fa-map-marked-alt"></i>
              <p>Mapa interactivo de áreas protegidas</p>
              <router-link to="/mapa-areas" class="btn-primary">
                Ver Mapa Completo
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- News Carousel -->
    <section class="news-section">
      <div class="container">
        <div class="section-header">
          <h2>Últimas Noticias Ambientales</h2>
          <p>Mantente informado sobre las últimas novedades</p>
        </div>
        
        <div class="news-grid">
          <div v-for="news in newsItems" :key="news.id" class="news-card">
            <div class="news-image">
              <img :src="news.imagen" :alt="news.titulo" />
              <div class="news-category">{{ news.categoria }}</div>
            </div>
            <div class="news-content">
              <h3>{{ news.titulo }}</h3>
              <p>{{ news.contenido }}</p>
              <div class="news-meta">
                <span class="news-date">
                  <i class="fas fa-calendar"></i>
                  {{ formatDate(news.fecha) }}
                </span>
              </div>
              <button class="read-more-btn" @click="viewNews(news)">
                Leer Más
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Emergency Report Section -->
    <section class="emergency-section">
      <div class="container">
        <div class="emergency-card">
          <div class="emergency-content">
            <h2>¿Viste un daño ambiental?</h2>
            <p>Reporta situaciones que afecten nuestro medio ambiente</p>
            <router-link to="/reportar-dano" class="btn-emergency">
              <i class="fas fa-exclamation-triangle"></i>
              Reportar Ahora
            </router-link>
          </div>
          <div class="emergency-image">
          <img :src="emergencyReport" alt="Reportar Daño" />          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { formatDate } from '@/utils';
import type { News, ProtectedArea } from '@/types';
import emergencyReport from '@/assets/images/emergency-report.png'


const router = useRouter();
const featuresSection = ref<HTMLElement>();
const parallaxOffset = ref(0);

// Datos de ejemplo (reemplazar con API real)
const stats = ref([
  { id: 1, icon: 'fas fa-tree', value: 128, label: 'Áreas Protegidas' },
  { id: 2, icon: 'fas fa-leaf', value: 2500, label: 'Especies Protegidas' },
  { id: 3, icon: 'fas fa-users', value: 15000, label: 'Voluntarios Activos' },
  { id: 4, icon: 'fas fa-recycle', value: 85, label: 'Proyectos Activos' }
]);

const features = ref([
  {
    id: 1,
    icon: 'fas fa-tree',
    title: 'Áreas Protegidas',
    description: 'Descubre nuestros parques nacionales y reservas naturales',
    route: '/areas-protegidas'
  },
  {
    id: 2,
    icon: 'fas fa-graduation-cap',
    title: 'Educación Ambiental',
    description: 'Programas de concienciación y formación ambiental',
    route: '/videos'
  },
  {
    id: 3,
    icon: 'fas fa-hands-helping',
    title: 'Voluntariado',
    description: 'Únete a nuestras iniciativas de conservación',
    route: '/voluntariado'
  },
  {
    id: 4,
    icon: 'fas fa-book',
    title: 'Normativas',
    description: 'Conoce las leyes y regulaciones ambientales',
    route: '/normativas'
  }
]);

const featuredAreas = ref<ProtectedArea[]>([]);
const newsItems = ref<News[]>([
    {
    id: 1,
    titulo: 'Ministerio de Medio Ambiente lanza programa de reforestación nacional',
    contenido: 'El Ministerio de Medio Ambiente y Recursos Naturales inició un ambicioso programa de reforestación que busca plantar más de 5 millones de árboles en las principales cuencas hidrográficas del país. El proyecto involucra a comunidades locales y organizaciones ambientalistas. Esta iniciativa forma parte del plan "Quisqueya Verde" que busca recuperar las áreas degradadas y promover la conservación de la biodiversidad dominicana.\n\nEl programa incluye la creación de viveros comunitarios, capacitación en técnicas de reforestación y monitoreo continuo de las áreas intervenidas. Se espera que este esfuerzo contribuya significativamente a la mitigación del cambio climático y a la protección de nuestras fuentes de agua.',
    imagen: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800',
    fecha: new Date('2024-01-15').toISOString(),
    autor: 'Ministerio de Medio Ambiente',
    categoria: 'Reforestación',
    vistas: 1250,
    likes: 89
  },
  {
    id: 2,
    titulo: 'RD fortalece protección de especies marinas en peligro',
    contenido: 'Nuevas medidas de conservación para proteger a las tortugas marinas y manatíes en las costas dominicanas. Se establecen zonas de protección especial y programas de monitoreo continuo en las principales playas de anidación.\n\nEl programa incluye la vigilancia de playas durante la temporada de desove, protección de nidos y educación a comunidades costeras. También se han establecido alianzas con organizaciones internacionales para el rescate y rehabilitación de especies marinas en peligro.',
    imagen: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    fecha: new Date('2024-01-12').toISOString(),
    autor: 'Departamento de Vida Silvestre',
    categoria: 'Conservación Marina',
    vistas: 890,
    likes: 67
  },
  {
    id: 3,
    titulo: 'Iniciativa de reciclaje logra recolectar 50 toneladas de plástico',
    contenido: 'El programa "RD Limpia" supera expectativas en su primer trimestre, promoviendo la economía circular y reduciendo la contaminación por plásticos. La iniciativa ha involucrado a más de 100 comunidades en todo el país.\n\nLos materiales recolectados son procesados en centros de acopio y transformados en nuevos productos, creando oportunidades de empleo verde y reduciendo la presión sobre los vertederos. El programa también incluye campañas educativas sobre separación de residuos y reciclaje.',
    imagen: 'https://images.unsplash.com/photo-1585516514286-2d6c153200de?w=800',
    fecha: new Date('2024-01-10').toISOString(),
    autor: 'Dirección de Residuos Sólidos',
    categoria: 'Reciclaje',
    vistas: 756,
    likes: 45
  }
]);
  

const parallaxStyle = computed(() => ({
  transform: `translateY(${parallaxOffset.value * 0.5}px)`
}));

// Métodos
const scrollToFeatures = () => {
  featuresSection.value?.scrollIntoView({ behavior: 'smooth' });
};

const navigateTo = (route: string) => {
  router.push(route);
};

const viewNews = (news: News) => {
  // Navegar a detalle de noticia
  console.log('View news:', news);
};

const handleScroll = () => {
  parallaxOffset.value = window.scrollY;
};

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped lang="scss">
.home {
  min-height: 100vh;
}

.hero-section {
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .hero-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #1b5e20 0%, #4caf50 100%);
    background-size: cover;
    background-position: center;
    transition: transform 0.1s ease;
  }
  
  .hero-content {
    position: relative;
    z-index: 2;
    color: white;
    text-align: center;
    
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3rem;
    }
  }
  
  .hero-text {
    max-width: 800px;
    
    .hero-title {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 700;
      margin-bottom: 1.5rem;
      line-height: 1.1;
      
      .title-line {
        display: block;
        
        &.accent {
          background: linear-gradient(135deg, #a5d6a7, #e8f5e8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      }
    }
    
    .hero-description {
      font-size: 1.3rem;
      margin-bottom: 2.5rem;
      opacity: 0.9;
      line-height: 1.6;
    }
  }
  
  .hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    
    .btn-primary, .btn-secondary {
      padding: 1rem 2rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      cursor: pointer;
    }
    
    .btn-primary {
      background: white;
      color: #1b5e20;
      border-color: white;
      
      &:hover {
        background: transparent;
        color: white;
      }
    }
    
    .btn-secondary {
      background: transparent;
      color: white;
      border-color: white;
      
      &:hover {
        background: white;
        color: #1b5e20;
      }
    }
  }
  
  .hero-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    width: 100%;
    max-width: 800px;
    
    .stat-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 2rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      
      .stat-icon {
        font-size: 2.5rem;
        opacity: 0.8;
      }
      
      .stat-content {
        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }
      }
    }
  }
  
  .scroll-indicator {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    cursor: pointer;
    
    .scroll-arrow {
      width: 30px;
      height: 30px;
      border-right: 3px solid white;
      border-bottom: 3px solid white;
      transform: rotate(45deg);
      animation: bounce 2s infinite;
    }
  }
}

.features-section {
  padding: 6rem 0;
  background: white;
  
  .section-header {
    text-align: center;
    margin-bottom: 4rem;
    
    h2 {
      font-size: 2.5rem;
      color: #1b5e20;
      margin-bottom: 1rem;
    }
    
    p {
      font-size: 1.2rem;
      color: #666;
    }
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    
    .feature-card {
      background: white;
      padding: 2.5rem 2rem;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 1px solid #f0f0f0;
      opacity: 1;
      transform: translateY(0);
      
      &:hover {
        transform: translateY(-10px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        
        .feature-icon {
          transform: scale(1.1);
          background: linear-gradient(135deg, #1b5e20, #4caf50);
        }
        
        .feature-link {
          color: #1b5e20;
          transform: translateX(5px);
        }
      }
      
      .feature-icon {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #4caf50, #81c784);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem;
        font-size: 2rem;
        color: white;
        transition: all 0.3s ease;
      }
      
      h3 {
        color: #1b5e20;
        margin-bottom: 1rem;
        font-size: 1.5rem;
      }
      
      p {
        color: #666;
        line-height: 1.6;
        margin-bottom: 1.5rem;
      }
      
      .feature-actions {
        .feature-link {
          color: #4caf50;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }
      }
    }
  }
}

.map-preview-section {
  padding: 4rem 0;
  background: #f8f9fa;
  
  .map-placeholder {
    background: white;
    border-radius: 12px;
    padding: 4rem 2rem;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    
    i {
      font-size: 4rem;
      color: #4caf50;
      margin-bottom: 1rem;
    }
    
    p {
      color: #666;
      margin-bottom: 2rem;
      font-size: 1.1rem;
    }
  }
}

.news-section {
  padding: 4rem 0;
  
  .news-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }
  
  .news-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
    }
    
    .news-image {
      position: relative;
      height: 200px;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .news-category {
        position: absolute;
        top: 1rem;
        left: 1rem;
        background: #1b5e20;
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
      }
    }
    
    .news-content {
      padding: 1.5rem;
      
      h3 {
        color: #1b5e20;
        margin-bottom: 1rem;
        font-size: 1.2rem;
      }
      
      p {
        color: #666;
        line-height: 1.5;
        margin-bottom: 1rem;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .news-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        font-size: 0.9rem;
        color: #999;
      }
      
      .read-more-btn {
        background: #1b5e20;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.3s ease;
        
        &:hover {
          background: #144017;
        }
      }
    }
  }
}

.emergency-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  
  .emergency-card {
    background: white;
    border-radius: 16px;
    padding: 3rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
  
  .emergency-content {
    h2 {
      color: #d84315;
      margin-bottom: 1rem;
      font-size: 2rem;
    }
    
    p {
      color: #666;
      margin-bottom: 2rem;
      font-size: 1.1rem;
    }
    
    .btn-emergency {
      background: #d84315;
      color: white;
      padding: 1rem 2rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: background 0.3s ease;
      
      &:hover {
        background: #bf360c;
      }
    }
  }
  
  .emergency-image {
    text-align: center;
    
    img {
      max-width: 100%;
      height: auto;
    }
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) rotate(45deg);
  }
  40% {
    transform: translateY(-10px) rotate(45deg);
  }
  60% {
    transform: translateY(-5px) rotate(45deg);
  }
}

@media (max-width: 768px) {
  .hero-section {
    height: auto;
    min-height: 100vh;
    padding: 2rem 0;
    
    .hero-stats {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .hero-actions {
      flex-direction: column;
      align-items: center;
    }
  }
  
  .features-grid {
    grid-template-columns: 1fr !important;
  }
  
  .emergency-card {
    grid-template-columns: 1fr !important;
    text-align: center;
  }
  
  .news-grid {
    grid-template-columns: 1fr !important;
  }
}

.feature-card {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
  
  &.animate-in {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Si quieres animación automática al hacer scroll */
.feature-card {
  animation: fadeInUp 0.6s ease forwards;
  animation-delay: calc(var(--index, 0) * 0.1s);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>