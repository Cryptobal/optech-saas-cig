interface FetchOptions extends RequestInit {
  token?: string;
}

export async function fetchWithAuth(
  url: string,
  options: FetchOptions = {}
) {
  const token = localStorage.getItem('token');
  
  // Forzar HTTPS en producción
  let secureUrl = url;
  if (secureUrl.startsWith('http://') && !secureUrl.includes('localhost')) {
    secureUrl = secureUrl.replace('http://', 'https://');
  }
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  console.log('Fetching URL:', secureUrl); // Para depuración

  const response = await fetch(secureUrl, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token inválido o expirado
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
    throw new Error('Sesión expirada');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Ha ocurrido un error');
  }

  return response.json();
} 