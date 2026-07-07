import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, type: 'number' | 'bool' | 'text', max_score?: number) => void;
}

export const AddColumnModal = ({ isOpen, onClose, onAdd }: Props) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'number' | 'bool' | 'text'>('number');
  const [maxScore, setMaxScore] = useState<number | undefined>(undefined);

  if (!isOpen) return null;

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title, type, type === 'number' ? maxScore : undefined);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-2xl">📝</span>
          <h3 className="text-lg font-bold text-gray-800">Новая колонка</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-base font-semibold text-gray-700 mb-1.5">
              Название колонки
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="Например: Лабораторная работа №3"
              autoFocus
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-base font-semibold text-gray-700 mb-1.5">
              Тип данных
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition appearance-none"
            >
              <option value="number">🔢 Число</option>
              <option value="bool">✅ Посещение (Да/Нет)</option>
              <option value="text">📝 Текст</option>
            </select>
          </div>

          {type === 'number' && (
            <div className="mb-5">
              <label className="block text-base font-semibold text-gray-700 mb-1.5">
                Максимальный балл
              </label>
              <input
                type="number"
                value={maxScore ?? ''}
                onChange={(e) => setMaxScore(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="Необязательно"
                min="0"
                step="0.5"
              />
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition font-medium"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn-success py-2.5"
            >
              ➕ Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};