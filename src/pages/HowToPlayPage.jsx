/* ─────────────────────────────────────────────────────────────────────────
   HowToPlayPage — a friendly guide for kids & parents: how to start, the
   controls, scoring, and tips. Styled to match the Discover landing page.
   ──────────────────────────────────────────────────────────────────────── */

const STEPS = [
  { n: '1', icon: '🔎', title: 'Find a game',  text: 'Browse the Home page or open Games. Tap any colourful card that looks fun!' },
  { n: '2', icon: '▶️', title: 'Press Play',   text: 'Sign in once with Google to save your scores, then hit the Play button.' },
  { n: '3', icon: '🕹️', title: 'Have fun',     text: 'Each game shows a "How to Play" box on the side with its own simple rules.' },
  { n: '4', icon: '🏆', title: 'Beat your best','text': 'Your top score is saved automatically. Try again and beat it next time!' },
];

const CONTROLS = [
  { icon: '🖱️', name: 'Mouse / Tap',  text: 'Most games — click or tap buttons, cards and targets.' },
  { icon: '⌨️', name: 'Arrow Keys',   text: 'Snake, 2048, Asteroid Dodge — steer with ← ↑ → ↓ or WASD.' },
  { icon: '␣',  name: 'Spacebar',     text: 'Flappy Rocket & Space Shooter — press Space to fly or shoot.' },
  { icon: '✍️', name: 'Typing',       text: 'Word Blast & Word Scramble — type the words on your keyboard.' },
];

const CATEGORIES = [
  { icon: '📚', name: 'Learn & Play', text: 'Brain Quiz, Word Scramble, Flag Quiz, Math Blitz — learn while you play.', color: '#34d399' },
  { icon: '🧒', name: 'Kids Games',   text: 'Easy, gentle arcade fun perfect for younger players.',                   color: '#F59E0B' },
  { icon: '🧩', name: 'Brain & Puzzle','text': 'Minesweeper, 2048, Simon — train your memory and logic.',             color: '#A78BFA' },
  { icon: '🤖', name: 'Vs Computer',  text: 'Chess, Connect Four, Blackjack — test your skill against the computer.',  color: '#94A3B8' },
];

const TIPS = [
  '🟢 Look for the green "Start" button inside each game to begin a round.',
  '⏱️ Many games are timed — answer fast for bonus points and streaks!',
  '❤️ Tap the heart on any game to save it to your Favorites.',
  '💡 Stuck on Word Scramble? Use the Hint button (it costs a few points).',
  '👨‍👩‍👧 Parents: every game is ad-free and safe — no chat, no strangers.',
];

export default function HowToPlayPage({ setPage, onPlay, allDb = [] }) {
  const goPlay = () => (allDb[0] && onPlay ? onPlay(allDb[0]) : setPage && setPage('games'));

  return (
    <div style={{ fontFamily: "'Exo 2',sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @keyframes hp-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .hp-card { background:rgba(15,12,41,0.7); border:1px solid rgba(124,58,237,0.2); border-radius:20px; padding:24px; transition:transform .25s, border-color .25s; }
        .hp-card:hover { transform:translateY(-5px); border-color:rgba(124,58,237,0.5); }
        .hp-cta { background:linear-gradient(135deg,#7C3AED,#EC4899); border:none; border-radius:14px; padding:15px 40px; color:#fff; font-family:'Fredoka One',cursive; font-size:17px; cursor:pointer; transition:transform .2s; box-shadow:0 8px 28px rgba(124,58,237,0.45); }
        .hp-cta:hover { transform:translateY(-3px) scale(1.03); }
      `}</style>

      {/* Hero */}
      <section style={{
        position: 'relative', textAlign: 'center', padding: 'clamp(44px,7vw,76px) 24px 48px', overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 0%,rgba(236,72,153,0.18) 0%,transparent 55%),#040814',
      }}>
        <div style={{ fontSize: 'clamp(52px,9vw,82px)', marginBottom: 12, animation: 'hp-float 4s ease-in-out infinite' }}>🎯</div>
        <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 'clamp(32px,6vw,58px)', lineHeight: 1.08, margin: '0 0 14px' }}>
          <span style={{ color: '#fff' }}>How to </span>
          <span style={{ background: 'linear-gradient(135deg,#A78BFA,#EC4899,#F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Play</span>
        </h1>
        <p style={{ color: '#94A3B8', fontSize: 'clamp(15px,2.2vw,18px)', lineHeight: 1.65, maxWidth: 560, margin: '0 auto' }}>
          New here? It only takes a few seconds to start playing. Here's everything you need to know.
        </p>
      </section>

      {/* Steps */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '16px 24px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20 }}>
          {STEPS.map(s => (
            <div key={s.n} className="hp-card" style={{ textAlign: 'center' }}>
              <div style={{ width: 58, height: 58, margin: '0 auto 14px', borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fredoka One',cursive", fontSize: 24, color: '#fff', boxShadow: '0 6px 20px rgba(124,58,237,0.4)' }}>{s.n}</div>
              <div style={{ fontSize: 30, marginBottom: 6 }}>{s.icon}</div>
              <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: '#fff', margin: '0 0 6px' }}>{s.title}</h3>
              <p style={{ fontSize: 13.5, color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Controls */}
      <section style={{ background: 'linear-gradient(180deg,transparent,rgba(124,58,237,0.06),transparent)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '44px 24px' }}>
          <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 'clamp(24px,4vw,34px)', color: '#fff', textAlign: 'center', margin: '0 0 32px' }}>
            🎮 The controls
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 16 }}>
            {CONTROLS.map(c => (
              <div key={c.name} style={{ display: 'flex', gap: 14, alignItems: 'center', background: 'rgba(15,12,41,0.6)', border: '1px solid rgba(124,58,237,0.18)', borderRadius: 16, padding: '18px 20px' }}>
                <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 12, background: 'rgba(124,58,237,0.18)', border: '1px solid rgba(124,58,237,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{c.icon}</div>
                <div>
                  <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: '#fff', marginBottom: 3 }}>{c.name}</div>
                  <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
        <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 'clamp(24px,4vw,34px)', color: '#fff', textAlign: 'center', margin: '0 0 32px' }}>
          🗂️ Kinds of games
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 18 }}>
          {CATEGORIES.map(c => (
            <div key={c.name} className="hp-card" onClick={() => setPage && setPage('games')} style={{ cursor: 'pointer' }}>
              <div style={{ fontSize: 34, marginBottom: 10 }}>{c.icon}</div>
              <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: c.color, margin: '0 0 6px' }}>{c.name}</h3>
              <p style={{ fontSize: 13.5, color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '8px 24px 48px' }}>
        <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 'clamp(22px,4vw,32px)', color: '#fff', textAlign: 'center', margin: '0 0 28px' }}>
          ✨ Handy tips
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {TIPS.map((t, i) => (
            <div key={i} style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.18)', borderRadius: 14, padding: '14px 18px', fontSize: 14.5, color: '#CBD5E1', lineHeight: 1.5 }}>
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '8px 24px 72px' }}>
        <button className="hp-cta" onClick={goPlay}>▶ Start Playing</button>
      </section>
    </div>
  );
}
