import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useAuth() {
  const router = useRouter();

  const logout = useCallback(() => {
    // Eliminar el token del localStorage
    localStorage.removeItem('token');
    // Redirigir al login
    router.push('/auth/login');
  }, [router]);

  return {
    logout
  };
} 