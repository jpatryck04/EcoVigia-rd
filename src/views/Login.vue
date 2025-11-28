<template>
  <div class="login-page">
    <div class="container">
      <div class="login-container">
        <div class="login-header">
          <h1>Iniciar Sesión</h1>
          <p>Accede como voluntario o administrador</p>
        </div>

        <!-- Selector de Tipo de Usuario -->
        <div class="user-type-selector">
          <button 
            :class="['type-btn', { active: userType === 'volunteer' }]"
            @click="userType = 'volunteer'"
          >
            <i class="fas fa-hands-helping"></i>
            Voluntario
          </button>
          <button 
            :class="['type-btn', { active: userType === 'admin' }]"
            @click="userType = 'admin'"
          >
            <i class="fas fa-user-shield"></i>
            Administrador
          </button>
        </div>

        <!-- Formulario de Login -->
        <form @submit.prevent="handleLogin" class="login-form">
          <!-- Campo Cédula (solo para voluntarios) -->
          <div v-if="userType === 'volunteer'" class="form-group">
            <label for="cedula">Cédula *</label>
            <input
              id="cedula"
              v-model="form.cedula"
              type="text"
              required
              placeholder="Ingresa tu cédula"
              :class="{ error: errors.cedula }"
            />
            <span v-if="errors.cedula" class="error-message">{{ errors.cedula }}</span>
          </div>

          <!-- Campo Email (para ambos) -->
          <div class="form-group">
            <label for="email">Correo Electrónico *</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="Ingresa tu correo electrónico"
              :class="{ error: errors.email }"
            />
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>

          <!-- Campo Contraseña -->
          <div class="form-group">
            <label for="password">Contraseña *</label>
            <div class="password-input">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                :placeholder="userType === 'admin' ? 'Contraseña de administrador' : 'Ingresa tu contraseña'"
                :class="{ error: errors.password }"
              />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>

          <!-- Recordar sesión (solo voluntarios) -->
          <div v-if="userType === 'volunteer'" class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.rememberMe" />
              <span class="checkmark"></span>
              Recordar sesión
            </label>
            <a href="#" class="forgot-password" @click.prevent="showRecovery = true">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <!-- Información Admin -->
          <div v-if="userType === 'admin'" class="admin-info">
            <div class="info-card">
              <i class="fas fa-info-circle"></i>
              <p>Acceso restringido para personal autorizado del Ministerio</p>
            </div>
          </div>

          <button type="submit" :disabled="loading" class="login-btn">
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            {{ loading ? 'Iniciando Sesión...' : userType === 'admin' ? 'Acceder como Admin' : 'Iniciar Sesión' }}
          </button>
        </form>

        <!-- Enlace a registro (solo voluntarios) -->
        <div v-if="userType === 'volunteer'" class="register-link">
          <p>¿No tienes cuenta? <router-link to="/voluntariado">Regístrate como voluntario</router-link></p>
        </div>

        <!-- Modal de Recuperación de Contraseña -->
        <RecoveryModal 
          v-if="showRecovery"
          @close="showRecovery = false"
          @recover="handlePasswordRecovery"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useAppStore } from '@/stores/app';
import { isValidEmail, isValidCedula } from '@/utils';
import { volunteerValidator } from '@/utils/validators';
import RecoveryModal from '@/components/RecoveryModal.vue';

const router = useRouter();
const authStore = useAuthStore();
const appStore = useAppStore();

const userType = ref<'volunteer' | 'admin'>('volunteer');
const loading = ref(false);
const showPassword = ref(false);
const showRecovery = ref(false);

// Configuración de administradores (puede estar en .env en producción)
const ADMIN_CREDENTIALS = {
  email: 'admin@medioambiente.gob.do',
  password: 'AdminMedioAmbiente2024!' // Cambiar en producción
};

const form = reactive({
  cedula: '',
  email: '',
  password: '',
  rememberMe: false
});

const errors = reactive({
  cedula: '',
  email: '',
  password: ''
});

const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach(key => errors[key as keyof typeof errors] = '');

  // Validar email
  if (!isValidEmail(form.email)) {
    errors.email = 'El correo electrónico no es válido';
    return false;
  }

  // Validar cédula (solo para voluntarios)
  if (userType.value === 'volunteer' && !isValidCedula(form.cedula)) {
    errors.cedula = 'La cédula debe tener 11 dígitos';
    return false;
  }

  // Validar contraseña
  if (form.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
    return false;
  }

  return true;
};

