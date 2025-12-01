<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <button class="close-btn" @click="$emit('close')">
        <i class="fas fa-times"></i>
      </button>
      
      <div class="modal-header">
        <div class="form-icon">
          <i :class="service.icon"></i>
        </div>
        <div class="header-text">
          <h2>Solicitar {{ service.title }}</h2>
          <span class="form-subtitle">Complete el formulario para iniciar el proceso</span>
        </div>
      </div>

      <form @submit.prevent="submitForm" class="service-form">
        <div class="form-body">
          <!-- Información del Servicio -->
          <div class="form-section">
            <h3><i class="fas fa-info-circle"></i> Información del Servicio</h3>
            <div class="service-info-card">
              <div class="service-info">
                <strong>Servicio:</strong> {{ service.title }}
              </div>
              <div class="service-info">
                <strong>Descripción:</strong> {{ service.description }}
              </div>
              <div class="service-info">
                <strong>Tiempo estimado:</strong> {{ service.processTime || '15-20 días hábiles' }}
              </div>
            </div>
          </div>

          <!-- Información Personal -->
          <div class="form-section">
            <h3><i class="fas fa-user"></i> Información Personal</h3>
            <div class="form-grid">
              <div class="form-group">
                <label for="nombre">Nombre Completo *</label>
                <input
                  id="nombre"
                  v-model="formData.nombre"
                  type="text"
                  required
                  placeholder="Ingrese su nombre completo"
                />
                <span class="form-error" v-if="errors.nombre">{{ errors.nombre }}</span>
              </div>

              <div class="form-group">
                <label for="cedula">Cédula o Pasaporte *</label>
                <input
                  id="cedula"
                  v-model="formData.cedula"
                  type="text"
                  required
                  placeholder="Ingrese su cédula o pasaporte"
                />
                <span class="form-error" v-if="errors.cedula">{{ errors.cedula }}</span>
              </div>

              <div class="form-group">
                <label for="email">Correo Electrónico *</label>
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                />
                <span class="form-error" v-if="errors.email">{{ errors.email }}</span>
              </div>

              <div class="form-group">
                <label for="telefono">Teléfono *</label>
                <input
                  id="telefono"
                  v-model="formData.telefono"
                  type="tel"
                  required
                  placeholder="(809) 555-5555"
                />
                <span class="form-error" v-if="errors.telefono">{{ errors.telefono }}</span>
              </div>

              <div class="form-group full-width">
                <label for="direccion">Dirección Completa *</label>
                <textarea
                  id="direccion"
                  v-model="formData.direccion"
                  required
                  placeholder="Calle, número, sector, municipio, provincia"
                  rows="2"
                ></textarea>
                <span class="form-error" v-if="errors.direccion">{{ errors.direccion }}</span>
              </div>
            </div>
          </div>

          <!-- Detalles de la Solicitud -->
          <div class="form-section">
            <h3><i class="fas fa-file-alt"></i> Detalles de la Solicitud</h3>
            <div class="form-grid">
              <div class="form-group">
                <label for="proyecto">Nombre del Proyecto/Aplicación *</label>
                <input
                  id="proyecto"
                  v-model="formData.proyecto"
                  type="text"
                  required
                  placeholder="Ej: Construcción de Vivienda"
                />
              </div>

              <div class="form-group">
                <label for="ubicacion">Ubicación del Proyecto *</label>
                <input
                  id="ubicacion"
                  v-model="formData.ubicacion"
                  type="text"
                  required
                  placeholder="Provincia, municipio, coordenadas"
                />
              </div>

              <div class="form-group">
                <label for="tipoSolicitud">Tipo de Solicitud *</label>
                <select id="tipoSolicitud" v-model="formData.tipoSolicitud" required>
                  <option value="">Seleccione una opción</option>
                  <option value="nuevo">Nuevo Permiso</option>
                  <option value="renovacion">Renovación</option>
                  <option value="modificacion">Modificación</option>
                  <option value="ampliacion">Ampliación</option>
                </select>
              </div>

              <div class="form-group">
                <label for="urgencia">Nivel de Urgencia *</label>
                <select id="urgencia" v-model="formData.urgencia" required>
                  <option value="">Seleccione una opción</option>
                  <option value="normal">Normal (20 días)</option>
                  <option value="urgente">Urgente (10 días)</option>
                  <option value="emergencia">Emergencia (5 días)</option>
                </select>
              </div>

              <div class="form-group full-width">
                <label for="descripcion">Descripción Detallada *</label>
                <textarea
                  id="descripcion"
                  v-model="formData.descripcion"
                  required
                  placeholder="Describa en detalle su solicitud, incluyendo objetivos, alcance y cualquier información relevante..."
                  rows="4"
                ></textarea>
                <span class="char-count">{{ formData.descripcion.length }}/1000</span>
              </div>
            </div>
          </div>

          <!-- Documentos Adjuntos -->
          <div class="form-section">
            <h3><i class="fas fa-paperclip"></i> Documentos Adjuntos</h3>
            <div class="documents-section">
              <div class="documents-list">
                <div class="document-item" v-for="(doc, index) in service.requiredDocuments" :key="index">
                  <i class="fas fa-file-pdf"></i>
                  <span>{{ doc }}</span>
                  <button type="button" class="btn-upload" @click="uploadDocument(doc)">
                    <i class="fas fa-upload"></i> Adjuntar
                  </button>
                </div>
              </div>
              
              <div class="uploaded-documents" v-if="uploadedFiles.length > 0">
                <h4>Documentos Subidos:</h4>
                <div class="files-list">
                  <div v-for="file in uploadedFiles" :key="file.name" class="file-item">
                    <i class="fas fa-file"></i>
                    <span>{{ file.name }}</span>
                    <button type="button" class="btn-remove" @click="removeFile(file)">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Términos y Condiciones -->
          <div class="form-section">
            <div class="terms-section">
              <label class="checkbox-label">
                <input type="checkbox" v-model="formData.aceptoTerminos" required />
                <span>Acepto los <a href="#" @click.prevent="showTerms">términos y condiciones</a> del servicio</span>
              </label>
              <span class="form-error" v-if="errors.aceptoTerminos">{{ errors.aceptoTerminos }}</span>
              
              <label class="checkbox-label">
                <input type="checkbox" v-model="formData.aceptoPrivacidad" required />
                <span>Acepto la <a href="#" @click.prevent="showPrivacy">política de privacidad</a> y tratamiento de datos</span>
              </label>
              <span class="form-error" v-if="errors.aceptoPrivacidad">{{ errors.aceptoPrivacidad }}</span>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="$emit('close')">
            Cancelar
          </button>
          <button type="submit" class="btn-primary" :disabled="isSubmitting">
            <i class="fas fa-paper-plane"></i>
            {{ isSubmitting ? 'Enviando...' : 'Enviar Solicitud' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { Service } from './types';

interface Props {
  service: Service;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  submitted: [data: any];
}>();

const isSubmitting = ref(false);
const uploadedFiles = ref<File[]>([]);

const formData = reactive({
  nombre: '',
  cedula: '',
  email: '',
  telefono: '',
  direccion: '',
  proyecto: '',
  ubicacion: '',
  tipoSolicitud: '',
  urgencia: '',
  descripcion: '',
  aceptoTerminos: false,
  aceptoPrivacidad: false
});

const errors = reactive<Record<string, string>>({});

const validateForm = () => {
  let isValid = true;
  
  // Limpiar errores anteriores
  Object.keys(errors).forEach(key => delete errors[key]);

  // Validaciones básicas
  if (!formData.nombre.trim()) {
    errors.nombre = 'El nombre es requerido';
    isValid = false;
  }

  if (!/^\d{11}$/.test(formData.cedula)) {
    errors.cedula = 'Cédula inválida (debe tener 11 dígitos)';
    isValid = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Correo electrónico inválido';
    isValid = false;
  }

  if (!/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(formData.telefono)) {
    errors.telefono = 'Teléfono inválido';
    isValid = false;
  }

  if (!formData.direccion.trim()) {
    errors.direccion = 'La dirección es requerida';
    isValid = false;
  }

  if (!formData.aceptoTerminos) {
    errors.aceptoTerminos = 'Debe aceptar los términos y condiciones';
    isValid = false;
  }

  if (!formData.aceptoPrivacidad) {
    errors.aceptoPrivacidad = 'Debe aceptar la política de privacidad';
    isValid = false;
  }

  return isValid;
};

const submitForm = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    // Simular envío a API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Aquí iría la llamada real a la API
    // await medioAmbienteAPI.solicitarServicio({
    //   ...formData,
    //   servicioId: props.service.id,
    //   files: uploadedFiles.value
    // });

    emit('submitted', {
      ...formData,
      servicio: props.service.title,
      fecha: new Date().toISOString()
    });

    // Mostrar confirmación
    alert('✅ Solicitud enviada exitosamente. Recibirá un correo de confirmación.');
    
    // Cerrar el formulario
    emit('close');

  } catch (error) {
    console.error('Error submitting form:', error);
    alert('❌ Error al enviar la solicitud. Por favor intente nuevamente.');
  } finally {
    isSubmitting.value = false;
  }
};

