// src/pages/JournalPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { JournalData } from '../types';
import { JournalTable } from '../components/JournalTable';
import { Spinner } from '../components/Spinner';

export const JournalPage = () => {
  const { groupSubjectId } = useParams<{ groupSubjectId: string }>();
  const navigate = useNavigate();
  const [journalData, setJournalData] = useState<JournalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJournal = async () => {
      if (!groupSubjectId) {
        setError('Неверный идентификатор журнала');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await api.get(`/journals/${groupSubjectId}`);
        setJournalData(res.data);
        setError('');
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.detail || 'Ошибка загрузки журнала');
      } finally {
        setLoading(false);
      }
    };

    fetchJournal();
  }, [groupSubjectId]);

  const handleUpdate = async () => {
    if (!groupSubjectId) return;
    try {
      const res = await api.get(`/journals/${groupSubjectId}`);
      setJournalData(res.data);
    } catch (err) {
      console.error('Ошибка обновления журнала', err);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="p-8 text-red-600 text-center text-xl">Ошибка: {error}</div>;
  if (!journalData) return <div className="p-8 text-center text-xl">Журнал не найден</div>;

  return (
    <div className="journal-page">
      <div className="journal-nav">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад
        </button>
        <h1 className="page-title">📊 Журнал</h1>
        <div style={{ width: '100px' }}></div>
      </div>

      <div className="journal-card">
        <JournalTable
          journalData={journalData}
          groupSubjectId={journalData.group_subject_id}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
};