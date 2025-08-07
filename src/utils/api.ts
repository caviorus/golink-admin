import { useCookie } from '@nuxt/ui/runtime/inertia/stubs.js';
import axios from 'axios';

const token = useCookie('token');

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token.value}`,
  },
});

export default api;