const ACCESS = { token: null }; // in-memory

const REFRESH_KEY = 'refresh_token';

export function getAccessToken() {
  return ACCESS.token;
}

export function setAccessToken(token) {
  ACCESS.token = token || null;
}

export function clearAccessToken() {
  ACCESS.token = null;
}

export function getRefreshToken() {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setRefreshToken(token) {
  if (typeof localStorage === 'undefined') return;
  if (token) localStorage.setItem(REFRESH_KEY, token);
  else localStorage.removeItem(REFRESH_KEY);
}

export function clearAllTokens() {
  clearAccessToken();
  setRefreshToken(null);
}
