<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <button class="close-btn" @click="$emit('close')">
        <i class="fas fa-times"></i>
      </button>
      
      <div class="modal-header">
        <h2>Recuperar Contraseña</h2>
        <p>Ingresa tu correo electrónico para recuperar tu contraseña</p>
      </div>

      <form @submit.prevent="handleRecovery" class="recovery-form">
        <div class="form-group">
          <label for="recovery-email">Correo Electrónico</label>
          <input
            id="recovery-email"
            v-model="recoveryEmail"
            type="email"
            required
            placeholder="tu@email.com"
          />
        </div>

        <button type="submit" :disabled="loading" class="recovery-btn">
          <i v-if="loading" class="fas fa-spinner fa-spin"></i>
          {{ loading ? 'Enviando...' : 'Enviar Enlace de Recuperación' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Definir los emits correctamente
const emit = defineEmits<{
  close: [];
  recover: [email: string];
}>();

const recoveryEmail = ref('');
const loading = ref(false);

const handleRecovery = () => {
  loading.value = true;
  
  // Simular envío
  setTimeout(() => {
    loading.value = false;
    emit('recover', recoveryEmail.value);
    emit('close');
  }, 1500);
};
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;

  &:hover {
    background: #f5f5f5;
  }
}

.modal-header {
  text-align: center;
  margin-bottom: 2rem;

  h2 {
    color: #1b5e20;
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
  }
}

.recovery-form {
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

      &:focus {
        outline: none;
        border-color: #1b5e20;
      }
    }
  }
}

.recovery-btn {
  width: 100%;
  background: #1b5e20;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
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
</style>