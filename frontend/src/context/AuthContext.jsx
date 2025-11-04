import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api, { base } from '../api/axios';
import { setAccessToken, setRefreshToken, getRefreshToken, clearAllTokens } from '../api/authStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccess] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from refresh token on app start
  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const rt = getRefreshToken();
        if (rt) {
          const { data } = await base.post('/auth/refresh', { refreshToken: rt });
          if (!ignore && data?.accessToken) {
            setAccessToken(data.accessToken);
            setAccess(data.accessToken);
          }
        }
      } catch {
        // ignore; user remains logged out
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const { data } = await base.post('/auth/login', { email, password });
    const { accessToken: at, refreshToken: rt } = data || {};
    if (!at || !rt) throw new Error('Invalid login response');
    setRefreshToken(rt);
    setAccessToken(at);
    setAccess(at);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      // Optional server logout/invalidate call
      const rt = getRefreshToken();
      if (rt) await base.post('/auth/logout', { refreshToken: rt });
    } catch {
      // ignore network/server errors during logout
    } finally {
      clearAllTokens();
      setAccess(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      accessToken,
      isAuthenticated: !!accessToken,
      loading,
      login,
      logout,
      api, // expose axios instance if needed
    }),
    [accessToken, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
