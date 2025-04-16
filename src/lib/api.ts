const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = {
  auth: {
    login: `${API_URL}/api/auth/login`,
    register: `${API_URL}/api/auth/register`,
    forgotPassword: `${API_URL}/api/auth/forgot-password`,
    resetPassword: `${API_URL}/api/auth/reset-password`,
  },
  tenants: {
    list: `${API_URL}/api/tenants`,
    create: `${API_URL}/api/tenants`,
    update: (id: string) => `${API_URL}/api/tenants/${id}`,
    delete: (id: string) => `${API_URL}/api/tenants/${id}`,
  },
  users: {
    list: `${API_URL}/api/users`,
    create: `${API_URL}/api/users`,
    update: (id: string) => `${API_URL}/api/users/${id}`,
    delete: (id: string) => `${API_URL}/api/users/${id}`,
  },
}; 