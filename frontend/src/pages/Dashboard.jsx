import React, { useEffect, useState } from 'react';
import JournalForm from '../components/JournalForm';
import JournalList from '../components/JournalList';
import InsightsPanel from '../components/InsightsPanel';
import { journalService } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [journals, setJournals] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loadingJournals, setLoadingJournals] = useState(true);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [jRes, iRes] = await Promise.all([
        journalService.getJournals(),
        journalService.getInsights()
      ]);
      setJournals(jRes.data || jRes); // Depending on exact backend nested wrapper, assuming direct array or .data array
      setInsights(iRes.data || iRes);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      }
      console.error(err);
    } finally {
      setLoadingJournals(false);
      setLoadingInsights(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleJournalAdded = (newJournal) => {
    // Re-fetch everything to ensure insights update immediately. Alternatively, could optimistically update.
    fetchData();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Form & History */}
      <div className="lg:col-span-8 flex flex-col gap-8">
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">Express Yourself</h2>
          <JournalForm onJournalAdded={handleJournalAdded} />
        </section>
        
        <section>
          <JournalList journals={journals} loading={loadingJournals} />
        </section>
      </div>

      {/* Right Column: Insights */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-primary mb-2 hidden lg:block">Insights</h2>
        <div className="sticky top-24">
          <InsightsPanel insights={insights} loading={loadingInsights} />
        </div>
      </div>
    </div>
  );
}
