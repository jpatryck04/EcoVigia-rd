<template>
  <div class="report-damage-page">
    <div class="container">
      <div class="page-header">
        <h1>Reportar Daño Ambiental</h1>
        <p>Ayúdanos a proteger nuestro medio ambiente reportando situaciones que lo afecten</p>
      </div>

      <form @submit.prevent="submitReport" class="report-form">
        <div class="form-section">
          <h3>Información del Reporte</h3>
          
          <div class="form-group">
            <label for="titulo">Título del Reporte *</label>
            <input
              id="titulo"
              v-model="form.titulo"
              type="text"
              required
              placeholder="Ej: Tala ilegal de árboles"
              maxlength="100"
            />
            <span class="char-count">{{ form.titulo.length }}/100</span>
          </div>

          <div class="form-group">
            <label for="descripcion">Descripción Detallada *</label>
            <textarea
              id="descripcion"
              v-model="form.descripcion"
              required
              placeholder="Describe la situación en detalle..."
              rows="4"
              maxlength="1000"
            ></textarea>
            <span class="char-count">{{ form.descripcion.length }}/1000</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="categoria">Categoría *</label>
              <select id="categoria" v-model="form.categoria" required>
                <option value="">Selecciona una categoría</option>
                <option value="contaminacion">Contaminación</option>
                <option value="deforestacion">Deforestación</option>
                <option value="fauna">Fauna en Peligro</option>
                <option value="flora">Flora Amenazada</option>
                <option value="agua">Contaminación del Agua</option>
                <option value="residuos">Manejo de Residuos</option>
                <option value="otros">Otros</option>
              </select>
            </div>

            <div class="form-group">
              <label for="urgencia">Nivel de Urgencia *</label>
              <select id="urgencia" v-model="form.urgencia" required>
                <option value="">Selecciona urgencia</option>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Evidencia Fotográfica</h3>
          <div class="photo-upload">
            <div 
              class="upload-area"
              @click="triggerFileInput"
              @drop="handleDrop"
              @dragover.prevent
              @dragenter.prevent
            >
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="handleFileSelect"
                style="display: none"
              />
              <i class="fas fa-camera"></i>
              <p>Haz clic o arrastra una foto aquí</p>
              <span>Formatos: JPG, PNG, GIF (Máx. 5MB)</span>
            </div>
            
            <div v-if="form.foto" class="photo-preview">
              <img :src="form.foto" alt="Vista previa" />
              <button type="button" @click="removePhoto" class="remove-photo">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Ubicación</h3>
          <div class="location-section">
            <p>Tu ubicación actual será utilizada para el reporte</p>
            <div class="location-coords" v-if="currentLocation">
              <span>Lat: {{ currentLocation.lat.toFixed(6) }}</span>
              <span>Lng: {{ currentLocation.lng.toFixed(6) }}</span>
            </div>
            <button type="button" @click="getCurrentLocation" class="btn-secondary">
              <i class="fas fa-location-crosshairs"></i>
              Obtener Ubicación Actual
            </button>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="$router.back()" class="btn-cancel">
            Cancelar
          </button>
          <button type="submit" :disabled="loading" class="btn-submit">
            <span v-if="loading">
              <i class="fas fa-spinner fa-spin"></i>
              Enviando Reporte...
            </span>
            <span v-else>
              <i class="fas fa-paper-plane"></i>
              Enviar Reporte
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app';
import { convertToBase64, validateImageFile } from '@/utils';
import type { EnvironmentalReport } from '@/types';

const router = useRouter();
const appStore = useAppStore();

const loading = ref(false);
const fileInput = ref<HTMLInputElement>();

const form = ref({
  titulo: '',
  descripcion: '',
  categoria: '',
  urgencia: '' as 'baja' | 'media' | 'alta' | '',
  foto: '',
  latitud: 0,
  longitud: 0
});

