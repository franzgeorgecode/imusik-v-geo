import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EndOfPlaylistNotification } from './EndOfPlaylistNotification';

export const Player = ({
  currentTrack,
  isPlaying,
  isMinimized,
  onMinimize,
  onTogglePlay,
  onPrevious,
  onNext,
  currentIndex,
  queueLength,
  showEndNotification,
  onDismissNotification
}) => {
  return (
    <>
      <AnimatePresence>
        {!isMinimized && currentTrack && (
          <motion.div
            className="player"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
          >
            <motion.button
              className="minimize-button"
              onClick={onMinimize}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              ✕
            </motion.button>

            <div className="player-content">
              <div className="now-playing">
                <motion.img
                  src={currentTrack.cover}
                  alt={currentTrack.title}
                  whileHover={{ scale: 1.05 }}
                />
                <div className="track-details">
                  <h4>{currentTrack.title}</h4>
                  <p>{currentTrack.artist}</p>
                </div>
              </div>

              <div className="player-controls">
                <motion.button
                  className="control-button"
                  onClick={onPrevious}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ⏮
                </motion.button>
                <motion.button
                  className="play-button"
                  onClick={onTogglePlay}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isPlaying ? '⏸' : '▶'}
                </motion.button>
                <motion.button
                  className="control-button"
                  onClick={onNext}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ⏭
                </motion.button>
              </div>

              <div className="queue-info">
                <span>{currentIndex + 1} / {queueLength}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEndNotification && (
          <EndOfPlaylistNotification onDismiss={onDismissNotification} />
        )}
      </AnimatePresence>
    </>
  );
};
