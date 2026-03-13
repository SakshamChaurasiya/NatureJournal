import React from 'react';
import { motion } from 'framer-motion';

const emotionEmojis = {
  calm: '🙂',
  relaxed: '😌',
  happy: '😊',
  sad: '😢',
  anxious: '😟',
  neutral: '😐'
};

const ambienceEmojis = {
  forest: '🌿',
  ocean: '🌊',
  mountain: '🏔️'
};

export default function JournalList({ journals, loading }) {
  if (loading) {
    return <div className="text-gray-500 text-center py-8">Loading history...</div>;
  }

  if (!journals || journals.length === 0) {
    return (
      <div className="card text-center py-8 text-gray-500">
        No journal entries found. Start by writing one above!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-primary mb-2">Previous Entries</h3>
      {journals.map((journal, index) => (
        <motion.div
          key={journal._id || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="card border-l-4 border-primary hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm text-gray-500">
              {new Date(journal.createdAt).toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
              })}
            </div>
            <div className="flex gap-2 text-lg">
              <span title={`Ambience: ${journal.ambience}`}>
                {ambienceEmojis[journal.ambience] || '🌿'}
              </span>
              <span title={`Emotion: ${journal.emotion}`}>
                {emotionEmojis[(journal.emotion || '').toLowerCase()] || '🙂'} ({journal.emotion})
              </span>
            </div>
          </div>
          
          <p className="text-gray-800 whitespace-pre-wrap">{journal.text}</p>
          
          <div className="mt-3 bg-gray-50 p-3 rounded-md text-sm text-gray-600">
            <strong>AI Summary:</strong> {journal.summary}
          </div>
          
          <div className="mt-3 flex flex-wrap gap-2">
            {journal.keywords && journal.keywords.map((kw, i) => (
              <span key={i} className="text-xs bg-secondary text-white px-2 py-1 rounded-full">
                #{kw}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
