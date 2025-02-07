import React from 'react';
import { motion } from 'framer-motion';

export const ListenMoreButton = ({ onClick, isLoading }) => {
  return (
    <motion.button
      className="listen-more-button"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="loading-dots">Loading</span>
      ) : (
        'Listen More'
      )}
    </motion.button>
  );
};
