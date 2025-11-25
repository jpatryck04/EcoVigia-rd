<template>
  <div class="services-page">
    <div class="container">
      <div class="page-header">
        <h1>Servicios del Ministerio</h1>
        <p>Conoce todos los servicios que ofrece el Ministerio de Medio Ambiente y Recursos Naturales</p>
      </div>

      <!-- Servicios Principales -->
      <div class="services-grid">
        <div class="service-card" v-for="service in services" :key="service.id">
          <div class="service-icon">
            <i :class="service.icon"></i>
          </div>
          <div class="service-content">
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
            <div class="service-features">
              <span v-for="feature in service.features" :key="feature" class="feature-tag">
                {{ feature }}
              </span>
            </div>
            <div class="service-actions">
              <button class="btn-info" @click="viewServiceDetails(service)">
                Más Información
              </button>
              <button v-if="service.hasForm" class="btn-primary" @click="openServiceForm(service)">
                Solicitar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Información de Contacto -->
      <div class="contact-section">
        <h2>¿Necesitas ayuda?</h2>
        <div class="contact-grid">
          <div class="contact-card">
            <i class="fas fa-phone-alt"></i>
            <h3>Línea Directa</h3>
            <p><strong> 849-356-6400 o 809-200-6400</strong></p>
            <span>Lunes a Viernes 8:00 AM - 4:00 PM</span>
          </div>
          
          <div class="contact-card">
            <i class="fas fa-envelope"></i>
            <h3>Correo Electrónico</h3>
            <p><strong>info@ambiente.gob.do</strong></p>
            <span>Respondemos en 24-48 horas</span>
          </div>
          
          <div class="contact-card">
            <i class="fas fa-map-marker-alt"></i>
            <h3>Oficinas Centrales</h3>
            <p><strong>Avenida Cayetano Germosén esq. Avenida Gregorio Luperón, Ensanche El Pedregal, Santo Domingo, R.D. </strong></p>
            <span>Distrito Nacional</span>
          </div>
          
          <div class="contact-card">
            <i class="fas fa-globe"></i>
            <h3>Sitio Web</h3>
            <p><strong>https://ambiente.gob.do/</strong></p>
            <span>Más información y formularios</span>
          </div>
        </div>
      </div>

      <!-- Procedimientos -->
      <div class="procedures-section">
        <h2>Procedimientos y Trámites</h2>
        <div class="procedures-list">
          <div class="procedure-item" v-for="procedure in procedures" :key="procedure.id">
            <div class="procedure-number">{{ procedure.step }}</div>
            <div class="procedure-content">
              <h4>{{ procedure.title }}</h4>
              <p>{{ procedure.description }}</p>
              <div class="procedure-docs" v-if="procedure.requirements">
                <strong>Documentos requeridos:</strong>
                <ul>
                  <li v-for="doc in procedure.requirements" :key="doc">{{ doc }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
  features: string[];
  hasForm: boolean;
}

interface Procedure {
  id: number;
  step: string;
  title: string;
  description: string;
  requirements?: string[];
}

const services = ref<Service[]>([
  {
    id: 1,
    icon: 'fas fa-file-certificate',
    title: 'Permisos Ambientales',
    description: 'Autorizaciones para proyectos, obras o actividades que puedan afectar el medio ambiente.',
    features: ['Evaluación de impacto', 'Consultoría técnica', 'Seguimiento ambiental'],
    hasForm: true
  },
  {
    id: 2,
    icon: 'fas fa-tree',
    title: 'Manejo Forestal',
    description: 'Servicios relacionados con la gestión sostenible de los recursos forestales.',
    features: ['Permisos de corta', 'Reforestación', 'Viveros forestales'],
    hasForm: true
  },
  {
    id: 3,
    icon: 'fas fa-tint',
    title: 'Recursos Hídricos',
    description: 'Gestión y protección de cuencas hidrográficas y recursos acuáticos.',
    features: ['Permisos de agua', 'Calidad del agua', 'Protección de cuencas'],
    hasForm: true
  },
  {
    id: 4,
    icon: 'fas fa-recycle',
    title: 'Manejo de Residuos',
    description: 'Sistema integral para la gestión de residuos sólidos y peligrosos.',
    features: ['Plan de manejo', 'Autorizaciones', 'Auditorías ambientales'],
    hasForm: true
  },
  {
    id: 5,
    icon: 'fas fa-paw',
    title: 'Vida Silvestre',
    description: 'Protección y conservación de especies de flora y fauna nativas.',
    features: ['Permisos de caza', 'Colección científica', 'Centros de rescate'],
    hasForm: true
  },
  {
    id: 6,
    icon: 'fas fa-seedling',
    title: 'Educación Ambiental',
    description: 'Programas de concienciación y formación en temas ambientales.',
    features: ['Talleres', 'Charlas educativas', 'Material didáctico'],
    hasForm: false
  },
  {
    id: 7,
    icon: 'fas fa-exclamation-triangle',
    title: 'Denuncias Ambientales',
    description: 'Canal para reportar violaciones a las leyes ambientales.',
    features: ['Reporte anónimo', 'Seguimiento', 'Acción inmediata'],
    hasForm: true
  },
  {
    id: 8,
    icon: 'fas fa-chart-line',
    title: 'Información Ambiental',
    description: 'Acceso a datos, estadísticas y reportes sobre el medio ambiente.',
    features: ['Base de datos', 'Publicaciones', 'Indicadores'],
    hasForm: false
  }
]);

