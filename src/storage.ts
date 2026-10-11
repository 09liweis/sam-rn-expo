const TOKEN_KEY = 'auth_token';
const EMAIL_KEY = 'auth_email';

const memoryStore = new Map<string, string>();

function getItem(key: string): string | null {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
  } catch {
    // localStorage unavailable (private mode etc.), fall back to memory
  }
  return memoryStore.get(key) ?? null;
}

function setItem(key: string, value: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
      return;
    }
  } catch {
    // fall through to memory
  }
  memoryStore.set(key, value);
}

function removeItem(key: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  } catch {
    // fall through to memory
  }
  memoryStore.delete(key);
}

export function getStoredSession(): { token: string; email: string } | null {
  const token = getItem(TOKEN_KEY);
  const email = getItem(EMAIL_KEY);
  if (!token || !email) return null;
  return { token, email };
}

export function saveSession(token: string, email: string): void {
  setItem(TOKEN_KEY, token);
  setItem(EMAIL_KEY, email);
}

export function clearSession(): void {
  removeItem(TOKEN_KEY);
  removeItem(EMAIL_KEY);
}
