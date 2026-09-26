import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { apiClient } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  savedJobIds: string[];
  toggleSavedJob: (jobId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('cs_auth_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('cs_saved_jobs') || '[]');
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await apiClient.get('/auth/me');
        if (res.data?.data) {
          setUser(res.data.data);
        }
      } catch (e) {
        // Fallback user state
        setUser({
          id: 'demo-student-id',
          email: 'alex.rivera@university.edu',
          name: 'Alex Rivera',
          college: 'Indian Institute of Technology (IIT)',
          degree: 'B.Tech',
          branch: 'Computer Science & Engineering',
          gradYear: 2026,
          skills: ['Python', 'Java', 'React', 'C++', 'Data Structures', 'Git'],
          preferredRoles: ['Software Engineering Intern', 'AI/ML Engineer'],
          preferredLocations: ['Bengaluru', 'Hyderabad', 'Remote'],
          role: 'USER',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email: string, pass: string) => {
    try {
      const res = await apiClient.post('/auth/login', { email, password: pass });
      if (res.data?.data) {
        const { user: u, token: t } = res.data.data;
        setUser(u);
        setToken(t);
        localStorage.setItem('cs_auth_token', t);
        return;
      }
    } catch (e) {}

    // Mock login fallback
    const mockUser: User = {
      id: 'usr-demo',
      email,
      name: email.split('@')[0],
      college: 'National Institute of Technology (NIT)',
      degree: 'B.Tech',
      branch: 'Computer Science',
      gradYear: 2026,
      skills: ['Python', 'Java', 'React', 'Data Structures'],
      preferredRoles: ['Software Engineering Intern'],
      preferredLocations: ['Bengaluru', 'Remote'],
      role: 'USER',
    };
    const mockToken = 'mock-jwt-token-12345';
    setUser(mockUser);
    setToken(mockToken);
    localStorage.setItem('cs_auth_token', mockToken);
  };

  const signup = async (name: string, email: string, pass: string) => {
    try {
      const res = await apiClient.post('/auth/signup', { name, email, password: pass });
      if (res.data?.data) {
        const { user: u, token: t } = res.data.data;
        setUser(u);
        setToken(t);
        localStorage.setItem('cs_auth_token', t);
        return;
      }
    } catch (e) {}

    const mockUser: User = {
      id: 'usr-new',
      email,
      name,
      skills: ['Java', 'Problem Solving'],
      preferredRoles: ['Software Engineering Intern'],
      preferredLocations: ['Bengaluru'],
      role: 'USER',
    };
    const mockToken = 'mock-jwt-token-new';
    setUser(mockUser);
    setToken(mockToken);
    localStorage.setItem('cs_auth_token', mockToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cs_auth_token');
  };

  const toggleSavedJob = (jobId: string) => {
    setSavedJobIds((prev) => {
      let updated: string[];
      if (prev.includes(jobId)) {
        updated = prev.filter((id) => id !== jobId);
      } else {
        updated = [...prev, jobId];
      }
      localStorage.setItem('cs_saved_jobs', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        savedJobIds,
        toggleSavedJob,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
