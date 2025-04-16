// Forzamos HTTPS para la URL de la API
let API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
// Aseguramos que siempre usamos HTTPS en producción
if (API_URL.startsWith('http://') && !API_URL.includes('localhost')) {
  API_URL = API_URL.replace('http://', 'https://');
}

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