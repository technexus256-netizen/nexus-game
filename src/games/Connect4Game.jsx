import { useState, useCallback } from 'react';
import GameBtn from '../components/GameBtn';

const ROWS = 6, COLS = 7;
const PLAYER = 1, AI = 2;
const COLORS = { 1: '#EF4444', 2: '#EAB308', 0: 'rgba(255,255,255,0.06)' };
const GLOW   = { 1: '#EF4444', 2: '#EAB308' };

function makeGrid() { return Array(ROWS).fill(null).map(() => Array(COLS).fill(0)); }

function checkWin(grid, player) {
  // horizontal
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c <= COLS - 4; c++)
      if ([0,1,2,3].every(i => grid[r][c+i] === player)) return true;
  // vertical
  for (let r = 0; r <= ROWS - 4; r++)
    for (let c = 0; c < COLS; c++)
      if ([0,1,2,3].every(i => grid[r+i][c] === player)) return true;
  // diagonal ↘
  for (let r = 0; r <= ROWS - 4; r++)
    for (let c = 0; c <= COLS - 4; c++)
      if ([0,1,2,3].every(i => grid[r+i][c+i] === player)) return true;
  // diagonal ↙
  for (let r = 0; r <= ROWS - 4; r++)
    for (let c = 3; c < COLS; c++)
      if ([0,1,2,3].every(i => grid[r+i][c-i] === player)) return true;
  return false;
}

function getWinCells(grid, player) {
  const dirs = [[0,1],[1,0],[1,1],[1,-1]];
  for (const [dr,dc] of dirs)
    for (let r=0;r<ROWS;r++)
      for (let c=0;c<COLS;c++) {
        const cells = [[r,c],[r+dr,c+dc],[r+2*dr,c+2*dc],[r+3*dr,c+3*dc]];
        if (cells.every(([rr,cc]) => rr>=0&&rr<ROWS&&cc>=0&&cc<COLS&&grid[rr][cc]===player))
          return cells.map(([rr,cc]) => `${rr}-${cc}`);
      }
  return [];
}

function dropPiece(grid, col, player) {
  const g = grid.map(r => [...r]);
  for (let r = ROWS - 1; r >= 0; r--) {
    if (g[r][col] === 0) { g[r][col] = player; return g; }
  }
  return null;
}

function scoreWindow(w, player) {
  const opp = player === AI ? PLAYER : AI;
  const p = w.filter(c=>c===player).length;
  const e = w.filter(c=>c===0).length;
  const o = w.filter(c=>c===opp).length;
  if (p===4) return 100; if (p===3&&e===1) return 5; if (p===2&&e===2) return 2;
  if (o===3&&e===1) return -4;
  return 0;
}

function evalGrid(grid) {
  let score = 0;
  // center
  const center = grid.map(r=>r[Math.floor(COLS/2)]);
  score += center.filter(c=>c===AI).length * 3;
  // horizontal
  for (let r=0;r<ROWS;r++) for(let c=0;c<=COLS-4;c++) score+=scoreWindow(grid[r].slice(c,c+4),AI);
  // vertical
  for (let c=0;c<COLS;c++) for(let r=0;r<=ROWS-4;r++) score+=scoreWindow([0,1,2,3].map(i=>grid[r+i][c]),AI);
  // diag
  for (let r=0;r<=ROWS-4;r++) for(let c=0;c<=COLS-4;c++) score+=scoreWindow([0,1,2,3].map(i=>grid[r+i][c+i]),AI);
  for (let r=0;r<=ROWS-4;r++) for(let c=3;c<COLS;c++) score+=scoreWindow([0,1,2,3].map(i=>grid[r+i][c-i]),AI);
  return score;
}

function validCols(grid) { return Array.from({length:COLS},(_,c)=>c).filter(c=>grid[0][c]===0); }

function minimax(grid, depth, alpha, beta, maximizing) {
  if (checkWin(grid, AI))     return 10000;
  if (checkWin(grid, PLAYER)) return -10000;
  const valid = validCols(grid);
  if (!valid.length || depth===0) return evalGrid(grid);
  if (maximizing) {
    let best=-Infinity;
    for (const c of valid) { const g=dropPiece(grid,c,AI); if(!g)continue; best=Math.max(best,minimax(g,depth-1,alpha,beta,false)); alpha=Math.max(alpha,best); if(alpha>=beta)break; }
    return best;
  } else {
    let best=Infinity;
    for (const c of valid) { const g=dropPiece(grid,c,PLAYER); if(!g)continue; best=Math.min(best,minimax(g,depth-1,alpha,beta,true)); beta=Math.min(beta,best); if(alpha>=beta)break; }
    return best;
  }
}

function bestAIMove(grid) {
  const valid = validCols(grid);
  let best=-Infinity, bestCol=valid[0];
  for (const c of valid) {
    const g=dropPiece(grid,c,AI); if(!g)continue;
    const score=minimax(g,4,-Infinity,Infinity,false);
    if (score>best){best=score;bestCol=c;}
  }
  return bestCol;
}

