import { useState, useCallback } from 'react';
import GameBtn from '../components/GameBtn';

// ─── Piece definitions ────────────────────────────────────────────────────────
const W = 'w', B = 'b';
const PIECES = { K:'♔', Q:'♕', R:'♖', B2:'♗', N:'♘', P:'♙', k:'♚', q:'♛', r:'♜', b:'♝', n:'♞', p:'♟' };
const PIECE_VALUES = { p:100, n:320, b:330, r:500, q:900, k:20000 };

function initBoard() {
  const b = Array(8).fill(null).map(() => Array(8).fill(null));
  const backRow = ['r','n','b','q','k','b','n','r'];
  for (let c = 0; c < 8; c++) { b[0][c]={t:backRow[c],cl:B}; b[7][c]={t:backRow[c],cl:W}; }
  for (let c = 0; c < 8; c++) { b[1][c]={t:'p',cl:B}; b[6][c]={t:'p',cl:W}; }
  return b;
}

function cloneBoard(board) { return board.map(r => r.map(c => c ? {...c} : null)); }

// ─── Move generation ──────────────────────────────────────────────────────────
function getMoves(board, row, col, castling, enPassant, checkSafety = true) {
  const piece = board[row][col]; if (!piece) return [];
  const moves = []; const {t, cl} = piece;
  const enemy = cl === W ? B : W;
  const inBounds = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;

  const addIfEmpty = (r, c) => { if (inBounds(r,c) && !board[r][c]) { moves.push([r,c]); return true; } return false; };
  const addIfEnemy = (r, c) => { if (inBounds(r,c) && board[r][c]?.cl === enemy) { moves.push([r,c]); } };
  const slide = (dr, dc) => { let r=row+dr, c=col+dc; while(inBounds(r,c)){if(board[r][c]){if(board[r][c].cl===enemy)moves.push([r,c]);break;}moves.push([r,c]);r+=dr;c+=dc;} };

  if (t === 'p') {
    const dir = cl === W ? -1 : 1; const startRow = cl === W ? 6 : 1;
    if (addIfEmpty(row+dir, col)) if (row === startRow) addIfEmpty(row+2*dir, col);
    for (const dc of [-1, 1]) {
      const nr=row+dir, nc=col+dc;
      if (inBounds(nr,nc)) {
        if (board[nr][nc]?.cl === enemy) moves.push([nr,nc]);
        if (enPassant && enPassant[0]===nr && enPassant[1]===nc) moves.push([nr,nc,'ep']);
      }
    }
  } else if (t === 'n') {
    for (const [dr,dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) {
      const nr=row+dr, nc=col+dc; if (inBounds(nr,nc) && board[nr][nc]?.cl !== cl) moves.push([nr,nc]);
    }
  } else if (t === 'b') { slide(1,1);slide(1,-1);slide(-1,1);slide(-1,-1);
  } else if (t === 'r') { slide(1,0);slide(-1,0);slide(0,1);slide(0,-1);
  } else if (t === 'q') { slide(1,1);slide(1,-1);slide(-1,1);slide(-1,-1);slide(1,0);slide(-1,0);slide(0,1);slide(0,-1);
  } else if (t === 'k') {
    for (const [dr,dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) {
      const nr=row+dr, nc=col+dc; if (inBounds(nr,nc) && board[nr][nc]?.cl !== cl) moves.push([nr,nc]);
    }
    // Castling
    if (checkSafety && !isInCheck(board, cl)) {
      const backR = cl === W ? 7 : 0;
      if (castling[cl]?.kSide && !board[backR][5] && !board[backR][6] && board[backR][7]?.t==='r' && board[backR][7]?.cl===cl)
        if (!squareAttacked(board,backR,5,enemy) && !squareAttacked(board,backR,6,enemy)) moves.push([backR,6,'castle-k']);
      if (castling[cl]?.qSide && !board[backR][3] && !board[backR][2] && !board[backR][1] && board[backR][0]?.t==='r' && board[backR][0]?.cl===cl)
        if (!squareAttacked(board,backR,3,enemy) && !squareAttacked(board,backR,2,enemy)) moves.push([backR,2,'castle-q']);
    }
  }

  if (!checkSafety) return moves;
  return moves.filter(([nr, nc, flag]) => {
    const nb = cloneBoard(board); applyMove(nb, row, col, nr, nc, flag);
    return !isInCheck(nb, cl);
  });
}

function squareAttacked(board, row, col, byColor) {
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    if (board[r][c]?.cl === byColor) {
      const m = getMoves(board, r, c, {w:{kSide:false,qSide:false},b:{kSide:false,qSide:false}}, null, false);
      if (m.some(([mr,mc]) => mr===row && mc===col)) return true;
    }
  }
  return false;
}

function isInCheck(board, color) {
  let kr=-1, kc=-1;
  for (let r=0;r<8;r++) for(let c=0;c<8;c++) if(board[r][c]?.t==='k'&&board[r][c]?.cl===color){kr=r;kc=c;}
  if (kr===-1) return true;
  const enemy = color===W ? B : W;
  return squareAttacked(board, kr, kc, enemy);
}

function applyMove(board, fr, fc, tr, tc, flag) {
  const piece = board[fr][fc];
  if (flag==='ep') board[fr][tc]=null;
  if (flag==='castle-k') { const r=fr; board[r][5]={...board[r][7]};board[r][7]=null; }
  if (flag==='castle-q') { const r=fr; board[r][3]={...board[r][0]};board[r][0]=null; }
  board[tr][tc] = piece; board[fr][fc] = null;
  // Promotion
  if (piece.t==='p' && (tr===0||tr===7)) board[tr][tc]={t:'q',cl:piece.cl};
}

function hasAnyMoves(board, color, castling, enPassant) {
  for (let r=0;r<8;r++) for(let c=0;c<8;c++) if(board[r][c]?.cl===color) if(getMoves(board,r,c,castling,enPassant).length>0) return true;
  return false;
}

// ─── AI ───────────────────────────────────────────────────────────────────────
const PAWN_TABLE = [
  [0,0,0,0,0,0,0,0],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],
  [5,5,10,25,25,10,5,5],[0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],
  [5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0]
];
const KNIGHT_TABLE = [[-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,0,0,0,-20,-40],[-30,0,10,15,15,10,0,-30],[-30,5,15,20,20,15,5,-30],[-30,0,15,20,20,15,0,-30],[-30,5,10,15,15,10,5,-30],[-40,-20,0,5,5,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]];

