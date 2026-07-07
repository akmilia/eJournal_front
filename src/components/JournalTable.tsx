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

  // Получаем тип колонки по ключу
  const getColumnType = (field: string): string => {
    const col = columns.find(c => c.key === field);
    return col?.type || 'text';
  };

  // Получаем max_score для числовых полей
  const getMaxScore = (field: string): number | undefined => {
    const col = columns.find(c => c.key === field);
    return col?.max_score;
  };

  // Начало редактирования ячейки
  const handleCellClick = (studentId: number, field: string, currentValue: any) => {
    const colType = getColumnType(field);
    
    // Для булевых полей — переключаем сразу
    if (colType === 'bool') {
      toggleBoolValue(studentId, field, currentValue);
      return;
    }
    
    // Для остальных — открываем редактирование
    setEditingCell({ studentId, field });
    setEditValue(currentValue ?? '');
  };

  // Переключение булевого значения
  const toggleBoolValue = async (studentId: number, field: string, currentValue: any) => {
    const student = students.find(s => s.student_id === studentId);
    if (!student) return;
    const recordId = (student as any).record_id;
    if (!recordId) {
      alert('Ошибка: record_id не найден');
      return;
    }
    
    try {
      setLoading(true);
      await api.patch(`/journals/records/${recordId}`, {
        field: field,
        value: !currentValue
      });
      onUpdate();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.detail || 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  // Сохранение редактирования
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
    
    const colType = getColumnType(field);
    let valueToSave = editValue;
    
    // Валидация для числовых полей
    if (colType === 'number') {
      const numValue = Number(editValue);
      if (isNaN(numValue)) {
        alert('Введите корректное число');
        return;
      }
      const maxScore = getMaxScore(field);
      if (maxScore !== undefined && numValue > maxScore) {
        alert(`Значение не может превышать ${maxScore}`);
        return;
      }
      valueToSave = numValue;
    }
    
    try {
      setLoading(true);
      await api.patch(`/journals/records/${recordId}`, {
        field: field,
        value: valueToSave
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

  // Отмена редактирования
  const handleCellCancel = () => {
    setEditingCell(null);
  };

  // Обработка нажатия клавиш в режиме редактирования
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCellSave();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      handleCellCancel();
    }
  };

  // Форматирование значения для отображения
  const formatValue = (value: any, type: string) => {
    if (value === null || value === undefined) return '—';
    if (type === 'bool') return value ? '✅' : '❌';
    return String(value);
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
                  const isEditing = editingCell?.studentId === student.student_id && editingCell?.field === col.key;
                  const colType = col.type;

                  return (
                    <td
                      key={col.key}
                      className={colType === 'bool' ? 'cell-clickable text-center' : 'cell-clickable'}
                      onClick={() => {
                        if (!isEditing && colType !== 'bool') {
                          handleCellClick(student.student_id, col.key, value);
                        }
                      }}
                    >
                      {isEditing ? (
                        // Режим редактирования для чисел и текста
                        <input
                          type={colType === 'number' ? 'number' : 'text'}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleCellSave}
                          onKeyDown={handleKeyDown}
                          className="w-full px-2 py-1 border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                          autoFocus
                          step={colType === 'number' ? '0.5' : undefined}
                          min={colType === 'number' ? 0 : undefined}
                          max={colType === 'number' ? getMaxScore(col.key) : undefined}
                        />
                      ) : colType === 'bool' ? (
                        // Чекбокс для булевых полей
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={!!value}
                            onChange={() => toggleBoolValue(student.student_id, col.key, value)}
                            className="w-5 h-5 accent-primary cursor-pointer rounded border-gray-300 focus:ring-primary"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      ) : (
                        // Отображение для чисел и текста
                        <div className="flex items-center gap-1 min-h-[32px]">
                          <span className="text-base">{formatValue(value, colType)}</span>
                          <span className="text-base text-gray-300 opacity-0 group-hover:opacity-100 transition">✎</span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Модалка добавления колонки */}
      <AddColumnModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddColumn}
      />
    </div>
  );
};