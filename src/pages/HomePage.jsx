import { useState, useRef } from 'react';
import GameCard from '../components/GameCard';
import { CATEGORIES } from '../data/gamesData';

const INITIAL_SHOW = 12;

/* ── Curated sections ───────────────────────────────────────────────── */
const KIDS_IDS     = ['snake','flappy','memory','whackmole','bubble','rps','reaction','breakout'];
const LEARNING_IDS = ['typing','mathblitz','hangman','colorrush','numberguess','simon'];
const STRATEGY_IDS = ['chess','connect4','minesweeper','g2048','tictactoe','blackjack'];

/* ── Static reviews ─────────────────────────────────────────────────── */
const REVIEWS = [
  { name:'Arjun M.',    avatar:'🧑‍💻', stars:5, game:'Chess',         text:"Best chess game I've played online! The AI is actually challenging. Spent my entire weekend on it." },
  { name:'Priya S.',    avatar:'👩‍🎓', stars:5, game:'Math Blitz',    text:"My kids use this every day after school. Makes learning maths actually fun. Highly recommend!" },
  { name:'Rahul K.',    avatar:'🎮', stars:5, game:'2048',            text:"2048 here is super smooth. The animations are satisfying and it runs perfectly on my phone." },
  { name:'Sneha T.',    avatar:'👧', stars:4, game:'Whack-a-Mole',   text:"My 7 year old daughter is obsessed with Whack-a-Mole. She asks to play it every single day 😂" },
  { name:'Dev P.',      avatar:'👨‍💼', stars:5, game:'Minesweeper',   text:"Perfect time-killer. Minesweeper brought back so many childhood memories. Clean and fast." },
  { name:'Ananya R.',   avatar:'🌟', stars:5, game:'Simon Says',     text:"Simon Says is deceptively hard! Great for memory training. Love the colour effects." },
  { name:'Vikram N.',   avatar:'🏆', stars:4, game:'Space Shooter',  text:"Space Shooter is fire 🔥 Love the retro vibe. Would love more enemy types though!" },
  { name:'Meera J.',    avatar:'💜', stars:5, game:'Bubble Pop',     text:"So relaxing and addictive. I open Bubble Pop whenever I need a quick break from work." },
];

/* ── Mini horizontal section ────────────────────────────────────────── */
function GameRow({ title, emoji, gradient, games, onPlay, favorites, onFav, scores, onMore, moreLabel }) {
  const ref = useRef(null);
  const scroll = dir => ref.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });

  return (
    <section style={{ padding: '0 0 8px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px 24px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>{emoji}</div>
          <div>
            <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 22, color: '#fff', lineHeight: 1.1 }}>{title}</div>
            <div style={{ fontFamily: "'Exo 2',sans-serif", fontSize: 12, color: '#64748B', marginTop: 2 }}>{games.length} games</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="row-arrow" onClick={() => scroll(-1)}>‹</button>
          <button className="row-arrow" onClick={() => scroll(1)}>›</button>
          <button className="row-more" onClick={onMore}>{moreLabel || 'See All'} →</button>
        </div>
      </div>

      {/* Scrollable row */}
      <div ref={ref} className="hrow-track" style={{ padding: '0 24px 16px' }}>
        {games.map((g, i) => (
          <div key={g.id} style={{ flexShrink: 0, width: 190 }}>
            <GameCard game={g} onPlay={onPlay} isFav={favorites.includes(g.id)} onFav={onFav} bestScore={scores[g.id]} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Star renderer ──────────────────────────────────────────────────── */
function Stars({ n }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= n ? '#F59E0B' : '#334155', fontSize: 14 }}>★</span>
      ))}
    </span>
  );
}

