export const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  return { response, payload };
}

export function getDashboardPathByRole(role) {
  return role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/client';
}
