import React from 'react';
import { motion } from 'framer-motion';

export const EndOfPlaylistNotification = ({ onDismiss }) => {
  return (
    <motion.div
      className="notification-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onDismiss}
    >
      <motion.div
        className="notification-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <button className="notification-close" onClick={onDismiss}>
          ✕
        </button>
        <h3>Playlist Ended</h3>
        <p>Select another song to continue your session</p>
      </motion.div>
    </motion.div>
  );
};
