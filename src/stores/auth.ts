import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const token = ref<string | null>(localStorage.getItem('eco_vigia_token'));

  const login = (userData: User, userToken: string) => {
    user.value = userData;
    isAuthenticated.value = true;
    token.value = userToken;
    localStorage.setItem('eco_vigia_token', userToken);
  };

  const logout = () => {
    user.value = null;
    isAuthenticated.value = false;
    token.value = null;
    localStorage.removeItem('eco_vigia_token');
  };

  return {
    user,
    isAuthenticated,
    token,
    login,
    logout
  };
});