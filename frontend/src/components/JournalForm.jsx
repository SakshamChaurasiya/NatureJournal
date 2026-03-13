import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { journalService } from '../services/api';

const ambiences = [
  { value: 'forest', label: 'Forest 🌿' },
  { value: 'ocean', label: 'Ocean 🌊' },
  { value: 'mountain', label: 'Mountain 🏔️' }
];

export default function JournalForm({ onJournalAdded }) {
  const [text, setText] = useState('');
  const [ambience, setAmbience] = useState('forest');
  const [analysis, setAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!text) {
      setError('Please write something before analyzing.');
      return;
    }
    setError('');
    setLoadingAnalysis(true);
    try {
      const res = await journalService.analyzeJournal(text);
      setAnalysis(res);
    } catch (err) {
      setError('Failed to analyze emotion.');
      console.error(err);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const handleSave = async () => {
    if (!text) {
      setError('Journal cannot be empty.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        text,
        ambience,
        emotion: analysis?.emotion || 'Unknown',
        keywords: analysis?.keywords || [],
        summary: analysis?.summary || 'No summary available.',
      };
      const res = await journalService.createJournal(payload);
      onJournalAdded(res);
      
      // reset form
      setText('');
      setAnalysis(null);
      setAmbience('forest');
    } catch (err) {
      setError('Failed to save journal.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card flex flex-col gap-4"
    >
      <h3 className="text-xl font-semibold text-primary">New Entry</h3>
      
      {error && <div className="text-red-500 text-sm">{error}</div>}
      
      <textarea 
        className="input-field min-h-[150px] resize-y"
        placeholder="How was your nature session? What did you observe and feel?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <label className="text-sm text-gray-600 mr-2">Ambience:</label>
          <select 
            value={ambience}
            onChange={(e) => setAmbience(e.target.value)}
            className="input-field w-auto py-2"
          >
            {ambiences.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-3">
          <button 
            type="button" 
            onClick={handleAnalyze} 
            disabled={loadingAnalysis}
            className="btn-secondary bg-accent text-gray-900 border-none hover:bg-opacity-80"
          >
            {loadingAnalysis ? 'Analyzing...' : 'Analyze Emotion'}
          </button>
          <button 
            type="button" 
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
          >
            {saving ? 'Saving...' : 'Save Journal'}
          </button>
        </div>
      </div>

      {analysis && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-4 bg-gray-50 rounded-lg text-sm border-l-4 border-secondary"
        >
          <p><strong>Emotion:</strong> {analysis.emotion}</p>
          <p className="mt-1"><strong>Summary:</strong> {analysis.summary}</p>
          <p className="mt-2 text-xs text-gray-500">
            <strong>Keywords:</strong> {analysis.keywords.join(', ')}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
