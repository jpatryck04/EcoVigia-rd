<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>Iniciar Sesión</h1>
          <p>Accede a tu cuenta de EcoVigía RD</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="tu@email.com"
              :class="{ error: errors.email }"
            />
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              placeholder="Tu contraseña"
              :class="{ error: errors.password }"
            />
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>

          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="form.remember" />
              <span>Recordarme</span>
            </label>
            <router-link to="/recuperar-contrasena" class="forgot-password">
              ¿Olvidaste tu contraseña?
            </router-link>
          </div>

          <button type="submit" :disabled="loading" class="login-btn">
            <span v-if="loading">
              <i class="fas fa-spinner fa-spin"></i>
              Iniciando sesión...
            </span>
            <span v-else>
              <i class="fas fa-sign-in-alt"></i>
              Iniciar Sesión
            </span>
          </button>
        </form>

        <div class="login-footer">
          <p>¿No tienes cuenta? 
            <router-link to="/voluntariado">Solicita ser voluntario</router-link>
          </p>
        </div>
      </div>

      <div class="login-hero">
        <div class="hero-content">
          <h2>Bienvenido de vuelta</h2>
          <p>Accede para reportar daños ambientales, ver tus reportes y contribuir con la protección de nuestro medio ambiente.</p>
          <div class="hero-features">
            <div class="feature">
              <i class="fas fa-exclamation-triangle"></i>
              <span>Reporta daños ambientales</span>
            </div>
            <div class="feature">
              <i class="fas fa-map-marked-alt"></i>
              <span>Sigue tus reportes</span>
            </div>
            <div class="feature">
              <i class="fas fa-chart-line"></i>
              <span>Mira el impacto de tus contribuciones</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { loginValidator } from '@/utils/validators';
import { handleApiError } from '@/utils';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const form = ref({
  email: '',
  password: '',
  remember: false
});

const errors = ref({
  email: '',
  password: ''
});

const handleLogin = async () => {
  // Validar formulario
  const validation = loginValidator(form.value);
  if (!validation.valid) {
    validation.errors.forEach(error => {
      if (error.includes('correo')) errors.value.email = error;
      if (error.includes('contraseña')) errors.value.password = error;
    });
    return;
  }

  loading.value = true;
  errors.value = { email: '', password: '' };

  try {
    // Simular login (reemplazar con API real)
    const userData = {
      id: '1',
      cedula: '00112345678',
      nombre: 'Usuario Demo',
      email: form.value.email,
      telefono: '809-123-4567'
    };

    authStore.login(userData, 'demo-token');
    
    // Redirigir a la página principal
    router.push('/');
    
  } catch (error) {
    const errorMessage = handleApiError(error);
    errors.value.email = errorMessage;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1b5e20 0%, #4caf50 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  width: 100%;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.login-card {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  margin-bottom: 2rem;

  .remember-me {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;

    input {
      margin: 0;
    }

    span {
      color: #666;
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
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;

  p {
    color: #666;
  }

  a {
    color: #1b5e20;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
}

.login-hero {
  background: linear-gradient(135deg, #1b5e20, #4caf50);
  color: white;
  padding: 3rem;
  display: flex;
  align-items: center;

  .hero-content {
    h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    p {
      margin-bottom: 2rem;
      opacity: 0.9;
      line-height: 1.6;
    }
  }
}

.hero-features {
  .feature {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;

    i {
      font-size: 1.2rem;
      width: 20px;
    }

    span {
      opacity: 0.9;
    }
  }
}

@media (max-width: 768px) {
  .login-container {
    grid-template-columns: 1fr;
  }

  .login-hero {
    display: none;
  }
}
</style>