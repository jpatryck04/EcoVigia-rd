<template>
  <div class="admin-news">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Gestión de Noticias</h1>
          <p>Administra las noticias ambientales publicadas en la plataforma</p>
        </div>
        <div class="header-actions">
          <button class="btn-back" @click="$router.push('/admin')">
            <i class="fas fa-arrow-left"></i>
            Volver al Dashboard
          </button>
          <button class="btn-primary" @click="showCreateModal = true">
            <i class="fas fa-plus"></i>
            Nueva Noticia
          </button>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon total">
            <i class="fas fa-newspaper"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.totalNews }}</div>
            <div class="stat-label">Noticias Totales</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon published">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.publishedNews }}</div>
            <div class="stat-label">Publicadas</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon draft">
            <i class="fas fa-edit"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.draftNews }}</div>
            <div class="stat-label">Borradores</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon views">
            <i class="fas fa-eye"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.totalViews }}</div>
            <div class="stat-label">Vistas Totales</div>
          </div>
        </div>
      </div>

      <!-- Filtros y Búsqueda -->
      <div class="filters-section">
        <div class="filters-row">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input 
              v-model="filters.search"
              type="text" 
              placeholder="Buscar noticias..." 
              @input="applyFilters"
            >
          </div>

          <div class="filter-group">
            <select v-model="filters.estado" @change="applyFilters">
              <option value="">Todos los estados</option>
              <option value="publicada">Publicada</option>
              <option value="borrador">Borrador</option>
              <option value="programada">Programada</option>
            </select>
          </div>

          <div class="filter-group">
            <select v-model="filters.categoria" @change="applyFilters">
              <option value="">Todas las categorías</option>
              <option value="Reforestación">Reforestación</option>
              <option value="Conservación Marina">Conservación Marina</option>
              <option value="Reciclaje">Reciclaje</option>
              <option value="Educación Ambiental">Educación Ambiental</option>
              <option value="Normativas">Normativas</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando noticias...</p>
      </div>

      <!-- Lista de Noticias -->
      <div v-else class="news-grid">
        <div 
          v-for="news in filteredNews" 
          :key="news.id"
          class="news-card"
          :class="{ draft: news.estado === 'borrador' }"
        >
          <div class="news-image">
            <img 
              :src="news.imagen || '/images/news-placeholder.jpg'" 
              :alt="news.titulo"
              @error="handleImageError"
            />
            <div class="news-status" :class="news.estado">
              {{ getStatusText(news.estado) }}
            </div>
          </div>

          <div class="news-content">
            <div class="news-header">
              <h3>{{ news.titulo }}</h3>
              <div class="news-meta">
                <span class="category">{{ news.categoria }}</span>
                <span class="date">{{ formatDate(news.fecha) }}</span>
              </div>
            </div>

            <p class="news-excerpt">{{ truncateText(news.contenido, 120) }}</p>

            <div class="news-stats">
              <div class="stat">
                <i class="fas fa-eye"></i>
                <span>{{ news.vistas }} vistas</span>
              </div>
              <div class="stat">
                <i class="fas fa-heart"></i>
                <span>{{ news.likes }} me gusta</span>
              </div>
              <div class="stat">
                <i class="fas fa-user"></i>
                <span>{{ news.autor }}</span>
              </div>
            </div>

            <div class="news-actions">
              <button 
                class="btn-action edit" 
                @click="editNews(news)"
                :title="news.estado === 'borrador' ? 'Editar borrador' : 'Editar noticia'"
              >
                <i class="fas fa-edit"></i>
                {{ news.estado === 'borrador' ? 'Editar' : 'Editar' }}
              </button>

              <button 
                v-if="news.estado === 'borrador'"
                class="btn-action publish" 
                @click="publishNews(news)"
                title="Publicar noticia"
              >
                <i class="fas fa-paper-plane"></i>
                Publicar
              </button>

              <button 
                v-else-if="news.estado === 'publicada'"
                class="btn-action unpublish" 
                @click="unpublishNews(news)"
                title="Despublicar noticia"
              >
                <i class="fas fa-eye-slash"></i>
                Ocultar
              </button>

              <button 
                class="btn-action delete" 
                @click="deleteNews(news)"
                title="Eliminar noticia"
              >
                <i class="fas fa-trash"></i>
                Eliminar
              </button>

              <button 
                class="btn-action preview" 
                @click="previewNews(news)"
                title="Vista previa"
              >
                <i class="fas fa-eye"></i>
                Vista Previa
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredNews.length === 0" class="empty-state">
        <i class="fas fa-newspaper"></i>
        <h3>No se encontraron noticias</h3>
        <p v-if="hasActiveFilters">Intenta ajustar los filtros de búsqueda</p>
        <p v-else>No hay noticias publicadas aún</p>
        <button class="btn-primary" @click="showCreateModal = true">
          <i class="fas fa-plus"></i>
          Crear Primera Noticia
        </button>
      </div>

      <!-- Modal Crear/Editar Noticia -->
      <NewsModal 
        v-if="showCreateModal || editingNews"
        :news="editingNews"
        :mode="editingNews ? 'edit' : 'create'"
        @close="closeModal"
        @save="handleSaveNews"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { formatDate, truncateText } from '@/utils';
