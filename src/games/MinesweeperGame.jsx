import { useState, useEffect, useRef } from 'react';

const ROWS = 9, COLS = 9, MINES = 10;

function createEmptyBoard() {
  return Array(ROWS).fill(null).map((_, r) =>
    Array(COLS).fill(null).map((_, c) => ({
      r, c, mine: false, revealed: false, flagged: false, adjacent: 0,
    }))
  );
}

function placeMines(board, safeR, safeC) {
  const safe = new Set();
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      const nr = safeR + dr, nc = safeC + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS)
        safe.add(`${nr},${nc}`);
    }
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!board[r][c].mine && !safe.has(`${r},${c}`)) {
      board[r][c].mine = true;
      placed++;
    }
  }
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].mine)
            count++;
        }
      board[r][c].adjacent = count;
    }
  return board;
}

function floodReveal(board, r, c) {
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
  const cell = board[r][c];
  if (cell.revealed || cell.flagged || cell.mine) return;
  cell.revealed = true;
  if (cell.adjacent === 0) {
    for (let dr = -1; dr <= 1; dr++)
      for (let dc = -1; dc <= 1; dc++)
        if (dr !== 0 || dc !== 0) floodReveal(board, r + dr, c + dc);
  }
}

function checkWin(board) {
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const cell = board[r][c];
      if (!cell.mine && !cell.revealed) return false;
    }
  return true;
}

const NUM_COLORS = { 1: '#3b82f6', 2: '#22c55e', 3: '#ef4444', 4: '#1e40af', 5: '#b91c1c', 6: '#0891b2', 7: '#7c3aed', 8: '#374151' };

export default function MinesweeperGame({ onScore }) {
  const [board, setBoard] = useState(createEmptyBoard);
  const [gameState, setGameState] = useState('idle'); // idle, playing, won, lost
  const [flagCount, setFlagCount] = useState(0);
  const [time, setTime] = useState(0);
  const [boardReady, setBoardReady] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  function newGame() {
    clearInterval(timerRef.current);
    setBoard(createEmptyBoard());
    setGameState('idle');
    setFlagCount(0);
    setTime(0);
    setBoardReady(false);
  }

  function handleReveal(r, c) {
    if (gameState === 'won' || gameState === 'lost') return;
    setBoard(prev => {
      const cell = prev[r][c];
      if (cell.revealed || cell.flagged) return prev;

      let newBoard = prev.map(row => row.map(cell => ({ ...cell })));

      if (!boardReady) {
        newBoard = placeMines(newBoard, r, c);
        setBoardReady(true);
        setGameState('playing');
      }

      if (newBoard[r][c].mine) {
        // Reveal all mines
        for (let row = 0; row < ROWS; row++)
          for (let col = 0; col < COLS; col++)
            if (newBoard[row][col].mine) newBoard[row][col].revealed = true;
        setGameState('lost');
        return newBoard;
      }

      floodReveal(newBoard, r, c);
      if (checkWin(newBoard)) {
        setGameState('won');
        onScore(100);
      }
      return newBoard;
    });
  }

  function handleFlag(e, r, c) {
    e.preventDefault();
    if (gameState === 'won' || gameState === 'lost') return;
    setBoard(prev => {
      const cell = prev[r][c];
      if (cell.revealed) return prev;
      const newBoard = prev.map(row => row.map(c => ({ ...c })));
      newBoard[r][c].flagged = !newBoard[r][c].flagged;
      setFlagCount(fc => newBoard[r][c].flagged ? fc + 1 : fc - 1);
      return newBoard;
    });
  }

  const styles = {
    container: {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '500px', padding: '20px',
      fontFamily: "'Exo 2', sans-serif", color: '#fff', background: '#040814',
      userSelect: 'none',
    },
    title: {
      fontFamily: "'Fredoka One', cursive", fontSize: '2.2rem',
      background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      marginBottom: '16px',
    },
    header: { display: 'flex', gap: '20px', marginBottom: '16px', alignItems: 'center' },
    statPill: {
      background: '#1a0a2e', border: '1px solid #7C3AED',
      borderRadius: '10px', padding: '8px 16px', textAlign: 'center',
    },
    statLabel: { fontSize: '0.6rem', color: '#9d6fef', textTransform: 'uppercase', letterSpacing: '1px' },
    statVal: { fontSize: '1.3rem', fontWeight: '700', color: '#EC4899' },
    grid: {
      display: 'grid',
      gridTemplateColumns: `repeat(${COLS}, 38px)`,
      gap: '3px', padding: '12px',
      background: '#1a0a2e', borderRadius: '12px',
      border: '2px solid #7C3AED',
      marginBottom: '16px',
    },
    cell: (cell, gameState) => {
      const isLostMine = gameState === 'lost' && cell.mine && cell.revealed;
      return {
        width: '38px', height: '38px', borderRadius: '5px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1rem', fontWeight: '700', cursor: 'pointer',
        background: cell.revealed
          ? (isLostMine ? '#b91c1c' : '#0d0520')
          : '#2d1a4e',
        border: cell.revealed ? '1px solid #1a0a2e' : '1px solid #4a2a7e',
        boxShadow: !cell.revealed ? 'inset 0 2px 0 rgba(255,255,255,0.1), 0 2px 0 rgba(0,0,0,0.5)' : 'none',
        color: cell.revealed && !cell.mine && cell.adjacent > 0 ? NUM_COLORS[cell.adjacent] : '#fff',
        transition: 'background 0.1s',
      };
    },
    btn: {
      padding: '10px 28px',
      background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
      border: 'none', borderRadius: '25px', color: '#fff',
      fontFamily: "'Fredoka One', cursive", fontSize: '1.1rem',
      cursor: 'pointer',
    },
    statusMsg: {
      fontFamily: "'Fredoka One', cursive", fontSize: '1.5rem',
      color: gameState === 'won' ? '#22c55e' : '#ef4444',
      marginBottom: '12px',
    },
    hint: { color: '#555', fontSize: '0.75rem', marginTop: '8px' },
  };

  function cellContent(cell) {
    if (cell.flagged && !cell.revealed) return '🚩';
    if (!cell.revealed) return '';
    if (cell.mine) return '💣';
    if (cell.adjacent === 0) return '';
    return cell.adjacent;
  }

  return (
    <div style={styles.container}>
      <div style={styles.title}>Minesweeper</div>
      {(gameState === 'won' || gameState === 'lost') && (
        <div style={styles.statusMsg}>{gameState === 'won' ? '🎉 You Win!' : '💥 Boom!'}</div>
      )}
      <div style={styles.header}>
        <div style={styles.statPill}>
          <div style={styles.statLabel}>Mines Left</div>
          <div style={styles.statVal}>💣 {MINES - flagCount}</div>
        </div>
        <div style={styles.statPill}>
          <div style={styles.statLabel}>Time</div>
          <div style={styles.statVal}>⏱ {time}s</div>
        </div>
        <button style={styles.btn} onClick={newGame}>New Game</button>
      </div>
      <div style={styles.grid}>
        {board.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              style={styles.cell(cell, gameState)}
              onClick={() => handleReveal(r, c)}
              onContextMenu={(e) => handleFlag(e, r, c)}
            >
              {cellContent(cell)}
            </div>
          ))
        )}
      </div>
      <div style={styles.hint}>Left click = reveal &nbsp;|&nbsp; Right click = flag</div>
    </div>
  );
}
