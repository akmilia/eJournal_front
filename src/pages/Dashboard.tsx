
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Subject, GroupInfo, JournalListItem } from '../types';
import { Spinner } from '../components/Spinner';
import { SubjectList } from '../components/SubjectList';
import { GroupList } from '../components/GroupList';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [groups, setGroups] = useState<GroupInfo[]>([]);
  const [allJournals, setAllJournals] = useState<JournalListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [selectedGroupSubjectId, setSelectedGroupSubjectId] = useState<number | null>(null);
  const [teacherName, setTeacherName] = useState('Преподаватель');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, allJournalsRes] = await Promise.all([
          api.get('/journals/subjects'),
          api.get('/journals'),
        ]);
        setSubjects(subRes.data);
        setAllJournals(allJournalsRes.data);
        // Здесь можно добавить получение имени пользователя, если есть соответствующий эндпоинт
        // setTeacherName('Анна Петровна Смирнова');
      } catch (error) {
        console.error(error);
        if (error && typeof error === 'object' && 'response' in error) {
          const err = error as { response: { status: number } };
          if (err.response?.status === 401) {
            localStorage.removeItem('access_token');
            navigate('/login');
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleSubjectSelect = async (subjectId: number) => {
    setSelectedSubjectId(subjectId);
    setSelectedGroupSubjectId(null);
    try {
      const res = await api.get(`/journals/subjects/${subjectId}/groups`);
      setGroups(res.data);
    } catch (error) {
      console.error(error);
      setGroups([]);
    }
  };

  const handleGroupSelect = (groupSubjectId: number) => {
    setSelectedGroupSubjectId(groupSubjectId);
    navigate(`/journal/${groupSubjectId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Шапка (без иконки) */}
        <header className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              e<span className="text-indigo-600">Journal</span>
            </h1>
            <p className="text-sm text-gray-500">Добро пожаловать, {teacherName}</p>
          </div>
          <button onClick={handleLogout} className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition shadow-sm hover:shadow">
            Выйти
          </button>
        </header>

        {/* Основная сетка с карточками (без изменений) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition hover:shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📚</span>
              <h2 className="text-lg font-semibold text-gray-800">Мои предметы</h2>
              <span className="ml-auto bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {subjects.length}
              </span>
            </div>
            <SubjectList subjects={subjects} onSelect={handleSubjectSelect} selectedId={selectedSubjectId} />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition hover:shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">👥</span>
              <h2 className="text-lg font-semibold text-gray-800">Группы</h2>
              <span className="ml-auto bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {groups.length}
              </span>
            </div>
            {selectedSubjectId ? (
              <GroupList groups={groups} onSelect={handleGroupSelect} selectedId={selectedGroupSubjectId} />
            ) : (
              <p className="text-gray-400 text-sm text-center py-8">Выберите предмет</p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition hover:shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">⚡</span>
              <h2 className="text-lg font-semibold text-gray-800">Быстрый доступ</h2>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-1.5">
              {allJournals.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">Нет журналов</p>
              ) : (
                allJournals.map((j) => (
                  <button
                    key={j.group_subject_id}
                    onClick={() => navigate(`/journal/${j.group_subject_id}`)}
                    className="w-full text-left px-4 py-2.5 rounded-xl transition-all text-sm hover:bg-gray-50 border border-transparent hover:border-gray-200"
                  >
                    <div className="font-medium text-gray-800">{j.group_name}</div>
                    <div className="text-xs text-gray-500">{j.subject_name} · Семестр {j.semester}</div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};