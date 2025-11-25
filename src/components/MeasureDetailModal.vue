<template>
  <div v-if="measure" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <!-- Header del Modal -->
      <div class="modal-header">
        <div class="measure-header">
          <div class="measure-icon-large">
            <i :class="measure.icon"></i>
          </div>
          <div class="measure-title">
            <h2>{{ measure.titulo }}</h2>
            <div class="measure-meta">
              <span class="category-badge">{{ getCategoryName(measure.categoria) }}</span>
              <span class="difficulty" :class="measure.dificultad">
                <i class="fas fa-signal"></i>
                {{ getDifficultyText(measure.dificultad) }}
              </span>
              <span class="impact">
                <i class="fas fa-chart-line"></i>
                Impacto: {{ measure.impacto }}/10
              </span>
            </div>
          </div>
        </div>
        <button class="close-btn" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Contenido del Modal -->
      <div class="modal-body">
        <!-- Descripción -->
        <section class="description-section">
          <h3>Descripción</h3>
          <p>{{ measure.descripcionLarga }}</p>
        </section>

        <!-- Pasos a Seguir -->
        <section class="steps-section">
          <h3>Pasos a Seguir</h3>
          <div class="steps-list">
            <div v-for="(step, index) in measure.pasos" :key="index" class="step-item">
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-text">{{ step }}</div>
            </div>
          </div>
        </section>

        <!-- Beneficios -->
        <section class="benefits-section">
          <h3>Beneficios</h3>
          <div class="benefits-list">
            <div v-for="(benefit, index) in measure.beneficios" :key="index" class="benefit-item">
              <i class="fas fa-check-circle"></i>
              <span>{{ benefit }}</span>
            </div>
          </div>
        </section>

        <!-- Recursos (si existen) -->
        <section v-if="measure.recursos && measure.recursos.length" class="resources-section">
          <h3>Recursos Adicionales</h3>
          <div class="resources-list">
            <div v-for="(resource, index) in measure.recursos" :key="index" class="resource-item">
              <i class="fas fa-external-link-alt"></i>
              <span>{{ resource }}</span>
            </div>
          </div>
        </section>

        <!-- Acciones -->
        <section class="actions-section">
          <button class="btn-primary" @click="markAsCompleted">
            <i class="fas fa-check"></i>
            Marcar como Completado
          </button>
          <button class="btn-secondary" @click="shareMeasure">
            <i class="fas fa-share"></i>
            Compartir
          </button>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { EnvironmentalMeasure } from '@/types'; // ✅ Importar desde tipos

interface Props {
  measure: EnvironmentalMeasure;
}

const props = defineProps<Props>();
defineEmits<{
  close: [];
}>();

const getCategoryName = (categoryId: string) => {
  const categories: { [key: string]: string } = {
    agua: 'Agua',
    energia: 'Energía',
    residuos: 'Residuos',
    biodiversidad: 'Biodiversidad',
    consumo: 'Consumo',
    todas: 'Todas'
  };
  return categories[categoryId] || categoryId;
};

const getDifficultyText = (difficulty: string) => {
  const texts = {
    facil: 'Fácil',
    medio: 'Medio',
    dificil: 'Difícil'
  };
  return texts[difficulty as keyof typeof texts];
};

const markAsCompleted = () => {
  // Aquí iría la lógica para marcar la medida como completada
  alert(`¡Felicidades! Has completado la medida: ${props.measure.titulo}`);
};

const shareMeasure = () => {
  if (navigator.share) {
    navigator.share({
      title: props.measure.titulo,
      text: props.measure.descripcionCorta,
      url: window.location.href
    });
  } else {
    // Fallback para navegadores que no soportan Web Share API
    navigator.clipboard.writeText(props.measure.titulo + ' - ' + props.measure.descripcionCorta);
    alert('Medida copiada al portapapeles');
  }
};
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
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
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.measure-header {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  flex: 1;
}

.measure-icon-large {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #1b5e20, #4caf50);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  i {
    font-size: 2rem;
    color: white;
  }
}

.measure-title {
  flex: 1;

  h2 {
    color: #1b5e20;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    line-height: 1.3;
  }
}

.measure-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;

  .category-badge {
    background: #e8f5e8;
    color: #1b5e20;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .difficulty, .impact {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #666;

    &.facil { color: #4caf50; }
    &.medio { color: #ff9800; }
    &.dificil { color: #f44336; }
  }
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.3s ease;

  &:hover {
    background: #f5f5f5;
  }
}

.modal-body {
  padding: 0 2rem 2rem;
}

section {
  margin-bottom: 2rem;

  h3 {
    color: #1b5e20;
    margin-bottom: 1rem;
    font-size: 1.2rem;
    border-bottom: 2px solid #e8f5e8;
    padding-bottom: 0.5rem;
  }
}

.description-section {
  p {
    line-height: 1.6;
    color: #333;
    font-size: 1.1rem;
  }
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
}

.step-number {
  width: 32px;
  height: 32px;
  background: #4caf50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
  font-size: 0.9rem;
}

.step-text {
  flex: 1;
  line-height: 1.5;
  color: #333;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #e8f5e8;
  border-radius: 8px;

  i {
    color: #4caf50;
    font-size: 1.1rem;
  }

  span {
    color: #1b5e20;
    font-weight: 500;
  }
}

.resources-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #e3f2fd;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #bbdefb;
  }

  i {
    color: #2196f3;
  }

  span {
    color: #1976d2;
  }
}

.actions-section {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;

  .btn-primary, .btn-secondary {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-primary {
    background: #1b5e20;
    color: white;

    &:hover {
      background: #144017;
    }
  }

  .btn-secondary {
    background: transparent;
    color: #1b5e20;
    border: 2px solid #1b5e20;

    &:hover {
      background: #1b5e20;
      color: white;
    }
  }
}

@media (max-width: 768px) {
  .modal-content {
    margin: 1rem;
    max-height: 95vh;
  }

  .modal-header {
    padding: 1.5rem 1.5rem 1rem;
    flex-direction: column;
    gap: 1rem;
  }

  .measure-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .measure-icon-large {
    align-self: center;
  }

  .measure-meta {
    justify-content: center;
  }

  .modal-body {
    padding: 0 1.5rem 1.5rem;
  }

  .actions-section {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .measure-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>