import { useRef } from 'react';

/* ─────────────────────────────────────────────────────────────────────────
   LandingPage — a standalone advertisement / promo page.
   Distinct, marketing-first design (separate from the Home feed). Its only
   job is to sell the platform and funnel visitors into "Play Free".
   ──────────────────────────────────────────────────────────────────────── */

const FEATURES = [
  { icon: '⚡', title: 'Instant Play',     text: 'No downloads, no installs, no waiting. Click and play in your browser in under a second.' },
  { icon: '📚', title: 'Learn While You Play', text: 'Word, maths, geography & brain quizzes turn screen time into real learning time.' },
  { icon: '🛡️', title: '100% Kid-Safe',   text: 'No chat, no ads in games, no surprises. A clean, friendly space the whole family can enjoy.' },
  { icon: '📱', title: 'Plays Everywhere', text: 'Phone, tablet or desktop — every game is fully responsive and free, forever.' },
];

const STEPS = [
  { n: '1', title: 'Pick a game', text: 'Browse 28 hand-crafted HTML5 games across 8 categories.' },
  { n: '2', title: 'Press play',  text: 'No sign-up wall to browse. Jump straight into the action.' },
  { n: '3', title: 'Beat your score', text: 'Track your high scores, beat your personal best, and challenge your friends.' },
];

const PROOF = [
  { stars: 5, text: 'My kids use the Math Blitz and Brain Quiz games every day after school. Learning made fun!', name: 'Priya S.', tag: 'Parent' },
  { stars: 5, text: 'Best free games site I have found. Loads instantly and works perfectly on my phone.',          name: 'Rahul K.', tag: 'Player'  },
  { stars: 5, text: 'Clean, safe and genuinely addictive. The Word Scramble is my new coffee-break habit.',     name: 'Dev P.',   tag: 'Player'  },
];

function Stars({ n }) {
  return <span style={{ color: '#F59E0B', fontSize: 15, letterSpacing: 1 }}>{'★'.repeat(n)}</span>;
}

