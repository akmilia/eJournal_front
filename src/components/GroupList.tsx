import { GroupInfo } from '../types';

interface Props {
  groups: GroupInfo[];
  onSelect: (groupSubjectId: number) => void;
  selectedId: number | null;
}

export const GroupList = ({ groups, onSelect, selectedId }: Props) => (
  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
    {groups.length === 0 ? (
      <p className="text-gray-400 text-base text-center py-6">Нет групп</p>
    ) : (
      groups.map((g) => (
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
      ))
    )}
  </div>
);