import type { News } from '@/types';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(true);
const showCreateModal = ref(false);
const editingNews = ref<News | null>(null);

const stats = ref({
  totalNews: 0,
  publishedNews: 0,
  draftNews: 0,
  totalViews: 0
});

const news = ref<News[]>([]);

const filters = ref({
  search: '',
  estado: '',
  categoria: ''
});

// Noticias filtradas
const filteredNews = computed(() => {
  let filtered = news.value;

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    filtered = filtered.filter(n => 
      n.titulo.toLowerCase().includes(search) ||
      n.contenido.toLowerCase().includes(search) ||
      n.autor.toLowerCase().includes(search)
    );
  }

  if (filters.value.estado) {
    filtered = filtered.filter(n => n.estado === filters.value.estado);
  }

  if (filters.value.categoria) {
    filtered = filtered.filter(n => n.categoria === filters.value.categoria);
  }

  return filtered;
});

const hasActiveFilters = computed(() => {
  return filters.value.search || filters.value.estado || filters.value.categoria;
});

const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    publicada: 'Publicada',
    borrador: 'Borrador',
    programada: 'Programada'
  };
  return statusMap[status] || status;
};

const applyFilters = () => {
  // Los filtros se aplican automáticamente mediante computed
};

const loadNews = async () => {
  try {
    loading.value = true;
    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    news.value = [
      {
        id: 1,
        titulo: 'Ministerio lanza programa de reforestación nacional',
        contenido: 'El Ministerio de Medio Ambiente y Recursos Naturales inició un ambicioso programa de reforestación que busca plantar más de 5 millones de árboles en las principales cuencas hidrográficas del país. El proyecto involucra a comunidades locales y organizaciones ambientalistas.',
        imagen: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600',
        fecha: new Date().toISOString(),
        autor: 'Ministerio de Medio Ambiente',
        categoria: 'Reforestación',
        vistas: 1250,
        likes: 89,
        estado: 'publicada'
      },
      {
        id: 2,
        titulo: 'RD fortalece protección de especies marinas en peligro',
        contenido: 'Nuevas medidas de conservación para proteger a las tortugas marinas y manatíes en las costas dominicanas. Se establecen zonas de protección especial y programas de monitoreo continuo.',
        imagen: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600',
        fecha: new Date(Date.now() - 86400000).toISOString(),
        autor: 'Departamento de Vida Silvestre',
        categoria: 'Conservación Marina',
        vistas: 890,
        likes: 67,
        estado: 'publicada'
      },
      {
        id: 3,
        titulo: 'Nueva normativa para el manejo de residuos electrónicos',
        contenido: 'Se establecen nuevos protocolos para el manejo y disposición final de residuos electrónicos en todo el territorio nacional. Las empresas deberán cumplir con los nuevos estándares ambientales.',
        imagen: '',
        fecha: new Date(Date.now() - 172800000).toISOString(),
        autor: 'Dirección de Normativas',
        categoria: 'Normativas',
        vistas: 0,
        likes: 0,
        estado: 'borrador'
      }
    ];

    // Calcular estadísticas
    stats.value = {
      totalNews: news.value.length,
      publishedNews: news.value.filter(n => n.estado === 'publicada').length,
      draftNews: news.value.filter(n => n.estado === 'borrador').length,
      totalViews: news.value.reduce((sum, n) => sum + n.vistas, 0)
    };
  } catch (error) {
    console.error('Error loading news:', error);
  } finally {
    loading.value = false;
  }
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = '/images/news-placeholder.jpg';
};

const editNews = (newsItem: News) => {
  editingNews.value = { ...newsItem };
};

const publishNews = (newsItem: News) => {
  if (confirm('¿Estás seguro de que quieres publicar esta noticia?')) {
    newsItem.estado = 'publicada';
    newsItem.fecha = new Date().toISOString();
    // Aquí iría la llamada a la API
  }
};

const unpublishNews = (newsItem: News) => {
  if (confirm('¿Estás seguro de que quieres ocultar esta noticia?')) {
    newsItem.estado = 'borrador';
    // Aquí iría la llamada a la API
  }
};

