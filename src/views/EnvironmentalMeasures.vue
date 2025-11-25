<template>
  <div class="environmental-measures">
    <div class="container">
      <div class="page-header">
        <h1>Medidas Ambientales</h1>
        <p>Acciones concretas para proteger nuestro medio ambiente</p>
      </div>

      <!-- Categorías -->
      <div class="categories">
        <button 
          v-for="category in categories" 
          :key="category.id"
          :class="['category-btn', { active: activeCategory === category.id }]"
          @click="setActiveCategory(category.id)"
        >
          <i :class="category.icon"></i>
          {{ category.name }}
        </button>
      </div>

      <!-- Lista de medidas -->
      <div class="measures-list">
        <div 
          v-for="measure in filteredMeasures" 
          :key="measure.id"
          class="measure-card"
          @click="openMeasure(measure)"
        >
          <div class="measure-icon">
            <i :class="measure.icon"></i>
          </div>
          <div class="measure-content">
            <h3>{{ measure.titulo }}</h3>
            <p>{{ measure.descripcionCorta }}</p>
            <div class="measure-meta">
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
          <div class="measure-arrow">
            <i class="fas fa-chevron-right"></i>
          </div>
        </div>
      </div>

      <!-- Modal de detalle -->
      <MeasureDetailModal 
        v-if="selectedMeasure"
        :measure="selectedMeasure"
        @close="selectedMeasure = null"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import MeasureDetailModal from '@/components/MeasureDetailModal.vue';
import type { EnvironmentalMeasure } from '@/types'; // ✅ Importar desde tipos

interface Category {
  id: string;
  name: string;
  icon: string;
}

const categories = ref<Category[]>([
  { id: 'todas', name: 'Todas', icon: 'fas fa-star' },
  { id: 'agua', name: 'Agua', icon: 'fas fa-tint' },
  { id: 'energia', name: 'Energía', icon: 'fas fa-bolt' },
  { id: 'residuos', name: 'Residuos', icon: 'fas fa-recycle' },
  { id: 'biodiversidad', name: 'Biodiversidad', icon: 'fas fa-leaf' },
  { id: 'consumo', name: 'Consumo', icon: 'fas fa-shopping-cart' }
]);

const activeCategory = ref('todas');
const measures = ref<EnvironmentalMeasure[]>([]);
const selectedMeasure = ref<EnvironmentalMeasure | null>(null);

const filteredMeasures = computed(() => {
  if (activeCategory.value === 'todas') return measures.value;
  return measures.value.filter(measure => measure.categoria === activeCategory.value);
});

const setActiveCategory = (categoryId: string) => {
  activeCategory.value = categoryId;
};

const openMeasure = (measure: EnvironmentalMeasure) => {
  selectedMeasure.value = measure;
};

const getDifficultyText = (difficulty: string) => {
  const texts = {
    facil: 'Fácil',
    medio: 'Medio',
    dificil: 'Difícil'
  };
  return texts[difficulty as keyof typeof texts];
};

onMounted(async () => {
  try {
    // const response = await medioAmbienteAPI.getMedidas();
    // measures.value = response.data;
    
    // Datos de ejemplo
    measures.value = [
      {
        id: 1,
        titulo: 'Reducir el consumo de agua',
        descripcionCorta: 'Implementa hábitos para disminuir el gasto de agua en el hogar',
        descripcionLarga: 'El agua es un recurso vital y limitado. Aprende cómo reducir tu consumo diario mediante prácticas simples pero efectivas.',
        categoria: 'agua',
        icon: 'fas fa-tint',
        dificultad: 'facil',
        impacto: 8,
        pasos: [
          'Toma duchas cortas de máximo 5 minutos',
          'Cierra el grifo mientras te cepillas los dientes',
          'Repara inmediatamente las fugas de agua',
          'Instala reductores de flujo en grifos y duchas',
          'Riega las plantas por la mañana o tarde para evitar evaporación'
        ],
        beneficios: [
          'Ahorro económico en la factura del agua',
          'Conservación de recursos hídricos',
          'Reducción de energía para bombeo y tratamiento',
          'Preservación de ecosistemas acuáticos'
        ],
        recursos: ['Calculadora de consumo de agua', 'Guía de dispositivos ahorradores']
      },
      {
        id: 2,
        titulo: 'Separación correcta de residuos',
        descripcionCorta: 'Aprende a separar los desechos para facilitar el reciclaje',
        descripcionLarga: 'La separación adecuada de residuos es fundamental para un reciclaje eficiente y la reducción de desechos en vertederos.',
        categoria: 'residuos',
        icon: 'fas fa-recycle',
        dificultad: 'medio',
        impacto: 9,
        pasos: [
          'Establece contenedores separados en casa',
          'Limpia los envases antes de reciclarlos',
          'Aplasta las botellas para ahorrar espacio',
          'Identifica los puntos de recolección en tu comunidad',
          'Educa a tu familia sobre la separación correcta'
        ],
        beneficios: [
          'Reducción de desechos en vertederos',
          'Ahorro de recursos naturales',
          'Generación de empleos en el sector reciclaje',
          'Disminución de la contaminación'
        ]
      }
    ];
  } catch (error) {
    console.error('Error loading environmental measures:', error);
  }
});
</script>

<style scoped lang="scss">
.environmental-measures {
  padding: 2rem 0;
  min-height: 100vh;
  background: #f8f9fa;
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

.categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
}

.category-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  i {
    font-size: 1.5rem;
    color: #1b5e20;
  }

  &:hover {
    border-color: #1b5e20;
    background: #f8f9fa;
  }

  &.active {
    background: #1b5e20;
    border-color: #1b5e20;
    color: white;

    i {
      color: white;
    }
  }
}

.measures-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.measure-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid #1b5e20;

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    .measure-arrow {
      color: #1b5e20;
      transform: translateX(3px);
    }
  }
}

.measure-icon {
  width: 60px;
  height: 60px;
  background: #e8f5e8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  i {
    font-size: 1.5rem;
    color: #1b5e20;
  }
}

.measure-content {
  flex: 1;

  h3 {
    color: #1b5e20;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
  }

  p {
    color: #666;
    line-height: 1.5;
    margin-bottom: 1rem;
  }

  .measure-meta {
    display: flex;
    gap: 2rem;

    span {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: #666;
    }

    .difficulty {
      &.facil { color: #4caf50; }
      &.medio { color: #ff9800; }
      &.dificil { color: #f44336; }
    }
  }
}

.measure-arrow {
  color: #999;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .categories {
    grid-template-columns: repeat(2, 1fr);
  }

  .measure-card {
    gap: 1rem;
    padding: 1rem;
  }

  .measure-icon {
    width: 50px;
    height: 50px;
    
    i {
      font-size: 1.2rem;
    }
  }

  .measure-meta {
    flex-direction: column;
    gap: 0.5rem !important;
  }
}
</style>