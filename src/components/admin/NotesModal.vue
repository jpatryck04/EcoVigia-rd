<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Agregar Notas para {{ volunteer.nombre }}</h3>
        <button class="close-btn" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="form-group">
          <label>Notas (opcional)</label>
          <textarea 
            v-model="notes"
            rows="4"
            placeholder="Agrega notas sobre este voluntario..."
          ></textarea>
        </div>
      </div>
      
      <div class="modal-actions">
        <button class="btn-secondary" @click="$emit('close')">
          Cancelar
        </button>
        <button class="btn-primary" @click="saveNotes">
          <i class="fas fa-save"></i>
          Guardar Notas
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Props {
  volunteer: any;
}

const props = defineProps<Props>();
const emit = defineEmits(['save', 'close']);

const notes = ref('');

onMounted(() => {
  notes.value = props.volunteer.notas || '';
});

const saveNotes = () => {
  emit('save', props.volunteer.id, notes.value);
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
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  
  h3 {
    margin: 0;
    color: #1b5e20;
  }
}

.close-btn {
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

.modal-body {
  padding: 1.5rem;
}

.form-group {
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: 500;
  }
  
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    resize: vertical;
    
    &:focus {
      outline: none;
      border-color: #1b5e20;
    }
  }
}

.modal-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e0e0e0;
  
  button {
    flex: 1;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
}

.btn-primary {
  background: #1b5e20;
  color: white;
  
  &:hover {
    background: #144017;
  }
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
  
  &:hover {
    background: #d0d0d0;
  }
}
</style>