export default function Connect4Game({ onScore }) {
  const [grid,      setGrid]      = useState(makeGrid);
  const [turn,      setTurn]      = useState(PLAYER);
  const [status,    setStatus]    = useState('idle');   // idle playing won draw
  const [winner,    setWinner]    = useState(0);
  const [winCells,  setWinCells]  = useState([]);
  const [scores,    setScores]    = useState({p:0,ai:0,d:0});
  const [hover,     setHover]     = useState(null);
  const [thinking,  setThinking]  = useState(false);

  const reset = () => { setGrid(makeGrid()); setTurn(PLAYER); setStatus('playing'); setWinner(0); setWinCells([]); setThinking(false); };

  const drop = useCallback((col) => {
    if (status!=='playing'||turn!==PLAYER||thinking) return;
    if (grid[0][col]!==0) return;
    const ng = dropPiece(grid, col, PLAYER); if(!ng) return;
    if (checkWin(ng, PLAYER)) {
      setGrid(ng); setWinner(PLAYER); setWinCells(getWinCells(ng,PLAYER));
      setStatus('won'); setScores(s=>({...s,p:s.p+1})); onScore&&onScore(100); return;
    }
    if (!validCols(ng).length) { setGrid(ng); setStatus('draw'); setScores(s=>({...s,d:s.d+1})); return; }
    setGrid(ng); setTurn(AI); setThinking(true);
    setTimeout(()=>{
      const aiCol = bestAIMove(ng);
      const ng2 = dropPiece(ng, aiCol, AI);
      if (!ng2) { setThinking(false); return; }
      if (checkWin(ng2,AI)) {
        setGrid(ng2); setWinner(AI); setWinCells(getWinCells(ng2,AI));
        setStatus('won'); setScores(s=>({...s,ai:s.ai+1}));
      } else if (!validCols(ng2).length) {
        setGrid(ng2); setStatus('draw'); setScores(s=>({...s,d:s.d+1}));
      } else {
        setGrid(ng2); setTurn(PLAYER);
      }
      setThinking(false);
    }, 300);
  }, [grid, turn, status, thinking, onScore]);

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14,width:'100%'}}>
      {/* Score */}
      <div style={{display:'flex',gap:20}}>
        {[['You','p','#EF4444'],['AI','ai','#EAB308'],['Draw','d','#64748B']].map(([l,k,c])=>(
          <div key={k} style={{textAlign:'center'}}>
            <div style={{fontFamily:"'Fredoka One',cursive",fontSize:22,color:c}}>{scores[k]}</div>
            <div style={{fontFamily:"'Exo 2',sans-serif",fontSize:11,color:'#64748B'}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Status */}
      <div style={{fontFamily:"'Exo 2',sans-serif",fontSize:14,fontWeight:700,color:
        status==='won'?(winner===PLAYER?'#43E97B':'#FF6B35'):'#94A3B8'}}>
        {status==='idle'&&'Press START to play'}
        {status==='playing'&&(thinking?'🤔 AI thinking…':turn===PLAYER?'🔴 Your turn':'🟡 AI turn')}
        {status==='won'&&(winner===PLAYER?'🎉 You Win!':'🤖 AI Wins!')}
        {status==='draw'&&'🤝 Draw!'}
      </div>

      {/* Board */}
      <div style={{background:'#1e3a8a',borderRadius:16,padding:'10px 10px 14px',boxShadow:'0 8px 32px rgba(30,58,138,0.6)'}}>
        {/* Column click targets */}
        <div style={{display:'grid',gridTemplateColumns:`repeat(${COLS},1fr)`,gap:6,marginBottom:6}}>
          {Array.from({length:COLS},(_,c)=>(
            <div key={c} onClick={()=>drop(c)} onMouseEnter={()=>setHover(c)} onMouseLeave={()=>setHover(null)}
              style={{height:20,cursor:status==='playing'&&turn===PLAYER&&!thinking?'pointer':'default',display:'flex',justifyContent:'center',alignItems:'center'}}>
              {hover===c&&status==='playing'&&turn===PLAYER&&!thinking&&grid[0][c]===0&&(
                <div style={{width:20,height:20,borderRadius:'50%',background:'#EF4444',opacity:0.7}}/>
              )}
            </div>
          ))}
        </div>
        {/* Grid */}
        {grid.map((row,r)=>(
          <div key={r} style={{display:'grid',gridTemplateColumns:`repeat(${COLS},1fr)`,gap:6,marginBottom:6}}>
            {row.map((cell,c)=>{
              const isWin = winCells.includes(`${r}-${c}`);
              return (
                <div key={c} onClick={()=>drop(c)} onMouseEnter={()=>setHover(c)} onMouseLeave={()=>setHover(null)}
                  style={{width:'clamp(34px,8vw,52px)',height:'clamp(34px,8vw,52px)',borderRadius:'50%',
                    background: cell?COLORS[cell]:COLORS[0],
                    boxShadow: isWin?`0 0 20px ${GLOW[cell]},0 0 40px ${GLOW[cell]}`:'inset 0 2px 8px rgba(0,0,0,0.4)',
                    cursor:status==='playing'&&turn===PLAYER&&!thinking?'pointer':'default',
                    transition:'all 0.2s',
                    transform: isWin?'scale(1.15)':'scale(1)',
                    border: isWin?`3px solid ${GLOW[cell]}`:'none'}}>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <GameBtn onClick={reset} color="#EAB308">{status==='idle'?'▶ START':'↺ New Game'}</GameBtn>
    </div>
  );
}