function evalBoard(board) {
  let score = 0;
  for (let r=0;r<8;r++) for(let c=0;c<8;c++) {
    const p = board[r][c]; if (!p) continue;
    const val = PIECE_VALUES[p.t] || 0;
    let bonus = 0;
    if (p.t==='p') bonus = PAWN_TABLE[p.cl===W?r:7-r][p.cl===W?c:7-c];
    if (p.t==='n') bonus = KNIGHT_TABLE[p.cl===W?r:7-r][c];
    score += (p.cl===W ? 1 : -1) * (val + bonus);
  }
  return score;
}

function minimax(board, depth, alpha, beta, maximizing, castling, enPassant) {
  const color = maximizing ? W : B;
  if (!hasAnyMoves(board, color, castling, enPassant)) {
    if (isInCheck(board, color)) return maximizing ? -100000 : 100000;
    return 0;
  }
  if (depth === 0) return evalBoard(board);
  let best = maximizing ? -Infinity : Infinity;
  for (let r=0;r<8;r++) for(let c=0;c<8;c++) {
    if (board[r][c]?.cl!==color) continue;
    const moves = getMoves(board,r,c,castling,enPassant);
    for (const [tr,tc,flag] of moves) {
      const nb=cloneBoard(board); applyMove(nb,r,c,tr,tc,flag);
      const score = minimax(nb,depth-1,alpha,beta,!maximizing,castling,null);
      if (maximizing) { best=Math.max(best,score); alpha=Math.max(alpha,score); }
      else            { best=Math.min(best,score); beta=Math.min(beta,score);  }
      if (beta<=alpha) break;
    }
  }
  return best;
}

function getBestMove(board, color, depth, castling, enPassant) {
  let best=null, bestScore = color===W ? -Infinity : Infinity;
  const candidates=[];
  for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(board[r][c]?.cl===color){
    const moves=getMoves(board,r,c,castling,enPassant);
    for(const [tr,tc,flag] of moves) candidates.push([r,c,tr,tc,flag]);
  }
  // Shuffle for variety
  for(let i=candidates.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[candidates[i],candidates[j]]=[candidates[j],candidates[i]];}
  for(const [fr,fc,tr,tc,flag] of candidates){
    const nb=cloneBoard(board); applyMove(nb,fr,fc,tr,tc,flag);
    const score=minimax(nb,depth-1,-Infinity,Infinity,color!==W,castling,null);
    if(color===W?(score>bestScore):(score<bestScore)){bestScore=score;best=[fr,fc,tr,tc,flag];}
  }
  return best;
}

