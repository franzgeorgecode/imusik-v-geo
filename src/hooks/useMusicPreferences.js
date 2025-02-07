import { useLocalStorage } from './useLocalStorage';

export function useMusicPreferences() {
  const [recentSearches, setRecentSearches] = useLocalStorage('recentSearches', []);
  const [likedGenres, setLikedGenres] = useLocalStorage('likedGenres', []);
  const [recentlyPlayed, setRecentlyPlayed] = useLocalStorage('recentlyPlayed', []);

  const addSearch = (search) => {
    setRecentSearches(prev => {
      const newSearches = [search, ...prev.filter(s => s !== search)].slice(0, 10);
      return newSearches;
    });
  };

  const addGenre = (genre) => {
    setLikedGenres(prev => {
      if (prev.includes(genre)) return prev;
      return [...prev, genre].slice(0, 10);
    });
  };

  const addPlayedSong = (song) => {
    setRecentlyPlayed(prev => {
      const newPlayed = [song, ...prev.filter(s => s.id !== song.id)].slice(0, 20);
      return newPlayed;
    });
  };

  return {
    recentSearches,
    likedGenres,
    recentlyPlayed,
    addSearch,
    addGenre,
    addPlayedSong
  };
}
