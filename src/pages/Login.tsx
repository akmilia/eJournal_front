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
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-200 animate-fade-in">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">eJournal</h1>
          <p className="text-secondary text-lg mt-2">Электронный журнал для преподавателей</p>
        </div>

        {/* Табы */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
          <button
            onClick={() => { setIsRegister(false); setError(''); }}
            className={`flex-1 py-3 text-lg font-medium rounded-lg transition ${
              !isRegister ? 'bg-white shadow-sm text-primary' : 'text-secondary hover:text-gray-700'
            }`}
          >
            Вход
          </button>
          <button
            onClick={() => { setIsRegister(true); setError(''); }}
            className={`flex-1 py-3 text-lg font-medium rounded-lg transition ${
              isRegister ? 'bg-white shadow-sm text-primary' : 'text-secondary hover:text-gray-700'
            }`}
          >
            Регистрация
          </button>
        </div>

        {/* Форма входа */}
        {!isRegister ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-base font-medium text-secondary mb-1.5">Email</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-xl">📧</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                  placeholder="teacher@univ.ru"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-base font-medium text-secondary mb-1.5">Пароль</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-xl">🔒</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-base rounded-xl">⚠️ {error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white text-xl font-semibold py-4 rounded-xl transition disabled:opacity-60"
            >
              {loading ? 'Загрузка...' : 'Войти'}
            </button>
          </form>
        ) : (
          /* Форма регистрации */
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-base font-medium text-secondary mb-1.5">Полное имя</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-xl">👤</span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                  placeholder="Иванова Анна Петровна"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-base font-medium text-secondary mb-1.5">Email</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-xl">📧</span>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                  placeholder="teacher@univ.ru"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-base font-medium text-secondary mb-1.5">Пароль</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-xl">🔒</span>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-base font-medium text-secondary mb-1.5">Кафедра (опционально)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-xl">🏛️</span>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                  placeholder="Кафедра математики"
                />
              </div>
            </div>
            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-base rounded-xl">⚠️ {error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white text-xl font-semibold py-4 rounded-xl transition disabled:opacity-60"
            >
              {loading ? 'Загрузка...' : 'Зарегистрироваться'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-secondary">
            {!isRegister ? 'Тестовые данные: a.smirnova@univ.ru / 12345' : 'После регистрации вы будете автоматически авторизованы'}
          </p>
        </div>
      </div>
    </div>
  );
};
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../api/axios';

// export const Login = () => {
//   const [isRegister, setIsRegister] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [fullName, setFullName] = useState('');
//   const [regEmail, setRegEmail] = useState('');
//   const [regPassword, setRegPassword] = useState('');
//   const [department, setDepartment] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
//     try {
//       const res = await api.post('/auth/login', { email, password });
//       localStorage.setItem('access_token', res.data.access_token);
//       navigate('/dashboard');
//     } catch (err: any) {
//       setError(err.response?.data?.detail || 'Неверный email или пароль');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
//     try {
//       const res = await api.post('/auth/register', {
//         full_name: fullName,
//         email: regEmail,
//         password: regPassword,
//         department: department || undefined,
//       });
//       localStorage.setItem('access_token', res.data.access_token);
//       navigate('/dashboard');
//     } catch (err: any) {
//       setError(err.response?.data?.detail || 'Ошибка регистрации');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background p-6">
//       <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-200 animate-fade-in">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-primary tracking-tight">
//             e<span className="text-primary">Journal</span>
//           </h1>
//           <p className="text-secondary text-lg mt-2">Электронный журнал для преподавателей</p>
//         </div>

//         <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
//           <button
//             onClick={() => { setIsRegister(false); setError(''); }}
//             className={`flex-1 py-3 text-lg font-medium rounded-lg transition ${
//               !isRegister ? 'bg-white shadow-sm text-primary' : 'text-secondary hover:text-gray-700'
//             }`}
//           >
//             Вход
//           </button>
//           <button
//             onClick={() => { setIsRegister(true); setError(''); }}
//             className={`flex-1 py-3 text-lg font-medium rounded-lg transition ${
//               isRegister ? 'bg-white shadow-sm text-primary' : 'text-secondary hover:text-gray-700'
//             }`}
//           >
//             Регистрация
//           </button>
//         </div>

//         {!isRegister ? (
//           <form onSubmit={handleLogin}>
//             <div className="mb-5">
//               <label className="block text-base font-medium text-secondary mb-1.5">Email</label>
//               <div className="relative">
//                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-xl">📧</span>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="input-field pl-12"
//                   placeholder="teacher@univ.ru"
//                   required
//                 />
//               </div>
//             </div>
//             <div className="mb-6">
//               <label className="block text-base font-medium text-secondary mb-1.5">Пароль</label>
//               <div className="relative">
//                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-xl">🔒</span>
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="input-field pl-12"
//                   placeholder="••••••••"
//                   required
//                 />
//               </div>
//             </div>
//             {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-base rounded-xl">⚠️ {error}</div>}
//             <button type="submit" disabled={loading} className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-60">
//               {loading ? 'Загрузка...' : 'Войти'}
//             </button>
//           </form>
//         ) : (
//           <form onSubmit={handleRegister}>
//             <div className="mb-5">
//               <label className="block text-base font-medium text-secondary mb-1.5">Полное имя</label>
//               <div className="relative">
//                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-xl">👤</span>
//                 <input
//                   type="text"
//                   value={fullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                   className="input-field pl-12"
//                   placeholder="Иванова Анна Петровна"
//                   required
//                 />
//               </div>
//             </div>
//             <div className="mb-5">
//               <label className="block text-base font-medium text-secondary mb-1.5">Email</label>
//               <div className="relative">
//                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-xl">📧</span>
//                 <input
//                   type="email"
//                   value={regEmail}
//                   onChange={(e) => setRegEmail(e.target.value)}
//                   className="input-field pl-12"
//                   placeholder="teacher@univ.ru"
//                   required
//                 />
//               </div>
//             </div>
//             <div className="mb-5">
//               <label className="block text-base font-medium text-secondary mb-1.5">Пароль</label>
//               <div className="relative">
//                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-xl">🔒</span>
//                 <input
//                   type="password"
//                   value={regPassword}
//                   onChange={(e) => setRegPassword(e.target.value)}
//                   className="input-field pl-12"
//                   placeholder="••••••••"
//                   required
//                 />
//               </div>
//             </div>
//             <div className="mb-6">
//               <label className="block text-base font-medium text-secondary mb-1.5">Кафедра (опционально)</label>
//               <div className="relative">
//                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-xl">🏛️</span>
//                 <input
//                   type="text"
//                   value={department}
//                   onChange={(e) => setDepartment(e.target.value)}
//                   className="input-field pl-12"
//                   placeholder="Кафедра математики"
//                 />
//               </div>
//             </div>
//             {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-base rounded-xl">⚠️ {error}</div>}
//             <button type="submit" disabled={loading} className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-60">
//               {loading ? 'Загрузка...' : 'Зарегистрироваться'}
//             </button>
//           </form>
//         )}
//         <div className="mt-6 text-center">
//           <p className="text-sm text-secondary">
//             {!isRegister ? 'Тестовые данные: a.smirnova@univ.ru / 12345' : 'После регистрации вы будете автоматически авторизованы'}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };