<template>
  <div class="change-password-page">
    <div class="container">
      <div class="password-card">
        <div class="password-header">
          <h1>Cambiar Contraseña</h1>
          <p>Actualiza tu contraseña para mantener tu cuenta segura</p>
        </div>

        <form @submit.prevent="handleChangePassword" class="password-form">
          <div class="form-group">
            <label for="currentPassword">Contraseña Actual</label>
            <input
              id="currentPassword"
              v-model="form.currentPassword"
              type="password"
              required
              placeholder="Ingresa tu contraseña actual"
            />
          </div>

          <div class="form-group">
            <label for="newPassword">Nueva Contraseña</label>
            <input
              id="newPassword"
              v-model="form.newPassword"
              type="password"
              required
              placeholder="Ingresa tu nueva contraseña"
              minlength="8"
            />
            <div class="password-requirements">
              <span :class="{ met: hasMinLength }">Mínimo 8 caracteres</span>
              <span :class="{ met: hasUpperCase }">Una mayúscula</span>
              <span :class="{ met: hasLowerCase }">Una minúscula</span>
              <span :class="{ met: hasNumber }">Un número</span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmar Nueva Contraseña</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              placeholder="Confirma tu nueva contraseña"
            />
            <span v-if="!passwordsMatch && form.confirmPassword" class="error-message">
              Las contraseñas no coinciden
            </span>
          </div>

          <button 
            type="submit" 
            :disabled="loading || !isFormValid" 
            class="submit-btn"
          >
            <span v-if="loading">
              <i class="fas fa-spinner fa-spin"></i>
              Cambiando Contraseña...
            </span>
            <span v-else>
              <i class="fas fa-key"></i>
              Cambiar Contraseña
            </span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const loading = ref(false);
const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// Validaciones de contraseña
const hasMinLength = computed(() => form.value.newPassword.length >= 8);
const hasUpperCase = computed(() => /[A-Z]/.test(form.value.newPassword));
const hasLowerCase = computed(() => /[a-z]/.test(form.value.newPassword));
const hasNumber = computed(() => /[0-9]/.test(form.value.newPassword));

const passwordsMatch = computed(() => 
  form.value.newPassword === form.value.confirmPassword
);

const isFormValid = computed(() => 
  form.value.currentPassword &&
  form.value.newPassword &&
  form.value.confirmPassword &&
  hasMinLength.value &&
  hasUpperCase.value &&
  hasLowerCase.value &&
  hasNumber.value &&
  passwordsMatch.value
);

const handleChangePassword = async () => {
  loading.value = true;

  try {
    // Simular cambio de contraseña
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('¡Contraseña cambiada exitosamente!');
    router.push('/');
    
  } catch (error) {
    alert('Error al cambiar la contraseña');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.change-password-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1b5e20 0%, #4caf50 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.container {
  max-width: 500px;
  width: 100%;
}

.password-card {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.password-header {
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

.password-form {
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
    }

    .password-requirements {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      margin-top: 0.5rem;

      span {
        font-size: 0.8rem;
        color: #666;

        &.met {
          color: #4caf50;
          font-weight: 500;
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

.submit-btn {
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

@media (max-width: 768px) {
  .password-card {
    padding: 2rem;
    margin: 0 1rem;
  }

  .password-requirements {
    grid-template-columns: 1fr !important;
  }
}
</style>