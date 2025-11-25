<template>
  <div class="about-developers">
    <div class="container">
      <div class="page-header">
        <h1>Acerca del Desarrollo</h1>
        <p>Conoce al equipo detrás de esta aplicación</p>
      </div>

      <!-- Información del equipo -->
      <div class="developers-grid">
        <div 
          v-for="developer in developers" 
          :key="developer.id"
          class="developer-card"
        >
          <div class="developer-photo">
            <img :src="developer.foto" :alt="developer.nombre" />
          </div>
          <div class="developer-info">
            <h3>{{ developer.nombre }}</h3>
            <p class="role">{{ developer.rol }}</p>
            <p class="matricula">{{ developer.matricula }}</p>
            
            <div class="contact-info">
              <div class="contact-item">
                <i class="fas fa-phone"></i>
                <a :href="`tel:${developer.telefono}`">{{ developer.telefono }}</a>
              </div>
              <div v-if="developer.telegram" class="contact-item">
                <i class="fab fa-telegram"></i>
                <a :href="developer.telegram" target="_blank">Telegram</a>
              </div>
              <div v-if="developer.email" class="contact-item">
                <i class="fas fa-envelope"></i>
                <a :href="`mailto:${developer.email}`">{{ developer.email }}</a>
              </div>
            </div>

            <div class="skills">
              <span 
                v-for="skill in developer.habilidades" 
                :key="skill"
                class="skill-tag"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Información del proyecto -->
      <div class="project-info">
        <div class="info-card">
          <h3>Información del Proyecto</h3>
          <div class="info-grid">
            <div class="info-item">
              <strong>Nombre:</strong>
              <span>EcoVigía RD</span>
            </div>
            <div class="info-item">
              <strong>Versión:</strong>
              <span>1.0.0</span>
            </div>
            <div class="info-item">
              <strong>Framework:</strong>
              <span>Vue.js 3 + TypeScript</span>
            </div>
            <div class="info-item">
              <strong>API:</strong>
              <span>Ministerio de Medio Ambiente RD</span>
            </div>
            <div class="info-item">
              <strong>Fecha de Desarrollo:</strong>
              <span>Diciembre 2025</span>
            </div>
          </div>
        </div>

        <div class="tech-stack">
          <h3>Tecnologías Utilizadas</h3>
          <div class="tech-grid">
            <div class="tech-item" v-for="tech in technologies" :key="tech.name">
              <i :class="tech.icon"></i>
              <span>{{ tech.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- QR Code para el video -->
      <div class="qr-section">
        <div class="qr-card">
          <h3>Video Explicativo</h3>
          <div class="qr-code">
            <!-- Aquí iría el QR code generado -->
            <div class="qr-placeholder">
              <i class="fas fa-qrcode"></i>
              <p>QR Code del Video</p>
            </div>
          </div>
          <p>Escanea para ver el video explicativo del proyecto</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import patryckImg from '@/assets/team/patryck.png';
import yordalisImg from '@/assets/team/yordalis.png';
import enmanuelImg from '@/assets/team/enmanuel.jpg';
import anthonyImg from '@/assets/team/anthony.jpg';



interface Developer {
  id: number;
  nombre: string;
  rol: string;
  matricula: string;
  foto: string;
  telefono: string;
  telegram?: string;
  email?: string;
  habilidades: string[];
}

interface Technology {
  name: string;
  icon: string;
}

const developers = ref<Developer[]>([
  {
    id: 1,
    nombre: 'Patryck Yandell Jimenez Ogando',
    rol: 'Desarrollador Frontend',
    matricula: '2023-1953',
    foto: patryckImg,
    telefono: '(829) 429-1048',
    telegram: 'https://t.me/Patryckjimenez',
    email: 'patryckyandelljimenea@gmail.com',
    habilidades: ['Vue.js', 'TypeScript','Ionic', 'Node.js', 'React', 'Flutter', 'UI/UX Design','C#']
  },
   {
    id: 2,
    nombre: 'Yordalis Estefany Herrera Encarnacion',
    rol: 'Desarrolladora Frontend',
    matricula: '2023-1719',
    foto: yordalisImg,
    telefono: '(809) 994-0927',
    telegram: '',
    email: 'herrerayordalis@gmail.com',
    habilidades: ['JavaScript','TypeScript', 'Python', 'Flutter', 'Vue', 'HTML', 'CSS', 'Ionic']
  },
   {
    id: 3,
    nombre: 'Anthony Enmanuel Feliz De La Rosa',
    rol: 'Desarrollador Full Stack',
    matricula: '2021-0615',
    foto: anthonyImg,
    telefono: '(809) 418-3162',
    telegram: 'https://t.me/Zeidant',
    email: 'anthonyemma55@gmail.com',
    habilidades: ['Vue.js', 'TypeScript','JavaScript', 'Python', 'SQL','mongoDB','C#']
  },
   {
    id: 4,
    nombre: 'Edward Neftalí Liriano Gómez',
    rol: 'Desarrollador Full Stack',
    matricula: '2022-0437',
    foto: '',
    telefono: '(809) 777-0697',
    telegram: 'https://t.me/Neta26',
    email: 'enlg2603@gmail.com',
    habilidades: ['Vue.js','JavaScript', 'Laravel', 'Ionic','Docker','CI/CD','.NET']
  },
   {
    id: 5,
    nombre: 'Reynaldo Sebastian Lopez Terrero',
    rol: '',
    matricula: '2023-0201',
    foto: '',
    telefono: '(829) 380-1726',
    telegram: '',
    email: 'codebastiandev@gmail.com',
    habilidades: ['']
  }
  ,
   {
    id: 6,
    nombre: 'Enmanuel De Jesus Pichardo Salas',
    rol: '',
    matricula: '2022-1341',
    foto: enmanuelImg,
    telefono: '(849) 343-0203',
    telegram: '',
    email: 'enmanueldjpichardos@gmail.com',
    habilidades: ['']
  }
]);

const technologies = ref<Technology[]>([
  { name: 'Vue.js 3', icon: 'fab fa-vuejs' },
  { name: 'TypeScript', icon: 'fas fa-code' },
  { name: 'Pinia', icon: 'fas fa-store' },
  { name: 'Vue Router', icon: 'fas fa-route' },
  { name: 'Leaflet Maps', icon: 'fas fa-map' },
  { name: 'Capacitor', icon: 'fas fa-mobile-alt' },
  { name: 'Sass', icon: 'fab fa-sass' },
  { name: 'Axios', icon: 'fas fa-cloud' }
]);
</script>

<style scoped lang="scss">
.about-developers {
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

.developers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.developer-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.developer-photo {
  height: 250px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;

  img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}

.developer-info {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;

  h3 {
    color: #1b5e20;
    margin-bottom: 0.5rem;
    font-size: 1.3rem;
  }

  .role {
    color: #333;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .matricula {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
}

.contact-info {
  margin-bottom: 1.5rem;

  .contact-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    color: #666;

    i {
      width: 16px;
      color: #1b5e20;
    }

    a {
      color: inherit;
      text-decoration: none;
      transition: color 0.3s ease;

      &:hover {
        color: #1b5e20;
      }
    }
  }
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
}

.skill-tag {
  background: #e8f5e8;
  color: #1b5e20;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.project-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.info-card, .tech-stack {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h3 {
    color: #1b5e20;
    margin-bottom: 1.5rem;
    font-size: 1.3rem;
  }
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f0f0f0;

  strong {
    color: #333;
  }

  span {
    color: #666;
  }
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.tech-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: background 0.3s ease;

  &:hover {
    background: #e8f5e8;
  }

  i {
    font-size: 1.5rem;
    color: #1b5e20;
    width: 24px;
    text-align: center;
  }

  span {
    color: #333;
    font-weight: 500;
  }
}

.qr-section {
  display: flex;
  justify-content: center;
}

.qr-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 300px;

  h3 {
    color: #1b5e20;
    margin-bottom: 1.5rem;
  }
}

.qr-code {
  margin-bottom: 1.5rem;
}

.qr-placeholder {
  width: 200px;
  height: 200px;
  background: #f8f9fa;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
  margin: 0 auto;

  i {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
}
</style>