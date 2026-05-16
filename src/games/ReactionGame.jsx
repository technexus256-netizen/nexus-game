import { useState, useEffect, useRef } from 'react';

const GRADES = [
  { max: 200, label: '⚡ Pro', color: '#10B981' },
  { max: 300, label: '🚀 Fast', color: '#3B82F6' },
  { max: 500, label: '👍 Average', color: '#F59E0B' },
  { max: Infinity, label: '🐢 Slow', color: '#EF4444' },
];

const getGrade = (ms) => GRADES.find(g => ms < g.max);

const TOTAL_ROUNDS = 5;

export default function ReactionGame({ onScore }) {
  const [phase, setPhase] = useState('idle'); // idle | waiting | ready | result | done
  const [times, setTimes] = useState([]);
  const [currentTime, setCurrentTime] = useState(null);
  const [tooEarly, setTooEarly] = useState(false);
  const startRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const startRound = () => {
    setTooEarly(false);
    setCurrentTime(null);
    setPhase('waiting');
    const delay = 1000 + Math.random() * 3000;
    timerRef.current = setTimeout(() => {
      startRef.current = Date.now();
      setPhase('ready');
    }, delay);
  };

  const handleBoxClick = () => {
    if (phase === 'waiting') {
      clearTimeout(timerRef.current);
      setTooEarly(true);
      setPhase('idle');
      return;
    }
    if (phase === 'ready') {
      const elapsed = Date.now() - startRef.current;
      setCurrentTime(elapsed);
      const newTimes = [...times, elapsed];
      setTimes(newTimes);
      if (newTimes.length >= TOTAL_ROUNDS) {
        const avg = Math.round(newTimes.reduce((a, b) => a + b, 0) / newTimes.length);
        const score = Math.max(0, 1000 - avg);
        onScore && onScore(score);
        setPhase('done');
      } else {
        setPhase('result');
      }
    }
  };

  const reset = () => {
    setPhase('idle');
    setTimes([]);
    setCurrentTime(null);
    setTooEarly(false);
  };

  const avg = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null;
  const grade = avg !== null ? getGrade(avg) : null;

  const boxColor = {
    idle: '#1E1B4B',
    waiting: '#374151',
    ready: '#10B981',
    result: '#1E1B4B',
    done: '#1E1B4B',
  }[phase];

  const boxLabel = {
    idle: 'Press Ready to start',
    waiting: 'Wait for green...',
    ready: 'CLICK NOW! ⚡',
    result: 'Nice! Click Next Round',
    done: 'All done!',
  }[phase];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%' }}>
      {/* Round indicator */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
          <div key={i} style={{
            width: 28, height: 28, borderRadius: '50%',
            background: i < times.length ? '#7C3AED' : i === times.length ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.08)',
            border: `2px solid ${i <= times.length ? '#7C3AED' : 'rgba(255,255,255,0.12)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Fredoka One', cursive", fontSize: 12, color: '#fff',
            transition: 'all 0.3s',
          }}>
            {i < times.length ? '✓' : i + 1}
          </div>
        ))}
        <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 13, color: '#64748B', marginLeft: 8 }}>
          Round {Math.min(times.length + 1, TOTAL_ROUNDS)} / {TOTAL_ROUNDS}
        </div>
      </div>

      {/* Reaction box */}
      {phase !== 'done' && (
        <div
          onClick={handleBoxClick}
          style={{
            width: '100%', maxWidth: 380, height: 180, borderRadius: 24,
            background: boxColor,
            border: `3px solid ${phase === 'ready' ? '#10B981' : phase === 'waiting' ? '#374151' : 'rgba(124,58,237,0.4)'}`,
            boxShadow: phase === 'ready' ? '0 0 40px rgba(16,185,129,0.5)' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: ['waiting', 'ready'].includes(phase) ? 'pointer' : 'default',
            transition: 'all 0.15s',
            userSelect: 'none',
          }}
        >
          <div style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: phase === 'ready' ? 26 : 18,
            color: phase === 'ready' ? '#fff' : '#64748B',
            textAlign: 'center', padding: '0 20px',
          }}>
            {boxLabel}
          </div>
        </div>
      )}

      {/* Too early message */}
      {tooEarly && (
        <div style={{
          fontFamily: "'Exo 2', sans-serif", fontSize: 15, color: '#EF4444',
          background: 'rgba(239,68,68,0.1)', borderRadius: 12, padding: '8px 20px',
          border: '1px solid rgba(239,68,68,0.3)',
        }}>
          Too early! Wait for green 🚦
        </div>
      )}

      {/* Current result */}
      {currentTime !== null && phase !== 'done' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 32, color: '#A78BFA' }}>
            {currentTime}ms
          </div>
          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 14, color: getGrade(currentTime).color }}>
            {getGrade(currentTime).label}
          </div>
        </div>
      )}

      {/* Past times */}
      {times.length > 0 && phase !== 'done' && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {times.map((t, i) => (
            <div key={i} style={{
              background: 'rgba(124,58,237,0.15)', borderRadius: 10, padding: '4px 12px',
              fontFamily: "'Exo 2', sans-serif", fontSize: 13, color: '#A78BFA',
              border: '1px solid rgba(124,58,237,0.3)',
            }}>
              #{i + 1}: {t}ms
            </div>
          ))}
        </div>
      )}

      {/* Buttons */}
      {phase === 'idle' && !tooEarly && (
        <button
          onClick={startRound}
          style={{
            border: 'none', borderRadius: 14, padding: '12px 36px', cursor: 'pointer',
            fontFamily: "'Fredoka One', cursive", fontSize: 18,
            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
            color: '#fff', boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
          }}
        >
          {times.length === 0 ? '▶ Ready' : '▶ Next Round'}
        </button>
      )}

      {tooEarly && (
        <button
          onClick={startRound}
          style={{
            border: 'none', borderRadius: 14, padding: '12px 36px', cursor: 'pointer',
            fontFamily: "'Fredoka One', cursive", fontSize: 18,
            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
            color: '#fff', boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
          }}
        >
          Try Again
        </button>
      )}

      {phase === 'result' && (
        <button
          onClick={startRound}
          style={{
            border: 'none', borderRadius: 14, padding: '12px 36px', cursor: 'pointer',
            fontFamily: "'Fredoka One', cursive", fontSize: 18,
            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
            color: '#fff', boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
          }}
        >
          Next Round ▶
        </button>
      )}

      {/* Done screen */}
      {phase === 'done' && avg !== null && (
        <div style={{
          textAlign: 'center', width: '100%',
          background: 'rgba(15,10,40,0.8)', borderRadius: 24, padding: 28,
          border: '2px solid rgba(124,58,237,0.4)',
        }}>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: '#A78BFA', marginBottom: 8 }}>
            Results
          </div>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 48, color: grade.color, marginBottom: 4 }}>
            {avg}ms
          </div>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: grade.color, marginBottom: 16 }}>
            {grade.label}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 }}>
            {times.map((t, i) => (
              <div key={i} style={{
                background: 'rgba(124,58,237,0.15)', borderRadius: 10, padding: '4px 12px',
                fontFamily: "'Exo 2', sans-serif", fontSize: 13, color: '#A78BFA',
                border: '1px solid rgba(124,58,237,0.3)',
              }}>
                #{i + 1}: {t}ms
              </div>
            ))}
          </div>
          <button
            onClick={reset}
            style={{
              border: 'none', borderRadius: 14, padding: '12px 36px', cursor: 'pointer',
              fontFamily: "'Fredoka One', cursive", fontSize: 18,
              background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
              color: '#fff', boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
