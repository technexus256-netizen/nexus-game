/* ─────────────────────────────────────────────────────────────────────────
   AboutPage — kid-friendly "who we are" page, styled to match the Discover
   landing page (bold hero, playful gradients, value cards).
   ──────────────────────────────────────────────────────────────────────── */

const VALUES = [
  { icon: '🛡️', title: 'Safety First',     text: 'No chat, no strangers, no ads inside games. A walled garden where kids can just play.', color: '#43E97B' },
  { icon: '📚', title: 'Learning is Fun',  text: 'Maths, words, geography and brain teasers hidden inside games kids actually want to play.', color: '#60A5FA' },
  { icon: '⚡', title: 'Zero Friction',    text: 'No downloads, no installs, no waiting. Open the page and play in under a second.', color: '#F59E0B' },
  { icon: '💜', title: 'Free Forever',     text: 'Every single game is free with no surprise costs, loot boxes, or pay-to-win tricks.', color: '#A78BFA' },
];

const STATS = [
  ['28+', 'Free Games'],
  ['8',   'Categories'],
  ['100%','Kid-Safe'],
  ['4.8★','Avg Rating'],
];

const STORY = [
  { year: 'The Idea',   text: 'We wanted a place our own kids could play online without us worrying about ads, chat, or creepy content.' },
  { year: 'The Build',  text: 'So we hand-built 28 fast, lightweight HTML5 games that run instantly in any browser — no app store needed.' },
  { year: 'Today',      text: 'Thousands of families play every day, mixing arcade fun with real learning games like Brain Quiz and Word Scramble.' },
];

export default function AboutPage({ setPage, onPlay, allDb = [] }) {
  const goPlay  = () => (allDb[0] && onPlay ? onPlay(allDb[0]) : setPage && setPage('games'));

  return (
    <div style={{ fontFamily: "'Exo 2',sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @keyframes ab-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .ab-card { background:rgba(15,12,41,0.7); border:1px solid rgba(124,58,237,0.2); border-radius:22px; padding:28px 24px; transition:transform .25s, border-color .25s; }
        .ab-card:hover { transform:translateY(-6px); border-color:rgba(124,58,237,0.5); }
        .ab-cta { background:linear-gradient(135deg,#7C3AED,#EC4899); border:none; border-radius:14px; padding:15px 40px; color:#fff; font-family:'Fredoka One',cursive; font-size:17px; cursor:pointer; transition:transform .2s, box-shadow .2s; box-shadow:0 8px 28px rgba(124,58,237,0.45); }
        .ab-cta:hover { transform:translateY(-3px) scale(1.03); }
      `}</style>

      {/* Hero */}
      <section style={{
        position: 'relative', textAlign: 'center', padding: 'clamp(48px,8vw,86px) 24px 56px', overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 0%,rgba(124,58,237,0.22) 0%,transparent 55%),#040814',
      }}>
        <div style={{ fontSize: 'clamp(56px,10vw,90px)', marginBottom: 14, animation: 'ab-float 4s ease-in-out infinite' }}>🎮</div>
        <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 'clamp(34px,6vw,64px)', lineHeight: 1.08, margin: '0 0 16px' }}>
          <span style={{ color: '#fff' }}>We make the internet a </span>
          <span style={{ background: 'linear-gradient(135deg,#A78BFA,#EC4899,#F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>safer playground</span>
        </h1>
        <p style={{ color: '#94A3B8', fontSize: 'clamp(15px,2.2vw,19px)', lineHeight: 1.65, maxWidth: 620, margin: '0 auto' }}>
          Nexus Play is a free, kid-safe gaming platform where fun meets learning. No downloads,
          no ads in games, no strangers — just 28 hand-crafted games the whole family can enjoy.
        </p>
      </section>

      {/* Stats band */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '8px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 16 }}>
          {STATS.map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 18, padding: '20px 12px' }}>
              <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 'clamp(24px,4vw,34px)', background: 'linear-gradient(135deg,#A78BFA,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{v}</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 48px' }}>
        <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 'clamp(24px,4vw,38px)', color: '#fff', textAlign: 'center', margin: '0 0 36px' }}>
          What we believe in 💜
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 20 }}>
          {VALUES.map(v => (
            <div key={v.title} className="ab-card">
              <div style={{ fontSize: 40, marginBottom: 14 }}>{v.icon}</div>
              <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 19, color: v.color, margin: '0 0 8px' }}>{v.title}</h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65, margin: 0 }}>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section style={{ background: 'linear-gradient(180deg,transparent,rgba(124,58,237,0.06),transparent)' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '48px 24px' }}>
          <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 'clamp(24px,4vw,36px)', color: '#fff', textAlign: 'center', margin: '0 0 36px' }}>
            Our story 📖
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {STORY.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', background: 'rgba(15,12,41,0.6)', border: '1px solid rgba(124,58,237,0.18)', borderRadius: 18, padding: '22px 24px' }}>
                <div style={{ flexShrink: 0, width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#7C3AED,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{['💡','🛠️','🚀'][i]}</div>
                <div>
                  <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: '#A78BFA', marginBottom: 4 }}>{s.year}</div>
                  <p style={{ fontSize: 14.5, color: '#94A3B8', lineHeight: 1.7, margin: 0 }}>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '48px 24px 72px' }}>
        <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 'clamp(24px,4vw,38px)', color: '#fff', margin: '0 0 14px' }}>
          Come play with us! 🎉
        </h2>
        <p style={{ color: '#94A3B8', fontSize: 16, margin: '0 auto 28px', maxWidth: 480 }}>
          28 free games are waiting. No account needed to start.
        </p>
        <button className="ab-cta" onClick={goPlay}>▶ Play Free Now</button>
      </section>
    </div>
  );
}