const deleteNews = (newsItem: News) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta noticia? Esta acción no se puede deshacer.')) {
    news.value = news.value.filter(n => n.id !== newsItem.id);
    // Aquí iría la llamada a la API
  }
};

const previewNews = (newsItem: News) => {
  // Abrir vista previa en nueva pestaña o modal
  console.log('Preview news:', newsItem);
};

const closeModal = () => {
  showCreateModal.value = false;
  editingNews.value = null;
};

const handleSaveNews = (newsData: any) => {
  if (editingNews.value) {
    // Editar noticia existente
    const index = news.value.findIndex(n => n.id === editingNews.value!.id);
    if (index !== -1) {
      news.value[index] = { ...news.value[index], ...newsData };
    }
  } else {
    // Crear nueva noticia
    const newNews: News = {
      id: Math.max(...news.value.map(n => n.id)) + 1,
      ...newsData,
      vistas: 0,
      likes: 0,
      estado: 'borrador'
    };
    news.value.unshift(newNews);
  }
  closeModal();
};

onMounted(() => {
  if (!authStore.isAdmin()) {
    router.push('/');
    return;
  }
  loadNews();
});
</script>

<style scoped lang="scss">
.admin-news {
  padding: 2rem 0;
  background: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  .header-content {
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

  .header-actions {
    display: flex;
    gap: 1rem;
  }
}

.btn-back {
  background: #6c757d;
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
    background: #5a6268;
  }
}

.btn-primary {
  background: #1b5e20;
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
    background: #144017;
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

    &.total {
      background: #e3f2fd;
      color: #1976d2;
    }

    &.published {
      background: #e8f5e8;
      color: #4caf50;
    }

    &.draft {
      background: #fff3e0;
      color: #ff9800;
    }

    &.views {
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

.filters-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.filters-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  align-items: end;
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
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.3s ease;

    &:focus {
      outline: none;
      border-color: #1b5e20;
    }
  }
}

.filter-group {
  select {
    padding: 0.75rem 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    background: white;
    font-size: 1rem;
    cursor: pointer;
    min-width: 150px;

    &:focus {
      outline: none;
      border-color: #1b5e20;
    }
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
  gap: 1.5rem;
}

.news-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }

  &.draft {
    border-left: 4px solid #ff9800;
    opacity: 0.8;
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

    .news-status {
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 0.4rem 0.8rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;

      &.publicada {
        background: #4caf50;
        color: white;
      }

      &.borrador {
        background: #ff9800;
        color: white;
      }

      &.programada {
        background: #2196f3;
        color: white;
      }
    }
  }

  .news-content {
    padding: 1.5rem;
  }

  .news-header {
    margin-bottom: 1rem;

    h3 {
      color: #1b5e20;
      margin-bottom: 0.5rem;
      font-size: 1.2rem;
      line-height: 1.3;
    }

    .news-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.8rem;
      color: #666;

      .category {
        background: #e8f5e8;
        color: #1b5e20;
        padding: 0.2rem 0.6rem;
        border-radius: 10px;
        font-weight: 600;
      }
    }
  }

  .news-excerpt {
    color: #666;
    line-height: 1.5;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  .news-stats {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e0e0e0;

    .stat {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      color: #666;
      font-size: 0.8rem;

      i {
        color: #1b5e20;
      }
    }
  }

  .news-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;

    .btn-action {
      flex: 1;
      min-width: 80px;
      padding: 0.5rem 0.75rem;
      border: none;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;

      &.edit {
        background: #e3f2fd;
        color: #1976d2;

        &:hover {
          background: #1976d2;
          color: white;
        }
      }

      &.publish {
        background: #e8f5e8;
        color: #4caf50;

        &:hover {
          background: #4caf50;
          color: white;
        }
      }

      &.unpublish {
        background: #fff3e0;
        color: #ff9800;

        &:hover {
          background: #ff9800;
          color: white;
        }
      }

      &.delete {
        background: #ffebee;
        color: #f44336;

        &:hover {
          background: #f44336;
          color: white;
        }
      }

      &.preview {
        background: #f3e5f5;
        color: #7b1fa2;

        &:hover {
          background: #7b1fa2;
          color: white;
        }
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
    margin-bottom: 0.5rem;
    color: #333;
  }

  p {
    margin-bottom: 2rem;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filters-row {
    grid-template-columns: 1fr;
  }

  .news-grid {
    grid-template-columns: 1fr;
  }

  .news-actions {
    flex-direction: column;
  }

  .btn-action {
    min-width: 100% !important;
  }
}
</style>