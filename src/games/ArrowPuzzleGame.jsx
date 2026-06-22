import { useState, useEffect, useRef, useCallback } from 'react';

/*
 * Arrow Puzzle — a tap puzzle.
 * The board is a grid of arrows, each pointing up/down/left/right.
 * Tap an arrow to fire it: if every cell between it and the edge it points
 * toward is empty, the arrow flies off the board and is removed. If the path
 * is blocked by another arrow, the move is invalid. Clear the whole board to win.
 *
 * Boards are generated in REVERSE (arrows added only where their path to the
 * edge is currently clear) which guarantees every generated level is solvable.
 */

const DIRS = {
  up:    { dr: -1, dc:  0, char: '↑' },
  down:  { dr:  1, dc:  0, char: '↓' },
  left:  { dr:  0, dc: -1, char: '←' },
  right: { dr:  0, dc:  1, char: '→' },
};
const DIR_KEYS = Object.keys(DIRS);

const LEVELS = {
  normal:   { label: 'Normal',    size: 12, arrows: 50,  color: '#22C55E' },
  medium:   { label: 'Medium',    size: 15, arrows: 90,  color: '#F59E0B' },
  hard:     { label: 'Hard',      size: 18, arrows: 135, color: '#EF4444' },
  veryhard: { label: 'Very Hard', size: 20, arrows: 175, color: '#A21CAF' },
};

const key = (r, c) => `${r},${c}`;

/* True if the straight path from (r,c) toward the edge in `dir` is empty. */
function pathClear(arrows, size, r, c, dir) {
  const { dr, dc } = DIRS[dir];
  let nr = r + dr, nc = c + dc;
  while (nr >= 0 && nr < size && nc >= 0 && nc < size) {
    if (arrows.has(key(nr, nc))) return false;
    nr += dr; nc += dc;
  }
  return true;
}

/* Reverse-construct a solvable board: only place an arrow where it could
   currently fly off, so the placement order is a valid (reversed) solution. */
function generateBoard(size, target) {
  const arrows = new Map(); // "r,c" -> dir
  let attempts = 0;
  const maxAttempts = target * 150;
  while (arrows.size < target && attempts < maxAttempts) {
    attempts++;
    const r = Math.floor(Math.random() * size);
    const c = Math.floor(Math.random() * size);
    if (arrows.has(key(r, c))) continue;
    // Directions whose path to the edge is clear right now, in random order.
    const choices = DIR_KEYS
      .filter(d => pathClear(arrows, size, r, c, d))
      .sort(() => Math.random() - 0.5);
    if (choices.length === 0) continue;
    arrows.set(key(r, c), choices[0]);
  }
  return arrows;
}

