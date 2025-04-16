// Forzamos HTTPS para la URL de la API
let API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Aseguramos que siempre usamos HTTPS en producción
if (API_URL.startsWith('http://') && !API_URL.includes('localhost')) {
  API_URL = API_URL.replace('http://', 'https://');
}

// Aseguramos que la URL no tenga una barra al final
if (API_URL.endsWith('/')) {
  API_URL = API_URL.slice(0, -1);
}

// Si la URL contiene "railway.app", aseguramos que use HTTPS
if (API_URL.includes('railway.app') && !API_URL.startsWith('https://')) {
  API_URL = `https://${API_URL.replace('http://', '')}`;
}

console.log('API_URL:', API_URL); // Para depuración

export const api = {
  auth: {
    login: `${API_URL}/api/v1/auth/login`,
    register: `${API_URL}/api/v1/auth/register`,
    forgotPassword: `${API_URL}/api/v1/auth/forgot-password`,
    resetPassword: `${API_URL}/api/v1/auth/reset-password`,
  },
  tenants: {
    list: `${API_URL}/api/v1/tenants`,
    create: `${API_URL}/api/v1/tenants`,
    update: (id: string) => `${API_URL}/api/v1/tenants/${id}`,
    delete: (id: string) => `${API_URL}/api/v1/tenants/${id}`,
  },
  users: {
    list: `${API_URL}/api/v1/users`,
    create: `${API_URL}/api/v1/users`,
    update: (id: string) => `${API_URL}/api/v1/users/${id}`,
    delete: (id: string) => `${API_URL}/api/v1/users/${id}`,
  },
}; 