<template>
  <div class="volunteer-page">
    <div class="container">
      <div class="page-header">
        <h1>Únete como Voluntario</h1>
        <p>Forma parte del cambio y ayuda a proteger nuestro medio ambiente</p>
      </div>

      <div class="volunteer-content">
        <div class="requirements-section">
          <h2>Requisitos para ser Voluntario</h2>
          <ul class="requirements-list">
            <li>Ser mayor de 18 años</li>
            <li>Tener cédula dominicana</li>
            <li>Compromiso con el medio ambiente</li>
            <li>Disponibilidad de tiempo</li>
            <li>Actitud positiva y proactiva</li>
          </ul>
        </div>

        <form @submit.prevent="submitApplication" class="volunteer-form">
          <h2>Solicitud de Voluntariado</h2>
          
          <div class="form-group">
            <label for="cedula">Cédula *</label>
            <input
              id="cedula"
              v-model="form.cedula"
              type="text"
              required
              placeholder="Ingresa tu cédula"
            />
          </div>

          <div class="form-group">
            <label for="nombre">Nombre y Apellido *</label>
            <input
              id="nombre"
              v-model="form.nombre"
              type="text"
              required
              placeholder="Ingresa tu nombre completo"
            />
          </div>

          <div class="form-group">
            <label for="email">Correo Electrónico *</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="Ingresa tu correo"
            />
          </div>

          <div class="form-group">
            <label for="password">Contraseña *</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              placeholder="Crea una contraseña"
            />
          </div>

          <div class="form-group">
            <label for="telefono">Teléfono *</label>
            <input
              id="telefono"
              v-model="form.telefono"
              type="tel"
              required
              placeholder="Ingresa tu teléfono"
            />
          </div>

          <button type="submit" :disabled="loading" class="submit-btn">
            {{ loading ? 'Enviando...' : 'Enviar Solicitud' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { medioAmbienteAPI } from '@/services/api';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);

const form = ref({
  cedula: '',
  nombre: '',
  email: '',
  password: '',
  telefono: ''
});

const submitApplication = async () => {
  loading.value = true;
  
  try {
    await medioAmbienteAPI.solicitarVoluntariado(form.value);
    
    alert('¡Solicitud enviada exitosamente! Te contactaremos pronto.');
    router.push('/');
    
  } catch (error) {
    console.error('Error submitting application:', error);
    alert('Error al enviar la solicitud. Por favor intenta nuevamente.');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.volunteer-page {
  padding: 2rem 0;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    color: #1b5e20;
    margin-bottom: 1rem;
  }
  
  p {
    color: #666;
    font-size: 1.1rem;
  }
}

.volunteer-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 1000px;
  margin: 0 auto;
}

.requirements-section {
  h2 {
    color: #1b5e20;
    margin-bottom: 1.5rem;
  }
  
  .requirements-list {
    list-style: none;
    padding: 0;
    
    li {
      padding: 0.75rem 1rem;
      margin-bottom: 0.5rem;
      background: #e8f5e8;
      border-left: 4px solid #2e7d32;
      border-radius: 4px;
    }
  }
}

.volunteer-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  
  h2 {
    color: #1b5e20;
    margin-bottom: 2rem;
    text-align: center;
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
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #2e7d32;
    }
    
    &::placeholder {
      color: #999;
    }
  }
}

.submit-btn {
  width: 100%;
  background: #2e7d32;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover:not(:disabled) {
    background: #1b5e20;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}

@media (max-width: 768px) {
  .volunteer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>