const currentLocation = ref<{ lat: number; lng: number } | null>(null);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    try {
      const base64 = await convertToBase64(file);
      form.value.foto = base64;
    } catch (error) {
      alert('Error al procesar la imagen');
    }
  }
};

const handleDrop = async (event: DragEvent) => {
  event.preventDefault();
  const file = event.dataTransfer?.files[0];
  
  if (file) {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    try {
      const base64 = await convertToBase64(file);
      form.value.foto = base64;
    } catch (error) {
      alert('Error al procesar la imagen');
    }
  }
};

const removePhoto = () => {
  form.value.foto = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert('La geolocalización no es soportada por este navegador');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      currentLocation.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      form.value.latitud = position.coords.latitude;
      form.value.longitud = position.coords.longitude;
    },
    (error) => {
      alert('Error al obtener la ubicación: ' + error.message);
    }
  );
};

const submitReport = async () => {
  if (!form.value.latitud || !form.value.longitud) {
    alert('Por favor, obtén tu ubicación actual antes de enviar el reporte');
    return;
  }

  loading.value = true;

  try {
    // Simular envío a API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Agregar reporte al store con el tipo correcto
    const newReport: EnvironmentalReport = {
      id: Date.now().toString(),
      titulo: form.value.titulo,
      descripcion: form.value.descripcion,
      categoria: form.value.categoria,
      urgencia: form.value.urgencia as 'baja' | 'media' | 'alta',
      foto: form.value.foto,
      latitud: form.value.latitud,
      longitud: form.value.longitud,
      fecha: new Date().toISOString(),
      estado: 'pendiente'
    };
    
    appStore.addReport(newReport);
    
    alert('¡Reporte enviado exitosamente!');
    router.push('/mis-reportes');
    
  } catch (error) {
    alert('Error al enviar el reporte');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getCurrentLocation();
});
</script>

<style scoped lang="scss">
.report-damage-page {
  padding: 2rem 0;
  background: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    color: #1b5e20;
    margin-bottom: 1rem;
    font-size: 2.5rem;
  }

  p {
    color: #666;
    font-size: 1.2rem;
  }
}

.report-form {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e0e0e0;

  &:last-of-type {
    border-bottom: none;
  }

  h3 {
    color: #1b5e20;
    margin-bottom: 1.5rem;
    font-size: 1.3rem;
  }
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;

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
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;

    &:focus {
      outline: none;
      border-color: #1b5e20;
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }

  .char-count {
    position: absolute;
    right: 0.5rem;
    bottom: 0.5rem;
    font-size: 0.8rem;
    color: #666;
    background: white;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
  }
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.photo-upload {
  .upload-area {
    border: 2px dashed #e0e0e0;
    border-radius: 8px;
    padding: 3rem 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: #1b5e20;
      background: #f8f9fa;
    }

    i {
      font-size: 3rem;
      color: #666;
      margin-bottom: 1rem;
    }

    p {
      color: #333;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    span {
      color: #666;
      font-size: 0.9rem;
    }
  }

  .photo-preview {
    position: relative;
    margin-top: 1rem;
    max-width: 300px;

    img {
      width: 100%;
      border-radius: 8px;
    }

    .remove-photo {
      position: absolute;
      top: -10px;
      right: -10px;
      background: #f44336;
      color: white;
      border: none;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.location-section {
  p {
    color: #666;
    margin-bottom: 1rem;
  }

  .location-coords {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;

    span {
      background: #e8f5e8;
      color: #1b5e20;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-family: monospace;
    }
  }
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;

  button {
    padding: 1rem 2rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .btn-cancel {
    background: #e0e0e0;
    color: #333;

    &:hover {
      background: #d0d0d0;
    }
  }

  .btn-submit {
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
}

@media (max-width: 768px) {
  .report-form {
    padding: 1.5rem;
    margin: 0 1rem;
  }

  .form-actions {
    flex-direction: column-reverse;
  }
}
</style>