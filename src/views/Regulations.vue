<template>
  <div class="regulations-page">
    <div class="container">
      <div class="page-header">
        <h1>Normativas Ambientales</h1>
        <p>Consulta las leyes, regulaciones y normativas ambientales de la República Dominicana</p>
      </div>

      <!-- Filtros -->
      <div class="filters-section">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Buscar normativas..." 
          />
        </div>
        <select v-model="selectedCategory" class="category-filter">
          <option value="">Todas las categorías</option>
          <option value="leyes">Leyes</option>
          <option value="decretos">Decretos</option>
          <option value="resoluciones">Resoluciones</option>
          <option value="reglamentos">Reglamentos</option>
          <option value="normas">Normas Técnicas</option>
        </select>
      </div>

      <!-- Lista de Normativas -->
      <div class="regulations-list">
        <div 
          v-for="regulation in filteredRegulations" 
          :key="regulation.id"
          class="regulation-card"
          @click="viewRegulationDetails(regulation)"
        >
          <div class="regulation-icon" :class="getCategoryClass(regulation.categoria)">
            <i :class="getCategoryIcon(regulation.categoria)"></i>
          </div>
          <div class="regulation-content">
            <h3>{{ regulation.titulo }}</h3>
            <p class="regulation-description">{{ regulation.descripcion }}</p>
            <div class="regulation-meta">
              <span class="regulation-category">{{ getCategoryLabel(regulation.categoria) }}</span>
              <span class="regulation-date">{{ formatDate(regulation.fecha) }}</span>
              <span class="regulation-number">{{ regulation.numero }}</span>
              <span class="regulation-type">{{ getTypeLabel(regulation.tipo) }}</span>
            </div>
          </div>
          <div class="regulation-actions">
            <button class="btn-primary" @click.stop="downloadRegulation(regulation)">
              <i class="fas fa-download"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredRegulations.length === 0" class="empty-state">
        <i class="fas fa-file-contract"></i>
        <h3>No se encontraron normativas</h3>
        <p>Intenta con otros términos de búsqueda</p>
      </div>

      <!-- Modal de Detalles -->
      <div v-if="selectedRegulation" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <button class="close-btn" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
          
          <div class="modal-header">
            <div class="regulation-badge" :class="getCategoryClass(selectedRegulation.categoria)">
              <i :class="getCategoryIcon(selectedRegulation.categoria)"></i>
              <span>{{ getCategoryLabel(selectedRegulation.categoria) }}</span>
            </div>
            <h2>{{ selectedRegulation.titulo }}</h2>
            <div class="regulation-identifier">
              <span class="regulation-number">{{ selectedRegulation.numero }}</span>
              <span class="regulation-date">{{ formatDate(selectedRegulation.fecha) }}</span>
            </div>
          </div>

          <div class="modal-body">
            <div class="detail-section">
              <h3>Descripción</h3>
              <p>{{ selectedRegulation.descripcion }}</p>
            </div>

            <div class="details-grid">
              <div class="detail-item">
                <i class="fas fa-tag"></i>
                <div>
                  <strong>Tipo de Documento:</strong>
                  <span>{{ getTypeLabel(selectedRegulation.tipo) }}</span>
                </div>
              </div>

              <div class="detail-item">
                <i class="fas fa-hashtag"></i>
                <div>
                  <strong>Número Oficial:</strong>
                  <span>{{ selectedRegulation.numero }}</span>
                </div>
              </div>

              <div class="detail-item">
                <i class="fas fa-calendar-alt"></i>
                <div>
                  <strong>Fecha de Emisión:</strong>
                  <span>{{ formatDate(selectedRegulation.fecha) }}</span>
                </div>
              </div>

              <div class="detail-item">
                <i class="fas fa-layer-group"></i>
                <div>
                  <strong>Categoría:</strong>
                  <span>{{ getCategoryLabel(selectedRegulation.categoria) }}</span>
                </div>
              </div>
            </div>

            <div class="document-section" v-if="selectedRegulation.archivo">
              <h3>Documento Oficial</h3>
              <div class="document-info">
                <i class="fas fa-file-pdf"></i>
                <div class="document-details">
                  <strong>{{ selectedRegulation.archivo }}</strong>
                  <span>Documento PDF oficial</span>
                </div>
                <button class="btn-download" @click="downloadRegulation(selectedRegulation)">
                  <i class="fas fa-download"></i>
                  Descargar
                </button>
              </div>
            </div>

            <div class="legal-context">
              <h3>Contexto Legal</h3>
              <div class="context-info">
                <p>Esta normativa forma parte del marco legal ambiental de la República Dominicana y debe ser consultada junto con:</p>
                <ul>
                  <li>Ley General de Medio Ambiente y Recursos Naturales (Ley 64-00)</li>
                  <li>Reglamentos complementarios aplicables</li>
                  <li>Normas técnicas relacionadas</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn-secondary" @click="closeModal">
              Cerrar
            </button>
            <button class="btn-primary" @click="downloadRegulation(selectedRegulation)">
              <i class="fas fa-download"></i>
              Descargar Documento
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { formatDate } from '@/utils';
import type { Regulation } from '@/types';

