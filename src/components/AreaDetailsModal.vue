<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <button class="close-btn" @click="$emit('close')">
        <i class="fas fa-times"></i>
      </button>
      
      <div class="modal-header">
        <h2>{{ area.nombre }}</h2>
        <span class="area-type">{{ area.tipo }}</span>
      </div>

      <div class="modal-body">
        <div class="area-image">
          <img :src="area.imagen" :alt="area.nombre" />
        </div>

        <div class="area-details">
          <div class="detail-section">
            <h3>Descripción</h3>
            <p>{{ area.descripcion }}</p>
          </div>

          <div class="details-grid">
            <div class="detail-item">
              <i class="fas fa-map-marker-alt"></i>
              <div>
                <strong>Ubicación:</strong>
                <span>{{ area.ubicacion }}</span>
              </div>
            </div>

            <div class="detail-item">
              <i class="fas fa-expand-arrows-alt"></i>
              <div>
                <strong>Extensión:</strong>
                <span>{{ area.extension }}</span>
              </div>
            </div>

            <div class="detail-item" v-if="area.clima">
              <i class="fas fa-cloud-sun"></i>
              <div>
                <strong>Clima:</strong>
                <span>{{ area.clima }}</span>
              </div>
            </div>

            <div class="detail-item" v-if="area.horario">
              <i class="fas fa-clock"></i>
              <div>
                <strong>Horario:</strong>
                <span>{{ area.horario }}</span>
              </div>
            </div>

            <div class="detail-item" v-if="area.contacto">
              <i class="fas fa-phone"></i>
              <div>
                <strong>Contacto:</strong>
                <span>{{ area.contacto }}</span>
              </div>
            </div>
          </div>

          <div class="species-sections" v-if="area.flora || area.fauna">
            <div class="species-section" v-if="area.flora && area.flora.length > 0">
              <h3>Flora Representativa</h3>
              <div class="species-tags">
                <span v-for="(plant, index) in area.flora" :key="index" class="species-tag">
                  {{ plant }}
                </span>
              </div>
            </div>

            <div class="species-section" v-if="area.fauna && area.fauna.length > 0">
              <h3>Fauna Representativa</h3>
              <div class="species-tags">
                <span v-for="(animal, index) in area.fauna" :key="index" class="species-tag">
                  {{ animal }}
                </span>
              </div>
            </div>
          </div>

          <div class="activities-section" v-if="area.actividades && area.actividades.length > 0">
            <h3>Actividades Permitidas</h3>
            <div class="activities-list">
              <div v-for="(activity, index) in area.actividades" :key="index" class="activity-item">
                <i class="fas fa-check-circle"></i>
                <span>{{ activity }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn-secondary" @click="$emit('close')">
          Cerrar
        </button>
        <button class="btn-primary" @click="viewOnMap">
          <i class="fas fa-map-marked-alt"></i>
          Ver en Mapa
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { ProtectedArea } from '@/types';

interface Props {
  area: ProtectedArea;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

const router = useRouter();

const viewOnMap = () => {
  router.push({
    path: '/mapa-areas',
    query: { area: props.area.id.toString() }
  });
};
</script>

<style scoped lang="scss">
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
}

.modal-content {
  background: white;
  border-radius: 16px;
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
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
}

.modal-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e0e0e0;

  h2 {
    color: #1b5e20;
    margin-bottom: 0.5rem;
    font-size: 1.8rem;
  }

  .area-type {
    background: #1b5e20;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
  }
}

.modal-body {
  padding: 1rem 2rem;
}

.area-image {
  margin-bottom: 2rem;

  img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: 12px;
  }
}

.detail-section {
  margin-bottom: 2rem;

  h3 {
    color: #1b5e20;
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }

  p {
    color: #666;
    line-height: 1.6;
  }
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;

  i {
    color: #1b5e20;
    font-size: 1.2rem;
    margin-top: 0.2rem;
  }

  div {
    strong {
      display: block;
      color: #333;
      margin-bottom: 0.25rem;
    }

    span {
      color: #666;
    }
  }
}

.species-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.species-section {
  h3 {
    color: #1b5e20;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }
}

.species-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.species-tag {
  background: #e8f5e8;
  color: #1b5e20;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  border: 1px solid #c8e6c9;
}

.activities-section {
  h3 {
    color: #1b5e20;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;

  i {
    color: #4caf50;
  }

  span {
    color: #666;
  }
}

.modal-actions {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;

  button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .btn-primary {
    background: #1b5e20;
    color: white;

    &:hover {
      background: #144017;
    }
  }

  .btn-secondary {
    background: #e0e0e0;
    color: #333;

    &:hover {
      background: #d0d0d0;
    }
  }
}

@media (max-width: 768px) {
  .modal-content {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }

  .modal-header,
  .modal-body {
    padding: 1rem;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .species-sections {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }
}
</style>