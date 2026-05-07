import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { api, getToken, setToken, removeToken } from '../lib/api';
import { useAppStore } from '../stores/appStore';


interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
  role: string;
  createdAt?: string;
  phone?: string;
  countryCode?: string;
  onboardingDone?: boolean;
  plan?: string | null;
  subscriptionStart?: string;
  subscriptionEnd?: string;
  trialUsed?: boolean;
  paymentMethods?: any[];
}

interface AuthContextType {
  user: User | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { username?: string; name?: string; email: string; password: string; phone?: string; countryCode?: string }) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshProfile = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        setUser(null);
        setIsLoaded(true);
        return;
      }

      const account = await api.getMe();
      const baseUser = {
        id: account._id || account.id,
        name: account.username || account.name || account.email,
        username: account.username,
        email: account.email,
        role: account.role || 'STUDENT',
        plan: account.plan,
        subscriptionStart: account.subscriptionStart,
        subscriptionEnd: account.subscriptionEnd,
        trialUsed: account.trialUsed,
        paymentMethods: account.paymentMethods,
      };

      try {
        const profile = await api.getProfile();
        const role = (profile.role || baseUser.role) as any;
        const onboardingDone = !!profile.onboardingDone;
        
        setUser({
          ...baseUser,
          name: profile.fullName || baseUser.name,
          phone: profile.phone,
          countryCode: profile.countryCode,
          onboardingDone,
          role,
        });

        // Sync with AppStore
        const { setUserRole, setOnboardingDone } = useAppStore.getState();
        setUserRole(role);
        setOnboardingDone(onboardingDone);
      } catch {
        setUser(baseUser);
        const { setUserRole } = useAppStore.getState();
        setUserRole(baseUser.role as any);
      }
    } catch {
      removeToken();
      setUser(null);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    setToken(res.token);
    setUser({
      id: res.user.id,
      name: res.user.username || res.user.name || res.user.email,
      username: res.user.username,
      email: res.user.email,
      role: res.user.role || 'STUDENT',
    });
  };

  const register = async (data: { username?: string; name?: string; email: string; password: string; phone?: string; countryCode?: string }) => {
    const res = await api.register({
      username: data.username || data.name || data.email,
      email: data.email,
      password: data.password,
    });
    setToken(res.token);
    setUser({
      id: res.user.id,
      name: res.user.username || res.user.name || res.user.email,
      username: res.user.username,
      email: res.user.email,
      role: res.user.role || 'STUDENT',
    });
  };

  const logout = () => {
    removeToken();
    localStorage.removeItem('smartbus_user_role');
    localStorage.removeItem('smartbus_onboarding_done');
    setUser(null);
    window.location.href = '/';
  };

  const updateUser = (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoaded,
      isSignedIn: !!user,
      login,
      register,
      logout,
      updateUser,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