const regulations = ref<Regulation[]>([]);
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedRegulation = ref<Regulation | null>(null);

const filteredRegulations = computed(() => {
  let filtered = regulations.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(regulation => 
      regulation.titulo.toLowerCase().includes(query) ||
      regulation.descripcion.toLowerCase().includes(query) ||
      regulation.numero.toLowerCase().includes(query) ||
      regulation.tipo.toLowerCase().includes(query)
    );
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(regulation => regulation.categoria === selectedCategory.value);
  }

  return filtered;
});

// Métodos para categorías
const getCategoryClass = (categoria: string) => {
  const classes: { [key: string]: string } = {
    leyes: 'category-law',
    decretos: 'category-decree',
    resoluciones: 'category-resolution',
    reglamentos: 'category-regulation',
    normas: 'category-norm'
  };
  return classes[categoria] || 'category-default';
};

const getCategoryIcon = (categoria: string) => {
  const icons: { [key: string]: string } = {
    leyes: 'fas fa-gavel',
    decretos: 'fas fa-scroll',
    resoluciones: 'fas fa-file-signature',
    reglamentos: 'fas fa-book',
    normas: 'fas fa-ruler-combined'
  };
  return icons[categoria] || 'fas fa-file-alt';
};

const getCategoryLabel = (categoria: string) => {
  const labels: { [key: string]: string } = {
    leyes: 'Ley',
    decretos: 'Decreto',
    resoluciones: 'Resolución',
    reglamentos: 'Reglamento',
    normas: 'Norma Técnica'
  };
  return labels[categoria] || categoria;
};

const getTypeLabel = (tipo: string) => {
  const labels: { [key: string]: string } = {
    leyes: 'Ley Nacional',
    decretos: 'Decreto Ejecutivo',
    resoluciones: 'Resolución Ministerial',
    reglamentos: 'Reglamento Técnico',
    normas: 'Norma Ambiental'
  };
  return labels[tipo] || tipo;
};

const viewRegulationDetails = (regulation: Regulation) => {
  selectedRegulation.value = regulation;
};

const closeModal = () => {
  selectedRegulation.value = null;
};

const downloadRegulation = (regulation: Regulation) => {
  // Simular descarga
  console.log(`Descargando: ${regulation.titulo}`);
  // En producción, esto se conectaría con la API del Ministerio
  alert(`Iniciando descarga de: ${regulation.titulo}\n\n(En producción, esto descargaría el PDF oficial)`);
};

