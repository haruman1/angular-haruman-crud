import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { api, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const userData = await api.checkAuth();
        setUser(userData);
      }
    } catch {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login({ email, password });

      if (!response) {
        throw new Error('Login gagal, tidak ada response');
      }

      if (response.success === false) {
        throw new Error(response.message || 'Login gagal');
      }

      if (!response.data?.token || !response.data?.user) {
        throw new Error('Login gagal');
      }

      // Simpan token
      localStorage.setItem('auth_token', response.data.token);

      // Simpan user
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
      setUser(response.data.user);

      return { success: true };
    } catch (error: any) {
      // Wajib return agar UI bisa tahu error
      return { success: false, message: error.message };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.register({ name, email, password });
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    if (response.user) {
      localStorage.setItem('user_data', JSON.stringify(response.user));
      setUser(response.user);
    }
  };

  const logout = async () => {
    await api.logout();
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
