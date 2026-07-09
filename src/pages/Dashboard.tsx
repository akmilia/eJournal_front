// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Subject, JournalListItem, Group, Student } from '../types';
import { Spinner } from '../components/Spinner';
import { CreateSubjectModal } from '../components/CreateSubjectModal';
import { CreateJournalModal } from '../components/CreateJournalModal';
import { CreateGroupModal } from '../components/CreateGroupModal';
import { GroupStudentsModal } from '../components/GroupStudentsModal';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSubjectId, setExpandedSubjectId] = useState<number | null>(null);
  const [journalsMap, setJournalsMap] = useState<Record<number, JournalListItem[]>>({});
  
  // Модалки
  const [showCreateSubject, setShowCreateSubject] = useState(false);
  const [showCreateJournal, setShowCreateJournal] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showGroupStudents, setShowGroupStudents] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedSubjectForJournal, setSelectedSubjectForJournal] = useState<{ id: number; name: string } | null>(null);
  const [teacherName, setTeacherName] = useState('Преподаватель');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subRes, groupsRes] = await Promise.all([
        api.get('/journals/subjects'),
        api.get('/journals/groups/all'),
      ]);
      setSubjects(subRes.data);
      setGroups(groupsRes.data);
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
    fetchData();
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

  const toggleSubjectExpand = (subjectId: number) => {
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
      await fetchData();
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
      await fetchData();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Ошибка создания журнала');
    }
  };

  const openCreateJournal = (subjectId: number, subjectName: string) => {
    setSelectedSubjectForJournal({ id: subjectId, name: subjectName });
    setShowCreateJournal(true);
  };

  const openGroupStudents = (group: Group) => {
    setSelectedGroup(group);
    setShowGroupStudents(true);
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-background">
      <header className="dashboard-header">
        <div className="logo">
          <h1>eJournal</h1>
          <p>Добро пожаловать, {teacherName}</p>
        </div>
        <button onClick={handleLogout} className="btn-danger">
          Выйти
        </button>
      </header>

      <div className="dashboard-content">
        {/* ГРУППЫ */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary">👥 Группы</h2>
            <button onClick={() => setShowCreateGroup(true)} className="btn-primary">
              <span className="text-xl leading-none">+</span> Создать группу
            </button>
          </div>

          {groups.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <p className="text-secondary text-lg">Нет групп. Создайте первую!</p>
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.id} className="subject-card">
                <div className="subject-header">
                  <div>
                    <h2>{group.name}</h2>
                    <p className="credits">Курс {group.course} · {group.students?.length || 0} студентов</p>
                  </div>
                  <button
                    onClick={() => openGroupStudents(group)}
                    className="expand-btn"
                  >
                    Просмотр →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ПРЕДМЕТЫ */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary">📚 Мои предметы</h2>
            <button onClick={() => setShowCreateSubject(true)} className="btn-primary">
              <span className="text-xl leading-none">+</span> Создать предмет
            </button>
          </div>

          {subjects.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <p className="text-secondary text-lg">У вас пока нет предметов. Создайте первый!</p>
            </div>
          ) : (
            subjects.map((subject) => (
              <div key={subject.id} className="subject-card">
                <div className="subject-header">
                  <div>
                    <h2>{subject.name}</h2>
                    <p className="credits">{subject.credits} зач. ед.</p>
                  </div>
                  <button
                    onClick={() => toggleSubjectExpand(subject.id)}
                    className="expand-btn"
                  >
                    {expandedSubjectId === subject.id ? 'Свернуть ▲' : 'Развернуть ▼'}
                  </button>
                </div>

                {expandedSubjectId === subject.id && (
                  <div className="journals-section">
                    <div className="journals-header">
                      <h3>Журналы по предмету</h3>
                      <button
                        onClick={() => openCreateJournal(subject.id, subject.name)}
                        className="add-btn"
                      >
                        <span className="text-xl leading-none">+</span> Добавить журнал
                      </button>
                    </div>

                    {journalsMap[subject.id]?.length ? (
                      journalsMap[subject.id].map((j) => (
                        <div
                          key={j.group_subject_id}
                          className="journal-item"
                          onClick={() => {
                            navigate(`/journal/${j.group_subject_id}/${encodeURIComponent(j.group_name)}/${encodeURIComponent(subject.name)}`);
                          }}
                        >
                          <span className="journal-name">{j.group_name}</span>
                          <span className="journal-semester">Семестр {j.semester}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-base text-secondary">Нет журналов. Добавьте первый.</p>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Модалки */}
      <CreateGroupModal
        isOpen={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        onCreate={fetchData}
      />
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
      <GroupStudentsModal
        isOpen={showGroupStudents}
        onClose={() => setShowGroupStudents(false)}
        groupId={selectedGroup?.id || 0}
        groupName={selectedGroup?.name || ''}
        students={selectedGroup?.students || []}
        onGroupDeleted={fetchData}
      />
    </div>
  );
};