import { useState, useEffect, useRef } from 'react';

function getGrade(clicks) {
  if (clicks > 100) return { label: 'Legend', color: '#edc22e', emoji: '👑' };
  if (clicks > 60) return { label: 'Pro', color: '#7C3AED', emoji: '⚡' };
  if (clicks > 30) return { label: 'Good', color: '#22c55e', emoji: '👍' };
  return { label: 'Try Again', color: '#9d6fef', emoji: '💪' };
}

const TOTAL_TIME = 10;

export default function SpeedClickGame({ onScore }) {
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [pressed, setPressed] = useState(false);
  const timerRef = useRef(null);
  const clicksRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setRunning(false);
          setFinished(true);
          onScore(clicksRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [running, onScore]);

  function startGame() {
    setClicks(0);
    clicksRef.current = 0;
    setTimeLeft(TOTAL_TIME);
    setFinished(false);
    setRunning(true);
  }

  function handleClick() {
    if (!running) return;
    setClicks(c => {
      const nc = c + 1;
      clicksRef.current = nc;
      return nc;
    });
    setPressed(true);
    setTimeout(() => setPressed(false), 80);
  }

  const cps = running ? (clicks / (TOTAL_TIME - timeLeft + 0.001)).toFixed(1) : 0;
  const grade = getGrade(clicks);
  const progress = ((TOTAL_TIME - timeLeft) / TOTAL_TIME) * 100;

  const styles = {
    container: {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '500px', padding: '30px 20px',
      fontFamily: "'Exo 2', sans-serif", color: '#fff', background: '#040814',
    },
    title: {
      fontFamily: "'Fredoka One', cursive", fontSize: '2.5rem',
      background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      marginBottom: '24px',
    },
    statsRow: { display: 'flex', gap: '16px', marginBottom: '30px' },
    statBox: {
      background: '#1a0a2e', border: '1px solid #7C3AED',
      borderRadius: '10px', padding: '10px 20px', textAlign: 'center', minWidth: '80px',
    },
    statLabel: { fontSize: '0.65rem', color: '#9d6fef', textTransform: 'uppercase', letterSpacing: '1px' },
    statVal: { fontSize: '1.6rem', fontWeight: '700', color: '#EC4899' },
    clickBtn: {
      width: pressed ? '200px' : '220px',
      height: pressed ? '200px' : '220px',
      borderRadius: '50%',
      background: pressed
        ? 'linear-gradient(135deg, #EC4899, #7C3AED)'
        : 'linear-gradient(135deg, #7C3AED, #EC4899)',
      border: 'none', color: '#fff',
      fontFamily: "'Fredoka One', cursive", fontSize: '1.5rem',
      cursor: running ? 'pointer' : 'default',
      boxShadow: pressed
        ? '0 0 20px rgba(236,72,153,0.8), inset 0 4px 0 rgba(0,0,0,0.3)'
        : '0 0 40px rgba(124,58,237,0.6), 0 8px 0 #4c1d95, inset 0 2px 0 rgba(255,255,255,0.2)',
      transform: pressed ? 'translateY(4px) scale(0.95)' : 'translateY(0) scale(1)',
      transition: 'all 0.08s ease',
      userSelect: 'none',
      marginBottom: '30px',
      letterSpacing: '1px',
    },
    progressBar: {
      width: '280px', height: '8px', background: '#1a0a2e',
      borderRadius: '4px', overflow: 'hidden', marginBottom: '16px',
    },
    progressFill: {
      height: '100%', borderRadius: '4px',
      width: `${progress}%`,
      background: 'linear-gradient(90deg, #7C3AED, #EC4899)',
      transition: 'width 1s linear',
    },
    timerText: {
      fontSize: '1rem', color: timeLeft <= 3 ? '#ef4444' : '#9d6fef',
      marginBottom: '24px',
    },
    btn: {
      padding: '12px 35px',
      background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
      border: 'none', borderRadius: '25px', color: '#fff',
      fontFamily: "'Fredoka One', cursive", fontSize: '1.2rem',
      cursor: 'pointer',
    },
    resultCard: {
      background: '#0d0520', border: '2px solid #7C3AED',
      borderRadius: '16px', padding: '30px 50px', textAlign: 'center',
      marginBottom: '24px',
    },
    gradeText: {
      fontFamily: "'Fredoka One', cursive", fontSize: '2.5rem',
      color: grade.color, marginBottom: '8px',
    },
    resultStats: { color: '#9d6fef', fontSize: '0.95rem' },
  };

  if (!running && !finished) {
    return (
      <div style={styles.container}>
        <div style={styles.title}>Speed Click</div>
        <p style={{ color: '#9d6fef', marginBottom: '30px', textAlign: 'center' }}>
          Click as fast as you can for 10 seconds!
        </p>
        <button style={{ ...styles.clickBtn, cursor: 'pointer' }} onClick={startGame}>
          CLICK TO<br />START!
        </button>
      </div>
    );
  }

  if (finished) {
    const finalCPS = (clicks / TOTAL_TIME).toFixed(1);
    return (
      <div style={styles.container}>
        <div style={styles.title}>Speed Click</div>
        <div style={styles.resultCard}>
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>{grade.emoji}</div>
          <div style={styles.gradeText}>{grade.label}!</div>
          <div style={{ fontSize: '2rem', color: '#EC4899', fontWeight: '700', marginBottom: '12px' }}>
            {clicks} Clicks
          </div>
          <div style={styles.resultStats}>
            {finalCPS} clicks per second
          </div>
        </div>
        <button style={styles.btn} onClick={startGame}>Play Again</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.title}>Speed Click</div>
      <div style={styles.statsRow}>
        <div style={styles.statBox}>
          <div style={styles.statLabel}>Clicks</div>
          <div style={styles.statVal}>{clicks}</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statLabel}>CPS</div>
          <div style={styles.statVal}>{cps}</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statLabel}>Time</div>
          <div style={{ ...styles.statVal, color: timeLeft <= 3 ? '#ef4444' : '#EC4899' }}>{timeLeft}s</div>
        </div>
      </div>
      <div style={styles.progressBar}><div style={styles.progressFill} /></div>
      <button style={styles.clickBtn} onClick={handleClick} onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)}>
        CLICK!<br />CLICK!<br />CLICK!
      </button>
    </div>
  );
}