const procedures = ref<Procedure[]>([
  {
    id: 1,
    step: '01',
    title: 'Consulta Previa',
    description: 'Orientación sobre los requisitos y procedimientos necesarios para su trámite.',
    requirements: ['Descripción del proyecto', 'Ubicación exacta', 'Documento de identidad']
  },
  {
    id: 2,
    step: '02',
    title: 'Presentación de Solicitud',
    description: 'Entrega formal de la documentación requerida en las oficinas correspondientes.',
    requirements: ['Formulario completo', 'Documentos técnicos', 'Pago de tasas']
  },
  {
    id: 3,
    step: '03',
    title: 'Evaluación Técnica',
    description: 'Análisis por parte de los especialistas del ministerio.',
    requirements: ['Visitas de campo', 'Análisis documental', 'Consultas interinstitucionales']
  },
  {
    id: 4,
    step: '04',
    title: 'Resolución',
    description: 'Emisión de la decisión final y entrega del permiso o autorización.',
    requirements: ['Aprobación técnica', 'Cumplimiento de normativas', 'Pagos al día']
  },
  {
    id: 5,
    step: '05',
    title: 'Seguimiento',
    description: 'Monitoreo del cumplimiento de las condiciones establecidas.',
    requirements: ['Reportes periódicos', 'Inspecciones', 'Auditorías']
  }
]);

const viewServiceDetails = (service: Service) => {
  // Navegar a página de detalles del servicio
  console.log('View service details:', service);
  alert(`Más información sobre: ${service.title}\n\n${service.description}`);
};

const openServiceForm = (service: Service) => {
  // Abrir formulario de solicitud
  console.log('Open service form:', service);
  alert(`Formulario de solicitud para: ${service.title}`);
};
</script>

<style scoped lang="scss">
.services-page {
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
    max-width: 600px;
    margin: 0 auto;
  }
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.service-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e0e0e0;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
}

.service-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #1b5e20, #4caf50);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;

  i {
    font-size: 1.8rem;
    color: white;
  }
}

.service-content {
  h3 {
    color: #1b5e20;
    margin-bottom: 1rem;
    font-size: 1.4rem;
  }

  p {
    color: #666;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
}

.service-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.feature-tag {
  background: #e8f5e8;
  color: #1b5e20;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid #c8e6c9;
}

.service-actions {
  display: flex;
  gap: 0.75rem;

  button {
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    flex: 1;
  }

  .btn-primary {
    background: #1b5e20;
    color: white;

    &:hover {
      background: #144017;
    }
  }

  .btn-info {
    background: #e3f2fd;
    color: #1976d2;
    border: 1px solid #bbdefb;

    &:hover {
      background: #bbdefb;
    }
  }
}

.contact-section {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  margin-bottom: 4rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  h2 {
    text-align: center;
    color: #1b5e20;
    margin-bottom: 2rem;
    font-size: 2rem;
  }
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.contact-card {
  text-align: center;
  padding: 2rem 1rem;
  border-radius: 12px;
  background: #f8f9fa;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-3px);
  }

  i {
    font-size: 2.5rem;
    color: #1b5e20;
    margin-bottom: 1rem;
  }

  h3 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  p {
    color: #1b5e20;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  span {
    color: #666;
    font-size: 0.9rem;
  }
}

.procedures-section {
  h2 {
    text-align: center;
    color: #1b5e20;
    margin-bottom: 2rem;
    font-size: 2rem;
  }
}

.procedures-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.procedure-item {
  display: flex;
  gap: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #1b5e20;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
}

.procedure-number {
  width: 60px;
  height: 60px;
  background: #1b5e20;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  flex-shrink: 0;
}

.procedure-content {
  flex: 1;

  h4 {
    color: #1b5e20;
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }

  p {
    color: #666;
    line-height: 1.6;
    margin-bottom: 1rem;
  }
}

.procedure-docs {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;

  strong {
    color: #333;
    display: block;
    margin-bottom: 0.5rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      color: #666;
      padding: 0.25rem 0;
      position: relative;
      padding-left: 1rem;

      &::before {
        content: '•';
        color: #1b5e20;
        position: absolute;
        left: 0;
      }
    }
  }
}

@media (max-width: 768px) {
  .services-grid {
    grid-template-columns: 1fr;
  }

  .contact-grid {
    grid-template-columns: 1fr;
  }

  .service-actions {
    flex-direction: column;
  }

  .contact-section {
    padding: 2rem 1rem;
  }

  .procedure-item {
    padding: 1.5rem;
  }
}
</style>