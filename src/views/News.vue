<template>
  <div class="news-page">
    <div class="container">
      <div class="page-header">
        <h1>Noticias Ambientales</h1>
        <p>Mantente informado sobre las últimas novedades ambientales en RD</p>
      </div>

      <!-- Filtros -->
      <div class="news-filters">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Buscar noticias..." 
          />
        </div>
        <select v-model="selectedCategory" class="category-filter">
          <option value="">Todas las categorías</option>
          <option v-for="category in categories" :key="category">
            {{ category }}
          </option>
        </select>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando noticias...</p>
      </div>

      <!-- Grid de Noticias -->
      <div v-else class="news-grid">
        <article 
          v-for="news in filteredNews" 
          :key="news.id"
          class="news-card"
          @click="viewNewsDetail(news)"
        >
          <div class="news-image">
            <img 
              :src="news.imagen || '/images/news-placeholder.jpg'" 
              :alt="news.titulo"
              @error="handleImageError"
            />
            <div class="news-category">{{ news.categoria }}</div>
          </div>
          <div class="news-content">
            <h3>{{ news.titulo }}</h3>
            <p class="news-excerpt">{{ truncateText(news.contenido, 150) }}</p>
            <div class="news-meta">
              <div class="meta-left">
                <span class="news-date">
                  <i class="fas fa-calendar"></i>
                  {{ formatDate(news.fecha) }}
                </span>
                <span class="news-author">
                  <i class="fas fa-user"></i>
                  {{ news.autor }}
                </span>
              </div>
              <div class="meta-right">
                <span class="news-views">
                  <i class="fas fa-eye"></i>
                  {{ news.vistas }}
                </span>
                <span class="news-likes">
                  <i class="fas fa-heart"></i>
                  {{ news.likes }}
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredNews.length === 0" class="empty-state">
        <i class="fas fa-newspaper"></i>
        <h3>No se encontraron noticias</h3>
        <p>Intenta con otros términos de búsqueda</p>
      </div>

      <!-- Load More -->
      <div v-if="hasMoreNews && !loading" class="load-more">
        <button @click="loadMoreNews" class="btn-primary">
          Cargar Más Noticias
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { medioAmbienteAPI } from '@/services/api';
import { formatDate, truncateText } from '@/utils';
import type { News } from '@/types';

const router = useRouter();

const news = ref<News[]>([]);
const loading = ref(true);
const searchQuery = ref('');
const selectedCategory = ref('');
const currentPage = ref(1);
const hasMoreNews = ref(true);

// Categorías únicas para el filtro
const categories = computed(() => {
  const uniqueCategories = new Set(news.value.map(item => item.categoria));
  return Array.from(uniqueCategories);
});

// Noticias filtradas
const filteredNews = computed(() => {
  let filtered = news.value;

  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(item => 
      item.titulo.toLowerCase().includes(query) ||
      item.contenido.toLowerCase().includes(query) ||
      item.autor.toLowerCase().includes(query)
    );
  }

  // Filtrar por categoría
  if (selectedCategory.value) {
    filtered = filtered.filter(item => item.categoria === selectedCategory.value);
  }

  return filtered;
});

const loadNews = async (page: number = 1) => {
  try {
    loading.value = true;
    const response = await medioAmbienteAPI.getNoticias();
    
    if (response.data && Array.isArray(response.data)) {
      if (page === 1) {
        news.value = response.data;
      } else {
        news.value = [...news.value, ...response.data];
      }
      
      // Simular paginación (la API podría no tener paginación)
      hasMoreNews.value = response.data.length === 10; // Asumiendo 10 por página
    }
  } catch (error) {
    console.error('Error loading news:', error);
    // Datos de ejemplo en caso de error
    news.value = getSampleNews();
  } finally {
    loading.value = false;
  }
};

const loadMoreNews = () => {
  currentPage.value++;
  loadNews(currentPage.value);
};

const viewNewsDetail = (newsItem: News) => {
  router.push({
    name: 'NewsDetail',
    params: { id: newsItem.id.toString() },
    query: { 
      title: encodeURIComponent(newsItem.titulo),
      category: encodeURIComponent(newsItem.categoria)
    }
  });
};




const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = '/images/news-placeholder.jpg';
};

// Datos de ejemplo para desarrollo
const getSampleNews = (): News[] => {
  return [
    {
      id: 1,
      titulo: 'Ministerio de Medio Ambiente lanza programa de reforestación nacional',
      contenido: 'El Ministerio de Medio Ambiente y Recursos Naturales inició un ambicioso programa de reforestación que busca plantar más de 5 millones de árboles en las principales cuencas hidrográficas del país. El proyecto involucra a comunidades locales y organizaciones ambientalistas.',
      imagen: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600',
      fecha: new Date('2024-01-15').toISOString(),
      autor: 'Ministerio de Medio Ambiente',
      categoria: 'Reforestación',
      vistas: 1250,
      likes: 89
    },
    {
      id: 2,
      titulo: 'RD fortalece protección de especies marinas en peligro',
      contenido: 'Nuevas medidas de conservación para proteger a las tortugas marinas y manatíes en las costas dominicanas. Se establecen zonas de protección especial y programas de monitoreo.',
      imagen: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600',
      fecha: new Date('2024-01-12').toISOString(),
      autor: 'Departamento de Vida Silvestre',
      categoria: 'Conservación Marina',
      vistas: 890,
      likes: 67
    },
    {
      id: 3,
      titulo: 'Iniciativa de reciclaje logra recolectar 50 toneladas de plástico',
      contenido: 'El programa "RD Limpia" supera expectativas en su primer trimestre, promoviendo la economía circular y reduciendo la contaminación por plásticos.',
      imagen: 'https://images.unsplash.com/photo-1585516514286-2d6c153200de?w=600',
      fecha: new Date('2024-01-10').toISOString(),
      autor: 'Dirección de Residuos Sólidos',
      categoria: 'Reciclaje',
      vistas: 756,
      likes: 45
    }
  ];
};

onMounted(() => {
  loadNews();
});
</script>

<style scoped lang="scss">
.news-page {
  padding: 2rem 0;
  background: #f8f9fa;
  min-height: 100vh;
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

.news-filters {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1.5rem;
  margin-bottom: 2rem;
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

.category-filter {
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

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #1b5e20;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  p {
    color: #666;
  }
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.news-card {
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

.news-image {
  position: relative;
  height: 250px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .news-card:hover & img {
    transform: scale(1.05);
  }

  .news-category {
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

.news-content {
  padding: 1.5rem;

  h3 {
    color: #1b5e20;
    margin-bottom: 1rem;
    font-size: 1.3rem;
    line-height: 1.4;
  }

  .news-excerpt {
    color: #666;
    line-height: 1.5;
    margin-bottom: 1.5rem;
  }
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #999;

  .meta-left, .meta-right {
    display: flex;
    gap: 1rem;
  }

  span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  i {
    width: 14px;
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

.load-more {
  text-align: center;
  margin-top: 2rem;

  .btn-primary {
    background: #1b5e20;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;

    &:hover {
      background: #144017;
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .news-grid {
    grid-template-columns: 1fr;
  }

  .news-meta {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>