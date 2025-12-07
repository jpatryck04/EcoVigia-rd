<template>
  <div class="modal-overlay" @click.self="emitClose">
    <div class="modal-content">
      <div class="modal-header" :class="type">
        <i :class="getIcon()"></i>
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="emitClose">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <p>{{ message }}</p>
      </div>
      
      <div class="modal-footer">
        <button 
          class="btn-cancel" 
          @click="emitCancel"
          :style="type === 'danger' ? { order: 2 } : {}"
        >
          {{ cancelText }}
        </button>
        <button 
          class="btn-confirm" 
          :class="type"
          @click="emitConfirm"
          :style="type === 'danger' ? { order: 1 } : {}"
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
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger' | 'success';
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  type: 'info'
});

const emit = defineEmits<{
  confirm: [];
  cancel: [];
  close: [];
}>();

const getIcon = () => {
  const icons = {
    info: 'fas fa-info-circle',
    warning: 'fas fa-exclamation-triangle',
    danger: 'fas fa-exclamation-circle',
    success: 'fas fa-check-circle'
  };
  return icons[props.type];
};

const emitConfirm = () => {
  emit('confirm');
};

const emitCancel = () => {
  emit('cancel');
};

const emitClose = () => {
  emit('close');
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
  z-index: 2000;
  padding: 1rem;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

.modal-header {
  padding: 2rem 2rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  
  &.info {
    background: #e3f2fd;
    color: #1976d2;
  }
  
  &.warning {
    background: #fff3e0;
    color: #ff9800;
  }
  
  &.danger {
    background: #ffebee;
    color: #f44336;
  }
  
  &.success {
    background: #e8f5e8;
    color: #4caf50;
  }
  
  i {
    font-size: 2rem;
  }
  
  h3 {
    margin: 0;
    flex: 1;
    font-size: 1.5rem;
    font-weight: 600;
  }
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
  
  i {
    font-size: 1rem;
    color: inherit;
  }
}

.modal-body {
  padding: 2rem;
  
  p {
    margin: 0;
    color: #333;
    line-height: 1.6;
    font-size: 1.1rem;
    text-align: center;
  }
}

.modal-footer {
  padding: 1.5rem 2rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  border-top: 1px solid #e0e0e0;
  
  button {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 120px;
  }
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
  
  &:hover {
    background: #e0e0e0;
    color: #333;
  }
}

.btn-confirm {
  color: white;
  
  &.info {
    background: #1976d2;
    
    &:hover {
      background: #1565c0;
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
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .modal-content {
    max-width: 90%;
  }
  
  .modal-header {
    padding: 1.5rem 1.5rem 1rem;
    
    h3 {
      font-size: 1.3rem;
    }
  }
  
  .modal-body {
    padding: 1.5rem;
  }
  
  .modal-footer {
    padding: 1rem 1.5rem;
    flex-direction: column;
    
    button {
      width: 100%;
      min-width: auto;
    }
  }
}
</style>