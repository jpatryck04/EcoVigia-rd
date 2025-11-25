<template>
  <div v-if="show" class="profile-menu">
    <div class="menu-content">
      <div class="user-info">
        <div class="user-avatar">
          {{ userInitials }}
        </div>
        <div class="user-details">
          <strong>{{ user?.nombre }}</strong>
          <span>{{ user?.email }}</span>
        </div>
      </div>
      
      <div class="menu-items">
        <router-link to="/mis-reportes" class="menu-item" @click="$emit('close')">
          <i class="fas fa-list-alt"></i>
          Mis Reportes
        </router-link>
        
        <router-link to="/cambiar-contraseña" class="menu-item" @click="$emit('close')">
          <i class="fas fa-key"></i>
          Cambiar Contraseña
        </router-link>
        
        <button class="menu-item logout-btn" @click="handleLogout">
          <i class="fas fa-sign-out-alt"></i>
          Cerrar Sesión
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useAppStore } from '@/stores/app';

interface Props {
  show: boolean;
}

defineProps<Props>();
defineEmits<{
  close: [];
}>();

const router = useRouter();
const authStore = useAuthStore();
const appStore = useAppStore();

const user = authStore.user;
const userInitials = appStore.userInitials;

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};
</script>

<style scoped>
.profile-menu {
  position: fixed;
  top: 70px;
  right: 20px;
  width: 300px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  overflow: hidden;
}

.menu-content {
  padding: 1.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 1rem;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1b5e20, #4caf50);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.2rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-details strong {
  color: #333;
  margin-bottom: 0.25rem;
}

.user-details span {
  color: #666;
  font-size: 0.9rem;
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #333;
  border-radius: 8px;
  transition: background 0.3s ease;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  font-size: 1rem;
}

.menu-item:hover {
  background: #f5f5f5;
  color: #1b5e20;
}

.menu-item i {
  width: 20px;
  text-align: center;
}

.logout-btn {
  color: #f44336;
}

.logout-btn:hover {
  background: #ffebee;
  color: #d32f2f;
}
</style>    