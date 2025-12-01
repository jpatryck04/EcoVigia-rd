<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <button class="close-btn" @click="$emit('close')">
        <i class="fas fa-times"></i>
      </button>
      
      <div class="modal-header">
        <h2>{{ mode === 'create' ? 'Crear Nueva Noticia' : 'Editar Noticia' }}</h2>
      </div>

      <form @submit.prevent="handleSubmit" class="news-form">
        <div class="form-row">
          <div class="form-group">
            <label for="titulo">Título *</label>
            <input
              id="titulo"
              v-model="formData.titulo"
              type="text"
              required
              placeholder="Ingresa el título de la noticia"
            />
          </div>

          <div class="form-group">
            <label for="categoria">Categoría *</label>
            <select id="categoria" v-model="formData.categoria" required>
              <option value="">Selecciona una categoría</option>
              <option value="Reforestación">Reforestación</option>
              <option value="Conservación Marina">Conservación Marina</option>
              <option value="Reciclaje">Reciclaje</option>
              <option value="Educación Ambiental">Educación Ambiental</option>
              <option value="Normativas">Normativas</option>
              <option value="Eventos">Eventos</option>
              <option value="Investigación">Investigación</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="contenido">Contenido *</label>
          <textarea
            id="contenido"
            v-model="formData.contenido"
            required
            placeholder="Escribe el contenido de la noticia..."
            rows="6"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="imagen">URL de la Imagen</label>
            <input
              id="imagen"
              v-model="formData.imagen"
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          <div class="form-group">
            <label for="autor">Autor *</label>
            <input
              id="autor"
              v-model="formData.autor"
              type="text"
              required
              placeholder="Nombre del autor"
            />
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="$emit('close')">
            Cancelar
          </button>
          <button type="submit" class="btn-primary" :disabled="loading">
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            {{ mode === 'create' ? 'Crear Noticia' : 'Guardar Cambios' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type { News } from '@/types';

interface Props {
  news?: News | null;
  mode?: 'create' | 'edit';
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create'
});

const emit = defineEmits<{
  close: [];
  save: [news: any];
}>();

const loading = ref(false);

const formData = reactive({
  titulo: '',
  contenido: '',
  imagen: '',
  autor: '',
  categoria: ''
});

const handleSubmit = async () => {
  loading.value = true;
  
  try {
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000));
    emit('save', { ...formData });
  } catch (error) {
    console.error('Error saving news:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (props.news && props.mode === 'edit') {
    Object.assign(formData, {
      titulo: props.news.titulo,
      contenido: props.news.contenido,
      imagen: props.news.imagen,
      autor: props.news.autor,
      categoria: props.news.categoria
    });
  } else {
    // Valores por defecto para nueva noticia
    formData.autor = 'Ministerio de Medio Ambiente';
  }
});
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
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
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
  margin-bottom: 2rem;

  h2 {
    color: #1b5e20;
    font-size: 1.5rem;
  }
}

.news-form {
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: 500;
    }

    input, select, textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.3s ease;

      &:focus {
        outline: none;
        border-color: #1b5e20;
      }
    }

    textarea {
      resize: vertical;
      min-height: 120px;
    }
  }
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;

  button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .btn-primary {
    background: #1b5e20;
    color: white;

    &:hover:not(:disabled) {
      background: #144017;
    }

    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }

  .btn-secondary {
    background: #6c757d;
    color: white;

    &:hover {
      background: #5a6268;
    }
  }
}
</style>