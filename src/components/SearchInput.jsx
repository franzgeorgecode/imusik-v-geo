import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const SearchInput = ({ onSearch, onResultClick }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeout = useRef(null);

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (query.trim()) {
      setIsLoading(true);
      searchTimeout.current = setTimeout(() => {
        onSearch(query).then(data => {
          setResults(data.slice(0, 11));
          setIsLoading(false);
        });
      }, 300);
    } else {
      setResults([]);
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [query, onSearch]);

  return (
    <div className="search-container">
      <motion.input
        type="text"
        className="search-input"
        placeholder="Search tracks..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        whileFocus={{ scale: 1.02 }}
      />
      
      <AnimatePresence>
        {(results.length > 0 || isLoading) && (
          <motion.div
            className="search-results"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {isLoading ? (
              <div className="loading" />
            ) : (
              results.map((result) => (
                <motion.div
                  key={result.id}
                  className="search-result-item"
                  onClick={() => onResultClick(result)}
                  whileHover={{ backgroundColor: 'rgba(255, 230, 0, 0.1)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <img src={result.cover} alt={result.title} />
                  <div>
                    <h4>{result.title}</h4>
                    <p>{result.artist}</p>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
