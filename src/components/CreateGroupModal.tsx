// src/components/CreateGroupModal.tsx
import { useState, useEffect } from 'react';
import api from '../api/axios';

interface Student {
  id: number;
  full_name: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
}

export const CreateGroupModal = ({ isOpen, onClose, onCreate }: Props) => {
  const [name, setName] = useState('');
  const [course, setCourse] = useState(1);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentsList, setNewStudentsList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      fetchAvailableStudents();
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  const fetchAvailableStudents = async () => {
    try {
      const res = await api.get('/journals/students/available');
      setAvailableStudents(res.data);
    } catch (err) {
      console.error('Ошибка загрузки студентов', err);
    }
  };

  if (!isOpen) return null;

  const handleAddNewStudent = () => {
    if (newStudentName.trim()) {
      setNewStudentsList([...newStudentsList, newStudentName.trim()]);
      setNewStudentName('');
    }
  };

  const handleRemoveNewStudent = (index: number) => {
    setNewStudentsList(newStudentsList.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Название группы обязательно');
      return;
    }

    setLoading(true);
    try {
      await api.post('/journals/groups', {
        name: name.trim(),
        course,
        student_ids: selectedStudents.length > 0 ? selectedStudents : undefined,
        new_students: newStudentsList.length > 0 ? newStudentsList : undefined,
      });
      onCreate();
      onClose();
      // Сброс формы
      setName('');
      setCourse(1);
      setSelectedStudents([]);
      setNewStudentsList([]);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка создания группы');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" style={{ maxWidth: '560px' }}>
        <h3 className="modal-title">👥 Создать группу</h3>
        <p className="modal-subtitle">Добавьте новую академическую группу</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Название группы</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={error ? 'error' : ''}
              placeholder="Например: 4119"
              autoFocus
            />
          </div>

          <div className="field">
            <label>Курс</label>
            <input
              type="number"
              value={course}
              onChange={(e) => setCourse(Number(e.target.value))}
              min="1"
              max="6"
            />
          </div>

          <div className="field">
            <label>Добавить существующих студентов</label>
            <select
              value=""
              onChange={(e) => {
                const id = Number(e.target.value);
                if (id && !selectedStudents.includes(id)) {
                  setSelectedStudents([...selectedStudents, id]);
                }
              }}
            >
              <option value="">Выберите студента</option>
              {availableStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name}
                </option>
              ))}
            </select>
            {selectedStudents.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedStudents.map((id) => {
                  const student = availableStudents.find(s => s.id === id);
                  return (
                    <span key={id} className="bg-gray-100 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2">
                      {student?.full_name}
                      <button
                        type="button"
                        onClick={() => setSelectedStudents(selectedStudents.filter(s => s !== id))}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <div className="field">
            <label>Или создайте новых студентов</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder="ФИО студента"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddNewStudent();
                  }
                }}
              />
              <button type="button" onClick={handleAddNewStudent} className="btn-secondary">
                Добавить
              </button>
            </div>
            {newStudentsList.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {newStudentsList.map((name, index) => (
                  <span key={index} className="bg-green-50 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2">
                    {name}
                    <button
                      type="button"
                      onClick={() => handleRemoveNewStudent(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {error && <div className="modal-error">⚠️ {error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Отмена
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Создание...' : 'Создать группу'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};