export default function LandingPage({ allDb = [], onPlay, setPage }) {
  const total = allDb.length;
  const showcase = allDb.slice(0, 10);
  const firstGame = allDb[0];
  const ref = useRef(null);

  const goPlay = () => firstGame && onPlay ? onPlay(firstGame) : setPage && setPage('games');
  const browse = () => setPage && setPage('games');

  return (
    <div ref={ref} style={{ fontFamily: "'Exo 2',sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @keyframes lp-float { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-16px) } }
        @keyframes lp-pulse { 0%,100%{ box-shadow:0 0 0 0 rgba(236,72,153,0.5) } 50%{ box-shadow:0 0 0 18px rgba(236,72,153,0) } }
        @keyframes lp-marquee { from{ transform:translateX(0) } to{ transform:translateX(-50%) } }
        .lp-cta {
          background:linear-gradient(135deg,#7C3AED,#EC4899); border:none; border-radius:16px;
          padding:18px 46px; color:#fff; font-family:'Fredoka One',cursive; font-size:20px;
          cursor:pointer; transition:transform .2s, box-shadow .2s; box-shadow:0 10px 34px rgba(124,58,237,0.5);
          animation:lp-pulse 2.6s infinite;
        }
        .lp-cta:hover { transform:translateY(-3px) scale(1.04); }
        .lp-cta2 {
          background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.2); border-radius:16px;
          padding:18px 40px; color:#fff; font-family:'Fredoka One',cursive; font-size:18px; cursor:pointer;
          transition:all .2s;
        }
        .lp-cta2:hover { background:rgba(255,255,255,0.12); transform:translateY(-2px); }
        .lp-feature {
          background:rgba(15,12,41,0.7); border:1px solid rgba(124,58,237,0.2); border-radius:22px;
          padding:30px 26px; transition:transform .25s, border-color .25s;
        }
        .lp-feature:hover { transform:translateY(-6px); border-color:rgba(124,58,237,0.55); }
        .lp-tile {
          flex-shrink:0; width:150px; border-radius:18px; padding:20px 14px; text-align:center;
          cursor:pointer; transition:transform .2s; border:1px solid rgba(255,255,255,0.08);
        }
        .lp-tile:hover { transform:translateY(-6px) scale(1.03); }
        .lp-marquee-track { display:flex; gap:14px; width:max-content; animation:lp-marquee 26s linear infinite; }
        .lp-marquee-wrap:hover .lp-marquee-track { animation-play-state:paused; }
        .lp-cta-group { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; }

        /* ── Tablet & small laptop ── */
        @media (max-width:640px){
          .lp-cta  { padding:16px 30px; font-size:18px; }
          .lp-cta2 { padding:16px 26px; font-size:16px; }
        }
        /* ── Phone ── */
        @media (max-width:460px){
          .lp-cta-group { flex-direction:column; align-items:stretch; gap:12px; width:100%; max-width:340px; margin-left:auto; margin-right:auto; }
          .lp-cta-group .lp-cta, .lp-cta-group .lp-cta2 { width:100%; padding:15px 18px; font-size:16px; }
          .lp-tile { width:132px; padding:16px 10px; }
          .lp-feature { padding:24px 20px; }
        }
        /* Respect users who prefer no motion */
        @media (prefers-reduced-motion:reduce){
          .lp-cta { animation:none; }
          .lp-marquee-track { animation:none; }
        }
      `}</style>

      {/* ══ HERO (advertisement) ══════════════════════════════════════ */}
      <section style={{
        position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '70px 24px 56px', overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 0%,rgba(236,72,153,0.22) 0%,transparent 55%),radial-gradient(ellipse at 20% 80%,rgba(124,58,237,0.25) 0%,transparent 55%),#040814',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(124,58,237,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.06) 1px,transparent 1px)', backgroundSize: '54px 54px', maskImage: 'radial-gradient(ellipse at center,#000 30%,transparent 75%)' }} />
        {/* floating emojis */}
        {['🎮','🚀','🧠','🎯','🏆','🌍'].map((e, i) => (
          <span key={i} style={{
            position: 'absolute', fontSize: 'clamp(28px,4vw,52px)', opacity: 0.5,
            top: `${[18,26,70,64,40,80][i]}%`, left: `${[8,86,12,82,50,46][i]}%`,
            animation: `lp-float ${4 + i * 0.6}s ease-in-out infinite`, pointerEvents: 'none',
          }}>{e}</span>
        ))}

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 860 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 22,
            background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.4)',
            borderRadius: 99, padding: '7px 18px', fontFamily: "'Exo 2',sans-serif", fontWeight: 700, fontSize: 13, color: '#C4B5FD',
          }}>
            ✨ {total} free games · no download · 100% kid-safe
          </div>

          <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 'clamp(40px,8vw,86px)', lineHeight: 1.04, margin: '0 0 18px' }}>
            <span style={{ color: '#fff', display: 'block' }}>Where Play</span>
            <span style={{ display: 'block', background: 'linear-gradient(135deg,#A78BFA,#EC4899,#F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Meets Learning
            </span>
          </h1>

          <p style={{ fontFamily: "'Exo 2',sans-serif", color: '#94A3B8', fontSize: 'clamp(15px,2.2vw,20px)', lineHeight: 1.6, maxWidth: 620, margin: '0 auto 36px' }}>
            Instantly playable HTML5 games the whole family loves — from brain quizzes and
            word puzzles to arcade classics. No installs, no ads in games, just pure fun.
          </p>

          <div className="lp-cta-group">
            <button className="lp-cta" onClick={goPlay}>▶ Play Free Now</button>
            <button className="lp-cta2" onClick={browse}>Browse All Games</button>
          </div>

          {/* trust stats */}
          <div style={{ display: 'flex', gap: 'clamp(20px,5vw,56px)', justifyContent: 'center', marginTop: 48, flexWrap: 'wrap' }}>
            {[[`${total}+`, 'Free Games'], ['8', 'Categories'], ['4.8★', 'Avg Rating'], ['0', 'Downloads']].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 'clamp(24px,4vw,38px)', background: 'linear-gradient(135deg,#A78BFA,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{v}</div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2, letterSpacing: 0.5 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SCROLLING GAME MARQUEE ════════════════════════════════════ */}
      <div className="lp-marquee-wrap" style={{ padding: '8px 0 32px', overflow: 'hidden', background: '#040814' }}>
        <div className="lp-marquee-track">
          {[...showcase, ...showcase].map((g, i) => (
            <div key={i} className="lp-tile" onClick={() => onPlay && onPlay(g)}
              style={{ background: `linear-gradient(135deg,${g.color}28,rgba(15,12,41,0.92))`, borderColor: `${g.color}40` }}>
              <div style={{ fontSize: 44 }}>{g.emoji}</div>
              <div style={{ fontFamily: "'Exo 2',sans-serif", fontWeight: 700, fontSize: 13, color: '#E2E8F0', marginTop: 8 }}>{g.title}</div>
              <div style={{ fontSize: 11, color: g.color, marginTop: 3 }}>⭐ {g.rating}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ FEATURES ══════════════════════════════════════════════════ */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: '48px 24px' }}>
        <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 'clamp(26px,4vw,40px)', color: '#fff', textAlign: 'center', margin: '0 0 12px' }}>
          Why families choose <span style={{ background: 'linear-gradient(135deg,#A78BFA,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Nexus Play</span>
        </h2>
        <p style={{ textAlign: 'center', color: '#64748B', fontSize: 16, margin: '0 auto 40px', maxWidth: 560 }}>
          Built to be safe, fast and genuinely good for young minds.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 20 }}>
          {FEATURES.map(f => (
            <div key={f.title} className="lp-feature">
              <div style={{ fontSize: 40, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 19, color: '#fff', margin: '0 0 8px' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65, margin: 0 }}>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ HOW IT WORKS ══════════════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(180deg,transparent,rgba(124,58,237,0.06),transparent)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px' }}>
          <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 'clamp(24px,4vw,36px)', color: '#fff', textAlign: 'center', margin: '0 0 40px' }}>
            Playing takes seconds 🎯
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 22 }}>
            {STEPS.map(s => (
              <div key={s.n} style={{ textAlign: 'center', padding: '0 10px' }}>
                <div style={{ width: 64, height: 64, margin: '0 auto 16px', borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fredoka One',cursive", fontSize: 28, color: '#fff', boxShadow: '0 8px 24px rgba(124,58,237,0.4)' }}>{s.n}</div>
                <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: '#fff', margin: '0 0 6px' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SOCIAL PROOF ══════════════════════════════════════════════ */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: '48px 24px' }}>
        <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 'clamp(24px,4vw,36px)', color: '#fff', textAlign: 'center', margin: '0 0 8px' }}>
          Loved by players & parents ⭐
        </h2>
        <p style={{ textAlign: 'center', color: '#64748B', fontSize: 15, margin: '0 0 36px' }}>Rated 4.8/5 from 12,000+ reviews</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {PROOF.map((p, i) => (
            <div key={i} style={{ background: 'rgba(15,12,41,0.75)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 20, padding: 26 }}>
              <Stars n={p.stars} />
              <p style={{ fontSize: 15, color: '#CBD5E1', lineHeight: 1.7, margin: '12px 0 18px' }}>"{p.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(124,58,237,0.4),rgba(236,72,153,0.4))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🙂</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#E2E8F0' }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: '#A78BFA' }}>{p.tag}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FINAL CTA ═════════════════════════════════════════════════ */}
      <section style={{ padding: '20px 24px 72px' }}>
        <div style={{
          maxWidth: 920, margin: '0 auto', borderRadius: 30, padding: 'clamp(36px,6vw,64px) 28px', textAlign: 'center',
          background: 'radial-gradient(ellipse at 50% 0%,rgba(236,72,153,0.25),transparent 70%),linear-gradient(135deg,rgba(124,58,237,0.35),rgba(15,12,41,0.9))',
          border: '1px solid rgba(124,58,237,0.4)', boxShadow: '0 24px 70px rgba(124,58,237,0.25)',
        }}>
          <div style={{ fontSize: 54, marginBottom: 14 }} className="">🎮</div>
          <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 'clamp(28px,5vw,48px)', color: '#fff', margin: '0 0 14px', lineHeight: 1.1 }}>
            Ready to play? It's free.
          </h2>
          <p style={{ fontSize: 'clamp(14px,2vw,17px)', color: '#CBD5E1', margin: '0 auto 32px', maxWidth: 520 }}>
            Join thousands of players enjoying {total} games right now. No account needed to start — just press play.
          </p>
          <div className="lp-cta-group">
            <button className="lp-cta" onClick={goPlay}>▶ Start Playing Free</button>
            <button className="lp-cta2" onClick={browse}>See the Games</button>
          </div>
          <div style={{ marginTop: 22, fontSize: 13, color: '#64748B' }}>🛡️ Kid-safe · 📱 Works on any device · ✅ Free forever</div>
        </div>
      </section>
    </div>
  );
}