const uploadDocument = (docName: string) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
  
  input.onchange = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Validar tamaño máximo (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('El archivo no debe superar los 10MB');
        return;
      }
      
      uploadedFiles.value.push(file);
    }
  };
  
  input.click();
};

const removeFile = (fileToRemove: File) => {
  uploadedFiles.value = uploadedFiles.value.filter(file => file !== fileToRemove);
};

const showTerms = () => {
  alert('Términos y condiciones del servicio...');
};

const showPrivacy = () => {
  alert('Política de privacidad...');
};
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 1rem;
  backdrop-filter: blur(8px);
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 900px;
  width: 100%;
  max-height: 95vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
}

.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(0, 0, 0, 0.1);
  color: #666;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.2);
    color: #333;
  }
}

.modal-header {
  padding: 2rem 2.5rem;
  background: linear-gradient(135deg, #1b5e20, #4caf50);
  color: white;
  border-radius: 20px 20px 0 0;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.form-icon {
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  i {
    font-size: 2rem;
  }
}

.header-text {
  flex: 1;

  h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.8rem;
  }

  .form-subtitle {
    opacity: 0.9;
    font-size: 1rem;
  }
}

.service-form {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.form-body {
  padding: 2rem 2.5rem;
  flex: 1;
}

.form-section {
  margin-bottom: 2.5rem;

  h3 {
    color: #1b5e20;
    margin-bottom: 1.5rem;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #e8f5e8;

    i {
      font-size: 1.1rem;
    }
  }
}

.service-info-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  border-left: 4px solid #1b5e20;
  margin-bottom: 1rem;

  .service-info {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    color: #333;

    &:last-child {
      margin-bottom: 0;
    }

    strong {
      color: #1b5e20;
      min-width: 140px;
    }
  }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.form-group {
  &.full-width {
    grid-column: 1 / -1;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: 500;
    font-size: 0.95rem;
  }

  input, select, textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: #1b5e20;
      box-shadow: 0 0 0 3px rgba(27, 94, 32, 0.1);
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }

  .form-error {
    display: block;
    margin-top: 0.5rem;
    color: #f44336;
    font-size: 0.85rem;
  }
}

.char-count {
  display: block;
  text-align: right;
  margin-top: 0.25rem;
  color: #666;
  font-size: 0.85rem;
}

.documents-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
}

