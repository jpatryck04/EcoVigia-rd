<template>
  <div class="volunteer-login">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>Acceso de Voluntarios</h1>
          <p>Ingresa con tus credenciales aprobadas</p>
        </div>

        <!-- Mensajes de estado -->
        <div v-if="message" :class="['message', messageType]">
          <i :class="messageIcon"></i>
          {{ message }}
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input
              id="email"
              v-model="loginForm.email"
              type="email"
              required
              placeholder="Ingresa tu correo electrónico"
              :class="{ error: emailError }"
            />
            <div v-if="emailError" class="error-message">
              {{ emailError }}
            </div>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input
              id="password"
              v-model="loginForm.password"
              type="password"
              required
              placeholder="Ingresa tu contraseña"
            />
          </div>

          <button type="submit" :disabled="loading" class="login-btn">
            <span v-if="loading">
              <i class="fas fa-spinner fa-spin"></i> Verificando...
            </span>
            <span v-else>
              <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
            </span>
          </button>
        </form>

        <div class="login-footer">
          <p>¿No tienes una cuenta de voluntario?</p>
          <router-link to="/voluntariado" class="register-link">
            <i class="fas fa-user-plus"></i> Solicitar Ser Voluntario
          </router-link>
        </div>

        <!-- Información para desarrolladores -->
        <div class="dev-info">
          <h4>💡 Información para Desarrolladores:</h4>
          <p>Para poder iniciar sesión como voluntario, primero debes:</p>
          <ol>
            <li>Registrarte en la sección de <strong>Voluntariado</strong></li>
            <li>Esperar a que un administrador <strong>apruebe tu solicitud</strong></li>
            <li>Usar el mismo email y contraseña que registraste</li>
          </ol>
          <div class="approved-volunteers" v-if="approvedVolunteers.length > 0">
            <strong>Voluntarios Aprobados (para testing):</strong>
            <div v-for="volunteer in approvedVolunteers" :key="volunteer.id" class="volunteer-item">
              <span>{{ volunteer.email }}</span>
              <span>Contraseña: {{ volunteer.password }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const loginForm = ref({
  email: '',
  password: ''
});

const loading = ref(false);
const message = ref('');
const messageType = ref(''); // 'success' | 'error' | 'warning'
const emailError = ref('');

const messageIcon = computed(() => {
  switch (messageType.value) {
    case 'success': return 'fas fa-check-circle';
    case 'error': return 'fas fa-exclamation-circle';
    case 'warning': return 'fas fa-exclamation-triangle';
    default: return 'fas fa-info-circle';
  }
});

const approvedVolunteers = computed(() => {
  return authStore.getApprovedVolunteers();
});

const checkEmailStatus = () => {
  const email = loginForm.value.email.trim();
  if (!email) return;

  if (authStore.isEmailRegistered(email)) {
    if (authStore.isVolunteerApproved(email)) {
      emailError.value = '';
    } else {
      emailError.value = 'Tu solicitud de voluntariado está pendiente de aprobación.';
      message.value = 'Tu cuenta está pendiente de aprobación por un administrador.';
      messageType.value = 'warning';
    }
  } else {
    emailError.value = 'No existe una cuenta registrada con este email.';
    message.value = 'Debes registrarte primero como voluntario.';
    messageType.value = 'error';
  }
};

const handleLogin = async () => {
  loading.value = true;
  message.value = '';
  messageType.value = '';
  emailError.value = '';

  try {
    const success = authStore.loginVolunteer(loginForm.value.email, loginForm.value.password);
    
    if (success) {
      message.value = '¡Inicio de sesión exitoso!';
      messageType.value = 'success';
      
      // Redirigir después de un breve delay
      setTimeout(() => {
        router.push('/mis-reportes');
      }, 1500);
    } else {
      message.value = 'Credenciales incorrectas. Verifica tu email y contraseña.';
      messageType.value = 'error';
    }
  } catch (error) {
    message.value = 'Error al iniciar sesión. Intenta nuevamente.';
    messageType.value = 'error';
    console.error('Login error:', error);
  } finally {
    loading.value = false;
  }
};

// Verificar autenticación existente
onMounted(() => {
  if (authStore.isAuthenticated && authStore.userType === 'volunteer') {
    router.push('/mis-reportes');
  }
});
</script>

<style scoped lang="scss">
.volunteer-login {
  min-height: 100vh;
  background: linear-gradient(135deg, #1b5e20 0%, #4caf50 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  max-width: 450px;
  width: 100%;
}

.login-card {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
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
  }
}

.message {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  &.success {
    background: #e8f5e8;
    color: #2e7d32;
    border: 1px solid #c8e6c9;
  }
  
  &.error {
    background: #ffebee;
    color: #c62828;
    border: 1px solid #ffcdd2;
  }
  
  &.warning {
    background: #fff3e0;
    color: #ef6c00;
    border: 1px solid #ffe0b2;
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
    
    .error-message {
      color: #f44336;
      font-size: 0.875rem;
      margin-top: 0.5rem;
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

.login-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
  
  p {
    color: #666;
    margin-bottom: 1rem;
  }
}

.register-link {
  color: #1b5e20;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #144017;
  }
}

.dev-info {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #1b5e20;
  
  h4 {
    color: #1b5e20;
    margin-bottom: 1rem;
  }
  
  p {
    color: #666;
    margin-bottom: 1rem;
  }
  
  ol {
    color: #666;
    margin-bottom: 1rem;
    padding-left: 1.5rem;
    
    li {
      margin-bottom: 0.5rem;
    }
  }
}

.approved-volunteers {
  margin-top: 1rem;
  
  strong {
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
  }
}

.volunteer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  
  span:first-child {
    color: #333;
  }
  
  span:last-child {
    color: #666;
    font-family: monospace;
  }
}

@media (max-width: 768px) {
  .volunteer-login {
    padding: 1rem;
  }
  
  .login-card {
    padding: 2rem;
  }
  
  .volunteer-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>