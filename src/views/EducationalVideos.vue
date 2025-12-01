<template>
  <div class="educational-videos">
    <div class="container">
      <div class="page-header">
        <h1>Videos Educativos</h1>
        <p>Aprende sobre conservación, reciclaje y protección ambiental</p>
      </div>

      <!-- Filtros por categoría -->
      <div class="filters">
        <button 
          v-for="category in categories" 
          :key="category.id"
          :class="['filter-btn', { active: activeCategory === category.id }]"
          @click="setActiveCategory(category.id)"
        >
          {{ category.name }}
        </button>
      </div>

      <!-- Grid de videos -->
      <div class="videos-grid">
        <div 
          v-for="video in filteredVideos" 
          :key="video.id"
          class="video-card"
          @click="openVideo(video)"
        >
          <div class="video-thumbnail">
            <img :src="video.thumbnail" :alt="video.title" />
            <div class="play-overlay">
              <i class="fas fa-play"></i>
            </div>
            <div class="video-duration">{{ video.duration }}</div>
          </div>
          <div class="video-info">
            <h3>{{ video.title }}</h3>
            <p>{{ video.description }}</p>
            <div class="video-meta">
              <span class="views">
                <i class="fas fa-eye"></i>
                {{ video.views }} vistas
              </span>
              <span class="date">
                <i class="fas fa-calendar"></i>
                {{ formatDate(video.date) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de video -->
      <div v-if="selectedVideo" class="video-modal" @click="closeVideo">
        <div class="modal-content" @click.stop>
          <button class="close-btn" @click="closeVideo">
            <i class="fas fa-times"></i>
          </button>
          <div class="video-player">
            <h3>{{ selectedVideo.title }}</h3>
            <div class="video-wrapper">
              <!-- Reproductor de YouTube real -->
              <iframe 
                width="100%" 
                height="400" 
                :src="`https://www.youtube.com/embed/${getYouTubeId(selectedVideo.url)}?autoplay=1`"
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
              </iframe>
            </div>
            <div class="video-description">
              <p>{{ selectedVideo.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface Video {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  duration: string;
  views: number;
  date: string;
  category: string;
}

const categories = ref([
  { id: 'all', name: 'Todos' },
  { id: 'reciclaje', name: 'Reciclaje' },
  { id: 'conservacion', name: 'Conservación' },
  { id: 'cambio_climatico', name: 'Cambio Climático' },
  { id: 'biodiversidad', name: 'Biodiversidad' }
]);

const activeCategory = ref('all');
const videos = ref<Video[]>([]);
const selectedVideo = ref<Video | null>(null);

// Función para extraer el ID de YouTube de la URL
const getYouTubeId = (url: string) => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Función para formatear fecha
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const filteredVideos = computed(() => {
  if (activeCategory.value === 'all') return videos.value;
  return videos.value.filter(video => video.category === activeCategory.value);
});

const setActiveCategory = (categoryId: string) => {
  activeCategory.value = categoryId;
};

const openVideo = (video: Video) => {
  selectedVideo.value = video;
};

const closeVideo = () => {
  selectedVideo.value = null;
};

onMounted(async () => {
  // Simular carga de videos desde API
  try {
    // Datos de ejemplo con videos variados
    videos.value = [
      {
        id: 1,
        title: "Cómo reciclar en casa",
        description: "Aprende las técnicas básicas para separar y reciclar los residuos de tu hogar.",
        url: "https://www.youtube.com/watch?v=uW9Qk0OAPio",
        thumbnail: "https://img.youtube.com/vi/uW9Qk0OAPio/hqdefault.jpg",
        category: "reciclaje",
        duration: "12:45",
        views: 890,
        date: "2025-01-15 10:00:00"
      },
      {
        id: 2,
        title: "Guía completa de conservación del agua",
        description: "Descubre métodos efectivos para conservar el agua en tu vida diaria.",
        url: "https://www.youtube.com/watch?v=uW9Qk0OAPio",
        thumbnail: "https://img.youtube.com/vi/uW9Qk0OAPio/hqdefault.jpg",
        category: "conservacion",
        duration: "15:30",
        views: 1250,
        date: "2025-01-10 14:30:00"
      },
      {
        id: 3,
        title: "Impacto del cambio climático en los ecosistemas",
        description: "Análisis detallado de cómo el cambio climático afecta la biodiversidad mundial.",
        url: "https://www.youtube.com/watch?v=uW9Qk0OAPio",
        thumbnail: "https://img.youtube.com/vi/uW9Qk0OAPio/hqdefault.jpg",
        category: "cambio_climatico",
        duration: "22:15",
        views: 2100,
        date: "2025-01-05 09:15:00"
      },
      {
        id: 4,
        title: "Biodiversidad en América Latina",
        description: "Explora la riqueza de especies y ecosistemas únicos en Latinoamérica.",
        url: "https://www.youtube.com/watch?v=uW9Qk0OAPio",
        thumbnail: "https://img.youtube.com/vi/uW9Qk0OAPio/hqdefault.jpg",
        category: "biodiversidad",
        duration: "18:40",
        views: 1560,
        date: "2024-12-28 16:45:00"
      },
      {
        id: 5,
        title: "Compostaje para principiantes",
        description: "Aprende a crear tu propio compost con materiales orgánicos de tu hogar.",
        url: "https://www.youtube.com/watch?v=uW9Qk0OAPio",
        thumbnail: "https://img.youtube.com/vi/uW9Qk0OAPio/hqdefault.jpg",
        category: "reciclaje",
        duration: "10:20",
        views: 980,
        date: "2024-12-20 11:20:00"
      },
      {
        id: 6,
        title: "Energías renovables del futuro",
        description: "Conoce las últimas innovaciones en energías limpias y sostenibles.",
        url: "https://www.youtube.com/watch?v=uW9Qk0OAPio",
        thumbnail: "https://img.youtube.com/vi/uW9Qk0OAPio/hqdefault.jpg",
        category: "cambio_climatico",
        duration: "25:10",
        views: 1890,
        date: "2024-12-15 13:10:00"
      }
    ];
  } catch (error) {
    console.error('Error loading videos:', error);
  }
});
</script>

<style scoped lang="scss">
.educational-videos {
  padding: 2rem 0;
  min-height: 100vh;
  background: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
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

.filters {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;

  .filter-btn {
    padding: 0.75rem 1.5rem;
    border: 2px solid #1b5e20;
    background: white;
    color: #1b5e20;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;

    &:hover {
      background: #e8f5e8;
    }

    &.active {
      background: #1b5e20;
      color: white;
    }
  }
}

.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.video-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);

    .play-overlay {
      opacity: 1;
    }
  }
}

.video-thumbnail {
  position: relative;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .play-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;

    i {
      font-size: 3rem;
      color: white;
    }
  }

  .video-duration {
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
  }
}

.video-info {
  padding: 1.5rem;

  h3 {
    color: #1b5e20;
    margin-bottom: 0.75rem;
    font-size: 1.2rem;
    line-height: 1.4;
  }

  p {
    color: #666;
    line-height: 1.5;
    margin-bottom: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .video-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    color: #999;

    span {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
  }
}

.video-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
}

.video-player {
  padding: 2rem;

  h3 {
    color: #1b5e20;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }
}

.video-wrapper {
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  
  iframe {
    display: block;
    width: 100%;
    border: none;
  }
}

.video-description {
  p {
    color: #666;
    line-height: 1.6;
  }
}

@media (max-width: 768px) {
  .videos-grid {
    grid-template-columns: 1fr;
  }

  .filters {
    gap: 0.5rem;
  }

  .filter-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .video-modal {
    padding: 1rem;
  }

  .modal-content {
    max-height: 95vh;
  }

  .video-wrapper iframe {
    height: 250px;
  }
  
  .video-player {
    padding: 1.5rem;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
}
</style>