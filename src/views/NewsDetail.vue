<template>
  <div class="news-detail">
    <div class="container">
      <!-- Botón volver -->
      <button class="back-btn" @click="$router.back()">
        <i class="fas fa-arrow-left"></i>
        Volver a Noticias
      </button>

      <!-- Contenido de la noticia -->
      <article v-if="newsItem" class="news-article">
        <header class="article-header">
          <div class="article-meta">
            <span class="category">{{ newsItem.categoria }}</span>
            <span class="date">{{ formatDate(newsItem.fecha) }}</span>
          </div>
          <h1>{{ newsItem.titulo }}</h1>
          <div class="author-info">
            <i class="fas fa-user"></i>
            <span>Por: {{ newsItem.autor }}</span>
          </div>
        </header>

        <div class="article-image">
          <img 
            :src="newsItem.imagen || newsPlaceholder" 
            :alt="newsItem.titulo"
            @error="handleImageError"
          />
        </div>

        <div class="article-content">
          <p>{{ newsItem.contenido }}</p>
        </div>

        <footer class="article-footer">
          <div class="article-stats">
            <span class="views">
              <i class="fas fa-eye"></i>
              {{ newsItem.vistas }} vistas
            </span>
            <span class="likes">
              <i class="fas fa-heart"></i>
              {{ newsItem.likes }} me gusta
            </span>
          </div>
        </footer>
      </article>

      <!-- Loading -->
      <div v-else-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Cargando noticia...</p>
      </div>

      <!-- Not found -->
      <div v-else class="not-found">
        <i class="fas fa-exclamation-circle"></i>
        <h3>Noticia no encontrada</h3>
        <p>La noticia que buscas no existe o ha sido removida.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { medioAmbienteAPI } from '@/services/api';
import { formatDate } from '@/utils';
import type { News } from '@/types';
import newsPlaceholder from '@/assets/images/news-placeholder.jpg';


const route = useRoute();
const newsItem = ref<News | null>(null);
const loading = ref(true);

// Datos de ejemplo para desarrollo
const sampleNews: News[] = [
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
];

const loadNewsDetail = async () => {
  try {
    const newsId = parseInt(route.params.id as string);
    
    // Intentar cargar desde la API
    // const response = await medioAmbienteAPI.getNoticiaById(newsId);
    // newsItem.value = response.data;
    
    // Por ahora usar datos de ejemplo
    const foundNews = sampleNews.find(news => news.id === newsId);
    
    if (foundNews) {
      newsItem.value = foundNews;
    } else {
      // Si no se encuentra, usar el primer elemento como fallback
      newsItem.value = sampleNews[0];
    }
    
  } catch (error) {
    console.error('Error loading news detail:', error);
    
    // Fallback a datos de ejemplo
    const newsId = parseInt(route.params.id as string);
    const foundNews = sampleNews.find(news => news.id === newsId) || sampleNews[0];
    newsItem.value = foundNews;
  } finally {
    loading.value = false;
  }
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = newsPlaceholder;
};

onMounted(() => {
  loadNewsDetail();
});
</script>

<style scoped lang="scss">
.news-detail {
  padding: 2rem 0;
  background: #f8f9fa;
  min-height: 100vh;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 2px solid #1b5e20;
  color: #1b5e20;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 2rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: #1b5e20;
    color: white;
  }
}

.news-article {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.article-header {
  padding: 3rem 3rem 1rem;

  .article-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;

    .category {
      background: #1b5e20;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .date {
      color: #666;
      display: flex;
      align-items: center;
    }
  }

  h1 {
    color: #1b5e20;
    font-size: 2.5rem;
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  .author-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #666;

    i {
      color: #1b5e20;
    }
  }
}

.article-image {
  height: 400px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.article-content {
  padding: 2rem 3rem;
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;

  p {
    margin-bottom: 1.5rem;
    white-space: pre-line; /* Para respetar los saltos de línea */
  }
}

.article-footer {
  padding: 1.5rem 3rem;
  border-top: 1px solid #e0e0e0;
  background: #f8f9fa;

  .article-stats {
    display: flex;
    gap: 2rem;
    color: #666;

    span {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    i {
      color: #1b5e20;
    }
  }
}

.loading, .not-found {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1b5e20;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.not-found {
  i {
    font-size: 4rem;
    color: #ff9800;
    margin-bottom: 1rem;
  }

  h3 {
    color: #333;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .article-header {
    padding: 2rem 1.5rem 1rem;

    h1 {
      font-size: 2rem;
    }
  }

  .article-content {
    padding: 1.5rem;
    font-size: 1rem;
  }

  .article-footer {
    padding: 1.5rem;
  }
}
</style>