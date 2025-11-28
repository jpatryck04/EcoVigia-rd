<template>
  <div class="about-us">
    <div class="container">

      <!-- Encabezado -->
      <div class="page-header">
        <h1>Sobre Nosotros</h1>
        <p>Conoce la historia, misión y funciones del Ministerio de Medio Ambiente y Recursos Naturales.</p>
      </div>

      <div class="content-grid">

        <!-- Historia -->
        <section class="history-section" v-animate-on-scroll>
          <div class="section-header">
            <h2>Nuestra Historia</h2>
            <div class="section-icon">
              <i class="fas fa-landmark"></i>
            </div>
          </div>

          <div class="section-content">
            <div class="image-container">
              <img :src="historia" class="section-image" alt="Historia" />
              <div class="image-overlay">
                <i class="fas fa-search-plus"></i>
              </div>
            </div>

            <div class="text-content">
              <p>
                El Ministerio de Medio Ambiente y Recursos Naturales fue creado mediante la Ley 64-00,
                promulgada el 18 de agosto del año 2000, con el fin de regular y proteger los recursos
                naturales del país y garantizar una gestión ambiental responsable.
              </p>

              <p>
                Desde entonces, la institución ha desarrollado políticas públicas orientadas a la
                conservación, la educación ambiental, la fiscalización de actividades económicas y el
                cumplimiento de compromisos internacionales frente al cambio climático.
              </p>
            </div>
          </div>

          <div class="milestones">
            <div 
              v-for="(milestone, index) in milestones" 
              :key="index"
              class="milestone-card"
              :style="{ animationDelay: `${index * 0.2}s` }"
            >
              <div class="milestone-year">
                {{ milestone.year }}
              </div>
              <div class="milestone-content">
                <p>{{ milestone.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Misión / Visión -->
        <section class="mission-vision">

          <div class="mission" v-animate-on-scroll>
            <div class="section-header">
              <h2>Misión</h2>
              <div class="section-icon">
                <i class="fas fa-bullseye"></i>
              </div>
            </div>

            <div class="section-content">
              <div class="image-container">
                <img :src="mision" class="section-image" alt="Misión" />
                <div class="image-overlay">
                  <i class="fas fa-eye"></i>
                </div>
              </div>

              <div class="text-content">
                <p>
                  Proteger y administrar los recursos naturales del país mediante políticas eficaces,
                  educación ambiental, fiscalización y gestión sostenible, garantizando el bienestar de
                  la población y la integridad ecológica.
                </p>
              </div>
            </div>
          </div>

          <div class="vision" v-animate-on-scroll>
            <div class="section-header">
              <h2>Visión</h2>
              <div class="section-icon">
                <i class="fas fa-binoculars"></i>
              </div>
            </div>

            <div class="section-content">
              <div class="image-container">
                <img :src="vision" class="section-image" alt="Visión" />
                <div class="image-overlay">
                  <i class="fas fa-rocket"></i>
                </div>
              </div>

              <div class="text-content">
                <p>
                  Ser una institución moderna, transparente y líder en la gestión ambiental, reconocida
                  por promover una cultura nacional de sostenibilidad y respeto por los recursos naturales.
                </p>
              </div>
            </div>
          </div>

          <div class="functions" v-animate-on-scroll>
            <div class="section-header">
              <h2>Funciones Principales</h2>
              <div class="section-icon">
                <i class="fas fa-tasks"></i>
              </div>
            </div>

            <div class="section-content">
              <div class="image-container">
                <img :src="equipo" class="section-image" alt="Equipo" />
                <div class="image-overlay">
                  <i class="fas fa-cogs"></i>
                </div>
              </div>

              <div class="text-content">
                <ul class="functions-list">
                  <li v-for="(funcion, index) in funciones" :key="index">
                    <i class="fas fa-check-circle"></i>
                    {{ funcion }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- Video -->
        <section class="video-section" v-animate-on-scroll>
          <div class="section-header">
            <h2>Conoce Nuestro Trabajo</h2>
            <div class="section-icon">
              <i class="fas fa-play-circle"></i>
            </div>
          </div>

          <div class="video-container">
            <div class="video-wrapper">
              <iframe
                src="https://drive.google.com/file/d/1jNbMKYIRDCDPOOV5Fi3Per5uXzJjunOQ/preview"
                width="100%"
                height="400"
                allow="autoplay"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </div>
            <div class="video-caption">
              <p>Video institucional - Ministerio de Medio Ambiente y Recursos Naturales</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import historia from '@/assets/about/historia.png'
import mision from '@/assets/about/mision.png'
import vision from '@/assets/about/vision.png'
import equipo from '@/assets/about/equipo.png'

// Datos para las funciones
const funciones = ref([
  'Formular y supervisar políticas ambientales',
  'Regular el uso y explotación de los recursos naturales',
  'Administrar el Sistema Nacional de Áreas Protegidas',
  'Emitir permisos y licencias ambientales',
  'Promover educación ambiental a nivel nacional',
  'Coordinar acciones contra el cambio climático'
]);

// Datos para los hitos históricos
const milestones = ref([
  {
    year: '2000',
    description: 'Creación del Ministerio mediante la Ley General de Medio Ambiente.'
  },
  {
    year: '2012',
    description: 'Integración del Ministerio a la Estrategia Nacional de Desarrollo 2030.'
  },
  {
    year: '2023',
    description: 'Fortalecimiento de programas de conservación y gestión de áreas protegidas.'
  }
]);
</script>

<style scoped lang="scss">
.about-us {
  padding: 2rem 0;
  background: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 4rem;

  h1 {
    color: #1b5e20;
    margin-bottom: 1rem;
    font-size: 2.8rem;
    font-weight: 700;
    background: linear-gradient(135deg, #1b5e20, #4caf50);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  p {
    color: #666;
    font-size: 1.3rem;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
}

.content-grid {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  max-width: 1200px;
  margin: 0 auto;
}

// Secciones generales
section {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8f5e8;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #1b5e20, #4caf50);
    transform: scaleX(0);
    transition: transform 0.4s ease;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(27, 94, 32, 0.15);

    &::before {
      transform: scaleX(1);
    }

    .section-icon {
      transform: scale(1.1) rotate(5deg);
      background: linear-gradient(135deg, #1b5e20, #4caf50);
    }
  }

  &.animate-in {
    animation: slideUp 0.6s ease forwards;
  }
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e8f5e8;

  h2 {
    color: #1b5e20;
    font-size: 2rem;
    margin: 0;
    font-weight: 600;
  }
}

.section-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #4caf50, #81c784);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  transition: all 0.3s ease;
}

.section-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.image-container {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 12px 35px rgba(27, 94, 32, 0.2);

    .image-overlay {
      opacity: 1;
    }

    .section-image {
      transform: scale(1.05);
    }
  }
}

.section-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(27, 94, 32, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;

  i {
    color: white;
    font-size: 2rem;
  }
}

.text-content {
  p {
    color: #666;
    line-height: 1.8;
    font-size: 1.1rem;
    margin-bottom: 1.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

// Milestones
.milestones {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2.5rem;
}

.milestone-card {
  background: linear-gradient(135deg, #f8f9fa, #e8f5e8);
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid #1b5e20;
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(27, 94, 32, 0.15);
    background: linear-gradient(135deg, #e8f5e8, #c8e6c9);
  }
}

.milestone-year {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1b5e20;
  margin-bottom: 0.5rem;
}

.milestone-content p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

// Functions List
.functions-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid #e8f5e8;
    transition: all 0.3s ease;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      transform: translateX(8px);
      color: #1b5e20;
    }

    i {
      color: #4caf50;
      margin-top: 0.2rem;
      flex-shrink: 0;
    }
  }
}

// Video Section
.video-section {
  .video-container {
    margin-top: 1rem;
  }

  .video-wrapper {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.02);
      box-shadow: 0 12px 35px rgba(27, 94, 32, 0.2);
    }

    iframe {
      border-radius: 16px;
    }
  }

  .video-caption {
    text-align: center;
    margin-top: 1rem;

    p {
      color: #666;
      font-style: italic;
      margin: 0;
    }
  }
}

// Mission Vision Grid
.mission-vision {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  .mission, .vision, .functions {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid #e8f5e8;
    transition: all 0.4s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(27, 94, 32, 0.15);
    }
  }
}

// Animaciones
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

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Responsive
@media (max-width: 768px) {
  .page-header {
    h1 {
      font-size: 2.2rem;
    }

    p {
      font-size: 1.1rem;
    }
  }

  section {
    padding: 1.5rem;
  }

  .section-header {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;

    h2 {
      font-size: 1.6rem;
    }
  }

  .section-content {
    grid-template-columns: 1fr;
  }

  .milestones {
    grid-template-columns: 1fr;
  }

  .mission-vision {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .about-us {
    padding: 1rem 0;
  }

  .page-header {
    margin-bottom: 2rem;
  }

  .content-grid {
    gap: 2rem;
  }

  section {
    padding: 1rem;
    border-radius: 12px;
  }
}
</style>