import { useState, useCallback } from 'react';
import GameBtn from '../components/GameBtn';

const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const checkWinner = b => { for(const [a,c,d] of LINES) if(b[a]&&b[a]===b[c]&&b[a]===b[d]) return {w:b[a],line:[a,c,d]}; return b.every(Boolean)?{w:'D',line:null}:null; };
const COLORS = { X:'#A78BFA', O:'#EC4899' };

export default function TicTacToeGame({ onScore }) {
  const [board,setBoard]   = useState(Array(9).fill(null));
  const [xTurn,setXTurn]   = useState(true);
  const [winner,setWinner] = useState(null);
  const [scores,setScores] = useState({X:0,O:0,D:0});
  const [winLine,setWinLine] = useState(null);

  const aiMove = useCallback(b => {
    for(const [a,c,d] of LINES){const arr=[a,c,d],es=arr.filter(i=>!b[i]);if(arr.filter(i=>b[i]==='O').length===2&&es.length===1)return es[0];}
    for(const [a,c,d] of LINES){const arr=[a,c,d],es=arr.filter(i=>!b[i]);if(arr.filter(i=>b[i]==='X').length===2&&es.length===1)return es[0];}
    if(!b[4])return 4;
    const corners=[0,2,6,8].filter(i=>!b[i]); if(corners.length)return corners[Math.floor(Math.random()*corners.length)];
    const empty=b.map((v,i)=>v?null:i).filter(v=>v!==null); return empty[Math.floor(Math.random()*empty.length)];
  },[]);

  const click = i => {
    if(board[i]||winner||!xTurn)return;
    const nb=[...board]; nb[i]='X';
    const res=checkWinner(nb);
    if(res){setBoard(nb);setWinner(res.w);setWinLine(res.line);setScores(s=>({...s,[res.w]:s[res.w]+1}));if(res.w==='X')onScore&&onScore(10);return;}
    setBoard(nb); setXTurn(false);
    setTimeout(()=>{
      const ai=aiMove(nb); if(ai===undefined)return;
      const nb2=[...nb]; nb2[ai]='O';
      const res2=checkWinner(nb2);
      setBoard(nb2); setXTurn(true);
      if(res2){setWinner(res2.w);setWinLine(res2.line);setScores(s=>({...s,[res2.w]:s[res2.w]+1}));}
    },420);
  };

  const reset = () => { setBoard(Array(9).fill(null)); setWinner(null); setWinLine(null); setXTurn(true); };

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16,width:'100%'}}>
      <div style={{display:'flex',gap:24}}>
        {[['You (X)','X','#A78BFA'],['AI (O)','O','#EC4899'],['Draw','D','#64748B']].map(([l,k,c])=>(
          <div key={k} style={{textAlign:'center'}}>
            <div style={{fontFamily:"'Fredoka One',cursive",fontSize:22,color:c}}>{scores[k]}</div>
            <div style={{fontFamily:"'Exo 2',sans-serif",fontSize:11,color:'#64748B'}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{fontFamily:"'Exo 2',sans-serif",fontSize:14,color:'#94A3B8',height:22}}>
        {winner ? (winner==='D'?'Draw! 🤝':winner==='X'?'You Win! 🎉':'AI Wins! 🤖') : xTurn?'Your turn (X)':'AI thinking…'}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,width:'min(300px,90vw)'}}>
        {board.map((cell,i)=>(
          <button key={i} onClick={()=>click(i)} style={{
            height:'clamp(80px,20vw,100px)',
            background:winLine?.includes(i)?`${COLORS[cell]}22`:'rgba(15,12,41,0.8)',
            border:`2px solid ${winLine?.includes(i)?COLORS[cell]:'rgba(124,58,237,0.3)'}`,
            borderRadius:16, fontSize:'clamp(28px,8vw,44px)',
            cursor:cell||winner?'default':'pointer', transition:'all 0.2s',
            boxShadow:winLine?.includes(i)?`0 0 24px ${COLORS[cell]}60`:'none',
          }}>
            <span style={{color:COLORS[cell],textShadow:cell?`0 0 20px ${COLORS[cell]}`:'none'}}>
              {cell==='X'?'✕':cell==='O'?'○':''}
            </span>
          </button>
        ))}
      </div>
      <GameBtn onClick={reset} color="#A78BFA">↺ New Game</GameBtn>
    </div>
  );
}
