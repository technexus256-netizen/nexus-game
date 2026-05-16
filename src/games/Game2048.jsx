import { useState, useEffect, useCallback } from 'react';

const TILE_COLORS = {
  2: { bg: '#eee4da', text: '#776e65' },
  4: { bg: '#ede0c8', text: '#776e65' },
  8: { bg: '#f2b179', text: '#fff' },
  16: { bg: '#f59563', text: '#fff' },
  32: { bg: '#f67c5f', text: '#fff' },
  64: { bg: '#f65e3b', text: '#fff' },
  128: { bg: '#edcf72', text: '#fff' },
  256: { bg: '#edcc61', text: '#fff' },
  512: { bg: '#edc850', text: '#fff' },
  1024: { bg: '#edc53f', text: '#fff' },
  2048: { bg: '#edc22e', text: '#fff' },
};

function createEmptyGrid() {
  return Array(4).fill(null).map(() => Array(4).fill(0));
}

function addRandomTile(grid) {
  const empty = [];
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++)
      if (grid[r][c] === 0) empty.push([r, c]);
  if (empty.length === 0) return grid;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const newGrid = grid.map(row => [...row]);
  newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newGrid;
}

function initGrid() {
  let g = createEmptyGrid();
  g = addRandomTile(g);
  g = addRandomTile(g);
  return g;
}

function slideRow(row) {
  const nums = row.filter(x => x !== 0);
  let score = 0;
  const merged = [];
  let i = 0;
  while (i < nums.length) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      const val = nums[i] * 2;
      merged.push(val);
      score += val;
      i += 2;
    } else {
      merged.push(nums[i]);
      i++;
    }
  }
  while (merged.length < 4) merged.push(0);
  return { row: merged, score };
}

function moveLeft(grid) {
  let score = 0;
  const newGrid = grid.map(row => {
    const { row: r, score: s } = slideRow(row);
    score += s;
    return r;
  });
  return { grid: newGrid, score };
}

function rotateGrid(grid) {
  return grid[0].map((_, i) => grid.map(row => row[i]).reverse());
}

function move(grid, direction) {
  let g = grid.map(r => [...r]);
  let rotations = 0;
  if (direction === 'ArrowRight') rotations = 2;
  if (direction === 'ArrowUp') rotations = 3;
  if (direction === 'ArrowDown') rotations = 1;
  for (let i = 0; i < rotations; i++) g = rotateGrid(g);
  const { grid: moved, score } = moveLeft(g);
  let result = moved;
  for (let i = 0; i < (4 - rotations) % 4; i++) result = rotateGrid(result);
  const changed = JSON.stringify(result) !== JSON.stringify(grid);
  return { grid: result, score, changed };
}

function hasMovesLeft(grid) {
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) return true;
      if (c + 1 < 4 && grid[r][c] === grid[r][c + 1]) return true;
      if (r + 1 < 4 && grid[r][c] === grid[r + 1][c]) return true;
    }
  return false;
}

function has2048(grid) {
  return grid.some(row => row.some(v => v === 2048));
}

export default function Game2048({ onScore }) {
  const [grid, setGrid] = useState(initGrid);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [wonFired, setWonFired] = useState(false);

  const handleKey = useCallback((e) => {
    if (gameOver || won) return;
    const dirs = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    if (!dirs.includes(e.key)) return;
    e.preventDefault();
    setGrid(prev => {
      const { grid: newGrid, score: gained, changed } = move(prev, e.key);
      if (!changed) return prev;
      const withTile = addRandomTile(newGrid);
      setScore(s => {
        const ns = s + gained;
        return ns;
      });
      if (has2048(withTile) && !wonFired) {
        setWon(true);
        setWonFired(true);
        setScore(s => { onScore(s + gained); return s + gained; });
      } else if (!hasMovesLeft(withTile)) {
        setGameOver(true);
        setScore(s => { onScore(s + gained); return s + gained; });
      }
      return withTile;
    });
  }, [gameOver, won, wonFired, onScore]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  function newGame() {
    setGrid(initGrid());
    setScore(0);
    setGameOver(false);
    setWon(false);
    setWonFired(false);
  }

  const styles = {
    container: {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100%', padding: '20px',
      fontFamily: "'Exo 2', sans-serif", color: '#fff',
      background: '#040814',
    },
    title: {
      fontFamily: "'Fredoka One', cursive", fontSize: '3rem',
      background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      marginBottom: '10px',
    },
    scoreBox: {
      display: 'flex', gap: '16px', marginBottom: '16px',
    },
    scorePill: {
      background: '#1a0a2e', border: '1px solid #7C3AED',
      borderRadius: '10px', padding: '8px 20px', textAlign: 'center',
    },
    scoreLabel: { fontSize: '0.7rem', color: '#9d6fef', textTransform: 'uppercase', letterSpacing: '1px' },
    scoreVal: { fontSize: '1.5rem', fontWeight: '700', color: '#EC4899' },
    grid: {
      display: 'grid', gridTemplateColumns: 'repeat(4, 90px)',
      gridTemplateRows: 'repeat(4, 90px)', gap: '10px',
      background: '#1a0a2e', padding: '12px', borderRadius: '12px',
      border: '2px solid #7C3AED',
    },
    cell: (val) => ({
      width: '90px', height: '90px', borderRadius: '8px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Fredoka One', cursive",
      fontSize: val >= 1024 ? '1.3rem' : val >= 128 ? '1.6rem' : '2rem',
      fontWeight: '700',
      background: TILE_COLORS[val]?.bg || '#3d1a5e',
      color: TILE_COLORS[val]?.text || '#ccc',
      boxShadow: val >= 2048 ? '0 0 20px #edc22e' : val >= 128 ? '0 0 8px rgba(237,207,114,0.5)' : 'none',
      transition: 'all 0.1s ease',
    }),
    btn: {
      marginTop: '20px', padding: '10px 30px',
      background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
      border: 'none', borderRadius: '25px', color: '#fff',
      fontFamily: "'Fredoka One', cursive", fontSize: '1.1rem',
      cursor: 'pointer', letterSpacing: '1px',
    },
    overlay: {
      position: 'fixed', inset: 0, background: 'rgba(4,8,20,0.85)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', zIndex: 10,
    },
    overlayTitle: {
      fontFamily: "'Fredoka One', cursive", fontSize: '3rem',
      color: '#EC4899', marginBottom: '12px',
    },
    overlayScore: { fontSize: '1.5rem', color: '#7C3AED', marginBottom: '20px' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>2048</div>
      <div style={styles.scoreBox}>
        <div style={styles.scorePill}>
          <div style={styles.scoreLabel}>Score</div>
          <div style={styles.scoreVal}>{score}</div>
        </div>
      </div>
      <div style={styles.grid}>
        {grid.map((row, r) =>
          row.map((val, c) => (
            <div key={`${r}-${c}`} style={styles.cell(val)}>
              {val !== 0 ? val : ''}
            </div>
          ))
        )}
      </div>
      <button style={styles.btn} onClick={newGame}>New Game</button>
      <p style={{ color: '#555', fontSize: '0.8rem', marginTop: '10px' }}>Use arrow keys to move tiles</p>

      {(gameOver || won) && (
        <div style={styles.overlay}>
          <div style={styles.overlayTitle}>{won ? 'You Win! 🎉' : 'Game Over!'}</div>
          <div style={styles.overlayScore}>Score: {score}</div>
          <button style={styles.btn} onClick={newGame}>Play Again</button>
        </div>
      )}
    </div>
  );
}
