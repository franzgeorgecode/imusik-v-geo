const COLOMBIAN_GENRES = [
  'reggaeton',
  'salsa',
  'vallenato',
  'cumbia',
  'champeta',
  'pop latino',
  'tropical'
];

const getRandomGenres = (count = 3) => {
  const shuffled = [...COLOMBIAN_GENRES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getRecommendations = async (userPreferences) => {
  const { recentSearches, likedGenres } = userPreferences;
  const genres = [...new Set([...likedGenres, ...getRandomGenres()])];
  
  try {
    const promises = genres.map(genre =>
      fetch(
        `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(genre)}`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': import.meta.env.VITE_API_KEY,
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com',
          },
        }
      ).then(res => res.json())
    );

    const results = await Promise.all(promises);
    const recommendations = results
      .flatMap(result => result.data || [])
      .map(track => ({
        id: track.id,
        name: track.title,
        artist: track.artist.name,
        genre: track.genre_id,
        album: {
          name: track.album.title,
          images: [{ url: track.album.cover_medium }],
        },
        preview_url: track.preview,
      }));

    return recommendations
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return [];
  }
};

export const getTrendingInColombia = async () => {
  try {
    const genres = getRandomGenres(2);
    const promises = genres.map(genre =>
      fetch(
        `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(genre)}&limit=5`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': import.meta.env.VITE_API_KEY,
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com',
          },
        }
      ).then(res => res.json())
    );

    const results = await Promise.all(promises);
    const trending = results
      .flatMap(result => result.data || [])
      .map(track => ({
        id: track.id,
        name: track.title,
        artist: track.artist.name,
        genre: track.genre_id,
        album: {
          name: track.album.title,
          images: [{ url: track.album.cover_medium }],
        },
        preview_url: track.preview,
        trend_factor: Math.floor(Math.random() * 100000),
      }));

    return trending
      .sort((a, b) => b.trend_factor - a.trend_factor)
      .slice(0, 10);
  } catch (error) {
    console.error('Error getting trending songs:', error);
    return [];
  }
};
