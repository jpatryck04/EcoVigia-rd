<template>
  <div class="volunteer-page">
    <div class="container">
      <div class="page-header">
        <h1>Únete como Voluntario</h1>
        <p>Forma parte del cambio y ayuda a proteger nuestro medio ambiente</p>
      </div>

      <div class="volunteer-content">
        <div class="requirements-section">
          <h2>Requisitos para ser Voluntario</h2>
          <ul class="requirements-list">
            <li>Ser mayor de 18 años</li>
            <li>Tener cédula dominicana</li>
            <li>Compromiso con el medio ambiente</li>
            <li>Disponibilidad de tiempo</li>
            <li>Actitud positiva y proactiva</li>
          </ul>
          
          <div class="process-info">
            <h3>Proceso de Aprobación</h3>
            <div class="process-steps">
              <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                  <strong>Envía tu solicitud</strong>
                  <p>Completa el formulario de registro</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                  <strong>Revisión del administrador</strong>
                  <p>Verificaremos tu información</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                  <strong>Notificación por correo</strong>
                  <p>Te informaremos el resultado</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">4</div>
                <div class="step-content">
                  <strong>Acceso a la plataforma</strong>
                  <p>Podrás iniciar sesión si eres aprobado</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form @submit.prevent="submitApplication" class="volunteer-form">
          <h2>Solicitud de Voluntariado</h2>
          
          <div class="form-group">
            <label for="cedula">Cédula *</label>
            <input
              id="cedula"
              v-model="form.cedula"
              type="text"
              required
              placeholder="Ej: 00112345678"
              :class="{ error: errors.cedula }"
            />
            <span v-if="errors.cedula" class="error-message">{{ errors.cedula }}</span>
            <small class="help-text">11 dígitos sin guiones</small>
          </div>

          <div class="form-group">
            <label for="nombre">Nombre y Apellido *</label>
            <input
              id="nombre"
              v-model="form.nombre"
              type="text"
              required
              placeholder="Ej: Juan Pérez García"
              :class="{ error: errors.nombre }"
            />
            <span v-if="errors.nombre" class="error-message">{{ errors.nombre }}</span>
          </div>

          <div class="form-group">
            <label for="email">Correo Electrónico *</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="ejemplo@correo.com"
              :class="{ error: errors.email }"
            />
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label for="password">Contraseña *</label>
            <div class="password-input">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="Mínimo 8 caracteres con mayúsculas, minúsculas y números"
                :class="{ error: errors.password }"
              />
              <button type="button" class="toggle-password" @click="togglePassword">
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
            <small class="help-text">Debe incluir mayúsculas, minúsculas y números</small>
          </div>

          <div class="form-group">
            <label for="telefono">Teléfono *</label>
            <input
              id="telefono"
              v-model="form.telefono"
              type="tel"
              required
              placeholder="Ej: 8095551234"
              :class="{ error: errors.telefono }"
            />
            <span v-if="errors.telefono" class="error-message">{{ errors.telefono }}</span>
          </div>

          <div class="form-terms">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.acceptTerms" :class="{ error: !form.acceptTerms && termsError }" />
              <span class="checkmark"></span>
              Acepto los <a href="#" @click.prevent="showTerms">términos y condiciones</a> del voluntariado
            </label>
            <span v-if="termsError" class="error-message">Debes aceptar los términos y condiciones</span>
          </div>

          <button type="submit" :disabled="loading" class="submit-btn">
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            {{ loading ? 'Enviando...' : 'Enviar Solicitud' }}
          </button>    
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useAppStore } from '@/stores/app';
import { volunteerValidator } from '@/utils/validators';

const router = useRouter();
const authStore = useAuthStore();
const appStore = useAppStore();

const loading = ref(false);
const showPassword = ref(false);
const termsError = ref(false);

const form = reactive({
  cedula: '',
  nombre: '',
  email: '',
  password: '',
  telefono: '',
  acceptTerms: false
});

const errors = reactive({
  cedula: '',
  nombre: '',
  email: '',
  password: '',
  telefono: ''
});

