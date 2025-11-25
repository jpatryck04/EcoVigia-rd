<template>
  <div v-if="show" class="notifications-panel">
    <div class="panel-header">
      <h3>Notificaciones</h3>
      <button @click="$emit('close')" class="close-btn">
        <i class="fas fa-times"></i>
      </button>
    </div>
    
    <div class="notifications-list">
      <div v-for="notification in notifications" 
           :key="notification.id"
           :class="['notification-item', { unread: !notification.read }]">
        <div class="notification-icon">
          <i :class="getNotificationIcon(notification.type)"></i>
        </div>
        <div class="notification-content">
          <p>{{ notification.message }}</p>
          <span class="notification-time">
            {{ formatTime(notification.timestamp) }}
          </span>
        </div>
        <button @click="markAsRead(notification.id)" class="mark-read-btn">
          <i class="fas fa-check"></i>
        </button>
      </div>
      
      <div v-if="notifications.length === 0" class="empty-state">
        <i class="fas fa-bell-slash"></i>
        <p>No hay notificaciones</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/stores/app';
import { formatDateTime } from '@/utils';

interface Props {
  show: boolean;
}

defineProps<Props>();
defineEmits<{
  close: [];
}>();

const appStore = useAppStore();
const notifications = computed(() => appStore.notifications);

const getNotificationIcon = (type: string) => {
  const icons = {
    info: 'fas fa-info-circle',
    success: 'fas fa-check-circle',
    warning: 'fas fa-exclamation-triangle',
    error: 'fas fa-exclamation-circle'
  };
  return icons[type as keyof typeof icons] || 'fas fa-bell';
};

const markAsRead = (id: string) => {
  appStore.markNotificationAsRead(id);
};

const formatTime = (timestamp: Date) => {
  return formatDateTime(timestamp);
};
</script>

<style scoped>
.notifications-panel {
  position: fixed;
  top: 70px;
  right: 20px;
  width: 400px;
  max-height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.panel-header h3 {
  margin: 0;
  color: #1b5e20;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
}

.close-btn:hover {
  background: #f5f5f5;
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.3s ease;
}

.notification-item:hover {
  background: #f8f9fa;
}

.notification-item.unread {
  background: #e8f5e8;
}

.notification-icon {
  font-size: 1.2rem;
  color: #4caf50;
  margin-top: 0.25rem;
}

.notification-content {
  flex: 1;
}

.notification-content p {
  margin: 0 0 0.5rem 0;
  color: #333;
  line-height: 1.4;
}

.notification-time {
  font-size: 0.8rem;
  color: #666;
}

.mark-read-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  opacity: 0;
  transition: all 0.3s ease;
}

.notification-item:hover .mark-read-btn {
  opacity: 1;
}

.mark-read-btn:hover {
  background: #e0e0e0;
  color: #1b5e20;
}

.empty-state {
  padding: 3rem 2rem;
  text-align: center;
  color: #666;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}
</style>