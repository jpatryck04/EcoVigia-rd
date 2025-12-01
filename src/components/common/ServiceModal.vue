<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <button class="close-btn" @click="$emit('close')">
        <i class="fas fa-times"></i>
      </button>
      
      <div class="modal-header">
        <div class="service-icon">
          <i :class="service.icon"></i>
        </div>
        <div class="header-text">
          <h2>{{ service.title }}</h2>
          <span class="service-category">Servicio Ambiental</span>
        </div>
      </div>

      <div class="modal-body">
        <div class="service-description">
          <p>{{ service.description }}</p>
        </div>

        <div class="service-features">
          <h3>Características</h3>
          <div class="features-grid">
            <div v-for="feature in service.features" :key="feature" class="feature-item">
              <i class="fas fa-check-circle"></i>
              <span>{{ feature }}</span>
            </div>
          </div>
        </div>

        <div class="service-details" v-if="service.details">
          <h3>Información Adicional</h3>
          <div class="details-content">
            <p>{{ service.details }}</p>
          </div>
        </div>

        <div class="service-requirements" v-if="service.requirements">
          <h3>Requisitos</h3>
          <ul class="requirements-list">
            <li v-for="requirement in service.requirements" :key="requirement">
              <i class="fas fa-file-alt"></i>
              {{ requirement }}
            </li>
          </ul>
        </div>

        <div class="service-process">
          <h3>Proceso</h3>
          <div class="process-steps">
            <div v-for="step in service.process" :key="step.step" class="process-step">
              <div class="step-number">{{ step.step }}</div>
              <div class="step-content">
                <h4>{{ step.title }}</h4>
                <p>{{ step.description }}</p>
                <span class="step-duration">{{ step.duration }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn-secondary" @click="$emit('close')">
          Cerrar
        </button>
        <button v-if="service.hasForm" class="btn-primary" @click="$emit('open-form')">
          <i class="fas fa-file-alt"></i>
          Solicitar Servicio
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Service } from '@/types';

interface Props {
  service: Service;
}

defineProps<Props>();
defineEmits<{
  close: [];
  'open-form': [];
}>();
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
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
  padding: 2.5rem 2.5rem 2rem;
  background: linear-gradient(135deg, #1b5e20, #4caf50);
  color: white;
  border-radius: 20px 20px 0 0;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.service-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  i {
    font-size: 2.5rem;
  }
}

.header-text {
  flex: 1;

  h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.8rem;
  }

  .service-category {
    background: rgba(255, 255, 255, 0.2);
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
  }
}

.modal-body {
  padding: 2rem 2.5rem;
}

.service-description {
  margin-bottom: 2rem;
  
  p {
    color: #666;
    font-size: 1.1rem;
    line-height: 1.6;
    margin: 0;
  }
}

.service-features {
  margin-bottom: 2rem;

  h3 {
    color: #1b5e20;
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #4caf50;

  i {
    color: #4caf50;
    font-size: 1rem;
  }

  span {
    color: #333;
    font-weight: 500;
  }
}

.service-details,
.service-requirements,
.service-process {
  margin-bottom: 2rem;

  h3 {
    color: #1b5e20;
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }
}

.details-content {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;

  p {
    color: #666;
    line-height: 1.6;
    margin: 0;
  }
}

.requirements-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 0;
    color: #666;
    border-bottom: 1px solid #e0e0e0;

    &:last-child {
      border-bottom: none;
    }

    i {
      color: #1b5e20;
      font-size: 1rem;
    }
  }
}

.process-steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.process-step {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #1b5e20;

  .step-number {
    width: 40px;
    height: 40px;
    background: #1b5e20;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    flex-shrink: 0;
    font-size: 1.2rem;
  }

  .step-content {
    flex: 1;

    h4 {
      color: #1b5e20;
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
    }

    p {
      color: #666;
      margin: 0 0 0.5rem 0;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .step-duration {
      display: inline-block;
      background: rgba(27, 94, 32, 0.1);
      color: #1b5e20;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
    }
  }
}

.modal-actions {
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
  }

  .btn-primary {
    background: #1b5e20;
    color: white;

    &:hover {
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
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }

  .modal-header {
    padding: 1.5rem;
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .service-icon {
    width: 70px;
    height: 70px;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .process-step {
    flex-direction: column;
    gap: 1rem;
  }

  .modal-actions {
    flex-direction: column;
    gap: 0.75rem;

    button {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>