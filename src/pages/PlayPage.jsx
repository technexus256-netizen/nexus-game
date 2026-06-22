import { useState, useEffect, useRef } from 'react';
import { HOW_TO_PLAY } from '../data/gamesData';
import { getReviewsForGame, addReview } from '../firebase';

/* ── Star display ───────────────────────────────────────────────────── */
function Stars({ n, size = 14 }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= n ? '#F59E0B' : '#334155', fontSize: size }}>★</span>
      ))}
    </span>
  );
}

/* ── Reviews panel (per game, stored in Firebase) ───────────────────── */
function ReviewsPanel({ game: g, user, onReviewAdded }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stars,   setStars]   = useState(5);
  const [text,    setText]    = useState('');
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

  const load = () => {
    setLoading(true);
    getReviewsForGame(g.id)
      .then(setReviews)
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [g.id]);

  const submit = async () => {
    if (!text.trim()) { setError('Please write a few words.'); return; }
    setSaving(true);
    setError('');
    try {
      await addReview({
        gameId:    g.id,
        gameTitle: g.title,
        userName:  user?.displayName || 'Player',
        userPhoto: user?.photoURL || '',
        stars,
        text,
      });
      setText('');
      setStars(5);
      load();
      onReviewAdded && onReviewAdded();
    } catch {
      setError('Could not save your review. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + (r.stars || 0), 0) / reviews.length).toFixed(1)
    : g.rating;

  return (
    <div style={{ marginTop:16, background:'rgba(15,12,41,0.7)', border:'1px solid rgba(124,58,237,0.15)', borderRadius:16, padding:20 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14, flexWrap:'wrap', gap:8 }}>
        <h3 style={{ fontFamily:"'Fredoka One',cursive", fontSize:16, color:'#A78BFA', margin:0 }}>
          ⭐ Player Reviews <span style={{ color:'#64748B', fontSize:13 }}>({reviews.length})</span>
        </h3>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontFamily:"'Fredoka One',cursive", fontSize:20, color:'#F59E0B' }}>{avg}</span>
          <Stars n={Math.round(avg)} />
        </div>
      </div>

      {/* Write a review */}
      <div style={{ background:'rgba(124,58,237,0.06)', border:'1px solid rgba(124,58,237,0.18)', borderRadius:12, padding:16, marginBottom:18 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
          <span style={{ fontFamily:"'Exo 2',sans-serif", fontSize:13, fontWeight:700, color:'#CBD5E1' }}>Your rating:</span>
          <span style={{ cursor:'pointer' }}>
            {[1,2,3,4,5].map(i => (
              <span key={i} onClick={() => setStars(i)}
                style={{ color: i <= stars ? '#F59E0B' : '#334155', fontSize:22, transition:'color 0.15s' }}>★</span>
            ))}
          </span>
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={`Share your thoughts on ${g.title}…`}
          rows={3}
          style={{ width:'100%', resize:'vertical', background:'rgba(4,8,20,0.7)', border:'1px solid rgba(124,58,237,0.25)', borderRadius:10, padding:'10px 12px', color:'#fff', fontSize:13, fontFamily:"'Exo 2',sans-serif", boxSizing:'border-box' }}
        />
        {error && <p style={{ color:'#F87171', fontSize:12, fontFamily:"'Exo 2',sans-serif", margin:'8px 0 0' }}>⚠️ {error}</p>}
        <button
          onClick={submit}
          disabled={saving}
          style={{ marginTop:10, background:'linear-gradient(135deg,#7C3AED,#EC4899)', border:'none', borderRadius:10, padding:'9px 22px', color:'#fff', fontFamily:"'Fredoka One',cursive", fontSize:14, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}
        >
          {saving ? 'Posting…' : '✏️ Post Review'}
        </button>
      </div>

      {/* Existing reviews */}
      {loading ? (
        <p style={{ fontFamily:"'Exo 2',sans-serif", fontSize:13, color:'#64748B' }}>Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p style={{ fontFamily:"'Exo 2',sans-serif", fontSize:13, color:'#64748B' }}>No reviews yet — be the first to review {g.title}!</p>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {reviews.map(r => (
            <div key={r.id} style={{ background:'rgba(4,8,20,0.5)', border:'1px solid rgba(124,58,237,0.12)', borderRadius:12, padding:14 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(236,72,153,0.3))', border:'2px solid rgba(124,58,237,0.4)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0 }}>
                  {r.userPhoto
                    ? <img src={r.userPhoto} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    : <span style={{ fontSize:16 }}>🎮</span>}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Exo 2',sans-serif", fontWeight:700, fontSize:13, color:'#E2E8F0' }}>{r.userName}</div>
                  <Stars n={r.stars} size={12} />
                </div>
              </div>
              <p style={{ fontFamily:"'Exo 2',sans-serif", fontSize:13, color:'#94A3B8', lineHeight:1.6, margin:0 }}>{r.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PlayPage({ game: g, GameComp, onBack, onScore, similar, onPlay, fullscreen, setFullscreen, favorites, onFav, bestScore, user, onReviewAdded }) {
  const [liveScore, setLiveScore] = useState(0);
  const fsRef = useRef(null);

  const handleScore = s => { setLiveScore(s); onScore(s); };

  const toggleFS = () => {
    if (!fullscreen) { fsRef.current?.requestFullscreen?.(); setFullscreen(true); }
    else             { document.exitFullscreen?.();          setFullscreen(false); }
  };

  useEffect(() => {
    const h = () => setFullscreen(false);
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, [setFullscreen]);

  const fullPage = !!g.fullPage;

  return (
    <div style={{ maxWidth: fullPage ? 1600 : 1100, margin:'0 auto', padding:'24px 20px 60px' }}>
      <style>{`
        .pp-grid { display:grid; grid-template-columns:1fr minmax(0,360px); gap:24px; align-items:start; }
        /* Full-page games (large boards) use the whole width, sidebar drops below */
        .pp-grid.pp-full { grid-template-columns:1fr; }
        /* Stack the game and sidebar once there isn't room for two columns */
        @media (max-width:860px){
          .pp-grid { grid-template-columns:1fr; }
        }
        @media (max-width:560px){
          .pp-canvas { padding:12px !important; min-height:340px !important; }
          .pp-gamehead { padding:12px 14px !important; }
          .pp-pad { padding:16px !important; }
        }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20, fontFamily:"'Exo 2',sans-serif", fontSize:13, color:'#64748B' }}>
        <span onClick={onBack} style={{ cursor:'pointer', color:'#A78BFA' }}>🏠 Home</span>
        <span>›</span>
        <span style={{ color:'#fff' }}>{g.title}</span>
      </div>

      {/* Two-column layout (single, full-width column for full-page games) */}
      <div className={`pp-grid${fullPage ? ' pp-full' : ''}`}>

        {/* ── Left: game canvas ─────────────────── */}
        <div>
          <div ref={fsRef} style={{ background:'rgba(10,5,32,0.95)', border:`1px solid ${g.color}40`, borderRadius:24, overflow:'hidden', boxShadow:`0 0 60px ${g.color}20` }}>

            {/* Game header bar */}
            <div className="pp-gamehead" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, flexWrap:'wrap', padding:'14px 20px', background:`linear-gradient(90deg,${g.color}20,transparent)`, borderBottom:`1px solid ${g.color}25` }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:28 }}>{g.emoji}</span>
                <div>
                  <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:18, color:'#fff' }}>{g.title}</div>
                  <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:11, color:'#64748B' }}>🕹️ {g.controls}</div>
                </div>
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                {bestScore > 0 && (
                  <span style={{ fontFamily:"'Exo 2',sans-serif", fontSize:12, color:g.color, background:`${g.color}20`, borderRadius:8, padding:'4px 10px' }}>
                    🏆 Best: {bestScore}
                  </span>
                )}
                <button className="fav-btn" onClick={() => onFav(g.id)}>
                  {favorites.includes(g.id) ? '❤️' : '🤍'}
                </button>
                <button onClick={toggleFS} style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:8, padding:'6px 12px', color:'#fff', cursor:'pointer', fontSize:13, fontFamily:"'Exo 2',sans-serif" }}>
                  {fullscreen ? '⊡ Exit' : '⊞ Full'}
                </button>
              </div>
            </div>

            {/* Canvas area */}
            <div className="pp-canvas" style={{ padding:20, display:'flex', justifyContent:'center', alignItems:'center', background:'#040814', minHeight:420, overflowX:'auto' }}>
              {GameComp && <GameComp onScore={handleScore} />}
            </div>
          </div>

          {/* About panel */}
          <div className="pp-pad" style={{ marginTop:16, background:'rgba(15,12,41,0.7)', border:'1px solid rgba(124,58,237,0.15)', borderRadius:16, padding:20 }}>
            <h3 style={{ fontFamily:"'Fredoka One',cursive", fontSize:16, color:'#A78BFA', marginBottom:8 }}>About this Game</h3>
            <p style={{ fontFamily:"'Exo 2',sans-serif", fontSize:14, color:'#94A3B8', lineHeight:1.7 }}>{g.desc}</p>
            <div style={{ display:'flex', gap:20, marginTop:14, flexWrap:'wrap' }}>
              {[['Category', g.category], ['Rating', `⭐ ${g.rating}`], ['Plays', `👥 ${g.plays}`], ['Controls', g.controls]].map(([l, v]) => (
                <div key={l} style={{ textAlign:'center' }}>
                  <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:13, fontWeight:800, color:'#E2E8F0' }}>{v}</div>
                  <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:10, color:'#64748B' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <ReviewsPanel game={g} user={user} onReviewAdded={onReviewAdded} />
        </div>

        {/* ── Right: sidebar ────────────────────── */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* How to play */}
          <div className="pp-pad" style={{ background:'rgba(15,12,41,0.8)', border:`1px solid ${g.color}30`, borderRadius:20, padding:20 }}>
            <h3 style={{ fontFamily:"'Fredoka One',cursive", fontSize:16, color:g.color, marginBottom:12 }}>🎯 How to Play</h3>
            <p style={{ fontFamily:"'Exo 2',sans-serif", fontSize:13, color:'#94A3B8', lineHeight:1.8 }}>
              {HOW_TO_PLAY[g.id]}
            </p>
          </div>

          {/* Similar games */}
          {similar.length > 0 && (
            <div style={{ background:'rgba(15,12,41,0.8)', border:'1px solid rgba(124,58,237,0.15)', borderRadius:20, padding:20 }}>
              <h3 style={{ fontFamily:"'Fredoka One',cursive", fontSize:16, color:'#A78BFA', marginBottom:14 }}>🎮 Similar Games</h3>
              {similar.map(sg => (
                <div key={sg.id} className="side-row" onClick={() => onPlay(sg)}>
                  <span style={{ fontSize:32, flexShrink:0 }}>{sg.emoji}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:13, fontWeight:700, color:'#E2E8F0' }}>{sg.title}</div>
                    <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:11, color:'#64748B' }}>⭐ {sg.rating} • {sg.category}</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); onPlay(sg); }} style={{ background:`linear-gradient(135deg,${sg.color},${sg.color}88)`, border:'none', borderRadius:8, padding:'6px 14px', color:'#fff', fontSize:11, fontFamily:"'Fredoka One',cursive", cursor:'pointer', flexShrink:0 }}>
                    Play
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* All games shortcut */}
          <div style={{ background:'rgba(15,12,41,0.6)', border:'1px solid rgba(124,58,237,0.15)', borderRadius:20, padding:20, textAlign:'center' }}>
            <div style={{ fontSize:40, marginBottom:8 }}>🕹️</div>
            <p style={{ fontFamily:"'Exo 2',sans-serif", fontSize:13, color:'#64748B', marginBottom:12 }}>Explore more games on the platform!</p>
            <button onClick={onBack} style={{ background:'linear-gradient(135deg,#7C3AED,#EC4899)', border:'none', borderRadius:12, padding:'12px 24px', color:'#fff', fontSize:14, fontFamily:"'Fredoka One',cursive", cursor:'pointer' }}>
              ← Browse All Games
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
