import { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, credits: number) => void;
}

export const CreateSubjectModal = ({ isOpen, onClose, onCreate }: Props) => {
  const [name, setName] = useState('');
  const [credits, setCredits] = useState(3);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Название обязательно');
      return;
    }
    setLoading(true);
    try {
      await onCreate(name.trim(), credits);
      setName('');
      setCredits(3);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content">
        <h3 className="text-xl font-bold text-primary mb-4">Создать предмет</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary mb-1">Название</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`input-field ${error ? 'error' : ''}`}
              placeholder="Например: Математика"
              autoFocus
            />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-secondary mb-1">Кредиты</label>
            <input
              type="number"
              value={credits}
              onChange={(e) => setCredits(Number(e.target.value))}
              className="input-field"
              min="1"
              max="10"
            />
          </div>
          {error && <p className="text-accent text-sm mb-3">{error}</p>}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-secondary">
              Отмена
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};