import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResultsPanel({ results, onClearResults }) {
  const [sortOrder, setSortOrder] = useState('desc');

  const sortedResults = [...results].sort((a, b) => {
    if (sortOrder === 'desc') {
      return b.timestamp - a.timestamp;
    }
    return a.timestamp - b.timestamp;
  });

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <motion.section 
      className="panel results-panel"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="panel-header">
        <h3>📊 Results</h3>
        <span className="count-badge">{results.length}</span>
      </div>

      <div className="panel-controls">
        <motion.button
          className="btn-small"
          onClick={handleSort}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Sort results"
        >
          🔄 {sortOrder === 'asc' ? '↑' : '↓'}
        </motion.button>
        {results.length > 0 && (
          <motion.button
            className="btn-small danger"
            onClick={onClearResults}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Clear all results"
          >
            🧹 Clear
          </motion.button>
        )}
      </div>

      {/* Results List */}
      <div className="results-list">
        <AnimatePresence>
          {sortedResults.map((result, index) => (
            <motion.div
              key={result.id}
              className="result-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              layout
            >
              <div className="result-rank">#{results.length - index}</div>
              <div className="result-info">
                <span className="result-text">{result.name}</span>
                <span className="result-time">
                  {result.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {results.length === 0 && (
        <div className="empty-state">
          <p>No results yet. Spin the wheel!</p>
        </div>
      )}
    </motion.section>
  );
}
