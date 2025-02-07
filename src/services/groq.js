import Groq from "@groq/groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
});

export const getRecommendations = async (userPreferences) => {
  const { recentSearches, likedGenres, recentlyPlayed } = userPreferences;

  const prompt = `
    As a music recommendation expert, suggest 5 songs based on the following user preferences:
    - Recent searches: ${recentSearches.join(', ')}
    - Favorite genres: ${likedGenres.join(', ')}
    - Recently played: ${recentlyPlayed.map(song => `${song.name} by ${song.artist}`).join(', ')}
    
    Focus on Colombian and Latin American music trends.
    Return the response in the following JSON format:
    {
      "recommendations": [
        {
          "name": "Song Name",
          "artist": "Artist Name",
          "genre": "Genre",
          "reason": "Brief explanation for recommendation"
        }
      ]
    }
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a music recommendation expert with deep knowledge of Colombian and Latin American music."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 1024,
    });

    return JSON.parse(completion.choices[0]?.message?.content || '{"recommendations": []}');
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return { recommendations: [] };
  }
};

export const getTrendingInColombia = async () => {
  const prompt = `
    List 10 currently trending songs in Colombia, including both local and international hits.
    Return the response in the following JSON format:
    {
      "trending": [
        {
          "name": "Song Name",
          "artist": "Artist Name",
          "genre": "Genre",
          "trend_factor": "Brief explanation of why it's trending"
        }
      ]
    }
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a music trends analyst specializing in Colombian music charts and cultural trends."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 1024,
    });

    return JSON.parse(completion.choices[0]?.message?.content || '{"trending": []}');
  } catch (error) {
    console.error('Error getting trending songs:', error);
    return { trending: [] };
  }
};
