import { useState, useEffect, useRef, useCallback } from 'react';

const BUBBLE_COLORS = ['#7C3AED', '#EC4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#f472b6'];

let idCounter = 0;
function createBubble() {
  idCounter++;
  return {
    id: idCounter,
    x: Math.random() * 85 + 2,
    size: Math.floor(Math.random() * 40) + 40,
    color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
    duration: Math.random() * 4 + 4,
    delay: Math.random() * 2,
  };
}

export default function BubblePopGame({ onScore }) {
  const [bubbles, setBubbles] = useState(() => Array.from({ length: 8 }, createBubble));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [streak, setStreak] = useState(0);
  const [popEffects, setPopEffects] = useState([]);
  const timerRef = useRef(null);
  const spawnRef = useRef(null);
  const finalScoreRef = useRef(0);

  const endGame = useCallback((finalScore) => {
    clearInterval(timerRef.current);
    clearInterval(spawnRef.current);
    setGameOver(true);
    setRunning(false);
    onScore(finalScore);
  }, [onScore]);

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          endGame(finalScoreRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    spawnRef.current = setInterval(() => {
      setBubbles(prev => {
        const next = [...prev, createBubble()];
        if (next.length > 12) {
          endGame(finalScoreRef.current);
        }
        return next;
      });
    }, 2000);
    return () => {
      clearInterval(timerRef.current);
      clearInterval(spawnRef.current);
    };
  }, [running, endGame]);

  function startGame() {
    idCounter = 0;
    setBubbles(Array.from({ length: 8 }, createBubble));
    setScore(0);
    setTimeLeft(60);
    setStreak(0);
    setGameOver(false);
    setPopEffects([]);
    finalScoreRef.current = 0;
    setRunning(true);
  }

  function popBubble(id, x, y, bubbleColor) {
    if (!running) return;
    setBubbles(prev => prev.filter(b => b.id !== id));
    setStreak(prev => {
      const newStreak = prev + 1;
      const bonus = newStreak % 5 === 0 ? newStreak * 10 : 0;
      const gained = 10 + bonus;
      setScore(s => {
        const ns = s + gained;
        finalScoreRef.current = ns;
        return ns;
      });
      const effect = { id: Date.now() + Math.random(), x, y, bonus, color: bubbleColor };
      setPopEffects(ef => [...ef, effect]);
      setTimeout(() => setPopEffects(ef => ef.filter(e => e.id !== effect.id)), 800);
      return newStreak;
    });
  }

  const styles = {
    container: {
      position: 'relative', overflow: 'hidden',
      width: '100%', minHeight: '500px', height: '100%',
      background: '#040814', fontFamily: "'Exo 2', sans-serif",
      display: 'flex', flexDirection: 'column',
    },
    header: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '16px 24px', background: 'rgba(124,58,237,0.15)',
      borderBottom: '1px solid #7C3AED', zIndex: 5,
    },
    title: {
      fontFamily: "'Fredoka One', cursive", fontSize: '1.8rem',
      background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    },
    stat: { textAlign: 'center', color: '#fff' },
    statLabel: { fontSize: '0.65rem', color: '#9d6fef', textTransform: 'uppercase', letterSpacing: '1px' },
    statVal: { fontSize: '1.4rem', fontWeight: '700', color: '#EC4899' },
    arena: { flex: 1, position: 'relative', cursor: 'crosshair' },
    bubble: (b) => ({
      position: 'absolute',
      left: `${b.x}%`,
      width: `${b.size}px`,
      height: `${b.size}px`,
      borderRadius: '50%',
      background: `radial-gradient(circle at 35% 35%, ${b.color}cc, ${b.color})`,
      border: `2px solid ${b.color}`,
      boxShadow: `0 0 12px ${b.color}88`,
      cursor: 'pointer',
      animation: `floatUp ${b.duration}s linear ${b.delay}s forwards`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: `${b.size * 0.35}px`,
      userSelect: 'none',
    }),
    overlay: {
      position: 'absolute', inset: 0, background: 'rgba(4,8,20,0.92)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', zIndex: 20,
    },
    overlayTitle: {
      fontFamily: "'Fredoka One', cursive", fontSize: '2.5rem',
      color: '#EC4899', marginBottom: '12px',
    },
    overlayScore: { fontSize: '1.3rem', color: '#7C3AED', marginBottom: '20px' },
    btn: {
      padding: '12px 35px',
      background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
      border: 'none', borderRadius: '25px', color: '#fff',
      fontFamily: "'Fredoka One', cursive", fontSize: '1.2rem',
      cursor: 'pointer',
    },
    popEffect: (ef) => ({
      position: 'absolute',
      left: ef.x, top: ef.y,
      color: ef.color, fontWeight: '700', fontSize: '1.1rem',
      pointerEvents: 'none', zIndex: 10,
      animation: 'fadeUp 0.8s ease forwards',
      whiteSpace: 'nowrap',
    }),
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes floatUp {
          0% { bottom: -100px; opacity: 1; }
          90% { opacity: 1; }
          100% { bottom: 110%; opacity: 0; }
        }
        @keyframes fadeUp {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-50px); opacity: 0; }
        }
      `}</style>
      <div style={styles.header}>
        <div style={styles.title}>Bubble Pop</div>
        <div style={styles.stat}>
          <div style={styles.statLabel}>Score</div>
          <div style={styles.statVal}>{score}</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statLabel}>Time</div>
          <div style={{ ...styles.statVal, color: timeLeft <= 10 ? '#ef4444' : '#EC4899' }}>{timeLeft}s</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statLabel}>Streak</div>
          <div style={styles.statVal}>{streak}</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statLabel}>Bubbles</div>
          <div style={{ ...styles.statVal, color: bubbles.length > 10 ? '#ef4444' : '#EC4899' }}>{bubbles.length}/12</div>
        </div>
      </div>

      <div style={styles.arena}>
        {bubbles.map(b => (
          <div
            key={b.id}
            style={styles.bubble(b)}
            onClick={(e) => {
              const rect = e.currentTarget.closest('[style*="position: relative"]').getBoundingClientRect();
              popBubble(b.id, e.clientX - rect.left, e.clientY - rect.top, b.color);
            }}
          >
            🫧
          </div>
        ))}
        {popEffects.map(ef => (
          <div key={ef.id} style={styles.popEffect(ef)}>
            +{10}{ef.bonus > 0 ? ` +${ef.bonus} STREAK!` : ''}
          </div>
        ))}

        {!running && !gameOver && (
          <div style={styles.overlay}>
            <div style={styles.overlayTitle}>Bubble Pop</div>
            <p style={{ color: '#9d6fef', marginBottom: '20px', textAlign: 'center', maxWidth: '280px' }}>
              Pop bubbles before they escape! If 12+ bubbles appear at once, game over!
            </p>
            <button style={styles.btn} onClick={startGame}>Start Game</button>
          </div>
        )}

        {gameOver && (
          <div style={styles.overlay}>
            <div style={styles.overlayTitle}>{timeLeft <= 0 ? "Time's Up!" : 'Too Many Bubbles!'}</div>
            <div style={styles.overlayScore}>Final Score: {score}</div>
            <div style={{ color: '#9d6fef', marginBottom: '20px' }}>Streak: {streak} pops</div>
            <button style={styles.btn} onClick={startGame}>Play Again</button>
          </div>
        )}
      </div>
    </div>
  );
}