export default function HomePage({ db, allDb, search, category, setCategory, onPlay, setPage, favorites, onFav, recentPlayed, scores }) {
  const [showAll, setShowAll] = useState(false);

  const visibleGames = showAll ? db : db.slice(0, INITIAL_SHOW);
  const hasMore      = db.length > INITIAL_SHOW;

  const carouselRef = useRef(null);
  const scrollRecent = dir => carouselRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });

  const byIds = ids => ids.map(id => allDb.find(g => g.id === id)).filter(Boolean);

  return (
    <div>
      <style>{`
        .home-more-btn {
          background: linear-gradient(135deg,#7C3AED,#EC4899);
          border: none; border-radius: 14px; padding: 15px 48px; color: #fff;
          font-family: 'Fredoka One',cursive; font-size: 18px; cursor: pointer;
          transition: all 0.25s; box-shadow: 0 4px 20px rgba(124,58,237,0.45);
          display: inline-flex; align-items: center; gap: 10px;
        }
        .home-more-btn:hover { transform:translateY(-3px) scale(1.04); box-shadow:0 10px 32px rgba(124,58,237,0.6); }
        .carousel-track { display:flex; gap:14px; overflow-x:auto; padding-bottom:10px; scrollbar-width:none; }
        .carousel-track::-webkit-scrollbar { display:none; }
        .hrow-track { display:flex; gap:16px; overflow-x:auto; scrollbar-width:none; }
        .hrow-track::-webkit-scrollbar { display:none; }
        .row-arrow {
          width:36px; height:36px; border-radius:10px;
          background:rgba(124,58,237,0.15); border:1px solid rgba(124,58,237,0.3);
          color:#A78BFA; font-size:20px; cursor:pointer; display:flex;
          align-items:center; justify-content:center; transition:all 0.2s; flex-shrink:0;
        }
        .row-arrow:hover { background:rgba(124,58,237,0.32); }
        .row-more {
          background: transparent; border: 1px solid rgba(124,58,237,0.35);
          border-radius: 10px; padding: 8px 16px; color: #A78BFA;
          font-family: 'Exo 2',sans-serif; font-weight:700; font-size:13px;
          cursor:pointer; transition:all 0.2s; white-space:nowrap;
        }
        .row-more:hover { background:rgba(124,58,237,0.15); }
        .section-divider {
          height: 1px; background: linear-gradient(90deg,transparent,rgba(124,58,237,0.25),transparent);
          margin: 4px 24px;
        }
        .review-card {
          background: rgba(15,12,41,0.85);
          border: 1px solid rgba(124,58,237,0.2);
          border-radius: 20px; padding: 24px;
          transition: all 0.25s; flex-shrink:0; width:280px;
        }
        .review-card:hover {
          border-color: rgba(124,58,237,0.5);
          box-shadow: 0 8px 32px rgba(124,58,237,0.15);
          transform: translateY(-3px);
        }
        .reviews-track { display:flex; gap:18px; overflow-x:auto; padding:4px 24px 20px; scrollbar-width:none; }
        .reviews-track::-webkit-scrollbar { display:none; }
      `}</style>

      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <section style={{ minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', background:'radial-gradient(ellipse at 30% 50%,rgba(124,58,237,0.18) 0%,transparent 60%),radial-gradient(ellipse at 70% 30%,rgba(236,72,153,0.12) 0%,transparent 60%)' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(124,58,237,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.06) 1px,transparent 1px)', backgroundSize:'50px 50px' }} />
        <div style={{ textAlign:'center', position:'relative', zIndex:2, padding:'60px 24px 40px' }}>
          <div style={{ fontSize:'clamp(48px,10vw,100px)', marginBottom:16 }} className="float-anim">🎮</div>
          <h1 style={{ fontFamily:"'Fredoka One',cursive", fontSize:'clamp(32px,7vw,72px)', lineHeight:1.1, marginBottom:12 }}>
            <span style={{ display:'block', color:'#fff' }}>Play Amazing</span>
            <span className="neon-text" style={{ display:'block', background:'linear-gradient(135deg,#A78BFA,#EC4899,#F59E0B)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Games FREE!</span>
          </h1>
          <p style={{ fontFamily:"'Exo 2',sans-serif", color:'#94A3B8', fontSize:'clamp(14px,2vw,18px)', marginBottom:32 }}>
            {allDb.length}+ real playable HTML5 games — no download needed!
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={() => onPlay(allDb[0])} style={{ background:'linear-gradient(135deg,#7C3AED,#EC4899)', border:'none', borderRadius:14, padding:'16px 36px', color:'#fff', fontSize:17, fontFamily:"'Fredoka One',cursive", cursor:'pointer', boxShadow:'0 4px 20px rgba(124,58,237,0.4)' }}>▶ Play Now</button>
            <button onClick={() => document.getElementById('games-section')?.scrollIntoView({ behavior:'smooth' })} style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:14, padding:'16px 36px', color:'#fff', fontSize:17, fontFamily:"'Fredoka One',cursive", cursor:'pointer' }}>Browse Games</button>
          </div>
          <div style={{ display:'flex', gap:32, justifyContent:'center', marginTop:40, flexWrap:'wrap' }}>
            {[[`${allDb.length}+`,'Games'],['HTML5','Powered'],['0','Downloads'],['Free','Forever']].map(([v,l]) => (
              <div key={l} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'clamp(20px,3vw,28px)', background:'linear-gradient(135deg,#A78BFA,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{v}</div>
                <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:11, color:'#64748B', marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ RECENTLY PLAYED ═══════════════════════════════════════════ */}
      {recentPlayed.length > 0 && (
        <section style={{ padding:'32px 0 8px', maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', marginBottom:14 }}>
            <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:22, color:'#F59E0B', margin:0 }}>⏰ Recently Played</h2>
            <div style={{ display:'flex', gap:8 }}>
              <button className="row-arrow" onClick={() => scrollRecent(-1)}>‹</button>
              <button className="row-arrow" onClick={() => scrollRecent(1)}>›</button>
            </div>
          </div>
          <div ref={carouselRef} className="carousel-track" style={{ padding:'0 24px 8px' }}>
            {recentPlayed.map(g => (
              <div key={g.id} onClick={() => onPlay(g)} style={{ flexShrink:0, width:130, background:`linear-gradient(135deg,${g.color}25,rgba(15,12,41,0.9))`, border:`1px solid ${g.color}40`, borderRadius:16, padding:16, textAlign:'center', cursor:'pointer' }}>
                <div style={{ fontSize:38, marginBottom:8 }}>{g.emoji}</div>
                <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:11, fontWeight:700, color:'#E2E8F0' }}>{g.title}</div>
                {scores[g.id] > 0 && <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:10, color:g.color, marginTop:4 }}>Best: {scores[g.id]}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="section-divider" />

      {/* ══ KIDS GAMES SECTION ════════════════════════════════════════ */}
      <GameRow
        title="Kids Games" emoji="🧒" gradient="linear-gradient(135deg,#F59E0B,#EF4444)"
        games={byIds(KIDS_IDS)}
        onPlay={onPlay} favorites={favorites} onFav={onFav} scores={scores}
        onMore={() => { setCategory('Arcade'); setPage('games'); }}
        moreLabel="All Kids Games"
      />

      <div className="section-divider" />

      {/* ══ LEARNING / EDUCATIONAL SECTION ═══════════════════════════ */}
      <GameRow
        title="Learning Games" emoji="📚" gradient="linear-gradient(135deg,#10B981,#3B82F6)"
        games={byIds(LEARNING_IDS)}
        onPlay={onPlay} favorites={favorites} onFav={onFav} scores={scores}
        onMore={() => { setCategory('Educational'); setPage('games'); }}
        moreLabel="All Learning Games"
      />

      <div className="section-divider" />

      {/* ══ STRATEGY SECTION ══════════════════════════════════════════ */}
      <GameRow
        title="Strategy & Brain" emoji="🧠" gradient="linear-gradient(135deg,#7C3AED,#EC4899)"
        games={byIds(STRATEGY_IDS)}
        onPlay={onPlay} favorites={favorites} onFav={onFav} scores={scores}
        onMore={() => { setCategory('Strategy'); setPage('games'); }}
        moreLabel="All Strategy Games"
      />

      <div className="section-divider" style={{ margin:'8px 24px 0' }} />

      {/* ══ CATEGORY FILTER + ALL GAMES GRID ════════════════════════ */}
      <section style={{ padding:'28px 24px 14px', maxWidth:1200, margin:'0 auto' }}>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => { setCategory(cat); setShowAll(false); }}
              style={{ borderRadius:10, padding:'9px 18px', fontFamily:"'Exo 2',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap', background: category===cat ? 'linear-gradient(135deg,#7C3AED,#EC4899)' : 'rgba(15,12,41,0.8)', border:`1px solid ${category===cat ? 'transparent' : 'rgba(124,58,237,0.25)'}`, color: category===cat ? '#fff' : '#94A3B8' }}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section id="games-section" style={{ padding:'8px 24px 0', maxWidth:1200, margin:'0 auto' }}>
        <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:22, color:'#fff', marginBottom:20 }}>
          {search ? `🔍 Results for "${search}"` : '🎮 Featured Games'}{' '}
          <span style={{ fontSize:14, color:'#64748B', fontFamily:"'Exo 2',sans-serif" }}>
            ({showAll ? db.length : Math.min(INITIAL_SHOW, db.length)} of {db.length})
          </span>
        </h2>
        {db.length === 0 ? (
          <div style={{ textAlign:'center', padding:60, color:'#64748B', fontFamily:"'Exo 2',sans-serif", fontSize:18 }}>No games found 😔 Try another search!</div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:18 }}>
            {visibleGames.map((g, i) => (
              <GameCard key={g.id} game={g} onPlay={onPlay} isFav={favorites.includes(g.id)} onFav={onFav} bestScore={scores[g.id]} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* More Games button */}
      {hasMore && !search && (
        <div style={{ textAlign:'center', padding:'40px 24px 24px' }}>
          {!showAll ? (
            <div>
              <p style={{ fontFamily:"'Exo 2',sans-serif", color:'#64748B', fontSize:14, marginBottom:18 }}>
                Showing {Math.min(INITIAL_SHOW, db.length)} of {db.length} games
              </p>
              <button className="home-more-btn" onClick={() => setShowAll(true)}>
                🎮 More Games
                <span style={{ background:'rgba(255,255,255,0.2)', borderRadius:8, padding:'2px 10px', fontSize:14 }}>+{db.length - INITIAL_SHOW}</span>
              </button>
              <p style={{ fontFamily:"'Exo 2',sans-serif", color:'#475569', fontSize:12, marginTop:14 }}>
                or <span onClick={() => setPage && setPage('games')} style={{ color:'#A78BFA', cursor:'pointer', textDecoration:'underline' }}>browse all games →</span>
              </p>
            </div>
          ) : (
            <button onClick={() => { setShowAll(false); document.getElementById('games-section')?.scrollIntoView({ behavior:'smooth' }); }}
              style={{ background:'rgba(124,58,237,0.15)', border:'1px solid rgba(124,58,237,0.35)', borderRadius:14, padding:'13px 36px', color:'#A78BFA', fontFamily:"'Fredoka One',cursive", fontSize:16, cursor:'pointer' }}>
              ↑ Show Less
            </button>
          )}
        </div>
      )}

      <div className="section-divider" style={{ margin:'8px 24px' }} />

      {/* ══ USER REVIEWS SECTION ═══════════════════════════════════════ */}
      <section style={{ maxWidth:1200, margin:'0 auto', padding:'8px 0 16px' }}>
        {/* Header */}
        <div style={{ padding:'32px 24px 20px', display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
              <span style={{ fontSize:28 }}>⭐</span>
              <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:26, color:'#fff', margin:0 }}>Player Reviews</h2>
            </div>
            <p style={{ fontFamily:"'Exo 2',sans-serif", color:'#64748B', fontSize:14, margin:0 }}>
              What our community says about Nexus Play
            </p>
          </div>
          {/* Overall rating badge */}
          <div style={{ background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.35)', borderRadius:16, padding:'14px 24px', textAlign:'center' }}>
            <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:36, color:'#F59E0B', lineHeight:1 }}>4.8</div>
            <div style={{ margin:'4px 0 2px' }}><Stars n={5} /></div>
            <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:11, color:'#64748B' }}>Based on 12K+ reviews</div>
          </div>
        </div>

        {/* Reviews carousel */}
        <div className="reviews-track">
          {REVIEWS.map((r, i) => (
            <div key={i} className="review-card">
              {/* Top row */}
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(236,72,153,0.3))', border:'2px solid rgba(124,58,237,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
                  {r.avatar}
                </div>
                <div>
                  <div style={{ fontFamily:"'Exo 2',sans-serif", fontWeight:700, fontSize:14, color:'#E2E8F0' }}>{r.name}</div>
                  <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:11, color:'#A78BFA', marginTop:2 }}>Playing: {r.game}</div>
                </div>
                <div style={{ marginLeft:'auto', flexShrink:0 }}><Stars n={r.stars} /></div>
              </div>
              {/* Review text */}
              <p style={{ fontFamily:"'Exo 2',sans-serif", fontSize:13, color:'#94A3B8', lineHeight:1.7, margin:0 }}>
                "{r.text}"
              </p>
            </div>
          ))}
        </div>

        {/* Write a review CTA */}
        <div style={{ textAlign:'center', padding:'24px 24px 8px' }}>
          <button onClick={() => alert("working")}
            style={{ background:'transparent', border:'1px solid rgba(124,58,237,0.4)', borderRadius:12, padding:'11px 28px', color:'#A78BFA', fontFamily:"'Exo 2',sans-serif", fontWeight:700, fontSize:14, cursor:'pointer', transition:'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(124,58,237,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}
          >
            ✏️ Write a Review
          </button>
        </div>
      </section>

      <div style={{ height:48 }} />
    </div>
  );
}
