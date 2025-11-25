<template>
  <div class="ministry-team">
    <div class="container">
      <div class="page-header">
        <h1>Nuestro Equipo</h1>
        <p>Conoce al equipo comprometido con la protección ambiental de RD</p>
      </div>

      <!-- Filtros por departamento -->
      <div class="department-filters">
        <button 
          v-for="dept in departments" 
          :key="dept.id"
          :class="['dept-btn', { active: activeDepartment === dept.id }]"
          @click="setActiveDepartment(dept.id)"
        >
          {{ dept.name }}
        </button>
      </div>

      <!-- Grid del equipo -->
      <div class="team-grid">
        <div 
          v-for="member in filteredTeam" 
          :key="member.id"
          class="team-card"
        >
          <div class="member-photo">
            <img :src="member.foto" :alt="member.nombre" />
            <div class="member-overlay">
              <div class="social-links">
                <a v-if="member.email" :href="`mailto:${member.email}`">
                  <i class="fas fa-envelope"></i>
                </a>
                <a v-if="member.telefono" :href="`tel:${member.telefono}`">
                  <i class="fas fa-phone"></i>
                </a>
              </div>
            </div>
          </div>
          <div class="member-info">
            <h3>{{ member.nombre }}</h3>
            <p class="position">{{ member.cargo }}</p>
            <p class="department">{{ member.departamento }}</p>
            <p class="bio">{{ member.bio }}</p>
            <div class="member-contact">
              <div v-if="member.email" class="contact-item">
                <i class="fas fa-envelope"></i>
                <span>{{ member.email }}</span>
              </div>
              <div v-if="member.telefono" class="contact-item">
                <i class="fas fa-phone"></i>
                <span>{{ member.telefono }}</span>
              </div>
              <div v-if="member.extension" class="contact-item">
                <i class="fas fa-hashtag"></i>
                <span>Ext. {{ member.extension }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas del equipo -->
      <div class="team-stats">
        <div class="stat-card">
          <div class="stat-number">{{ teamMembers.length }}</div>
          <div class="stat-label">Miembros del Equipo</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ uniqueDepartments.length }}</div>
          <div class="stat-label">Departamentos</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ yearsExperience }} años</div>
          <div class="stat-label">Experiencia Promedio</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface TeamMember {
  id: number;
  nombre: string;
  cargo: string;
  departamento: string;
  foto: string;
  bio: string;
  email?: string;
  telefono?: string;
  extension?: string;
  experiencia: number;
}

const departments = ref([
  { id: 'todos', name: 'Todos' },
  { id: 'conservacion', name: 'Conservación' },
  { id: 'educacion', name: 'Educación Ambiental' },
  { id: 'investigacion', name: 'Investigación' },
  { id: 'operaciones', name: 'Operaciones' },
  { id: 'legal', name: 'Asuntos Legales' }
]);

const activeDepartment = ref('todos');
const teamMembers = ref<TeamMember[]>([]);

const filteredTeam = computed(() => {
  if (activeDepartment.value === 'todos') return teamMembers.value;
  return teamMembers.value.filter(member => 
    member.departamento.toLowerCase() === activeDepartment.value
  );
});

// CORRECCIÓN: Evitar el uso de Set con spread operator
const uniqueDepartments = computed(() => {
  const depts = teamMembers.value.map(member => member.departamento);
  const unique = new Set(depts);
  const result: string[] = [];
  unique.forEach(dept => result.push(dept));
  return result;
});

// ALTERNATIVA MÁS SEGURA:
// const uniqueDepartments = computed(() => {
//   const depts = teamMembers.value.map(member => member.departamento);
//   return depts.filter((dept, index) => depts.indexOf(dept) === index);
// });

const yearsExperience = computed(() => {
  if (teamMembers.value.length === 0) return 0;
  const total = teamMembers.value.reduce((sum, member) => sum + member.experiencia, 0);
  return Math.round(total / teamMembers.value.length);
});

const setActiveDepartment = (deptId: string) => {
  activeDepartment.value = deptId;
};

onMounted(async () => {
  try {
    // const response = await medioAmbienteAPI.getEquipo();
    // teamMembers.value = response.data;
    
    // Datos de ejemplo
    teamMembers.value = [
      {
        id: 1,
        nombre: 'María González',
        cargo: 'Directora de Conservación',
        departamento: 'conservacion',
        foto: '/images/team1.jpg',
        bio: 'Más de 15 años de experiencia en conservación de biodiversidad. Lidera proyectos de protección de especies endémicas.',
        email: 'maria.gonzalez@medioambiente.gob.do',
        telefono: '(809) 555-0101',
        extension: '101',
        experiencia: 15
      },
      {
        id: 2,
        nombre: 'Carlos Rodríguez',
        cargo: 'Coordinador de Educación Ambiental',
        departamento: 'educacion',
        foto: '/images/team2.jpg',
        bio: 'Especialista en programas educativos y de concienciación ambiental para comunidades y escuelas.',
        email: 'carlos.rodriguez@medioambiente.gob.do',
        telefono: '(809) 555-0102',
        extension: '102',
        experiencia: 12
      },
      {
        id: 3,
        nombre: 'Ana Martínez',
        cargo: 'Investigadora Principal',
        departamento: 'investigacion',
        foto: '/images/team3.jpg',
        bio: 'Doctora en Ciencias Ambientales. Coordina investigaciones sobre cambio climático y sus efectos en RD.',
        email: 'ana.martinez@medioambiente.gob.do',
        extension: '103',
        experiencia: 18
      }
    ];
  } catch (error) {
    console.error('Error loading team data:', error);
  }
});
</script>

<style scoped lang="scss">
.ministry-team {
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

.department-filters {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;

  .dept-btn {
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

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.team-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);

    .member-overlay {
      opacity: 1;
    }
  }
}

.member-photo {
  position: relative;
  height: 300px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .member-overlay {
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
  }

  .social-links {
    display: flex;
    gap: 1rem;

    a {
      width: 50px;
      height: 50px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1b5e20;
      text-decoration: none;
      transition: all 0.3s ease;

      &:hover {
        background: #1b5e20;
        color: white;
        transform: scale(1.1);
      }

      i {
        font-size: 1.2rem;
      }
    }
  }
}

.member-info {
  padding: 1.5rem;

  h3 {
    color: #1b5e20;
    margin-bottom: 0.5rem;
    font-size: 1.3rem;
  }

  .position {
    color: #333;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .department {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    padding: 0.25rem 0.75rem;
    background: #e8f5e8;
    border-radius: 12px;
    display: inline-block;
  }

  .bio {
    color: #666;
    line-height: 1.5;
    margin-bottom: 1.5rem;
  }

  .member-contact {
    .contact-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
      color: #666;
      font-size: 0.9rem;

      i {
        width: 16px;
        color: #1b5e20;
      }
    }
  }
}

.team-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  padding: 2rem 0;

  .stat-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    .stat-number {
      font-size: 3rem;
      font-weight: bold;
      color: #1b5e20;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: #666;
      font-size: 1.1rem;
    }
  }
}

@media (max-width: 768px) {
  .team-grid {
    grid-template-columns: 1fr;
  }

  .department-filters {
    gap: 0.5rem;
  }

  .dept-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .team-stats {
    grid-template-columns: 1fr;
  }
}
</style>