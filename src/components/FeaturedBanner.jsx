import { useState, useEffect, useRef } from 'react';

/* Auto-rotating hero banner carousel for the most popular games. */
export default function FeaturedBanner({ games, onPlay }) {
  const [active, setActive] = useState(0);
  const timer = useRef(null);
  const count = games.length;

  const go = i => setActive((i + count) % count);

  // Auto-advance every 5s; pause handled by clearing/restarting the timer.
  const restart = () => {
    clearInterval(timer.current);
    timer.current = setInterval(() => setActive(a => (a + 1) % count), 5000);
  };

  useEffect(() => {
    if (count > 1) restart();
    return () => clearInterval(timer.current);
  }, [count]);

  if (!count) return null;

  const g = games[active];

  return (
    <section
      onMouseEnter={() => clearInterval(timer.current)}
      onMouseLeave={restart}
      style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 8px' }}
    >
      <style>{`
        .fbanner {
          position: relative; border-radius: 26px; overflow: hidden;
          min-height: 300px; display: flex; align-items: center;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 18px 60px rgba(0,0,0,0.45);
        }
        .fbanner-emoji {
          position: absolute; right: 4%; top: 50%; transform: translateY(-50%);
          font-size: clamp(120px,22vw,230px); opacity: 0.9;
          filter: drop-shadow(0 12px 40px rgba(0,0,0,0.5));
          animation: float 3.5s ease-in-out infinite; pointer-events: none;
        }
        .fbanner-play {
          background: #fff; color: #0a0520; border: none; border-radius: 14px;
          padding: 14px 34px; font-family: 'Fredoka One',cursive; font-size: 17px;
          cursor: pointer; transition: all 0.25s; box-shadow: 0 8px 24px rgba(0,0,0,0.35);
        }
        .fbanner-play:hover { transform: translateY(-3px) scale(1.04); }
        .fbanner-arrow {
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.25);
          color: #fff; font-size: 22px; cursor: pointer; display: flex;
          align-items: center; justify-content: center; transition: all 0.2s;
          backdrop-filter: blur(4px); z-index: 3;
        }
        .fbanner-arrow:hover { background: rgba(0,0,0,0.6); transform: scale(1.08); }
        .fbanner-dot {
          height: 8px; border-radius: 99px; cursor: pointer;
          border: none; transition: all 0.3s; padding: 0;
        }
      `}</style>

      <div
        className="fbanner"
        style={{ background: `radial-gradient(ellipse at 20% 30%, ${g.color}55 0%, transparent 60%), linear-gradient(135deg, ${g.color}33, rgba(10,5,32,0.96))` }}
      >
        {/* Grid texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)', backgroundSize: '46px 46px' }} />

        <span className="fbanner-emoji" key={g.id}>{g.emoji}</span>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, padding: 'clamp(28px,5vw,52px)', maxWidth: '62%' }} key={g.id + '-c'} className="slide-up">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.3)', border: `1px solid ${g.color}`, borderRadius: 99, padding: '5px 14px', marginBottom: 16 }}>
            <span style={{ fontSize: 13 }}>🔥</span>
            <span style={{ fontFamily: "'Exo 2',sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: 1, color: '#fff', textTransform: 'uppercase' }}>Popular · {g.category}</span>
          </div>

          <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 'clamp(28px,5vw,52px)', color: '#fff', margin: '0 0 12px', lineHeight: 1.05, textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}>
            {g.title}
          </h2>

          <p style={{ fontFamily: "'Exo 2',sans-serif", fontSize: 'clamp(13px,1.6vw,16px)', color: '#E2E8F0', lineHeight: 1.6, margin: '0 0 22px', maxWidth: 460 }}>
            {g.desc}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
            <button className="fbanner-play" onClick={() => onPlay(g)}>▶ Play Now</button>
            <div style={{ display: 'flex', gap: 16 }}>
              <span style={{ fontFamily: "'Exo 2',sans-serif", fontSize: 14, color: '#F59E0B', fontWeight: 700 }}>⭐ {g.rating}</span>
              <span style={{ fontFamily: "'Exo 2',sans-serif", fontSize: 14, color: '#fff', fontWeight: 700 }}>🎮 {g.plays} plays</span>
            </div>
          </div>
        </div>

        {/* Arrows */}
        {count > 1 && (
          <>
            <button className="fbanner-arrow" onClick={() => go(active - 1)} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }}>‹</button>
            <button className="fbanner-arrow" onClick={() => go(active + 1)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)' }}>›</button>
          </>
        )}

        {/* Dots */}
        {count > 1 && (
          <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 3 }}>
            {games.map((gg, i) => (
              <button
                key={gg.id}
                className="fbanner-dot"
                onClick={() => go(i)}
                style={{ width: i === active ? 26 : 8, background: i === active ? '#fff' : 'rgba(255,255,255,0.4)' }}
                aria-label={`Go to ${gg.title}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
