import { useState, useEffect, useRef, useCallback } from 'react';

const COLORS = [
  { id: 0, name: 'Red',    bg: '#EF4444', lit: '#FCA5A5', shadow: 'rgba(239,68,68,0.7)' },
  { id: 1, name: 'Blue',   bg: '#3B82F6', lit: '#93C5FD', shadow: 'rgba(59,130,246,0.7)' },
  { id: 2, name: 'Green',  bg: '#10B981', lit: '#6EE7B7', shadow: 'rgba(16,185,129,0.7)' },
  { id: 3, name: 'Yellow', bg: '#F59E0B', lit: '#FCD34D', shadow: 'rgba(245,158,11,0.7)' },
];

export default function SimonSaysGame({ onScore }) {
  const [phase, setPhase] = useState('idle'); // idle | showing | input | won | lost
  const [sequence, setSequence] = useState([]);
  const [playerSeq, setPlayerSeq] = useState([]);
  const [litIndex, setLitIndex] = useState(null);
  const [level, setLevel] = useState(0);
  const [flashId, setFlashId] = useState(null);
  const timeoutsRef = useRef([]);

  const clearAll = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const showSequence = useCallback((seq) => {
    setPhase('showing');
    setLitIndex(null);
    const delay = Math.max(300, 600 - seq.length * 20);
    const gap = Math.max(200, 400 - seq.length * 15);

    seq.forEach((colorId, i) => {
      const t1 = setTimeout(() => setLitIndex(colorId), i * (delay + gap));
      const t2 = setTimeout(() => setLitIndex(null), i * (delay + gap) + delay);
      timeoutsRef.current.push(t1, t2);
    });

    const done = setTimeout(() => {
      setPhase('input');
      setPlayerSeq([]);
    }, seq.length * (delay + gap) + 100);
    timeoutsRef.current.push(done);
  }, []);

  const startGame = () => {
    clearAll();
    const first = [Math.floor(Math.random() * 4)];
    setSequence(first);
    setLevel(1);
    setPlayerSeq([]);
    showSequence(first);
  };

  const handlePress = (colorId) => {
    if (phase !== 'input') return;

    // Flash the button
    setFlashId(colorId);
    setTimeout(() => setFlashId(null), 200);

    const newPlayerSeq = [...playerSeq, colorId];
    const idx = newPlayerSeq.length - 1;

    if (newPlayerSeq[idx] !== sequence[idx]) {
      // Wrong!
      setPhase('lost');
      onScore && onScore(level - 1);
      return;
    }

    if (newPlayerSeq.length === sequence.length) {
      // Completed sequence!
      setPlayerSeq([]);
      const nextSeq = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(nextSeq);
      const nextLevel = level + 1;
      setLevel(nextLevel);
      setTimeout(() => showSequence(nextSeq), 800);
    } else {
      setPlayerSeq(newPlayerSeq);
    }
  };

  useEffect(() => () => clearAll(), []);

  const btnStyle = (color, i) => {
    const isLit = litIndex === i || flashId === i;
    const borderRadii = ['24px 6px 6px 6px', '6px 24px 6px 6px', '6px 6px 6px 24px', '6px 6px 24px 6px'];
    return {
      width: 110, height: 110,
      background: isLit ? color.lit : color.bg,
      border: 'none', borderRadius: borderRadii[i],
      cursor: phase === 'input' ? 'pointer' : 'default',
      boxShadow: isLit ? `0 0 36px ${color.shadow}, 0 0 12px ${color.shadow}` : `0 2px 8px rgba(0,0,0,0.4)`,
      transition: 'all 0.1s',
      filter: isLit ? 'brightness(1.3)' : phase === 'showing' ? 'brightness(0.6)' : 'brightness(0.85)',
      transform: isLit ? 'scale(1.05)' : 'scale(1)',
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%' }}>
      {/* Level display */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 32, color: '#A78BFA' }}>
          {phase === 'idle' ? '—' : level}
        </div>
        <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 11, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 }}>
          Level
        </div>
      </div>

      {/* Status */}
      <div style={{
        fontFamily: "'Exo 2', sans-serif", fontSize: 14,
        color: phase === 'input' ? '#10B981' : phase === 'showing' ? '#F59E0B' : '#64748B',
        height: 22,
      }}>
        {phase === 'idle' && 'Press Start to play'}
        {phase === 'showing' && '👀 Watch the sequence...'}
        {phase === 'input' && '🎮 Your turn! Repeat the sequence'}
        {phase === 'lost' && ''}
        {phase === 'won' && ''}
      </div>

      {/* Progress */}
      {phase === 'input' && (
        <div style={{ display: 'flex', gap: 6 }}>
          {sequence.map((_, i) => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: '50%',
              background: i < playerSeq.length ? '#10B981' : 'rgba(255,255,255,0.15)',
              border: `2px solid ${i < playerSeq.length ? '#10B981' : 'rgba(255,255,255,0.2)'}`,
              transition: 'all 0.2s',
            }} />
          ))}
        </div>
      )}

      {/* 2x2 Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {COLORS.map((color, i) => (
          <button
            key={i}
            onClick={() => handlePress(i)}
            style={btnStyle(color, i)}
            aria-label={color.name}
          />
        ))}
      </div>

      {/* Color labels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: 230 }}>
        {COLORS.map((color, i) => (
          <div key={i} style={{
            textAlign: 'center', fontFamily: "'Exo 2', sans-serif", fontSize: 12,
            color: color.bg, textTransform: 'uppercase', letterSpacing: 1,
          }}>
            {color.name}
          </div>
        ))}
      </div>

      {/* Lost screen */}
      {phase === 'lost' && (
        <div style={{
          textAlign: 'center', background: 'rgba(239,68,68,0.1)',
          border: '2px solid rgba(239,68,68,0.4)', borderRadius: 16, padding: '16px 32px',
        }}>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: '#EF4444', marginBottom: 4 }}>
            Wrong! Game Over 💥
          </div>
          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 14, color: '#94A3B8' }}>
            You reached level {level - 1}
          </div>
        </div>
      )}

      {/* Start / Try Again button */}
      {(phase === 'idle' || phase === 'lost') && (
        <button
          onClick={startGame}
          style={{
            border: 'none', borderRadius: 14, padding: '12px 40px', cursor: 'pointer',
            fontFamily: "'Fredoka One', cursive", fontSize: 18,
            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
            color: '#fff', boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
          }}
        >
          {phase === 'idle' ? '▶ Start' : '↺ Play Again'}
        </button>
      )}
    </div>
  );
}
