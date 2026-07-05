import { Subject } from '../types';

interface Props {
  subjects: Subject[];
  onSelect: (id: number) => void;
  selectedId: number | null;
}

export const SubjectList = ({ subjects, onSelect, selectedId }: Props) => (
  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
    {subjects.length === 0 ? (
      <p className="text-gray-400 text-base text-center py-6">Нет предметов</p>
    ) : (
      subjects.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
            selectedId === s.id
              ? 'bg-indigo-50 border-2 border-indigo-300 shadow-sm'
              : 'hover:bg-gray-50 border-2 border-transparent'
          }`}
        >
          <div className="font-medium text-gray-800 text-base">{s.name}</div>
          <div className="text-base text-gray-400">{s.credits} зач. ед.</div>
        </button>
      ))
    )}
  </div>
);