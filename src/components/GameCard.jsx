import { useState } from 'react';

export default function GameCard({ game: g, onPlay, isFav, onFav, bestScore, index = 0 }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className="game-card"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? `linear-gradient(135deg,${g.color}22,rgba(10,5,32,0.95))` : 'rgba(15,12,41,0.7)',
        border: `1px solid ${hov ? g.color + '60' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 20, overflow: 'hidden',
        boxShadow: hov ? `0 16px 48px ${g.color}35` : 'none',
        animation: `pop-in 0.4s ease ${index * 0.06}s both`,
      }}
    >
      {/* thumbnail */}
      <div style={{ height:140, background:`linear-gradient(135deg,${g.color}30,#0a0520)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:64, position:'relative' }}>
        <span style={{ filter: hov ? `drop-shadow(0 0 20px ${g.color})` : 'none', transition:'all 0.35s', transform: hov ? 'scale(1.2)' : 'scale(1)' }}>
          {g.emoji}
        </span>
        <button className="fav-btn" onClick={e => { e.stopPropagation(); onFav(g.id); }} style={{ position:'absolute', top:10, right:10 }}>
          {isFav ? '❤️' : '🤍'}
        </button>
        <span style={{ position:'absolute', top:10, left:10, background:g.color, color:'#fff', fontSize:9, fontWeight:800, padding:'3px 8px', borderRadius:99, fontFamily:"'Exo 2',sans-serif" }}>
          {g.category}
        </span>
      </div>

      {/* info */}
      <div style={{ padding:16 }}>
        <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:16, color: hov ? g.color : '#fff', transition:'color 0.3s', marginBottom:4 }}>
          {g.title}
        </div>
        <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:12, color:'#64748B', marginBottom:12, lineHeight:1.4 }}>
          {g.desc.slice(0, 58)}…
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <span style={{ fontSize:11, color:'#F59E0B', fontFamily:"'Exo 2',sans-serif", fontWeight:700 }}>⭐ {g.rating}</span>
            {bestScore > 0 && <span style={{ fontSize:10, color:g.color, fontFamily:"'Exo 2',sans-serif" }}>🏆 {bestScore}</span>}
          </div>
          <button
            className="play-btn"
            onClick={() => onPlay(g)}
            style={{ background:`linear-gradient(135deg,${g.color},${g.color}88)`, border:'none', borderRadius:9, padding:'8px 16px', color:'#fff', fontSize:12, fontFamily:"'Fredoka One',cursive", cursor:'pointer' }}
          >
            ▶ Play
          </button>
        </div>
      </div>
    </div>
  );
}
