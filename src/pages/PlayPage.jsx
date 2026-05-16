import { useState, useEffect, useRef } from 'react';
import { HOW_TO_PLAY } from '../data/gamesData';

export default function PlayPage({ game: g, GameComp, onBack, onScore, similar, onPlay, fullscreen, setFullscreen, favorites, onFav, bestScore }) {
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

  return (
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'24px 20px 60px' }}>

      {/* Breadcrumb */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20, fontFamily:"'Exo 2',sans-serif", fontSize:13, color:'#64748B' }}>
        <span onClick={onBack} style={{ cursor:'pointer', color:'#A78BFA' }}>🏠 Home</span>
        <span>›</span>
        <span style={{ color:'#fff' }}>{g.title}</span>
      </div>

      {/* Two-column layout */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr minmax(0,360px)', gap:24, alignItems:'start' }}>

        {/* ── Left: game canvas ─────────────────── */}
        <div>
          <div ref={fsRef} style={{ background:'rgba(10,5,32,0.95)', border:`1px solid ${g.color}40`, borderRadius:24, overflow:'hidden', boxShadow:`0 0 60px ${g.color}20` }}>

            {/* Game header bar */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', background:`linear-gradient(90deg,${g.color}20,transparent)`, borderBottom:`1px solid ${g.color}25` }}>
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
            <div style={{ padding:20, display:'flex', justifyContent:'center', background:'#040814', minHeight:420 }}>
              {GameComp && <GameComp onScore={handleScore} />}
            </div>
          </div>

          {/* About panel */}
          <div style={{ marginTop:16, background:'rgba(15,12,41,0.7)', border:'1px solid rgba(124,58,237,0.15)', borderRadius:16, padding:20 }}>
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
        </div>

        {/* ── Right: sidebar ────────────────────── */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* How to play */}
          <div style={{ background:'rgba(15,12,41,0.8)', border:`1px solid ${g.color}30`, borderRadius:20, padding:20 }}>
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
