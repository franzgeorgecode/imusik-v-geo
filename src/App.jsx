import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  const [songs, setSongs] = useState([]);
  const [queue, setQueue] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showEndNotification, setShowEndNotification] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHomeButton, setShowHomeButton] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    fetchColombianUrbanTracks();
  }, []);

  useEffect(() => {
    if (queue.length > 0 && currentIndex < queue.length) {
      setCurrentTrack(queue[currentIndex]);
      if (isPlaying && audioRef.current) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentIndex, queue, isPlaying]);

  const fetchColombianUrbanTracks = async () => {
    setIsLoading(true);
    try {
      const colombianArtists = [
        'maluma', 'j balvin', 'karol g', 'feid', 
        'ryan castro', 'blessd'
      ];
      const randomArtist = colombianArtists[Math.floor(Math.random() * colombianArtists.length)];
      
      const response = await fetch(
        `https://deezerdevs-deezer.p.rapidapi.com/search?q=${randomArtist}`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com',
          },
        }
      );

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      if (data?.data) {
        const processedSongs = data.data
          .map(track => ({
            id: track.id,
            title: track.title,
            artist: track.artist.name,
            artistId: track.artist.id,
            cover: track.album.cover_medium,
            preview: track.preview,
            streams: Math.floor(Math.random() * 1000000)
          }))
          .slice(0, 11);
        
        setSongs(processedSongs);
      }
    } catch (error) {
      console.error('Error fetching tracks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchSongs = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(searchQuery)}`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com',
          },
        }
      );

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      if (data?.data) {
        const processedSongs = data.data
          .map(track => ({
            id: track.id,
            title: track.title,
            artist: track.artist.name,
            artistId: track.artist.id,
            cover: track.album.cover_medium,
            preview: track.preview,
            streams: Math.floor(Math.random() * 1000000)
          }))
          .slice(0, 11);
        
        setSongs(processedSongs);
        setShowHomeButton(true);
      }
    } catch (error) {
      console.error('Error searching tracks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreSongs = async () => {
    if (!searchQuery && !currentTrack) return;
    
    setIsLoading(true);
    try {
      const searchTerm = searchQuery || currentTrack.artist;
      const response = await fetch(
        `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(searchTerm)}`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com',
          },
        }
      );

      const data = await response.json();
      if (data?.data) {
        const newSongs = data.data
          .filter(track => !songs.find(s => s.id === track.id))
          .map(track => ({
            id: track.id,
            title: track.title,
            artist: track.artist.name,
            artistId: track.artist.id,
            cover: track.album.cover_medium,
            preview: track.preview,
            streams: Math.floor(Math.random() * 1000000)
          }))
          .slice(0, 11);

        setSongs(prev => [...prev, ...newSongs]);
      }
    } catch (error) {
      console.error('Error loading more songs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createQueue = async (selectedTrack) => {
    try {
      const response = await fetch(
        `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(selectedTrack.artist)}`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com',
          },
        }
      );

      const data = await response.json();
      let queueSongs = data.data
        .filter(track => track.id !== selectedTrack.id)
        .map(track => ({
          id: track.id,
          title: track.title,
          artist: track.artist.name,
          artistId: track.artist.id,
          cover: track.album.cover_medium,
          preview: track.preview
        }));

      queueSongs = [selectedTrack, ...queueSongs.slice(0, 17)];
      setQueue(queueSongs);
      setCurrentIndex(0);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error creating queue:', error);
    }
  };

  const playTrack = (track) => {
    if (!track.preview) {
      alert('Preview not available for this track');
      return;
    }
    createQueue(track);
  };

  const handleNext = () => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowEndNotification(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const goToHome = () => {
    window.location.reload();
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">imusik</div>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search your favorite song"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchSongs()}
          />
          <button
            className="search-button"
            onClick={searchSongs}
            disabled={isLoading || !searchQuery.trim()}
          >
            Search
          </button>
          {showHomeButton && (
            <button
              className="search-button"
              onClick={goToHome}
            >
              Home
            </button>
          )}
        </div>
      </header>

      <main className="main-content">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {searchQuery ? `Results for "${searchQuery}"` : 'Top Colombian Urban'}
        </motion.h2>

        <motion.div 
          className="tracks-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {songs.map((song, index) => (
            <motion.div
              key={song.id}
              className="track-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => playTrack(song)}
            >
              <div className="track-artwork">
                <img src={song.cover} alt={song.title} />
                <div className="play-overlay">
                  <span className="play-icon">
                    {currentTrack?.id === song.id && isPlaying ? '⏸' : '▶'}
                  </span>
                </div>
                <div className="streams-badge">
                  {formatNumber(song.streams)} streams
                </div>
              </div>
              <div className="track-info">
                <h3>{song.title}</h3>
                <p>{song.artist}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.button
          className="listen-more-button"
          onClick={loadMoreSongs}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Listen More'}
        </motion.button>
      </main>

      <AnimatePresence>
        {currentTrack && !isPlayerMinimized && (
          <motion.div
            className="player"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
          >
            <motion.button
              className="minimize-button"
              onClick={() => setIsPlayerMinimized(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              ✕
            </motion.button>
            
            <div className="player-content">
              <div className="now-playing">
                <img src={currentTrack.cover} alt={currentTrack.title} />
                <div className="track-details">
                  <h4>{currentTrack.title}</h4>
                  <p>{currentTrack.artist}</p>
                </div>
              </div>

              <div className="player-controls">
                <motion.button
                  onClick={handlePrevious}
                  className="control-button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ⏮
                </motion.button>
                <motion.button
                  onClick={togglePlay}
                  className="play-button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isPlaying ? '⏸' : '▶'}
                </motion.button>
                <motion.button
                  onClick={handleNext}
                  className="control-button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ⏭
                </motion.button>
              </div>

              <div className="queue-info">
                <span>{currentIndex + 1} / {queue.length}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPlayerMinimized && (
          <motion.div
            className="minimized-player"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            onClick={() => setIsPlayerMinimized(false)}
          >
            <div className="minimized-content">
              <div className="minimized-info">
                <span>Now Playing</span>
                <p>{currentTrack?.title}</p>
              </div>
              <button className="restore-button">
                ↑
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEndNotification && (
          <motion.div
            className="notification-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEndNotification(false)}
          >
            <motion.div
              className="notification-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button 
                className="notification-close"
                onClick={() => setShowEndNotification(false)}
              >
                ✕
              </button>
              <h3>Playlist Ended</h3>
              <p>Select another song to continue your session</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio
        ref={audioRef}
        src={currentTrack?.preview}
        onEnded={handleNext}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        autoPlay
      />
    </div>
  );
}

export default App;
