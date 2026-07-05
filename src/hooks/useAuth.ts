import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));
  const navigate = useNavigate();

  const login = (newToken: string) => {
    localStorage.setItem('access_token', newToken);
    setToken(newToken);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    navigate('/login');
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  return { token, login, logout };
};