// Debug function
const debugStorage = () => {
  console.log('=== DEBUG LOCALSTORAGE ===');
  
  // Verificar diferentes claves que podrían estar usando
  const keys = [
    'eco_vigia_volunteer_applications',
    'eco_vigia_volunteers',
    'voluntarios',
    'volunteer_applications'
  ];
  
  keys.forEach(key => {
    const data = localStorage.getItem(key);
    console.log(`Key: ${key}`, data ? JSON.parse(data) : 'Empty');
  });
  
  // Verificar store
  console.log('Auth store methods available:', {
    registerVolunteer: typeof authStore.registerVolunteer,
    getAllVolunteers: typeof authStore.getAllVolunteers,
    isEmailRegistered: typeof authStore.isEmailRegistered
  });
  
  // Mostrar notificación
  appStore.addNotification({
    message: 'Datos de almacenamiento verificados en consola',
    type: 'info'
  });
};

onMounted(() => {
  console.log('Volunteer page mounted');
  // Inicializar localStorage si no existe
  if (!localStorage.getItem('eco_vigia_volunteer_applications')) {
    localStorage.setItem('eco_vigia_volunteer_applications', JSON.stringify([]));
    console.log('LocalStorage inicializado para voluntarios');
  }
});

const validateForm = (): boolean => {
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = '';
  });
  termsError.value = false;

  // Validar términos
  if (!form.acceptTerms) {
    termsError.value = true;
    appStore.addNotification({
      message: 'Debes aceptar los términos y condiciones',
      type: 'error'
    });
    return false;
  }

  // Usar el validator
  const validation = volunteerValidator(form);
  if (!validation.valid) {
    validation.errors.forEach(error => {
      // Extraer el campo del error
      if (error.includes('cédula')) errors.cedula = error;
      else if (error.includes('nombre')) errors.nombre = error;
      else if (error.includes('correo')) errors.email = error;
      else if (error.includes('contraseña')) errors.password = error;
      else if (error.includes('teléfono')) errors.telefono = error;
      else {
        // Error genérico
        appStore.addNotification({
          message: error,
          type: 'error'
        });
      }
    });
    return false;
  }

  return true;
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const showTerms = () => {
  const termsText = `
  TÉRMINOS Y CONDICIONES DEL VOLUNTARIADO

  1. COMPROMISO
  El voluntario se compromete a respetar las normas, políticas y procedimientos establecidos por el Ministerio de Medio Ambiente y Recursos Naturales.

  2. RESPONSABILIDADES
  - Asistir puntualmente a las actividades programadas
  - Seguir las instrucciones del personal asignado
  - Reportar cualquier incidente o situación irregular
  - Mantener conducta ética y profesional

  3. CONFIDENCIALIDAD
  El voluntario deberá mantener confidencialidad sobre la información interna del Ministerio a la que tenga acceso.

  4. SEGURIDAD
  El voluntario debe cumplir con todas las normas de seguridad y protección ambiental durante las actividades.

  5. DERECHOS
  - Recibir capacitación adecuada
  - Contar con equipo de protección necesario
  - Ser tratado con respeto y dignidad
  - Recibir certificado de participación

  6. APROBACIÓN
  El Ministerio se reserva el derecho de aprobar o rechazar solicitudes según criterios establecidos.

  7. BAJA
  El voluntario puede darse de baja notificando con 7 días de anticipación.

  Al marcar esta casilla, aceptas cumplir con estos términos y condiciones.
  `;
  
  alert(termsText);
};

