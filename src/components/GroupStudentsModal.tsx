// src/components/GroupStudentsModal.tsx
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Student } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  groupId: number;
  groupName: string;
  students: Student[];
  onGroupDeleted: () => void;
}

export const GroupStudentsModal = ({ isOpen, onClose, groupId, groupName, students, onGroupDeleted }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDeleteGroup = async () => {
    if (!confirm(`Вы уверены, что хотите удалить группу "${groupName}"? Это удалит всех студентов и связанные журналы.`)) {
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.delete(`/journals/groups/${groupId}`);
      onGroupDeleted();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка удаления группы');
    } finally {
      setLoading(false);
    }
  };

  // Проверяем, что students — это массив
  const studentsList = Array.isArray(students) ? students : [];

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" style={{ maxWidth: '520px' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="modal-title">👥 {groupName}</h3>
          <span className="text-sm text-secondary">{studentsList.length} студентов</span>
        </div>

        {error && <div className="modal-error">⚠️ {error}</div>}

        <div className="max-h-60 overflow-y-auto mb-5">
          {studentsList.length === 0 ? (
            <p className="text-secondary text-center py-4">В группе нет студентов</p>
          ) : (
            <ul className="space-y-1.5">
              {studentsList.map((student) => (
                <li key={student.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  <span className="text-gray-700">{student.full_name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="modal-actions">
          <button
            type="button"
            onClick={handleDeleteGroup}
            disabled={loading}
            className="btn-danger"
          >
            {loading ? 'Удаление...' : '🗑️ Удалить группу'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};