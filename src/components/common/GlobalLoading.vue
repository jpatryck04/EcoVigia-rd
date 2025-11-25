<template>
  <div v-if="isLoading" class="global-loading">
    <div class="loading-spinner">
      <div class="spinner"></div>
      <p>Cargando...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app';

const appStore = useAppStore();
const isLoading = appStore.isLoading;
</script>

<style scoped>
.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1b5e20;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>