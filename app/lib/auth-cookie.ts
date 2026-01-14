const COOKIE_NAME = 'auth_access_token';
const COOKIE_MAX_AGE = 60 * 60 * 24;

export function getToken(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === COOKIE_NAME && value) {
      return value;
    }
  }
  return null;
}

export function setToken(token: string): void {
  if (typeof document === 'undefined') {
    return;
  }
  document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function removeToken(): void {
  if (typeof document === 'undefined') {
    return;
  }
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}
