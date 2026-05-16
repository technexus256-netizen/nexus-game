import GameCard from '../components/GameCard';
import { CATEGORIES } from '../data/gamesData';

export default function GamesPage({ db, category, setCategory, search, setSearch, onPlay, favorites, onFav, scores }) {
  return (
    <div style={{ maxWidth:1200, margin:'0 auto', padding:'32px 20px 60px' }}>
      <h1 style={{ fontFamily:"'Fredoka One',cursive", fontSize:32, background:'linear-gradient(135deg,#A78BFA,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:24 }}>
        🎮 All Games
      </h1>

      {/* Filters */}
      <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap' }}>
        <div style={{ flex:1, minWidth:200, position:'relative' }}>
          <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#64748B' }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search games…"
            style={{ width:'100%', background:'rgba(15,12,41,0.8)', border:'1px solid rgba(124,58,237,0.3)', borderRadius:10, padding:'10px 12px 10px 36px', color:'#fff', fontSize:14, fontFamily:"'Exo 2',sans-serif" }}
          />
        </div>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{ background: category===cat ? 'linear-gradient(135deg,#7C3AED,#EC4899)' : 'rgba(15,12,41,0.8)', border:`1px solid ${category===cat ? 'transparent' : 'rgba(124,58,237,0.25)'}`, borderRadius:10, padding:'10px 18px', color: category===cat ? '#fff' : '#94A3B8', fontSize:13, cursor:'pointer', fontFamily:"'Exo 2',sans-serif", fontWeight:700, transition:'all 0.2s' }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {db.length === 0 ? (
        <div style={{ textAlign:'center', padding:80, color:'#64748B', fontFamily:"'Exo 2',sans-serif", fontSize:18 }}>
          No games found 😔 Try another search!
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:18 }}>
          {db.map((g, i) => (
            <GameCard key={g.id} game={g} onPlay={onPlay} isFav={favorites.includes(g.id)} onFav={onFav} bestScore={scores[g.id]} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
