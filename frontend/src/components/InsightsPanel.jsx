import React from 'react';
import { motion } from 'framer-motion';
import { FaBook, FaSmile, FaTree, FaHashtag } from 'react-icons/fa';

export default function InsightsPanel({ insights, loading }) {
  if (loading) {
    return <div className="text-gray-500 py-4 text-center">Loading insights...</div>;
  }

  if (!insights || insights.totalEntries === 0) {
    return (
      <div className="card text-center py-6 text-gray-500">
        Record an entry to generate insights!
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Journals',
      value: insights.totalEntries,
      icon: <FaBook className="text-secondary text-2xl" />,
    },
    {
      label: 'Top Emotion',
      value: insights.topEmotion || '-',
      icon: <FaSmile className="text-secondary text-2xl" />,
    },
    {
      label: 'Most Used Ambience',
      value: insights.mostUsedAmbience || '-',
      icon: <FaTree className="text-secondary text-2xl" />,
    },
    {
      label: 'Top Keywords',
      value: (insights.recentKeywords || []).slice(0, 3).join(', ') || '-',
      icon: <FaHashtag className="text-secondary text-2xl" />,
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {statCards.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className="card flex items-center gap-4 hover:shadow-md transition-shadow"
        >
          <div className="p-3 bg-gray-50 rounded-lg">
            {stat.icon}
          </div>
          <div>
            <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
            <div className="text-lg font-bold text-gray-800 capitalize">{stat.value}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
