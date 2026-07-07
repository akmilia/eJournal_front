import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('access_token', res.data.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        full_name: fullName,
        email: regEmail,
        password: regPassword,
        department: department || undefined,
      });
      localStorage.setItem('access_token', res.data.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Заголовок */}
        <div className="login-header">
          <h1>eJournal</h1>
          <p>Электронный журнал для преподавателей</p>
        </div>

        {/* Переключатель вкладок */}
        <div className="login-tabs">
          <button
            onClick={() => { setIsRegister(false); setError(''); }}
            className={`login-tab ${!isRegister ? 'login-tab-active' : 'login-tab-inactive'}`}
          >
            Вход
          </button>
          <button
            onClick={() => { setIsRegister(true); setError(''); }}
            className={`login-tab ${isRegister ? 'login-tab-active' : 'login-tab-inactive'}`}
          >
            Регистрация
          </button>
        </div>

        {/* Форма входа */}
        {!isRegister ? (
          <form onSubmit={handleLogin} className="login-form">
            <div className="login-field">
              <label>Email</label>
              <div className="input-wrap">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@univ.ru"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label>Пароль</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="login-error">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="login-submit"
            >
              {loading ? 'Загрузка...' : 'Войти'}
            </button>
          </form>
        ) : (
          /* Форма регистрации */
          <form onSubmit={handleRegister} className="login-form">
            <div className="login-field">
              <label>Полное имя</label>
              <div className="input-wrap">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Иванова Анна Петровна"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label>Email</label>
              <div className="input-wrap">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="teacher@univ.ru"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label>Пароль</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label>Кафедра (опционально)</label>
              <div className="input-wrap">
                <span className="input-icon">🏛️</span>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Кафедра математики"
                />
              </div>
            </div>

            {error && (
              <div className="login-error">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="login-submit"
            >
              {loading ? 'Загрузка...' : 'Зарегистрироваться'}
            </button>
          </form>
        )}

        <div className="login-footer">
          <p>
            {!isRegister 
              ? 'Тестовые данные: a.smirnova@univ.ru / 12345' 
              : 'После регистрации вы будете автоматически авторизованы'}
          </p>
        </div>
      </div>
    </div>
  );
};