.documents-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.document-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;

  i {
    color: #f44336;
    font-size: 1.2rem;
  }

  span {
    flex: 1;
    color: #333;
    font-weight: 500;
  }

  .btn-upload {
    background: #1b5e20;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: background 0.3s ease;

    &:hover {
      background: #144017;
    }
  }
}

.uploaded-documents {
  h4 {
    color: #1b5e20;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }
}

.files-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;

  i {
    color: #666;
  }

  span {
    flex: 1;
    color: #333;
    font-size: 0.95rem;
    word-break: break-all;
  }

  .btn-remove {
    background: none;
    border: none;
    color: #f44336;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;

    &:hover {
      background: rgba(244, 67, 54, 0.1);
    }
  }
}

.terms-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  color: #333;

  &:last-child {
    margin-bottom: 0;
  }

  input[type="checkbox"] {
    margin-top: 0.25rem;
    width: 18px;
    height: 18px;
    cursor: pointer;
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

.form-actions {
  padding: 1.5rem 2.5rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  background: #f8f9fa;
  border-radius: 0 0 20px 20px;

  button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    min-width: 150px;
    justify-content: center;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .btn-primary {
    background: #1b5e20;
    color: white;

    &:hover:not(:disabled) {
      background: #144017;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(27, 94, 32, 0.3);
    }
  }

  .btn-secondary {
    background: #e0e0e0;
    color: #333;

    &:hover {
      background: #d0d0d0;
    }
  }
}

@media (max-width: 768px) {
  .modal-content {
    margin: 0.5rem;
    max-height: calc(100vh - 1rem);
  }

  .modal-header {
    padding: 1.5rem;
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .form-body {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
    gap: 0.75rem;

    button {
      width: 100%;
    }
  }
}
</style>