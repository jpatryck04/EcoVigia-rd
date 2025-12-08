<template>
  <div class="modal-overlay" @click="$emit('cancel')">
    <div class="modal-content" @click.stop>
      <div class="modal-icon" :class="type">
        <i :class="getIcon()"></i>
      </div>
      
      <div class="modal-header">
        <h3>{{ title }}</h3>
      </div>
      
      <div class="modal-body">
        <p>{{ message }}</p>
      </div>
      
      <div class="modal-actions">
        <button 
          v-if="cancelText"
          class="btn-secondary" 
          @click="$emit('cancel')"
        >
          {{ cancelText }}
        </button>
        <button 
          class="btn-primary" 
          :class="type"
          @click="$emit('confirm')"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger' | 'success';
}

const props = withDefaults(defineProps<Props>(), {
  cancelText: 'Cancelar',
  type: 'warning'
});

defineEmits<{
  confirm: [];
  cancel: [];
}>();

const getIcon = () => {
  const icons = {
    info: 'fas fa-info-circle',
    warning: 'fas fa-exclamation-triangle',
    danger: 'fas fa-exclamation-circle',
    success: 'fas fa-check-circle'
  };
  return icons[props.type] || 'fas fa-question-circle';
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
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
  overflow: hidden;
}

.modal-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 2rem 1rem;
  
  i {
    font-size: 4rem;
  }
  
  &.info {
    color: #2196f3;
  }
  
  &.warning {
    color: #ff9800;
  }
  
  &.danger {
    color: #f44336;
  }
  
  &.success {
    color: #4caf50;
  }
}

.modal-header {
  padding: 0 2rem;
  text-align: center;
  
  h3 {
    margin: 0;
    color: #333;
    font-size: 1.5rem;
    font-weight: 600;
  }
}

.modal-body {
  padding: 1.5rem 2rem;
  
  p {
    margin: 0;
    color: #666;
    text-align: center;
    line-height: 1.5;
    font-size: 1.1rem;
  }
}

.modal-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
  
  button {
    flex: 1;
    padding: 1rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
  
  &:hover {
    background: #d0d0d0;
  }
  
  &:active {
    background: #c0c0c0;
  }
}

.btn-primary {
  color: white;
  
  &.info {
    background: #2196f3;
    
    &:hover {
      background: #1976d2;
    }
  }
  
  &.warning {
    background: #ff9800;
    
    &:hover {
      background: #f57c00;
    }
  }
  
  &.danger {
    background: #f44336;
    
    &:hover {
      background: #d32f2f;
    }
  }
  
  &.success {
    background: #4caf50;
    
    &:hover {
      background: #388e3c;
    }
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .modal-content {
    max-width: 90%;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .modal-icon i {
    font-size: 3rem;
  }
  
  .modal-header h3 {
    font-size: 1.3rem;
  }
  
  .modal-body p {
    font-size: 1rem;
  }
}
</style>