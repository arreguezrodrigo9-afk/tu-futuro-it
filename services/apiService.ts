// services/apiService.ts
// Servicio para comunicarse con el backend

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';

function getToken(): string | null {
  return localStorage.getItem('tfit_token');
}

function authHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export async function registerUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al registrar');
  localStorage.setItem('tfit_token', data.token);
  return data.user;
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Email o contraseña incorrectos');
  localStorage.setItem('tfit_token', data.token);
  return data.user;
}

export async function getMe() {
  const res = await fetch(`${API_URL}/api/me`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Sesión expirada');
  return res.json();
}

export function logoutUser() {
  localStorage.removeItem('tfit_token');
}

// ─── PROGRESO ─────────────────────────────────────────────────────────────────

export async function saveCourse(courseChosen: string) {
  const res = await fetch(`${API_URL}/api/course`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ courseChosen }),
  });
  if (!res.ok) throw new Error('Error al guardar curso');
}

export async function saveProgress(lastStepCompleted: number) {
  const res = await fetch(`${API_URL}/api/progress`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ lastStepCompleted }),
  });
  if (!res.ok) throw new Error('Error al guardar progreso');
}

export async function getCertificate() {
  const res = await fetch(`${API_URL}/api/certificate`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Certificado no disponible');
  return res.json();
}