export default function ArrowPuzzleGame({ onScore }) {
  const [difficulty, setDifficulty] = useState('normal');
  const [arrows, setArrows]   = useState(() => new Map());
  const [moves, setMoves]     = useState(0);
  const [score, setScore]     = useState(0);
  const [won, setWon]         = useState(false);
  const [shake, setShake]     = useState(null);   // key of arrow that buzzed
  const [flying, setFlying]   = useState(null);    // { key, dir } animating out
  const flyTimer = useRef(null);

  const conf = LEVELS[difficulty];

  const start = useCallback((diff) => {
    const c = LEVELS[diff];
    clearTimeout(flyTimer.current);
    setArrows(generateBoard(c.size, c.arrows));
    setMoves(0);
    setScore(0);
    setWon(false);
    setShake(null);
    setFlying(null);
  }, []);

  // Build the first board (and rebuild on difficulty change).
  useEffect(() => { start(difficulty); }, [difficulty, start]);
  useEffect(() => () => clearTimeout(flyTimer.current), []);

  function tap(r, c) {
    if (won || flying) return;
    const k = key(r, c);
    const dir = arrows.get(k);
    if (!dir) return;

    if (!pathClear(arrows, conf.size, r, c, dir)) {
      // Blocked — buzz the arrow.
      setShake(k);
      setTimeout(() => setShake(s => (s === k ? null : s)), 320);
      return;
    }

    // Valid move — animate the arrow flying off, then remove it.
    setFlying({ key: k, dir });
    flyTimer.current = setTimeout(() => {
      setArrows(prev => {
        const next = new Map(prev);
        next.delete(k);
        const remaining = next.size;
        const gained = 10 + remaining; // earlier clears (more left) score more
        setScore(s => {
          const total = s + gained;
          if (remaining === 0) {
            const bonus = conf.arrows * 15;
            const finalScore = total + bonus;
            setWon(true);
            onScore(finalScore);
            return finalScore;
          }
          return total;
        });
        return next;
      });
      setMoves(m => m + 1);
      setFlying(null);
    }, 240);
  }

  const remaining = arrows.size;

  // Make the board fill as much of the (full) page as possible while staying square.
  const GRID_PX = `min(96vw, 82vh, ${conf.size * 46}px)`;

  const s = {
    wrap: {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      fontFamily: "'Exo 2', sans-serif", color: '#fff', background: '#040814',
      padding: '18px', minHeight: 480, userSelect: 'none', width: '100%',
    },
    title: {
      fontFamily: "'Fredoka One', cursive", fontSize: '2rem', margin: '0 0 4px',
      background: 'linear-gradient(135deg, #0EA5E9, #7C3AED)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    },
    sub: { fontSize: 12, color: '#64748B', marginBottom: 14 },
    diffRow: { display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center' },
    diffBtn: (k) => ({
      padding: '7px 18px', borderRadius: 10, cursor: 'pointer',
      fontFamily: "'Fredoka One', cursive", fontSize: 13,
      background: difficulty === k ? LEVELS[k].color : 'rgba(15,12,41,0.8)',
      border: `1px solid ${difficulty === k ? 'transparent' : 'rgba(124,58,237,0.3)'}`,
      color: difficulty === k ? '#04121e' : '#94A3B8', transition: 'all 0.18s',
    }),
    stats: { display: 'flex', gap: 12, marginBottom: 16 },
    pill: {
      background: '#150a2a', border: '1px solid #7C3AED', borderRadius: 10,
      padding: '6px 16px', textAlign: 'center', minWidth: 72,
    },
    pLabel: { fontSize: 10, color: '#9d6fef', textTransform: 'uppercase', letterSpacing: 1 },
    pVal: { fontSize: '1.25rem', fontWeight: 700, color: '#38BDF8' },
    grid: {
      display: 'grid', gap: conf.size > 14 ? 3 : 4, padding: 8, position: 'relative',
      gridTemplateColumns: `repeat(${conf.size}, 1fr)`,
      background: '#150a2a', border: `2px solid ${conf.color}`, borderRadius: 14,
      width: GRID_PX, height: GRID_PX, boxSizing: 'border-box',
    },
    cell: (k, dir) => {
      const isShake  = shake === k;
      const isFlying = flying && flying.key === k;
      let transform = 'translate(0,0) scale(1)';
      if (isFlying) {
        const { dr, dc } = DIRS[flying.dir];
        transform = `translate(${dc * 240}%, ${dr * 240}%) scale(0.4)`;
      }
      return {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: conf.size > 14 ? 4 : 7, aspectRatio: '1 / 1',
        background: dir
          ? `linear-gradient(160deg, ${conf.color}33, rgba(124,58,237,0.12))`
          : 'rgba(255,255,255,0.025)',
        border: dir ? `1px solid ${conf.color}66` : '1px solid rgba(255,255,255,0.05)',
        boxShadow: dir ? `inset 0 1px 0 rgba(255,255,255,0.12)` : 'none',
        cursor: dir ? 'pointer' : 'default',
        fontSize: `calc(${GRID_PX} / ${conf.size} * 0.62)`,
        fontWeight: 700, color: '#fff', lineHeight: 1,
        transform, opacity: isFlying ? 0 : 1,
        transition: isFlying ? 'transform 0.24s ease-in, opacity 0.24s ease-in' : 'transform 0.12s',
        animation: isShake ? 'apShake 0.3s' : 'none',
      };
    },
    btn: {
      marginTop: 18, padding: '10px 28px',
      background: 'linear-gradient(135deg, #7C3AED, #EC4899)', border: 'none',
      borderRadius: 22, color: '#fff', fontFamily: "'Fredoka One', cursive",
      fontSize: '1rem', cursor: 'pointer',
    },
    winMsg: {
      fontFamily: "'Fredoka One', cursive", fontSize: '1.4rem',
      color: '#22C55E', marginBottom: 10,
    },
    hint: { color: '#475569', fontSize: 12, marginTop: 14, maxWidth: 360, textAlign: 'center', lineHeight: 1.6 },
  };

  const cells = [];
  for (let r = 0; r < conf.size; r++)
    for (let c = 0; c < conf.size; c++) {
      const k = key(r, c);
      const dir = arrows.get(k);
      cells.push(
        <div key={k} style={s.cell(k, dir)} onClick={() => tap(r, c)}>
          {dir ? DIRS[dir].char : ''}
        </div>
      );
    }

  return (
    <div style={s.wrap}>
      <style>{`
        @keyframes apShake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>

      <h2 style={s.title}>Arrow Puzzle</h2>
      <div style={s.sub}>Tap an arrow to fire it off the board — clear them all!</div>

      <div style={s.diffRow}>
        {Object.keys(LEVELS).map(k => (
          <button key={k} style={s.diffBtn(k)} onClick={() => setDifficulty(k)}>
            {LEVELS[k].label}
          </button>
        ))}
      </div>

      <div style={s.stats}>
        <div style={s.pill}><div style={s.pLabel}>Left</div><div style={s.pVal}>{remaining}</div></div>
        <div style={s.pill}><div style={s.pLabel}>Moves</div><div style={s.pVal}>{moves}</div></div>
        <div style={s.pill}><div style={s.pLabel}>Score</div><div style={s.pVal}>{score}</div></div>
      </div>

      {won && <div style={s.winMsg}>🎉 Solved in {moves} moves!</div>}

      <div style={s.grid}>{cells}</div>

      <button style={s.btn} onClick={() => start(difficulty)}>
        {won ? '🔄 Play Again' : '↻ New Puzzle'}
      </button>

      <div style={s.hint}>
        An arrow can only fire if every cell between it and the edge it points at is empty.
        Blocked arrows buzz — clear a path first, then fire.
      </div>
    </div>
  );
}
