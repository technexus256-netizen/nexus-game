import { useState } from 'react';

export function useGameState() {
  const [page, setPage]               = useState('home');
  const [activeGame, setActiveGame]   = useState(null);
  const [search, setSearch]           = useState('');
  const [category, setCategory]       = useState('All');
  const [favorites, setFavorites]     = useState([]);
  const [recentPlayed, setRecentPlayed] = useState([]);
  const [scores, setScores]           = useState({});
  const [fullscreen, setFullscreen]   = useState(false);

  const openGame = (game) => {
    setActiveGame(game);
    setPage('play');
    setFullscreen(false);
    setRecentPlayed((prev) =>
      [game, ...prev.filter((g) => g.id !== game.id)].slice(0, 6)
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (id) =>
    setFavorites((f) =>
      f.includes(id) ? f.filter((x) => x !== id) : [...f, id]
    );

  const updateScore = (gameId, s) =>
    setScores((prev) => ({
      ...prev,
      [gameId]: Math.max(prev[gameId] || 0, s),
    }));

  return {
    page, setPage,
    activeGame,
    search, setSearch,
    category, setCategory,
    favorites,
    recentPlayed,
    scores,
    fullscreen, setFullscreen,
    openGame,
    toggleFavorite,
    updateScore,
  };
}
