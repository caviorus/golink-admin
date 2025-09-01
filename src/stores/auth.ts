import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuth = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem("token"));

  function setToken(newToken: string) {
    token.value = newToken;
    localStorage.setItem("token", newToken);
  }

  function clearToken() {
    token.value = null;
    localStorage.removeItem("token");
  }

  return { token, setToken, clearToken }
})