onMounted(() => {
  // Datos de ejemplo - en producción vendrían de la API
  regulations.value = [
    {
      id: 1,
      titulo: "Ley General de Medio Ambiente y Recursos Naturales",
      descripcion: "Marco legal general para la protección del medio ambiente y recursos naturales en República Dominicana. Establece los principios, instrumentos y mecanismos para la gestión ambiental.",
      tipo: "leyes",
      fecha: "2000-08-18",
      numero: "Ley 64-00",
      categoria: "leyes",
      archivo: "ley-64-00.pdf"
    },
    {
      id: 2,
      titulo: "Ley General de Gestión Integral y Coprocesamiento de Residuos Sólidos",
      descripcion: "Establece las disposiciones para la gestión integral y disposición final de los residuos sólidos en el país, promoviendo el reciclaje y la economía circular.",
      tipo: "leyes",
      fecha: "2020-10-02",
      numero: "Ley 225-20",
      categoria: "leyes",
      archivo: "ley-225-20.pdf"
    },
    {
      id: 3,
      titulo: "Reglamento de la Ley 225-20 (Gestión Integral de Residuos Sólidos)",
      descripcion: "Reglamenta los procedimientos técnicos y administrativos para la gestión adecuada de residuos sólidos según la Ley 225-20.",
      tipo: "reglamentos",
      fecha: "2021-08-15",
      numero: "Decreto 320-21",
      categoria: "decretos",
      archivo: "decreto-320-21.pdf"
    },
    {
      id: 4,
      titulo: "Ley Sectorial de Biodiversidad",
      descripcion: "Norma especializada que protege la diversidad biológica, los ecosistemas, especies nativas y regula el acceso a recursos genéticos.",
      tipo: "leyes",
      fecha: "2015-03-27",
      numero: "Ley 333-15",
      categoria: "leyes",
      archivo: "ley-333-15.pdf"
    },
    {
      id: 5,
      titulo: "Ley de Áreas Protegidas y de Áreas Especiales",
      descripcion: "Define el régimen legal para la creación, manejo y administración del sistema de áreas protegidas en el país.",
      tipo: "leyes",
      fecha: "2004-06-11",
      numero: "Ley 202-04",
      categoria: "leyes",
      archivo: "ley-202-04.pdf"
    },
    {
      id: 6,
      titulo: "Norma Ambiental sobre Calidad del Agua y Control de Descargas",
      descripcion: "Establece criterios de calidad para aguas superficiales, subterráneas y costeras, así como límites para descargas contaminantes.",
      tipo: "normas",
      fecha: "2012-05-20",
      numero: "NA-QA-001-2012",
      categoria: "normas",
      archivo: "norma-calidad-agua-2012.pdf"
    },
    {
      id: 7,
      titulo: "Ley sobre Prevención, Supresión y Limitación de Ruidos Nocivos",
      descripcion: "Regula la contaminación sonora en zonas urbanas y rurales, estableciendo límites sonoros permisibles.",
      tipo: "leyes",
      fecha: "2004-12-29",
      numero: "Ley 287-04",
      categoria: "leyes",
      archivo: "ley-287-04.pdf"
    },
    {
      id: 8,
      titulo: "Ley Sectorial Forestal",
      descripcion: "Regula el aprovechamiento, conservación, reforestación y manejo sostenible de los recursos forestales.",
      tipo: "leyes",
      fecha: "2018-03-26",
      numero: "Ley 57-18",
      categoria: "leyes",
      archivo: "ley-57-18.pdf"
    },
    {
      id: 9,
      titulo: "Resolución sobre Evaluación de Impacto Ambiental",
      descripcion: "Establece los procedimientos y requisitos para la evaluación de impacto ambiental de proyectos de desarrollo.",
      tipo: "resoluciones",
      fecha: "2012-03-15",
      numero: "Resolución 023-2012",
      categoria: "resoluciones",
      archivo: "resolucion-023-2012.pdf"
    },
    {
      id: 10,
      titulo: "Decreto de Creación del Sistema Nacional de Áreas Protegidas",
      descripcion: "Crea el Sistema Nacional de Áreas Protegidas y establece su estructura organizativa.",
      tipo: "decretos",
      fecha: "2009-07-30",
      numero: "Decreto 207-09",
      categoria: "decretos",
      archivo: "decreto-207-09.pdf"
    }
  ];
});
</script>

