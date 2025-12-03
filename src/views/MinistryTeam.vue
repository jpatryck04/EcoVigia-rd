<template>
  <div class="ministry-team">
    <div class="container">
      <div class="page-header">
        <h1>Nuestro Equipo</h1>
        <p>Conoce al equipo comprometido con la protección ambiental de RD</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando información del equipo...</p>
      </div>

      <!-- Contenido Principal -->
      <div v-else>
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
              <img 
                :src="member.foto || '/images/team-placeholder.jpg'" 
                :alt="member.nombre"
                @error="handleImageError"
              />
              <div class="member-overlay">
                <div class="social-links">
                  <a v-if="member.email" :href="`mailto:${member.email}`" title="Enviar email">
                    <i class="fas fa-envelope"></i>
                  </a>
                  <a v-if="member.telefono" :href="`tel:${member.telefono}`" title="Llamar">
                    <i class="fas fa-phone"></i>
                  </a>
                </div>
              </div>
            </div>
            <div class="member-info">
              <h3>{{ member.nombre }}</h3>
              <p class="position">{{ member.cargo }}</p>
              <p class="department">{{ member.departamento }}</p>
              <p class="bio">{{ member.bio || 'Profesional dedicado a la protección ambiental.' }}</p>
              <div class="member-contact">
                <div v-if="member.email" class="contact-item">
                  <i class="fas fa-envelope"></i>
                  <span>{{ member.email }}</span>
                </div>
                <div v-if="member.telefono" class="contact-item">
                  <i class="fas fa-phone"></i>
                  <span>{{ formatPhone(member.telefono) }}</span>
                </div>
                <div v-if="member.extension" class="contact-item">
                  <i class="fas fa-hashtag"></i>
                  <span>Ext. {{ member.extension }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado vacío -->
        <div v-if="filteredTeam.length === 0 && !loading" class="empty-state">
          <i class="fas fa-users"></i>
          <h3>No hay miembros en este departamento</h3>
          <p>Selecciona otro departamento para ver más equipo</p>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { medioAmbienteAPI } from '@/services/api';
import MinistroImg from '@/assets/MinistryTeam/ministro.jpg';
import ViceministroCCImg from '@/assets/MinistryTeam/viceministra-cambio-climatico.jpg';
import ViceministroAPBImg from '@/assets/MinistryTeam/viceministro-areas-protegidas.jpg';
import ViceministroGAImg from '@/assets/MinistryTeam/viceministro-gestion-ambiental.jpg';
import ViceministroRCMImg from '@/assets/MinistryTeam/viceministro-costeros-marinos.jpg';
import ViceministroRFImg from '@/assets/MinistryTeam/viceministro-recursos-forestales.jpg';


interface TeamMember {
  id: number;
  nombre: string;
  cargo: string;
  departamento: string;
  foto?: string;
  bio?: string;
  email?: string;
  telefono?: string;
  extension?: string;
  experiencia?: number;
  area_especializacion?: string;
  fecha_ingreso?: string;
}

const loading = ref(true);
const activeDepartment = ref('todos');
const teamMembers = ref<TeamMember[]>([]);

// Departamentos dinámicos basados en los datos de la API
const departments = computed(() => {
  const deptList = [
    { id: 'todos', name: 'Todos' }
  ];
  
  // Agregar departamentos únicos de los miembros
  const uniqueDepts = [...new Set(teamMembers.value.map(member => member.departamento))];
  
  uniqueDepts.forEach(dept => {
    if (dept && dept.trim()) {
      deptList.push({
        id: dept.toLowerCase().replace(/\s+/g, '-'),
        name: dept
      });
    }
  });
  
  return deptList;
});

const filteredTeam = computed(() => {
  if (activeDepartment.value === 'todos') return teamMembers.value;
  
  return teamMembers.value.filter(member => {
    const memberDept = member.departamento?.toLowerCase().replace(/\s+/g, '-') || '';
    return memberDept === activeDepartment.value;
  });
});

const uniqueDepartments = computed(() => {
  const depts = teamMembers.value
    .map(member => member.departamento)
    .filter(dept => dept && dept.trim());
  
  return [...new Set(depts)];
});

const yearsExperience = computed(() => {
  const membersWithExp = teamMembers.value.filter(member => member.experiencia);
  
  if (membersWithExp.length === 0) return 0;
  
  const total = membersWithExp.reduce((sum, member) => {
    return sum + (member.experiencia || 0);
  }, 0);
  
  return Math.round(total / membersWithExp.length);
});

const setActiveDepartment = (deptId: string) => {
  activeDepartment.value = deptId;
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = '/images/team-placeholder.jpg';
};

const formatPhone = (phone: string) => {
  // Formatear número de teléfono para mejor visualización
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

// Datos de ejemplo para desarrollo
const getSampleTeamData = (): TeamMember[] => {
  return [
    {
      id: 1,
      nombre: 'Armando Paíno Henríquez',
      cargo: 'Ministro de Medio Ambiente y Recursos Naturales',
      departamento: 'Dirección General',
      foto: MinistroImg,
      bio: 'Abogado especializado en derecho comercial internacional. Dirige la implementación de políticas ambientales y lideró el proceso de gestión integral de residuos sólidos desde DO Sostenible.',
      email: 'paino.henriquez@medioambiente.gob.do',  // [AGREGADO: ejemplo institucional]
      telefono: '8090000000',                          // [AGREGADO: no disponible públicamente]
      extension: '100',                                // [AGREGADO: asignado ficticio]
      experiencia: 25,                                 // [AGREGADO: basado en “más de 25 años en el sector privado”]
      area_especializacion: 'Derecho comercial y gestión de residuos sólidos'
    },
    {
      id: 2,
      nombre: 'Ana Emilia Pimentel Rodríguez',
      cargo: 'Viceministra de Cambio Climático y Sostenibilidad',
      departamento: 'Cambio Climático y Sostenibilidad',
      foto: ViceministroCCImg,
      bio: 'Economista especializada en sostenibilidad, planificación y políticas públicas. Ha liderado estrategias nacionales relacionadas con residuos sólidos y cambio climático.',
      email: 'ana.pimentel@medioambiente.gob.do',  // [AGREGADO: ejemplo institucional]
      telefono: '8090000001',                      // [AGREGADO: no disponible públicamente]
      extension: '201',                            // [AGREGADO: asignado ficticio]
      experiencia: 20,                             // [AGREGADO: estimado por trayectoria 2007–2025]
      area_especializacion: 'Sostenibilidad y política pública'
    },
    {
      id: 3,
      nombre: 'Carlos Augusto Batista',
      cargo: 'Viceministro de Áreas Protegidas y Biodiversidad',
      departamento: 'Áreas Protegidas y Biodiversidad',
      foto: ViceministroAPBImg,
      bio: 'Ingeniero industrial y ambientalista. Especialista en conservación, biodiversidad y manejo de residuos. Ha participado en iniciativas nacionales sobre áreas protegidas.',
      email: 'carlos.batista@medioambiente.gob.do',  // [AGREGADO: ejemplo institucional]
      telefono: '8090000002',                         // [AGREGADO: no disponible públicamente]
      extension: '202',                               // [AGREGADO: asignado ficticio]
      experiencia: 18,                                // [AGREGADO: estimado por trayectoria en sector ambiental desde 2005]
      area_especializacion: 'Biodiversidad y conservación'
    },
    {
      id: 4,
      nombre: 'Lenin Ramón Bueno Rodríguez',
      cargo: 'Viceministro de Gestión Ambiental',
      departamento: 'Gestión Ambiental',
      foto: ViceministroGAImg,
      bio: 'Ingeniero civil con maestría en administración de la construcción. Experto en sostenibilidad, gestión de proyectos y supervisión técnica.',
      email: 'lenin.bueno@medioambiente.gob.do',  // [AGREGADO: ejemplo institucional]
      telefono: '8090000003',                     // [AGREGADO: no disponible públicicamente]
      extension: '203',                           // [AGREGADO: asignado ficticio]
      experiencia: 12,                            // [AGREGADO: estimado por roles 2020–2024 + experiencia previa]
      area_especializacion: 'Gestión ambiental y construcción sostenible'
    },
    {
      id: 5,
      nombre: 'José Ramón Reyes López',
      cargo: 'Viceministro de Recursos Costeros y Marinos',
      departamento: 'Costeros y Marinos',
      foto: ViceministroRCMImg,
      bio: 'Especialista en conservación marina, restauración de manglares y políticas para la protección de ecosistemas costeros. Representa al país en organismos internacionales.',
      email: 'jose.reyes@medioambiente.gob.do',   // [AGREGADO: ejemplo institucional]
      telefono: '8090000004',                      // [AGREGADO: no disponible públicamente]
      extension: '204',                            // [AGREGADO: asignado ficticio]
      experiencia: 10,                             // [AGREGADO: estimado desde 2020 como viceministro]
      area_especializacion: 'Conservación marina y recursos costeros'
    },
    {
      id: 6,
      nombre: 'José Elías González',
      cargo: 'Viceministro de Recursos Forestales',
      departamento: 'Recursos Forestales',
      foto: ViceministroRFImg,
      bio: 'Especialista forestal con amplia trayectoria en manejo forestal, reforestación, silvicultura e investigaciones agroforestales. Asesor y docente en el sector forestal.',
      email: 'jose.gonzalez@medioambiente.gob.do',  // [AGREGADO: ejemplo institucional]
      telefono: '8090000005',                        // [AGREGADO: no disponible públicamente]
      extension: '205',                              // [AGREGADO: asignado ficticio]
      experiencia: 30,                               // [AGREGADO: estimado por décadas de trayectoria]
      area_especializacion: 'Manejo forestal y conservación'
    }
  ];
};

const loadTeamData = async () => {
  loading.value = true;
  
  try {
    // Intenta cargar desde la API
    const response = await medioAmbienteAPI.getEquipo();
    
    if (response.data && Array.isArray(response.data)) {
      teamMembers.value = response.data;
    } else {
      // Si la API no responde, usa datos de ejemplo
      console.warn('API no respondió con datos válidos, usando datos de ejemplo');
      teamMembers.value = getSampleTeamData();
    }
  } catch (error) {
    console.error('Error loading team data from API:', error);
    // En caso de error, usar datos de ejemplo para desarrollo
    teamMembers.value = getSampleTeamData();
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadTeamData();
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

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #1b5e20;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  p {
    color: #666;
    font-size: 1.1rem;
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
    white-space: nowrap;

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
  border: 1px solid #e0e0e0;

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
  background: #f0f0f0;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    background: #f8f9fa;
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
    font-size: 1.1rem;
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
    font-size: 0.95rem;
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

      span {
        word-break: break-all;
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
    margin-bottom: 1rem;
    color: #333;
  }
}

.team-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  padding: 3rem 0;
  border-top: 1px solid #e0e0e0;
  margin-top: 2rem;

  .stat-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid #e0e0e0;

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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .team-grid {
    grid-template-columns: 1fr;
  }

  .department-filters {
    gap: 0.5rem;
    
    .dept-btn {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }
  }

  .team-stats {
    grid-template-columns: 1fr;
  }

  .member-photo {
    height: 250px;
  }
}
</style>