import { useState, useEffect, useRef } from 'react';
import GameBtn from '../components/GameBtn';

const EMOJIS = ['🐶','🐱','🐸','🦊','🐼','🦁','🐨','🦄'];
const makeCards = () => [...EMOJIS,...EMOJIS].sort(()=>Math.random()-0.5).map((e,i)=>({id:i,emoji:e,flipped:false,matched:false}));

export default function MemoryGame({ onScore }) {
  const [cards,setCards]   = useState(makeCards);
  const [flipped,setFlipped] = useState([]);
  const [moves,setMoves]   = useState(0);
  const [matches,setMatches] = useState(0);
  const [locked,setLocked] = useState(false);
  const [time,setTime]     = useState(0);
  const [running,setRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(()=>{
    if(running) timerRef.current=setInterval(()=>setTime(t=>t+1),1000);
    return()=>clearInterval(timerRef.current);
  },[running]);

  const flip = idx => {
    if(locked||cards[idx].flipped||cards[idx].matched||flipped.length===2)return;
    if(!running) setRunning(true);
    const nc=[...cards]; nc[idx]={...nc[idx],flipped:true};
    const nf=[...flipped,idx];
    setCards(nc); setFlipped(nf);
    if(nf.length===2){
      setMoves(m=>m+1); setLocked(true);
      setTimeout(()=>{
        const [a,b]=nf;
        if(nc[a].emoji===nc[b].emoji){
          const mc=[...nc]; mc[a].matched=true; mc[b].matched=true;
          const nm=matches+1; setMatches(nm); setCards(mc); setFlipped([]); setLocked(false);
          if(nm===EMOJIS.length){clearInterval(timerRef.current);setRunning(false);onScore&&onScore(Math.max(0,500-moves*10-time*5));}
        } else {
          const uc=[...nc]; uc[a].flipped=false; uc[b].flipped=false;
          setCards(uc); setFlipped([]); setLocked(false);
        }
      },800);
    }
  };

  const reset = () => { setCards(makeCards()); setFlipped([]); setMoves(0); setMatches(0); setLocked(false); setTime(0); setRunning(false); clearInterval(timerRef.current); };
  const won = matches===EMOJIS.length;

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12,width:'100%'}}>
      <div style={{display:'flex',gap:24}}>
        {[['Moves',moves,'#EC4899'],[`${matches}/${EMOJIS.length}`,null,'#A78BFA'],[`${time}s`,null,'#F59E0B']].map(([v,_,c],i)=>(
          <div key={i} style={{textAlign:'center'}}>
            <div style={{fontFamily:"'Fredoka One',cursive",fontSize:20,color:c}}>{v}</div>
            <div style={{fontFamily:"'Exo 2',sans-serif",fontSize:11,color:'#64748B'}}>{['Moves','Matches','Time'][i]}</div>
          </div>
        ))}
      </div>
      {won&&<div style={{fontFamily:"'Fredoka One',cursive",fontSize:20,color:'#43E97B'}}>🎉 You Won! Score: {Math.max(0,500-moves*10-time*5)}</div>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,width:'min(340px,95vw)'}}>
        {cards.map((card,i)=>(
          <button key={card.id} onClick={()=>flip(i)} style={{
            height:'clamp(60px,15vw,80px)',
            background:card.flipped||card.matched?'rgba(167,139,250,0.2)':'rgba(15,12,41,0.8)',
            border:`2px solid ${card.matched?'#43E97B':card.flipped?'#A78BFA':'rgba(124,58,237,0.3)'}`,
            borderRadius:12, fontSize:'clamp(22px,5vw,32px)',
            cursor:card.matched||card.flipped?'default':'pointer', transition:'all 0.3s',
            boxShadow:card.matched?'0 0 15px rgba(67,233,123,0.4)':card.flipped?'0 0 15px rgba(167,139,250,0.4)':'none',
          }}>
            {card.flipped||card.matched?card.emoji:'?'}
          </button>
        ))}
      </div>
      <GameBtn onClick={reset} color="#EC4899">↺ New Game</GameBtn>
    </div>
  );
}
