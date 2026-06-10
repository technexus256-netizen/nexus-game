import { useState, useEffect }       from 'react';
import { GAMES_DB, getSimilarGames } from './data/gamesData';
import { useGameState }              from './hooks/useGameState';
import { GAME_COMPONENTS }           from './games/index';
import { watchAuth, logout, getRecentReviews } from './firebase';

import Navbar           from './components/Navbar';
import Footer           from './components/Footer';
import GoogleLoginModal from './components/GoogleLoginModal';

import HomePage         from './pages/HomePage';
import LandingPage      from './pages/LandingPage';
import AboutPage        from './pages/AboutPage';
import HowToPlayPage    from './pages/HowToPlayPage';
import NewsPage         from './pages/NewsPage';
import GamesPage        from './pages/GamesPage';
import FavoritesPage    from './pages/FavoritesPage';
import PlayPage         from './pages/PlayPage';
import ContactPage      from './pages/ContactPage';
import PrivacyPage      from './pages/PrivacyPage';
import TermsPage        from './pages/TermsPage';
import ParentGuidePage  from './pages/ParentGuidePage';
import ReportBugPage    from './pages/ReportBugPage';

export default function App() {
  const [loginOpen,   setLoginOpen]   = useState(false);
  const [user,        setUser]        = useState(null);
  const [pendingGame, setPendingGame] = useState(null);
  const [homeReviews, setHomeReviews] = useState([]);

  const {
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
  } = useGameState();

  // Restore the signed-in user across reloads.
  useEffect(() => watchAuth(setUser), []);

  // Load the latest reviews for the home page.
  const loadHomeReviews = () =>
    getRecentReviews(5).then(setHomeReviews).catch(() => setHomeReviews([]));
  useEffect(() => { loadHomeReviews(); }, []);

  // Scroll to top on every page change
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [page]);

  // Require sign-in before playing. Remember the game so we can open it
  // automatically once the user finishes logging in.
  const handlePlay = (game) => {
    if (!user) {
      setPendingGame(game);
      setLoginOpen(true);
      return;
    }
    openGame(game);
  };

  const handleLogin = (u) => {
    setUser(u);
    if (pendingGame) {
      openGame(pendingGame);
      setPendingGame(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  const filtered = GAMES_DB.filter(g => {
    const matchSearch   = g.title.toLowerCase().includes(search.toLowerCase()) ||
                          g.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || g.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div style={{ fontFamily:"'Exo 2',sans-serif", background:'#040814', color:'#fff', minHeight:'100vh' }}>

      {/* ── Sticky Navigation ── */}
      <Navbar
        page={page}
        setPage={setPage}
        search={search}
        setSearch={setSearch}
        user={user}
        games={GAMES_DB}
        onPlay={handlePlay}
        onLoginOpen={() => setLoginOpen(true)}
        onLogout={handleLogout}
      />

      {/* ── Google Login Modal ── */}
      <GoogleLoginModal
        open={loginOpen}
        gameTitle={pendingGame?.title}
        onClose={() => { setLoginOpen(false); setPendingGame(null); }}
        onLogin={handleLogin}
      />

      {/* ── Page Router ── */}
      <main style={{ paddingTop: 62 }}>

        {page === 'home' && (
          <HomePage
            db={filtered}
            allDb={GAMES_DB}
            search={search}
            category={category}
            setCategory={setCategory}
            onPlay={handlePlay}
            setPage={setPage}
            favorites={favorites}
            onFav={toggleFavorite}
            recentPlayed={recentPlayed}
            scores={scores}
            reviews={homeReviews}
          />
        )}

        {page === 'landing' && (
          <LandingPage
            allDb={GAMES_DB}
            onPlay={handlePlay}
            setPage={setPage}
          />
        )}

        {page === 'about' && (
          <AboutPage allDb={GAMES_DB} onPlay={handlePlay} setPage={setPage} />
        )}

        {page === 'how-to-play' && (
          <HowToPlayPage allDb={GAMES_DB} onPlay={handlePlay} setPage={setPage} />
        )}

        {page === 'news' && (
          <NewsPage allDb={GAMES_DB} onPlay={handlePlay} setPage={setPage} />
        )}

        {page === 'games' && (
          <GamesPage
            db={filtered}
            category={category}
            setCategory={setCategory}
            search={search}
            setSearch={setSearch}
            onPlay={handlePlay}
            favorites={favorites}
            onFav={toggleFavorite}
            scores={scores}
          />
        )}

        {page === 'favorites' && (
          <FavoritesPage
            db={GAMES_DB.filter(g => favorites.includes(g.id))}
            onPlay={handlePlay}
            onFav={toggleFavorite}
            favorites={favorites}
          />
        )}

        {page === 'play' && activeGame && (
          <PlayPage
            game={activeGame}
            GameComp={GAME_COMPONENTS[activeGame.id]}
            onBack={() => setPage('home')}
            onScore={s => updateScore(activeGame.id, s)}
            similar={getSimilarGames(activeGame)}
            onPlay={openGame}
            fullscreen={fullscreen}
            setFullscreen={setFullscreen}
            favorites={favorites}
            onFav={toggleFavorite}
            bestScore={scores[activeGame.id] || 0}
            user={user}
            onReviewAdded={loadHomeReviews}
          />
        )}

        {page === 'contact'      && <ContactPage />}
        {page === 'privacy'      && <PrivacyPage />}
        {page === 'terms'        && <TermsPage />}
        {page === 'parent-guide' && <ParentGuidePage />}
        {page === 'report-bug'   && <ReportBugPage />}

      </main>

      {/* ── Footer ── */}
      <Footer onNav={setPage} />

    </div>
  );
}
