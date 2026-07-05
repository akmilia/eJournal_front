import { useState } from 'react';
import { JournalData, ColumnConfig } from '../types';
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
        value: editValue
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
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 overflow-hidden">
      {/* Заголовок таблицы */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-5 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">📊 Журнал</h2>
          <p className="text-base text-gray-500">
            {students.length} студентов · {columns.length} колонок
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-success text-base">
          ➕ Добавить колонку
        </button>
      </div>

      {/* Таблица */}
      <div className="overflow-x-auto table-container">
        <table>
          <thead>
            <tr>
              <th className="sticky-col text-left" style={{ minWidth: '180px' }}>
                Студент
              </th>
              {columns.map((col) => (
                <th key={col.key} className="relative group text-left" style={{ minWidth: '120px' }}>
                  <div className="flex items-center justify-between gap-2">
                    <span>{col.title}</span>
                    <button
                      onClick={() => handleDeleteColumn(col.key)}
                      className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition text-base"
                    >
                      ✕
                    </button>
                  </div>
                  {col.max_score !== undefined && (
                    <div className="text-base text-gray-400 font-normal">макс: {col.max_score}</div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.student_id} className="hover:bg-indigo-50/50 transition">
                <td className="sticky-col font-medium text-gray-800">
                  {student.name}
                </td>
                {columns.map((col) => {
                  const value = student.values?.[col.key];
                  return (
                    <td
                      key={col.key}
                      className="cursor-pointer hover:bg-indigo-100/50 transition rounded-lg"
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">✏️ Изменить значение</h3>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition mb-4"
              placeholder="Введите новое значение"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCellSave();
                if (e.key === 'Escape') setEditingCell(null);
              }}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingCell(null)}
                className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition font-medium"
              >
                Отмена
              </button>
              <button
                onClick={handleCellSave}
                disabled={loading}
                className="btn-primary py-2.5 disabled:opacity-50"
              >
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