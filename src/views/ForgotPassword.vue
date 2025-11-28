<template>
  <div class="forgot-password-page">
    <div class="container">
      <div class="password-card">
        <button class="back-btn" @click="$router.back()">
          <i class="fas fa-arrow-left"></i>
          Volver
        </button>

        <div class="password-header">
          <h1>Recuperar Contraseña</h1>
          <p>Ingresa tu correo electrónico para restablecer tu contraseña</p>
        </div>

        <form @submit.prevent="handleReset" class="password-form">
          <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="tu@email.com"
            />
          </div>

          <button type="submit" :disabled="loading" class="submit-btn">
            <span v-if="loading">
              <i class="fas fa-spinner fa-spin"></i>
              Enviando...
            </span>
            <span v-else>
              <i class="fas fa-paper-plane"></i>
              Enviar Instrucciones
            </span>
          </button>
        </form>

        <div class="password-footer">
          <p>¿Recordaste tu contraseña? 
            <router-link to="/login">Iniciar Sesión</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const loading = ref(false);
const form = ref({
  email: ''
});

const handleReset = async () => {
  loading.value = true;
  
  // Simular envío de instrucciones
  setTimeout(() => {
    alert('Se han enviado las instrucciones para restablecer tu contraseña a tu correo electrónico.');
    loading.value = false;
  }, 2000);
};
</script>

<style scoped lang="scss">
.forgot-password-page {
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

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 2px solid #1b5e20;
  color: #1b5e20;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 2rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: #1b5e20;
    color: white;
  }
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
    margin-bottom: 2rem;

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

.password-footer {
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
</style>