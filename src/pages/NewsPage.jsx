/* ─────────────────────────────────────────────────────────────────────────
   NewsPage — platform updates & announcements in a friendly card layout.
   Styled to match the Discover landing page.
   ──────────────────────────────────────────────────────────────────────── */

const POSTS = [
  {
    tag: 'New Games', tagColor: '#34d399', emoji: '🧠', date: 'June 2026', featured: true,
    title: '3 brand-new learning games just landed!',
    text: 'Say hello to Brain Quiz, Word Scramble and Flag Quiz — our newest educational games. Test your general knowledge, unscramble tricky words, and learn the flags of the world, all while racing the clock for bonus points.',
  },
  {
    tag: 'Update', tagColor: '#60A5FA', emoji: '🗂️', date: 'June 2026',
    title: 'A fresh, easier-to-browse home page',
    text: 'We reorganised the home page so learning games and the most-loved titles are front and centre. Games you play against the computer now live in their own tidy "Vs Computer" section.',
  },
  {
    tag: 'Announcement', tagColor: '#F59E0B', emoji: '✨', date: 'June 2026',
    title: 'Introducing the Discover page',
    text: 'A brand-new welcome page tells visitors everything that makes Nexus Play special — instant play, kid-safe by design, and 28 free games. Share it with a friend!',
  },
  {
    tag: 'Milestone', tagColor: '#EC4899', emoji: '🎉', date: 'May 2026',
    title: 'Our library grows to 28 free games',
    text: 'From Neon Snake to Chess to Math Blitz, the Nexus Play collection now spans 8 categories — and every single one is free, forever, with no downloads.',
  },
  {
    tag: 'Safety', tagColor: '#A78BFA', emoji: '🛡️', date: 'May 2026',
    title: 'Still 100% ad-free inside games',
    text: 'A quick reminder of our promise: no ads inside games, no chat, no strangers, and no in-app purchases. A clean, safe space for the whole family.',
  },
];

export default function NewsPage({ setPage, onPlay, allDb = [] }) {
  const goPlay = () => (allDb[0] && onPlay ? onPlay(allDb[0]) : setPage && setPage('games'));
  const [featured, ...rest] = POSTS;

  return (
    <div style={{ fontFamily: "'Exo 2',sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @keyframes nw-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .nw-card { background:rgba(15,12,41,0.7); border:1px solid rgba(124,58,237,0.2); border-radius:20px; padding:24px; transition:transform .25s, border-color .25s; }
        .nw-card:hover { transform:translateY(-5px); border-color:rgba(124,58,237,0.5); }
        .nw-tag { display:inline-flex; align-items:center; gap:6px; border-radius:99px; padding:4px 12px; font-size:11px; font-weight:800; letter-spacing:0.5px; text-transform:uppercase; }
        .nw-cta { background:linear-gradient(135deg,#7C3AED,#EC4899); border:none; border-radius:14px; padding:14px 36px; color:#fff; font-family:'Fredoka One',cursive; font-size:16px; cursor:pointer; transition:transform .2s; box-shadow:0 8px 28px rgba(124,58,237,0.45); }
        .nw-cta:hover { transform:translateY(-3px) scale(1.03); }
      `}</style>

      {/* Hero */}
      <section style={{
        textAlign: 'center', padding: 'clamp(44px,7vw,72px) 24px 40px', overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 0%,rgba(124,58,237,0.2) 0%,transparent 55%),#040814',
      }}>
        <div style={{ fontSize: 'clamp(50px,9vw,78px)', marginBottom: 12, animation: 'nw-float 4s ease-in-out infinite' }}>📰</div>
        <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 'clamp(32px,6vw,56px)', lineHeight: 1.08, margin: '0 0 14px' }}>
          <span style={{ color: '#fff' }}>What's </span>
          <span style={{ background: 'linear-gradient(135deg,#A78BFA,#EC4899,#F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>New</span>
        </h1>
        <p style={{ color: '#94A3B8', fontSize: 'clamp(15px,2.2vw,18px)', lineHeight: 1.65, maxWidth: 540, margin: '0 auto' }}>
          New games, fresh features and platform news — all the latest from Nexus Play.
        </p>
      </section>

      {/* Featured post */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '8px 24px 8px' }}>
        <div style={{
          borderRadius: 24, padding: 'clamp(26px,4vw,40px)', position: 'relative', overflow: 'hidden',
          background: 'radial-gradient(ellipse at 80% 20%,rgba(52,211,153,0.18),transparent 60%),linear-gradient(135deg,rgba(124,58,237,0.28),rgba(15,12,41,0.92))',
          border: '1px solid rgba(124,58,237,0.4)', boxShadow: '0 18px 50px rgba(124,58,237,0.2)',
        }}>
          <span className="nw-tag" style={{ background: `${featured.tagColor}22`, border: `1px solid ${featured.tagColor}`, color: featured.tagColor }}>
            ⭐ {featured.tag}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 'clamp(48px,8vw,72px)' }}>{featured.emoji}</div>
            <div style={{ flex: 1, minWidth: 240 }}>
              <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 'clamp(22px,3.5vw,32px)', color: '#fff', margin: '0 0 8px', lineHeight: 1.2 }}>{featured.title}</h2>
              <div style={{ fontSize: 12, color: '#64748B', marginBottom: 10 }}>{featured.date}</div>
              <p style={{ fontSize: 15, color: '#CBD5E1', lineHeight: 1.7, margin: '0 0 18px' }}>{featured.text}</p>
              <button className="nw-cta" onClick={goPlay}>▶ Try them now</button>
            </div>
          </div>
        </div>
      </section>

      {/* Other posts */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {rest.map((p, i) => (
            <article key={i} className="nw-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span className="nw-tag" style={{ background: `${p.tagColor}1f`, border: `1px solid ${p.tagColor}66`, color: p.tagColor }}>{p.tag}</span>
                <span style={{ fontSize: 12, color: '#64748B' }}>{p.date}</span>
              </div>
              <div style={{ fontSize: 38, marginBottom: 10 }}>{p.emoji}</div>
              <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 19, color: '#fff', margin: '0 0 8px', lineHeight: 1.25 }}>{p.title}</h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65, margin: 0 }}>{p.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '0 24px 72px' }}>
        <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 'clamp(22px,4vw,34px)', color: '#fff', margin: '0 0 18px' }}>
          Ready to jump in? 🎮
        </h2>
        <button className="nw-cta" onClick={goPlay}>▶ Play Free Now</button>
      </section>
    </div>
  );
}