const handleLogin = async () => {
  if (!validateForm()) return;

  loading.value = true;

  try {
    if (userType.value === 'admin') {
      await handleAdminLogin();
    } else {
      await handleVolunteerLogin();
    }
  } catch (error) {
    console.error('Login error:', error);
    appStore.addNotification({
      message: 'Error al iniciar sesión. Verifica tus credenciales.',
      type: 'error'
    });
  } finally {
    loading.value = false;
  }
};

const handleAdminLogin = async () => {
  // Verificar credenciales de admin
  if (form.email === ADMIN_CREDENTIALS.email && form.password === ADMIN_CREDENTIALS.password) {
    const adminUser = {
      id: 'admin-001',
      cedula: '00000000000',
      nombre: 'Administrador Ministerio',
      email: ADMIN_CREDENTIALS.email,
      telefono: '(809) 567-4300',
      role: 'admin'
    };

    authStore.login(adminUser, 'admin-token-' + Date.now());
    appStore.addNotification({
      message: 'Bienvenido, Administrador',
      type: 'success'
    });
    
    router.push('/admin/dashboard');
  } else {
    appStore.addNotification({
      message: 'Credenciales de administrador incorrectas',
      type: 'error'
    });
  }
};

const handleVolunteerLogin = async () => {
  try {
    // Simular login de voluntario (reemplazar con API real)
    const mockVolunteer = {
      id: 'vol-' + Date.now(),
      cedula: form.cedula,
      nombre: 'Voluntario Ejemplo', // En realidad vendría de la API
      email: form.email,
      telefono: '(809) 000-0000',
      role: 'volunteer'
    };

    const mockToken = 'volunteer-token-' + Date.now();
    
    authStore.login(mockVolunteer, mockToken);
    appStore.addNotification({
      message: '¡Bienvenido de vuelta!',
      type: 'success'
    });
    
    router.push('/mis-reportes');
  } catch (error) {
    throw new Error('Error en login de voluntario');
  }
};

const handlePasswordRecovery = (email: string) => {
  console.log('Recovery requested for:', email);
  // Implementar recuperación de contraseña
  appStore.addNotification({
    message: 'Se ha enviado un enlace de recuperación a tu correo',
    type: 'info'
  });
};
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1b5e20 0%, #4caf50 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.login-container {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    color: #1b5e20;
    margin-bottom: 0.5rem;
    font-size: 2rem;
  }

  p {
    color: #666;
    font-size: 1rem;
  }
}

.user-type-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
  background: #f8f9fa;
  padding: 0.5rem;
  border-radius: 12px;

  .type-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: #666;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &.active {
      background: white;
      color: #1b5e20;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    &:hover:not(.active) {
      background: rgba(27, 94, 32, 0.1);
      color: #1b5e20;
    }
  }
}

.login-form {
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
      padding: 0.75rem 1rem;
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
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    color: #666;
    font-size: 0.9rem;

    input {
      display: none;
    }

    .checkmark {
      width: 18px;
      height: 18px;
      border: 2px solid #e0e0e0;
      border-radius: 4px;
      position: relative;
      transition: all 0.3s ease;
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
  }

  .forgot-password {
    color: #1b5e20;
    text-decoration: none;
    font-size: 0.9rem;

    &:hover {
      text-decoration: underline;
    }
  }
}

.admin-info {
  margin-bottom: 1.5rem;

  .info-card {
    background: #e3f2fd;
    border: 1px solid #bbdefb;
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;

    i {
      color: #1976d2;
      margin-top: 0.1rem;
    }

    p {
      color: #1976d2;
      margin: 0;
      font-size: 0.9rem;
      line-height: 1.4;
    }
  }
}

.login-btn {
  width: 100%;
  background: #1b5e20;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: #144017;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}

.register-link {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;

  p {
    color: #666;
    margin: 0;

    a {
      color: #1b5e20;
      text-decoration: none;
      font-weight: 600;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 2rem 1.5rem;
  }

  .user-type-selector {
    grid-template-columns: 1fr;
  }

  .form-options {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>