export const Spinner = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg animate-pulse"></div>
      </div>
    </div>
    <p className="mt-4 text-gray-500 font-medium animate-pulse">Загрузка...</p>
  </div>
);