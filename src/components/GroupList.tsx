import { GroupInfo } from '../types';

interface Props {
  groups: GroupInfo[];
  onSelect: (groupSubjectId: number) => void;
  selectedId: number | null;
  onCreateJournal?: () => void; // новая пропса
}

export const GroupList = ({ groups, onSelect, selectedId, onCreateJournal }: Props) => (
  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
    {groups.length === 0 ? (
      <div className="text-center py-6">
        <p className="text-gray-400 text-base">Нет групп</p>
        {onCreateJournal && (
          <button
            onClick={onCreateJournal}
            className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium transition"
          >
            + Создать журнал для группы
          </button>
        )}
      </div>
    ) : (
      <>
        {groups.map((g) => (
          <button
            key={g.group_subject_id}
            onClick={() => onSelect(g.group_subject_id)}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
              selectedId === g.group_subject_id
                ? 'bg-green-50 border-2 border-green-300 shadow-sm'
                : 'hover:bg-gray-50 border-2 border-transparent'
            }`}
          >
            <div className="font-medium text-gray-800 text-base">{g.group_name}</div>
            <div className="text-base text-gray-400">Семестр {g.semester}</div>
          </button>
        ))}
        {onCreateJournal && (
          <button
            onClick={onCreateJournal}
            className="w-full text-center px-4 py-2.5 rounded-xl text-sm font-medium text-indigo-600 hover:bg-indigo-50 border-2 border-dashed border-indigo-200 transition"
          >
            + Создать журнал для новой группы
          </button>
        )}
      </>
    )}
  </div>
);