<template>
  <div class="toast-container">
    <div v-for="toast in toasts" :key="toast.id" 
         :class="['toast', `toast-${toast.type}`]">
      <i :class="getToastIcon(toast.type)"></i>
      <span>{{ toast.message }}</span>
      <button @click="removeToast(toast.id)" class="toast-close">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

const toasts = ref<Toast[]>([]);

const getToastIcon = (type: string) => {
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  };
  return icons[type as keyof typeof icons];
};

const removeToast = (id: string) => {
  toasts.value = toasts.value.filter(toast => toast.id !== id);
};

// Función para agregar toasts (puede ser llamada desde otros componentes)
const addToast = (message: string, type: Toast['type'] = 'info', duration: number = 5000) => {
  const id = Date.now().toString();
  const toast: Toast = { id, message, type, duration };
  
  toasts.value.push(toast);
  
  if (duration > 0) {
    setTimeout(() => removeToast(id), duration);
  }
};

// Exponer la función para uso global
defineExpose({ addToast });
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease;
}

.toast-success { background: #4caf50; }
.toast-error { background: #f44336; }
.toast-warning { background: #ff9800; }
.toast-info { background: #2196f3; }

.toast-close {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  margin-left: auto;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>