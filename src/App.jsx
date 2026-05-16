import { useState, useEffect }       from 'react';
import { GAMES_DB, getSimilarGames } from './data/gamesData';
import { useGameState }              from './hooks/useGameState';
import { GAME_COMPONENTS }           from './games/index';

import Navbar           from './components/Navbar';
import Footer           from './components/Footer';
import GoogleLoginModal from './components/GoogleLoginModal';

import HomePage         from './pages/HomePage';
import GamesPage        from './pages/GamesPage';
import FavoritesPage    from './pages/FavoritesPage';
import LeaderboardPage  from './pages/LeaderboardPage';
import PlayPage         from './pages/PlayPage';
import ContactPage      from './pages/ContactPage';
import PrivacyPage      from './pages/PrivacyPage';
import TermsPage        from './pages/TermsPage';
import ParentGuidePage  from './pages/ParentGuidePage';
import ReportBugPage    from './pages/ReportBugPage';

export default function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [user,      setUser]      = useState(null);

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

  // Scroll to top on every page change
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [page]);

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
        onLoginOpen={() => setLoginOpen(true)}
        onLogout={() => setUser(null)}
      />

      {/* ── Google Login Modal ── */}
      <GoogleLoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={setUser}
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
            onPlay={openGame}
            setPage={setPage}
            favorites={favorites}
            onFav={toggleFavorite}
            recentPlayed={recentPlayed}
            scores={scores}
          />
        )}

        {page === 'games' && (
          <GamesPage
            db={filtered}
            category={category}
            setCategory={setCategory}
            search={search}
            setSearch={setSearch}
            onPlay={openGame}
            favorites={favorites}
            onFav={toggleFavorite}
            scores={scores}
          />
        )}

        {page === 'favorites' && (
          <FavoritesPage
            db={GAMES_DB.filter(g => favorites.includes(g.id))}
            onPlay={openGame}
            onFav={toggleFavorite}
            favorites={favorites}
          />
        )}

        {page === 'leaderboard' && (
          <LeaderboardPage scores={scores} />
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
