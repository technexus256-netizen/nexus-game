import GameCard from '../components/GameCard';

export default function FavoritesPage({ db, onPlay, onFav, favorites }) {
  return (
    <div style={{ maxWidth:1200, margin:'0 auto', padding:'32px 20px 60px' }}>
      <h1 style={{ fontFamily:"'Fredoka One',cursive", fontSize:32, color:'#EC4899', marginBottom:24 }}>
        ❤️ My Favorites
      </h1>
      {db.length === 0 ? (
        <div style={{ textAlign:'center', padding:80, color:'#64748B', fontFamily:"'Exo 2',sans-serif" }}>
          <div style={{ fontSize:64, marginBottom:16 }}>🤍</div>
          <p style={{ fontSize:18 }}>No favorites yet! Hit the heart on any game card to save it here.</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:18 }}>
          {db.map((g, i) => (
            <GameCard key={g.id} game={g} onPlay={onPlay} isFav={true} onFav={onFav} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
