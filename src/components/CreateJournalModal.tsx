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
      const fetchGroups = async () => {
        try {
          const res = await api.get('/journals/groups');
          setGroups(res.data);
        } catch {
          setError('Не удалось загрузить группы');
        }
      };
      fetchGroups();
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

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
        <h3 className="text-xl font-bold text-primary mb-2">Создать журнал</h3>
        <p className="text-sm text-secondary mb-4">Предмет: <span className="font-medium text-primary">{subjectName}</span></p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary mb-1">Группа</label>
            <select
              value={selectedGroupId || ''}
              onChange={(e) => setSelectedGroupId(Number(e.target.value))}
              className={`input-field ${error ? 'error' : ''}`}
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
          <div className="mb-5">
            <label className="block text-sm font-medium text-secondary mb-1">Семестр</label>
            <input
              type="number"
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
              className="input-field"
              min="1"
              max="12"
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