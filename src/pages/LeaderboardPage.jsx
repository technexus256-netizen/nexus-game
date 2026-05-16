import { GAMES_DB } from '../data/gamesData';

export default function LeaderboardPage({ scores }) {
  const entries = GAMES_DB
    .map(g => ({ ...g, best: scores[g.id] || 0 }))
    .sort((a, b) => b.best - a.best);

  const medals  = ['🥇', '🥈', '🥉'];
  const rankClr = ['#F59E0B', '#94A3B8', '#CD7F32'];

  return (
    <div style={{ maxWidth:800, margin:'0 auto', padding:'32px 20px 60px' }}>
      <h1 style={{ fontFamily:"'Fredoka One',cursive", fontSize:32, background:'linear-gradient(135deg,#F59E0B,#FF6B35)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:24 }}>
        🏆 Your High Scores
      </h1>

      <div style={{ borderRadius:20, overflow:'hidden', border:'1px solid rgba(124,58,237,0.2)' }}>
        {entries.map((g, i) => (
          <div key={g.id} style={{ display:'flex', alignItems:'center', gap:16, padding:'18px 24px', background: i%2===0 ? 'rgba(15,12,41,0.7)' : 'rgba(10,5,32,0.5)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontFamily:"'Fredoka One',cursive", fontSize:22, width:32, textAlign:'center', color: rankClr[i] || '#64748B' }}>
              {i < 3 ? medals[i] : `#${i+1}`}
            </span>
            <span style={{ fontSize:32 }}>{g.emoji}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Exo 2',sans-serif", fontWeight:800, fontSize:15, color:'#E2E8F0' }}>{g.title}</div>
              <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:12, color:'#64748B' }}>{g.category} • {g.controls}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:22, color: g.best > 0 ? g.color : '#374151' }}>
                {g.best > 0 ? g.best : '—'}
              </div>
              <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:10, color:'#64748B' }}>Best Score</div>
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontFamily:"'Exo 2',sans-serif", fontSize:13, color:'#374151', textAlign:'center', marginTop:20 }}>
        Play games to set high scores! Scores save for this session.
      </p>
    </div>
  );
}
