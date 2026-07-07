import { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, type: 'number' | 'bool' | 'text', max_score?: number) => void;
}

export const AddColumnModal = ({ isOpen, onClose, onAdd }: Props) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'number' | 'bool' | 'text'>('number');
  const [maxScore, setMaxScore] = useState<number | undefined>(undefined);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Название обязательно');
      return;
    }
    setLoading(true);
    onAdd(title.trim(), type, type === 'number' ? maxScore : undefined);
    setTitle('');
    setType('number');
    setMaxScore(undefined);
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content">
        <h3 className="modal-title">📝 Новая колонка</h3>
        <p className="modal-subtitle">Добавьте новую колонку в журнал</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Название колонки</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={error ? 'error' : ''}
              placeholder="Например: Лабораторная работа №3"
              autoFocus
            />
          </div>

          <div className="field">
            <label>Тип данных</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
            >
              <option value="number">🔢 Число</option>
              <option value="bool">✅ Посещение (Да/Нет)</option>
              <option value="text">📝 Текст</option>
            </select>
          </div>

          {type === 'number' && (
            <div className="field">
              <label>Максимальный балл (опционально)</label>
              <input
                type="number"
                value={maxScore ?? ''}
                onChange={(e) => setMaxScore(e.target.value ? Number(e.target.value) : undefined)}
                min="0"
                step="0.5"
                placeholder="Необязательно"
              />
            </div>
          )}

          {error && <div className="modal-error">⚠️ {error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Отмена
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Добавление...' : '➕ Добавить колонку'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};