<style scoped lang="scss">
.regulations-page {
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

.filters-section {
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

.regulations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.regulation-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-left: 4px solid #1b5e20;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
}

.regulation-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;

  // Colores por categoría
  &.category-law {
    background: linear-gradient(135deg, #d32f2f, #f44336);
  }
  
  &.category-decree {
    background: linear-gradient(135deg, #1976d2, #2196f3);
  }
  
  &.category-resolution {
    background: linear-gradient(135deg, #388e3c, #4caf50);
  }
  
  &.category-regulation {
    background: linear-gradient(135deg, #f57c00, #ff9800);
  }
  
  &.category-norm {
    background: linear-gradient(135deg, #7b1fa2, #9c27b0);
  }
  
  &.category-default {
    background: linear-gradient(135deg, #1b5e20, #4caf50);
  }

  i {
    font-size: 1.2rem;
  }
}

.regulation-content {
  flex: 1;

  h3 {
    color: #1b5e20;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
  }

  .regulation-description {
    color: #666;
    line-height: 1.5;
    margin-bottom: 1rem;
  }

  .regulation-meta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;

    span {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .regulation-category {
      background: #e3f2fd;
      color: #1976d2;
    }

    .regulation-date {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .regulation-number {
      background: #e8f5e8;
      color: #1b5e20;
    }

    .regulation-type {
      background: #fff3e0;
      color: #ef6c00;
    }
  }
}

.regulation-actions {
  .btn-primary {
    background: #1b5e20;
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.3s ease;

    &:hover {
      background: #144017;
      transform: scale(1.1);
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
    margin-bottom: 1rem;
    color: #333;
  }
}

/* Modal Styles */
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
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.1);
  color: #666;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.2);
    color: #333;
  }
}

.modal-header {
  padding: 2.5rem 2.5rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);

  .regulation-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    color: white;
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 1rem;

    &.category-law {
      background: linear-gradient(135deg, #d32f2f, #f44336);
    }
    
    &.category-decree {
      background: linear-gradient(135deg, #1976d2, #2196f3);
    }
    
    &.category-resolution {
      background: linear-gradient(135deg, #388e3c, #4caf50);
    }
    
    &.category-regulation {
      background: linear-gradient(135deg, #f57c00, #ff9800);
    }
    
    &.category-norm {
      background: linear-gradient(135deg, #7b1fa2, #9c27b0);
    }
  }

  h2 {
    color: #1b5e20;
    margin-bottom: 1rem;
    font-size: 1.8rem;
    line-height: 1.3;
  }

  .regulation-identifier {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;

    .regulation-number {
      background: #e8f5e8;
      color: #1b5e20;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 600;
    }

    .regulation-date {
      background: #f3e5f5;
      color: #7b1fa2;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 500;
    }
  }
}

.modal-body {
  padding: 2rem 2.5rem;
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
    font-size: 1.1rem;
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
  border-left: 4px solid #1b5e20;

  i {
    color: #1b5e20;
    font-size: 1.2rem;
    margin-top: 0.2rem;
    flex-shrink: 0;
  }

  div {
    strong {
      display: block;
      color: #333;
      margin-bottom: 0.25rem;
      font-size: 0.9rem;
    }

    span {
      color: #666;
      font-weight: 500;
    }
  }
}

.document-section {
  background: #e3f2fd;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  border-left: 4px solid #2196f3;

  h3 {
    color: #1976d2;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  .document-info {
    display: flex;
    align-items: center;
    gap: 1rem;

    i {
      font-size: 2rem;
      color: #d32f2f;
    }

    .document-details {
      flex: 1;

      strong {
        display: block;
        color: #333;
        margin-bottom: 0.25rem;
      }

      span {
        color: #666;
        font-size: 0.9rem;
      }
    }

    .btn-download {
      background: #1976d2;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background 0.3s ease;

      &:hover {
        background: #1565c0;
      }
    }
  }
}

.legal-context {
  background: #fff3e0;
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid #ff9800;

  h3 {
    color: #e65100;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  .context-info {
    p {
      color: #666;
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    ul {
      color: #666;
      padding-left: 1.5rem;

      li {
        margin-bottom: 0.5rem;
        line-height: 1.4;
      }
    }
  }
}

.modal-actions {
  padding: 1.5rem 2.5rem;
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

  .btn-secondary {
    background: #e0e0e0;
    color: #333;

    &:hover {
      background: #d0d0d0;
    }
  }

  .btn-primary {
    background: #1b5e20;
    color: white;

    &:hover {
      background: #144017;
    }
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .regulation-card {
    flex-direction: column;
    gap: 1rem;
  }

  .regulation-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .modal-content {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }

  .modal-header,
  .modal-body {
    padding: 1.5rem;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .document-info {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 1rem !important;
  }

  .modal-actions {
    flex-direction: column-reverse;
    padding: 1.5rem;
  }
}
</style>