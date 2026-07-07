// src/components/JournalTable.tsx
import { useState } from 'react';
import { JournalData } from '../types';
import api from '../api/axios';
import { AddColumnModal } from './AddColumnModal';

interface Props {
  journalData: JournalData;
  groupSubjectId: number;
  onUpdate: () => void;
}

export const JournalTable = ({ journalData, groupSubjectId, onUpdate }: Props) => {
  const [editingCell, setEditingCell] = useState<{ studentId: number; field: string } | null>(null);
  const [editValue, setEditValue] = useState<any>('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const columns = journalData.columns_config;
  const students = journalData.students;

  const handleCellClick = (studentId: number, field: string, currentValue: any) => {
    setEditingCell({ studentId, field });
    setEditValue(currentValue ?? '');
  };

  const handleCellSave = async () => {
    if (!editingCell) return;
    const { studentId, field } = editingCell;
    const student = students.find(s => s.student_id === studentId);
    if (!student) return;
    const recordId = (student as any).record_id;
    if (!recordId) {
      alert('Ошибка: record_id не найден');
      setEditingCell(null);
      return;
    }
    try {
      setLoading(true);
      await api.patch(`/journals/records/${recordId}`, {
        field: field,
        value: editValue,
      });
      onUpdate();
      setEditingCell(null);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.detail || 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteColumn = async (key: string) => {
    const col = columns.find(c => c.key === key);
    if (!confirm(`Удалить колонку "${col?.title}"?`)) return;
    try {
      await api.delete(`/journals/${groupSubjectId}/columns/${key}`);
      onUpdate();
    } catch (error) {
      console.error(error);
      alert('Ошибка удаления');
    }
  };

  const handleAddColumn = async (title: string, type: 'number' | 'bool' | 'text', max_score?: number) => {
    try {
      await api.post(`/journals/${groupSubjectId}/columns`, { title, type, max_score });
      onUpdate();
      setShowModal(false);
    } catch (error) {
      console.error(error);
      alert('Ошибка добавления');
    }
  };

  const formatValue = (value: any, type: string) => {
    if (value === null || value === undefined) return '—';
    if (type === 'bool') return value ? '✅' : '❌';
    return value;
  };

  return (
    <div>
      {/* Заголовок таблицы */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-primary">📊 Журнал</h2>
          <p className="text-base text-secondary">
            {students.length} студентов · {columns.length} колонок
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          ➕ Добавить колонку
        </button>
      </div>

      {/* Таблица */}
      <div className="journal-table-container">
        <table>
          <thead>
            <tr>
              <th className="sticky-col">Студент</th>
              {columns.map((col) => (
                <th key={col.key} className="relative group">
                  <div className="flex items-center justify-between gap-2">
                    <span>{col.title}</span>
                    <button
                      onClick={() => handleDeleteColumn(col.key)}
                      className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition text-sm"
                    >
                      ✕
                    </button>
                  </div>
                  {col.max_score !== undefined && (
                    <div className="text-sm text-secondary font-normal">макс: {col.max_score}</div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.student_id}>
                <td className="sticky-col">{student.name}</td>
                {columns.map((col) => {
                  const value = student.values?.[col.key];
                  return (
                    <td
                      key={col.key}
                      className="cell-clickable"
                      onClick={() => handleCellClick(student.student_id, col.key, value)}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-base">{formatValue(value, col.type)}</span>
                        <span className="text-base text-gray-300 opacity-0 group-hover:opacity-100">✎</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Модалка редактирования */}
      {editingCell && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setEditingCell(null); }}>
          <div className="modal-content">
            <h3 className="modal-title">✏️ Изменить значение</h3>
            <p className="modal-subtitle">Введите новое значение для ячейки</p>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-lg focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition mb-5"
              placeholder="Введите новое значение"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCellSave();
                if (e.key === 'Escape') setEditingCell(null);
              }}
            />
            <div className="modal-actions">
              <button onClick={() => setEditingCell(null)} className="btn-secondary">
                Отмена
              </button>
              <button onClick={handleCellSave} disabled={loading} className="btn-primary">
                {loading ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка добавления колонки */}
      <AddColumnModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddColumn}
      />
    </div>
  );
};