const submitApplication = async () => {
  console.log('=== INICIANDO ENVÍO DE SOLICITUD ===');
  console.log('Datos del formulario:', { ...form, password: '***' });
  
  // Validar formulario
  if (!validateForm()) {
    console.log('Validación fallida');
    return;
  }

  loading.value = true;

  try {
    console.log('Llamando a registerVolunteer...');
    
    // Preparar datos para enviar
    const volunteerData = {
      cedula: form.cedula.trim(),
      nombre: form.nombre.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      telefono: form.telefono.trim()
    };
    
    console.log('Datos enviados al store:', { ...volunteerData, password: '***' });
    
    // Llamar al store
    const result = authStore.registerVolunteer(volunteerData);
    console.log('Resultado del store:', result);
    
    if (result.success) {
      console.log('✅ Registro exitoso');
      
      // Verificar que se guardó correctamente
      debugStorage();
      
      // Limpiar formulario
      Object.assign(form, {
        cedula: '',
        nombre: '',
        email: '',
        password: '',
        telefono: '',
        acceptTerms: false
      });
      
      // Mostrar notificación de éxito
      appStore.addNotification({
        message: '✅ ' + result.message + '. Un administrador revisará tu solicitud pronto.',
        type: 'success'
      });
      
      // Redirigir después de 3 segundos
      setTimeout(() => {
        router.push('/login');
      }, 3000);
      
    } else {
      console.log('❌ Registro fallido:', result.message);
      appStore.addNotification({
        message: '❌ ' + result.message,
        type: 'error'
      });
    }
    
  } catch (error: any) {
    console.error('Error en submitApplication:', error);
    appStore.addNotification({
      message: '❌ Error al procesar la solicitud: ' + (error.message || 'Error desconocido'),
      type: 'error'
    });
  } finally {
    loading.value = false;
    console.log('=== FINALIZADO ENVÍO DE SOLICITUD ===');
  }
};
</script>

<style scoped lang="scss">
.volunteer-page {
  padding: 2rem 0;
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
    font-size: 1.1rem;
  }
}

.volunteer-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 1000px;
  margin: 0 auto;
}

.requirements-section {
  h2 {
    color: #1b5e20;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }
  
  .requirements-list {
    list-style: none;
    padding: 0;
    margin-bottom: 2rem;
    
    li {
      padding: 0.75rem 1rem;
      margin-bottom: 0.5rem;
      background: #e8f5e8;
      border-left: 4px solid #2e7d32;
      border-radius: 4px;
    }
  }
}

.process-info {
  h3 {
    color: #1b5e20;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }
}

.process-steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  
  .step-number {
    width: 30px;
    height: 30px;
    background: #1b5e20;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    flex-shrink: 0;
  }
  
  .step-content {
    strong {
      display: block;
      color: #333;
      margin-bottom: 0.25rem;
    }
    
    p {
      color: #666;
      margin: 0;
      font-size: 0.9rem;
    }
  }
}

.volunteer-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  position: relative;
  
  h2 {
    color: #1b5e20;
    margin-bottom: 2rem;
    text-align: center;
    font-size: 1.5rem;
  }
}

.form-group {
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: 500;
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #1b5e20;
    }
    
    &.error {
      border-color: #f44336;
    }
  }
  
  .password-input {
    position: relative;
    
    input {
      padding-right: 3rem;
    }
    
    .toggle-password {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      padding: 0.25rem;
      
      &:hover {
        color: #333;
      }
    }
  }
  
  .error-message {
    color: #f44336;
    font-size: 0.8rem;
    margin-top: 0.25rem;
    display: block;
  }
  
  .help-text {
    color: #666;
    font-size: 0.8rem;
    margin-top: 0.25rem;
    display: block;
  }
}

.form-terms {
  margin: 2rem 0;
  
  .checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    cursor: pointer;
    color: #666;
    font-size: 0.9rem;
    
    input {
      display: none;
      
      &.error + .checkmark {
        border-color: #f44336;
      }
    }
    
    .checkmark {
      width: 20px;
      height: 20px;
      border: 2px solid #e0e0e0;
      border-radius: 4px;
      position: relative;
      transition: all 0.3s ease;
      flex-shrink: 0;
      margin-top: 0.1rem;
    }
    
    input:checked + .checkmark {
      background: #1b5e20;
      border-color: #1b5e20;
      
      &::after {
        content: '✓';
        position: absolute;
        color: white;
        font-size: 12px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    
    a {
      color: #1b5e20;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.submit-btn {
  width: 100%;
  background: #1b5e20;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  
  &:hover:not(:disabled) {
    background: #144017;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}

.debug-btn {
  width: 100%;
  background: #ff9800;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: #f57c00;
  }
}

@media (max-width: 768px) {
  .volunteer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .volunteer-form {
    padding: 1.5rem;
  }
  
  .debug-btn {
    font-size: 0.8rem;
    padding: 0.5rem;
  }
}
</style>