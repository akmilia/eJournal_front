// src/pages/Register.tsx
import { Link } from 'react-router-dom';

export const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">📝 Регистрация</h1>
          <p className="text-gray-600 mb-6">Функция регистрации находится в разработке.</p>
          <Link
            to="/login"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-xl transition shadow-md hover:shadow-lg"
          >
            Вернуться ко входу
          </Link>
        </div>
      </div>
    </div>
  );
};