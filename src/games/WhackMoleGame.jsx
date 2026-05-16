import { useState, useEffect, useRef, useCallback } from 'react';

const GAME_TIME = 30;
const HOLES = 9;
const MOLE_VISIBLE = 800;
const MOLE_INTERVAL = 1000;

export default function WhackMoleGame({ onScore }) {
  const [phase, setPhase] = useState('idle'); // idle | playing | over
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [moles, setMoles] = useState(Array(HOLES).fill(false));
  const [whacked, setWhacked] = useState(Array(HOLES).fill(false));
  const timerRef = useRef(null);
  const moleTimerRef = useRef(null);
  const moleHideTimers = useRef([]);
  const phaseRef = useRef('idle');

  useEffect(() => { phaseRef.current = phase; }, [phase]);

  const clearAll = () => {
    clearInterval(timerRef.current);
    clearInterval(moleTimerRef.current);
    moleHideTimers.current.forEach(clearTimeout);
    moleHideTimers.current = [];
  };

  const spawnMole = useCallback(() => {
    if (phaseRef.current !== 'playing') return;
    const hole = Math.floor(Math.random() * HOLES);
    setMoles(m => {
      if (m[hole]) return m;
      const next = [...m];
      next[hole] = true;
      return next;
    });
    const t = setTimeout(() => {
      setMoles(m => { const next = [...m]; next[hole] = false; return next; });
    }, MOLE_VISIBLE);
    moleHideTimers.current.push(t);
  }, []);

  const start = () => {
    clearAll();
    setScore(0);
    setTimeLeft(GAME_TIME);
    setMoles(Array(HOLES).fill(false));
    setWhacked(Array(HOLES).fill(false));
    setPhase('playing');
    phaseRef.current = 'playing';

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearAll();
          setPhase('over');
          phaseRef.current = 'over';
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    moleTimerRef.current = setInterval(spawnMole, MOLE_INTERVAL);
  };

  useEffect(() => {
    if (phase === 'over') {
      setMoles(Array(HOLES).fill(false));
      onScore && onScore(score);
    }
  }, [phase]);

  useEffect(() => () => clearAll(), []);

  const whack = (i) => {
    if (phase !== 'playing' || !moles[i]) return;
    setMoles(m => { const next = [...m]; next[i] = false; return next; });
    setWhacked(w => { const next = [...w]; next[i] = true; return next; });
    setScore(s => s + 10);
    setTimeout(() => setWhacked(w => { const next = [...w]; next[i] = false; return next; }), 300);
  };

  const timerPct = (timeLeft / GAME_TIME) * 100;
  const timerColor = timeLeft > 15 ? '#10B981' : timeLeft > 8 ? '#F59E0B' : '#EF4444';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}>
      {/* Score and timer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 32, color: '#EC4899' }}>{score}</div>
          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 11, color: '#64748B', textTransform: 'uppercase' }}>Score</div>
        </div>
        <div style={{
          fontFamily: "'Fredoka One', cursive", fontSize: 18, color: '#A78BFA',
          background: 'rgba(124,58,237,0.15)', borderRadius: 12, padding: '6px 18px',
          border: '1px solid rgba(124,58,237,0.3)',
        }}>
          🔨 Whack-a-Mole!
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 32, color: timerColor }}>{timeLeft}</div>
          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 11, color: '#64748B', textTransform: 'uppercase' }}>Secs</div>
        </div>
      </div>

      {/* Timer bar */}
      {phase === 'playing' && (
        <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
          <div style={{
            width: `${timerPct}%`, height: '100%', borderRadius: 99,
            background: timerColor, transition: 'width 1s linear, background 0.5s',
          }} />
        </div>
      )}

      {/* Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14,
        padding: 20, background: 'rgba(15,10,40,0.6)', borderRadius: 24,
        border: '1px solid rgba(124,58,237,0.3)',
      }}>
        {Array.from({ length: HOLES }).map((_, i) => {
          const hasMole = moles[i];
          const justWhacked = whacked[i];
          return (
            <div
              key={i}
              onClick={() => whack(i)}
              style={{
                width: 88, height: 88,
                borderRadius: 18,
                background: hasMole
                  ? justWhacked ? 'rgba(236,72,153,0.4)' : 'rgba(124,58,237,0.35)'
                  : 'rgba(15,10,40,0.8)',
                border: `2px solid ${hasMole ? (justWhacked ? '#EC4899' : '#7C3AED') : 'rgba(124,58,237,0.25)'}`,
                cursor: hasMole ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: hasMole ? 42 : 24,
                transition: 'all 0.1s',
                boxShadow: hasMole ? `0 0 20px ${justWhacked ? 'rgba(236,72,153,0.5)' : 'rgba(124,58,237,0.4)'}` : 'none',
                transform: hasMole ? (justWhacked ? 'scale(0.9)' : 'scale(1.05)') : 'scale(1)',
                userSelect: 'none',
              }}
            >
              {hasMole ? (justWhacked ? '💥' : '🐭') : '⭕'}
            </div>
          );
        })}
      </div>

      {/* Idle state */}
      {phase === 'idle' && (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 14, color: '#64748B' }}>
            Whack the moles as they pop up! +10 per mole
          </div>
          <button onClick={start} style={{
            border: 'none', borderRadius: 14, padding: '12px 40px', cursor: 'pointer',
            fontFamily: "'Fredoka One', cursive", fontSize: 18,
            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
            color: '#fff', boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
          }}>
            ▶ Start Game
          </button>
        </div>
      )}

      {/* Game over */}
      {phase === 'over' && (
        <div style={{
          textAlign: 'center', width: '100%',
          background: 'rgba(15,10,40,0.85)', borderRadius: 24, padding: '24px 32px',
          border: '2px solid rgba(124,58,237,0.4)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: '#A78BFA' }}>Time's Up! 🕐</div>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 52, color: '#EC4899' }}>{score}</div>
          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 14, color: '#64748B' }}>
            {score === 0 ? 'Better luck next time!' : score < 50 ? 'Good try!' : score < 100 ? 'Nice job!' : 'Amazing! 🏆'}
          </div>
          <button onClick={start} style={{
            border: 'none', borderRadius: 14, padding: '12px 40px', cursor: 'pointer',
            fontFamily: "'Fredoka One', cursive", fontSize: 18,
            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
            color: '#fff', boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
          }}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
