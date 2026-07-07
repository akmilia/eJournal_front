import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Subject, JournalListItem } from '../types';
import { Spinner } from '../components/Spinner';
import { CreateSubjectModal } from '../components/CreateSubjectModal';
import { CreateJournalModal } from '../components/CreateJournalModal';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSubjectId, setExpandedSubjectId] = useState<number | null>(null);
  const [journalsMap, setJournalsMap] = useState<Record<number, JournalListItem[]>>({});
  const [showCreateSubject, setShowCreateSubject] = useState(false);
  const [showCreateJournal, setShowCreateJournal] = useState(false);
  const [selectedSubjectForJournal, setSelectedSubjectForJournal] = useState<{ id: number; name: string } | null>(null);
  const [teacherName, setTeacherName] = useState('Преподаватель');

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/journals/subjects');
      setSubjects(res.data);
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

  useEffect(() => {
    fetchSubjects();
  }, [navigate]);

  const fetchJournalsForSubject = async (subjectId: number) => {
    try {
      const res = await api.get(`/journals/subjects/${subjectId}/groups`);
      const journals = res.data.map((g: any) => ({
        group_subject_id: g.group_subject_id,
        group_name: g.group_name,
        subject_name: subjects.find(s => s.id === subjectId)?.name || '',
        semester: g.semester,
      }));
      setJournalsMap(prev => ({ ...prev, [subjectId]: journals }));
    } catch (error) {
      console.error('Ошибка загрузки журналов', error);
    }
  };

  const toggleExpand = (subjectId: number) => {
    if (expandedSubjectId === subjectId) {
      setExpandedSubjectId(null);
    } else {
      setExpandedSubjectId(subjectId);
      if (!journalsMap[subjectId]) {
        fetchJournalsForSubject(subjectId);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const handleCreateSubject = async (name: string, credits: number) => {
    try {
      await api.post('/journals/subjects', { name, credits });
      await fetchSubjects();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Ошибка создания предмета');
    }
  };

  const handleCreateJournal = async (subjectId: number, groupId: number, semester: number) => {
    try {
      await api.post('/journals/journals', {
        subject_id: subjectId,
        group_id: groupId,
        semester,
      });
      if (expandedSubjectId) {
        await fetchJournalsForSubject(expandedSubjectId);
      }
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Ошибка создания журнала');
    }
  };

  const openCreateJournal = (subjectId: number, subjectName: string) => {
    setSelectedSubjectForJournal({ id: subjectId, name: subjectName });
    setShowCreateJournal(true);
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-background">
      {/* Шапка на всю ширину с отступами */}
      <header className="bg-white border-b border-gray-200 py-6 px-10 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-primary">eJournal</h1>
          <p className="text-lg text-secondary mt-1">Добро пожаловать, {teacherName}</p>
        </div>
        <button onClick={handleLogout} className="btn-danger text-lg px-8 py-3">
          Выйти
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-10 py-10">
        <div className="flex justify-end mb-8">
          <button onClick={() => setShowCreateSubject(true)} className="btn-primary flex items-center gap-2 text-lg px-8 py-3.5">
            <span className="text-2xl leading-none">+</span> Создать предмет
          </button>
        </div>

        <div className="space-y-5">
          {subjects.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <p className="text-secondary text-xl">У вас пока нет предметов. Создайте первый!</p>
            </div>
          ) : (
            subjects.map((subject) => (
              <div key={subject.id} className="subject-card">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-primary">{subject.name}</h2>
                    <p className="text-lg text-secondary mt-1">{subject.credits} зач. ед.</p>
                  </div>
                  <button
                    onClick={() => toggleExpand(subject.id)}
                    className="text-primary hover:text-[#1d4f38] font-medium text-lg flex items-center gap-2"
                  >
                    {expandedSubjectId === subject.id ? 'Свернуть ▲' : 'Развернуть ▼'}
                  </button>
                </div>

                {expandedSubjectId === subject.id && (
                  <div className="mt-5 pt-5 border-t border-gray-200 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-secondary">Журналы по предмету</h3>
                      <button
                        onClick={() => openCreateJournal(subject.id, subject.name)}
                        className="text-lg text-primary hover:text-[#1d4f38] font-medium flex items-center gap-1"
                      >
                        + Добавить журнал
                      </button>
                    </div>
                    {journalsMap[subject.id]?.length ? (
                      <div className="space-y-3">
                        {journalsMap[subject.id].map((j) => (
                          <div
                            key={j.group_subject_id}
                            onClick={() => navigate(`/journal/${j.group_subject_id}`)}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition"
                          >
                            <span className="font-medium text-primary text-lg">{j.group_name}</span>
                            <span className="text-lg text-secondary">Семестр {j.semester}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-lg text-secondary">Нет журналов. Добавьте первый.</p>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <CreateSubjectModal
        isOpen={showCreateSubject}
        onClose={() => setShowCreateSubject(false)}
        onCreate={handleCreateSubject}
      />
      <CreateJournalModal
        isOpen={showCreateJournal}
        onClose={() => setShowCreateJournal(false)}
        subjectId={selectedSubjectForJournal?.id || 0}
        subjectName={selectedSubjectForJournal?.name || ''}
        onCreate={handleCreateJournal}
      />
    </div>
  );
};