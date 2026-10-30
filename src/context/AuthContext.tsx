import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, Language } from '../types.ts';
import { translations } from '../i18n/translations.ts';

interface AuthContextType {
  user: UserAccount | null;
  token: string | null;
  language: Language;
  t: typeof translations['en'];
  setLanguage: (lang: Language) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: UserAccount }>;
  register: (data: any) => Promise<{ success: boolean; error?: string; user?: UserAccount }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfileLocally: (data: Partial<UserAccount>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('glowstudio_token');
  });

  const [user, setUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('glowstudio_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('glowstudio_lang');
    return (saved === 'hi' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('glowstudio_lang', lang);
  };

  const t = translations[language];

  // Refresh user from server on load
  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('glowstudio_user', JSON.stringify(data.user));
      } else if (res.status === 401 || res.status === 403) {
        logout();
      }
    } catch (err) {
      console.warn('Network issue fetching user me:', err);
    }
  };

  useEffect(() => {
    if (token) {
      refreshUser();
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('glowstudio_token', data.token);
      localStorage.setItem('glowstudio_user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message || 'Connection error' };
    }
  };

  const register = async (formData: any) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('glowstudio_token', data.token);
      localStorage.setItem('glowstudio_user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message || 'Connection error' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('glowstudio_token');
    localStorage.removeItem('glowstudio_user');
  };

  const updateProfileLocally = (data: Partial<UserAccount>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('glowstudio_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        language,
        t,
        setLanguage,
        login,
        register,
        logout,
        refreshUser,
        updateProfileLocally,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
