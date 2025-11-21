import axios from 'axios';

// URL del backend
const API_BASE = 'https://ln5c0hg6-4000.use.devtunnels.ms';

console.log('🔧 API Base URL:', API_BASE);

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para incluir token
api.interceptors.request.use((config) => {
  console.log('📤 Request:', config.method?.toUpperCase(), config.url);
  
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  console.error('❌ Request error:', error);
  return Promise.reject(error);
});

// Log de responses
api.interceptors.response.use((response) => {
  console.log('📥 Response:', response.status, response.config.url);
  return response;
}, (error) => {
  console.error('❌ Response error:', {
    url: error.config?.url,
    status: error.response?.status,
    data: error.response?.data,
    message: error.message
  });
  return Promise.reject(error);
});

export const getEspaciosDisponibles = async () => {
  const res = await api.get('/api/espacios/disponibles');
  return res.data;
};

export const getTodosLosEspacios = async () => {
  const res = await api.get('/api/espacios');
  return res.data;
};

export const crearReserva = async (body: { vehiculo_id: number; espacio_id: number; fecha_entrada: string }) => {
  const res = await api.post('/api/reservas', body);
  return res.data;
};

export const register = async (payload: { email: string; password: string; nombre: string; telefono?: string }) => {
  const res = await api.post('/api/auth/register', payload);
  if (res.data && res.data.token) {
    localStorage.setItem('token', res.data.token);
  }
  return res.data;
};

export const login = async (payload: { email: string; password: string }) => {
  const res = await api.post('/api/auth/login', payload);
  if (res.data && res.data.token) {
    localStorage.setItem('token', res.data.token);
  }
  return res.data;
};

export const logout = async () => {
  localStorage.removeItem('token');
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Vehículos & Reservas helpers
export const getMisVehiculos = async () => {
  const res = await api.get('/api/vehiculos');
  return res.data;
};

export const crearVehiculo = async (payload: { placa: string; marca?: string; modelo?: string; color?: string }) => {
  const res = await api.post('/api/vehiculos', payload);
  return res.data;
};

export const eliminarVehiculo = async (id: number) => {
  const res = await api.delete(`/api/vehiculos/${id}`);
  return res.data;
};

export const getMisReservas = async () => {
  const res = await api.get('/api/reservas');
  return res.data;
};

export const terminarReserva = async (id: number) => {
  const res = await api.put(`/api/reservas/${id}/terminar`);
  return res.data;
};

export const getUsuarioActual = async () => {
  const res = await api.get('/api/auth/me');
  return res.data;
};

export default api;
