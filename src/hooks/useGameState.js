import { useState, useEffect, useRef, useCallback } from 'react';

/* ─── URL routing ─────────────────────────────────────────────────────────
   Each page has a real path so the browser address bar reflects the current
   page and back/forward work. "landing" (the Discover advert) lives at
   /discover and is only reachable by URL or on a visitor's first visit.
   ────────────────────────────────────────────────────────────────────────── */
const PATH_TO_PAGE = {
  '/':             'home',
  '/discover':     'landing',
  '/games':        'games',
  '/favorites':    'favorites',
  '/about':        'about',
  '/how-to-play':  'how-to-play',
  '/news':         'news',
  '/play':         'play',
  '/contact':      'contact',
  '/privacy':      'privacy',
  '/terms':        'terms',
  '/parent-guide': 'parent-guide',
  '/report-bug':   'report-bug',
};
const PAGE_TO_PATH = Object.fromEntries(
  Object.entries(PATH_TO_PAGE).map(([path, page]) => [page, path])
);

const VISIT_KEY = 'nexus_visited';

const cleanPath = () => {
  const p = window.location.pathname.replace(/\/+$/, '');
  return p === '' ? '/' : p;
};

const pageFromUrl = () => PATH_TO_PAGE[cleanPath()] || 'home';

const hasVisited = () => {
  try { return localStorage.getItem(VISIT_KEY) === '1'; } catch { return false; }
};
const markVisited = () => {
  try { localStorage.setItem(VISIT_KEY, '1'); } catch { /* ignore */ }
};

/* Decide the very first page: a brand-new visitor landing on "/" is sent to
   the Discover advert; everyone else gets whatever the URL points to. */
function initialPage() {
  const fromUrl = pageFromUrl();
  if (cleanPath() === '/' && !hasVisited()) return 'landing';
  // A direct refresh on /play can't restore the game — fall back to games.
  if (fromUrl === 'play') return 'games';
  return fromUrl;
}

export function useGameState() {
  const [page, setPageState]          = useState(initialPage);
  const [activeGame, setActiveGame]   = useState(null);
  const activeGameRef                 = useRef(null);
  const [search, setSearch]           = useState('');
  const [category, setCategory]       = useState('All');
  const [favorites, setFavorites]     = useState([]);
  const [recentPlayed, setRecentPlayed] = useState([]);
  const [scores, setScores]           = useState({});
  const [fullscreen, setFullscreen]   = useState(false);

  // Keep the URL in sync with the initial page, and listen for back/forward.
  useEffect(() => {
    // If a first-time visitor was redirected to the advert, reflect it in the URL.
    if (page === 'landing' && cleanPath() === '/') {
      window.history.replaceState({ page: 'landing' }, '', '/discover');
    } else if (PATH_TO_PAGE[cleanPath()] !== page && PAGE_TO_PATH[page]) {
      // e.g. an initial /play refresh that we redirected to games
      window.history.replaceState({ page }, '', PAGE_TO_PATH[page]);
    }
    markVisited();

    const onPop = () => {
      const next = pageFromUrl();
      // Can't restore an in-progress game from a bare /play URL.
      setPageState(next === 'play' && !activeGameRef.current ? 'games' : next);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Navigate to a page and push a matching URL onto the history stack.
  const setPage = useCallback((next) => {
    setPageState(next);
    const path = PAGE_TO_PATH[next] || '/';
    if (cleanPath() !== path) {
      window.history.pushState({ page: next }, '', path);
    }
  }, []);

  const openGame = (game) => {
    setActiveGame(game);
    activeGameRef.current = game;
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