// ─── Piece renderer ───────────────────────────────────────────────────────────
const PIECE_UNICODE = {
  w:{k:'♔',q:'♕',r:'♖',b:'♗',n:'♘',p:'♙'},
  b:{k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟'},
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function ChessGame({ onScore }) {
  const [board, setBoard]         = useState(initBoard);
  const [selected, setSelected]   = useState(null);   // [row,col]
  const [validMoves, setValidMoves] = useState([]);
  const [turn, setTurn]           = useState(W);
  const [status, setStatus]       = useState('idle'); // idle|playing|check|checkmate|stalemate
  const [castling, setCastling]   = useState({ w:{kSide:true,qSide:true}, b:{kSide:true,qSide:true} });
  const [enPassant, setEnPassant] = useState(null);
  const [lastMove, setLastMove]   = useState(null);
  const [difficulty, setDifficulty] = useState(2);   // 1=easy 2=medium 3=hard
  const [playerColor] = useState(W);
  const [thinking, setThinking]   = useState(false);
  const [captured, setCaptured]   = useState({w:[],b:[]});

  const depthMap = {1:1, 2:2, 3:3};

  const resetGame = () => {
    setBoard(initBoard()); setSelected(null); setValidMoves([]);
    setTurn(W); setStatus('playing'); setLastMove(null);
    setCastling({w:{kSide:true,qSide:true},b:{kSide:true,qSide:true}});
    setEnPassant(null); setCaptured({w:[],b:[]}); setThinking(false);
  };

  const updateCastling = (cast, piece, fr, fc) => {
    const c = {...cast, w:{...cast.w}, b:{...cast.b}};
    if (piece.t==='k') { c[piece.cl].kSide=false; c[piece.cl].qSide=false; }
    if (piece.t==='r') { if(fc===0) c[piece.cl].qSide=false; if(fc===7) c[piece.cl].kSide=false; }
    return c;
  };

  const handleSquareClick = useCallback((row, col) => {
    if (status==='idle'||status==='checkmate'||status==='stalemate') return;
    if (thinking || turn !== playerColor) return;

    const piece = board[row][col];

    // If something selected → try to move
    if (selected) {
      const [sr, sc] = selected;
      const move = validMoves.find(([r,c]) => r===row && c===col);
      if (move) {
        const [tr, tc, flag] = move;
        const nb = cloneBoard(board);
        const captured_piece = nb[tr][tc];
        applyMove(nb, sr, sc, tr, tc, flag);

        const newCast = updateCastling(castling, board[sr][sc], sr, sc);
        const newEP = (board[sr][sc].t==='p' && Math.abs(tr-sr)===2) ? [(sr+tr)/2, tc] : null;

        const newCap = {...captured, w:[...captured.w], b:[...captured.b]};
        if (captured_piece) newCap[captured_piece.cl].push(captured_piece.t);

        const nextTurn = turn===W ? B : W;
        let newStatus = 'playing';
        if (isInCheck(nb, nextTurn)) {
          newStatus = hasAnyMoves(nb,nextTurn,newCast,newEP) ? 'check' : 'checkmate';
          if (newStatus==='checkmate') { onScore && onScore(500); }
        } else if (!hasAnyMoves(nb,nextTurn,newCast,newEP)) {
          newStatus = 'stalemate';
        }

        setBoard(nb); setSelected(null); setValidMoves([]);
        setTurn(nextTurn); setStatus(newStatus);
        setCastling(newCast); setEnPassant(newEP);
        setLastMove([sr,sc,tr,tc]); setCaptured(newCap);

        // AI move
        if (newStatus==='playing'||newStatus==='check') {
          setThinking(true);
          setTimeout(() => {
            const aiMove = getBestMove(nb, nextTurn, depthMap[difficulty], newCast, newEP);
            if (aiMove) {
              const [afr,afc,atr,atc,aflag] = aiMove;
              const nb2 = cloneBoard(nb);
              const cap2 = nb2[atr][atc];
              applyMove(nb2, afr, afc, atr, atc, aflag);
              const newCast2 = updateCastling(newCast, nb[afr][afc], afr, afc);
              const newEP2 = (nb[afr][afc]?.t==='p'&&Math.abs(atr-afr)===2)?[(afr+atr)/2,atc]:null;
              const newCap2 = {...newCap, w:[...newCap.w], b:[...newCap.b]};
              if (cap2) newCap2[cap2.cl].push(cap2.t);
              const backTurn = W;
              let ns = 'playing';
              if (isInCheck(nb2,backTurn)) ns = hasAnyMoves(nb2,backTurn,newCast2,newEP2)?'check':'checkmate';
              else if (!hasAnyMoves(nb2,backTurn,newCast2,newEP2)) ns='stalemate';
              setBoard(nb2); setTurn(backTurn); setStatus(ns);
              setCastling(newCast2); setEnPassant(newEP2);
              setLastMove([afr,afc,atr,atc]); setCaptured(newCap2);
            }
            setThinking(false);
          }, 80);
        }
        return;
      }
      // Clicked same piece → deselect
      if (piece?.cl === turn) { setSelected([row,col]); setValidMoves(getMoves(board,row,col,castling,enPassant)); return; }
      setSelected(null); setValidMoves([]); return;
    }

    // Select own piece
    if (piece?.cl === turn) {
      setSelected([row,col]);
      setValidMoves(getMoves(board,row,col,castling,enPassant));
    }
  }, [board, selected, validMoves, turn, status, castling, enPassant, thinking, playerColor, difficulty, onScore, captured]);

  const isLight = (r,c) => (r+c)%2===0;
  const isSelected = (r,c) => selected?.[0]===r && selected?.[1]===c;
  const isValidMove = (r,c) => validMoves.some(([mr,mc])=>mr===r&&mc===c);
  const isLastMove = (r,c) => lastMove && (lastMove[0]===r&&lastMove[1]===c||lastMove[2]===r&&lastMove[3]===c);

  const sqSize = 'clamp(36px, 10vw, 60px)';

  const DIFF_LABELS = {1:'🟢 Easy',2:'🟡 Medium',3:'🔴 Hard'};

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14,width:'100%',userSelect:'none'}}>
      <style>{`
        .chess-sq { transition: background 0.15s; cursor: pointer; position:relative; display:flex; align-items:center; justify-content:center; }
        .chess-sq:hover { filter: brightness(1.25); }
        .chess-piece { font-size: clamp(22px,6vw,38px); line-height:1; transition: transform 0.1s; cursor:pointer; }
        .chess-piece:hover { transform: scale(1.15); }
      `}</style>

      {/* Status bar */}
      <div style={{display:'flex',gap:12,alignItems:'center',flexWrap:'wrap',justifyContent:'center'}}>
        <div style={{background:'rgba(15,12,41,0.8)',border:'1px solid rgba(245,158,11,0.3)',borderRadius:12,padding:'8px 18px',fontFamily:"'Exo 2',sans-serif",fontSize:14,fontWeight:700,color:
          status==='checkmate'?'#43E97B':status==='check'?'#FF6B35':status==='stalemate'?'#94A3B8':'#fff'}}>
          {status==='idle'     && '♟️ Press NEW GAME to start'}
          {status==='playing'  && (thinking ? '🤔 AI thinking…' : turn===W ? '⬜ Your turn (White)' : '⬛ AI\'s turn (Black)')}
          {status==='check'    && (turn===W ? '⚠️ You are in CHECK!' : '⚠️ AI is in CHECK!')}
          {status==='checkmate'&& (turn===W ? '😔 Checkmate — AI wins!' : '🎉 Checkmate — You win!')}
          {status==='stalemate'&& '🤝 Stalemate — Draw!'}
        </div>
        <div style={{display:'flex',gap:6}}>
          {[1,2,3].map(d=>(
            <button key={d} onClick={()=>setDifficulty(d)} style={{background:difficulty===d?'linear-gradient(135deg,#F59E0B,#EF4444)':'rgba(15,12,41,0.8)',border:`1px solid ${difficulty===d?'transparent':'rgba(245,158,11,0.3)'}`,borderRadius:9,padding:'7px 12px',color:difficulty===d?'#fff':'#94A3B8',fontSize:11,cursor:'pointer',fontFamily:"'Exo 2',sans-serif",fontWeight:700,transition:'all 0.2s'}}>
              {DIFF_LABELS[d]}
            </button>
          ))}
        </div>
      </div>

      {/* Captured pieces — Black captured by White */}
      <div style={{display:'flex',gap:3,minHeight:24,flexWrap:'wrap',justifyContent:'center'}}>
        {captured.b.map((t,i)=><span key={i} style={{fontSize:16,opacity:0.8}}>{PIECE_UNICODE.b[t]}</span>)}
      </div>

      {/* Board */}
      <div style={{border:'3px solid rgba(245,158,11,0.5)',borderRadius:8,overflow:'hidden',boxShadow:'0 0 40px rgba(245,158,11,0.2)'}}>
        {/* Col labels top */}
        <div style={{display:'flex',paddingLeft:'clamp(20px,5vw,28px)'}}>
          {['a','b','c','d','e','f','g','h'].map(l=>(
            <div key={l} style={{width:sqSize,textAlign:'center',fontFamily:"'Exo 2',sans-serif",fontSize:10,color:'#64748B',padding:'2px 0'}}>{l}</div>
          ))}
        </div>

        {board.map((rowArr, r) => (
          <div key={r} style={{display:'flex',alignItems:'center'}}>
            {/* Row label */}
            <div style={{width:'clamp(20px,5vw,28px)',textAlign:'center',fontFamily:"'Exo 2',sans-serif",fontSize:10,color:'#64748B'}}>{8-r}</div>

            {rowArr.map((piece, c) => {
              const light = isLight(r,c);
              const sel   = isSelected(r,c);
              const valid = isValidMove(r,c);
              const last  = isLastMove(r,c);
              const inChk = (status==='check'||status==='checkmate') && piece?.t==='k' && piece?.cl===turn;

              let bg = light ? '#F0D9B5' : '#B58863';
              if (last)  bg = light ? '#CDD26A' : '#AAA23A';
              if (sel)   bg = '#F6F669';
              if (inChk) bg = '#FF4444';

              return (
                <div
                  key={c}
                  className="chess-sq"
                  onClick={() => handleSquareClick(r,c)}
                  style={{ width:sqSize, height:sqSize, background:bg, boxShadow: sel?'inset 0 0 12px rgba(0,0,0,0.4)':'' }}
                >
                  {/* Valid move dot */}
                  {valid && !piece && (
                    <div style={{width:'33%',height:'33%',background:'rgba(0,0,0,0.25)',borderRadius:'50%'}} />
                  )}
                  {/* Valid capture ring */}
                  {valid && piece && (
                    <div style={{position:'absolute',inset:2,border:'3px solid rgba(0,0,0,0.35)',borderRadius:'50%',pointerEvents:'none'}} />
                  )}
                  {/* Piece */}
                  {piece && (
                    <span className="chess-piece" style={{
                      color: piece.cl===W ? '#FFF8E7' : '#1a1a2e',
                      textShadow: piece.cl===W
                        ? '0 1px 3px rgba(0,0,0,0.8), 0 0 8px rgba(255,255,255,0.3)'
                        : '0 1px 2px rgba(0,0,0,0.5)',
                      filter: sel ? 'drop-shadow(0 0 8px #FFD700)' : '',
                    }}>
                      {PIECE_UNICODE[piece.cl][piece.t]}
                    </span>
                  )}
                </div>
              );
            })}

            {/* Row label right */}
            <div style={{width:'clamp(20px,5vw,28px)',textAlign:'center',fontFamily:"'Exo 2',sans-serif",fontSize:10,color:'#64748B'}}>{8-r}</div>
          </div>
        ))}

        {/* Col labels bottom */}
        <div style={{display:'flex',paddingLeft:'clamp(20px,5vw,28px)'}}>
          {['a','b','c','d','e','f','g','h'].map(l=>(
            <div key={l} style={{width:sqSize,textAlign:'center',fontFamily:"'Exo 2',sans-serif",fontSize:10,color:'#64748B',padding:'2px 0'}}>{l}</div>
          ))}
        </div>
      </div>

      {/* Captured pieces — White captured by Black */}
      <div style={{display:'flex',gap:3,minHeight:24,flexWrap:'wrap',justifyContent:'center'}}>
        {captured.w.map((t,i)=><span key={i} style={{fontSize:16,opacity:0.8}}>{PIECE_UNICODE.w[t]}</span>)}
      </div>

      {/* Controls */}
      <div style={{display:'flex',gap:10,flexWrap:'wrap',justifyContent:'center'}}>
        <GameBtn onClick={resetGame} color="#F59E0B">
          {status==='idle' ? '▶ New Game' : '↺ New Game'}
        </GameBtn>
      </div>

      {/* Legend */}
      <div style={{display:'flex',gap:16,flexWrap:'wrap',justifyContent:'center'}}>
        {[['⬜','You (White)','#E2E8F0'],['⬛','AI (Black)','#94A3B8'],['🟡','Last Move','#CDD26A'],['🔴','Check','#FF4444']].map(([ico,lbl,clr])=>(
          <div key={lbl} style={{display:'flex',alignItems:'center',gap:5,fontFamily:"'Exo 2',sans-serif",fontSize:11,color:clr}}>
            <span>{ico}</span>{lbl}
          </div>
        ))}
      </div>
    </div>
  );
}
