// src/components/CreateJournalModal.tsx
import { useState, useEffect } from 'react';
import api from '../api/axios';

interface Group {
  id: number;
  name: string;
  course: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  subjectId: number;
  subjectName: string;
  onCreate: (subjectId: number, groupId: number, semester: number) => Promise<void>;
}

export const CreateJournalModal = ({ isOpen, onClose, subjectId, subjectName, onCreate }: Props) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [semester, setSemester] = useState(7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      fetchGroups();
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  const fetchGroups = async () => {
    try {
      const res = await api.get('/journals/groups/all');
      console.log('Загружены группы для журнала:', res.data); // Для отладки
      // Убеждаемся, что данные — это массив
      setGroups(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Ошибка загрузки групп', err);
      setError('Не удалось загрузить группы');
      setGroups([]);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!selectedGroupId) {
      setError('Выберите группу');
      return;
    }
    setLoading(true);
    try {
      await onCreate(subjectId, selectedGroupId, semester);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка создания');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content">
        <h3 className="modal-title">📖 Создать журнал</h3>
        <p className="modal-subtitle">
          Для предмета: <span className="font-medium text-primary">{subjectName}</span>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Группа</label>
            <select
              value={selectedGroupId || ''}
              onChange={(e) => setSelectedGroupId(e.target.value ? Number(e.target.value) : null)}
              className={error ? 'error' : ''}
              required
            >
              <option value="">Выберите группу</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} (курс {g.course})
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Семестр</label>
            <input
              type="number"
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
              min="1"
              max="12"
            />
          </div>

          {error && <div className="modal-error">⚠️ {error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Отмена
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Создание...' : 'Создать журнал'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};