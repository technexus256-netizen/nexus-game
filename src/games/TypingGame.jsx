import { useState, useEffect, useRef } from 'react';
import GameBtn from '../components/GameBtn';

const WORDS=['apple','brave','cloud','dance','eagle','flame','ghost','happy','igloo','juice','karma','light','magic','night','ocean','piano','queen','river','storm','tiger','ultra','vivid','water','xenon','yacht','zebra','ninja','pixel','quest','royal','spark','swift','tempo','unity','valor','witch','yield'];

export default function TypingGame({ onScore }) {
  const [fallingWords,setFallingWords] = useState([]);
  const [input,setInput]   = useState('');
  const [score,setScore]   = useState(0);
  const [lives,setLives]   = useState(3);
  const [status,setStatus] = useState('idle');
  const [level,setLevel]   = useState(1);
  const frameRef = useRef(null);
  const stateRef = useRef({ words:[], score:0, lives:3, level:1, running:false, frame:0, nextId:0, spawnRate:200 });
  const inputRef = useRef(null);

  const startGame = () => {
    const s=stateRef.current;
    s.words=[];s.score=0;s.lives=3;s.level=1;s.running=true;s.frame=0;s.nextId=0;s.spawnRate=200;
    setScore(0);setLives(3);setLevel(1);setInput('');setStatus('running');setFallingWords([]);
    if(frameRef.current)clearInterval(frameRef.current);
    frameRef.current=setInterval(()=>{
      if(!s.running)return;
      s.frame++;
      if(s.frame%s.spawnRate===0){
        const word=WORDS[Math.floor(Math.random()*WORDS.length)];
        s.words.push({id:s.nextId++,word,x:5+Math.random()*60,y:0,spd:0.3+s.level*0.15});
      }
      s.words=s.words.map(w=>({...w,y:w.y+w.spd}));
      const fallen=s.words.filter(w=>w.y>95);
      if(fallen.length){s.lives-=fallen.length;setLives(s.lives);s.words=s.words.filter(w=>w.y<=95);}
      if(s.lives<=0){s.running=false;clearInterval(frameRef.current);setStatus('dead');setFallingWords([...s.words]);return;}
      s.level=1+Math.floor(s.score/100);setLevel(s.level);
      s.spawnRate=Math.max(60,200-s.level*20);
      setScore(s.score);setFallingWords([...s.words]);
    },50);
    setTimeout(()=>inputRef.current?.focus(),100);
  };

  const handleType = e => {
    const val=e.target.value; setInput(val);
    const s=stateRef.current; if(!s.running)return;
    const match=s.words.find(w=>w.word===val.toLowerCase().trim());
    if(match){s.words=s.words.filter(w=>w.id!==match.id);s.score+=match.word.length*10;setScore(s.score);setInput('');setFallingWords([...s.words]);}
  };

  useEffect(()=>()=>{if(frameRef.current)clearInterval(frameRef.current);},[]);

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10,width:'100%'}}>
      <div style={{display:'flex',gap:20}}>
        <span style={{fontFamily:"'Fredoka One',cursive",fontSize:18,color:'#43E97B'}}>Score: {score}</span>
        <span style={{fontFamily:"'Exo 2',sans-serif",fontSize:14,color:'#EC4899'}}>{'❤️'.repeat(lives)}</span>
        <span style={{fontFamily:"'Exo 2',sans-serif",fontSize:14,color:'#F59E0B'}}>Lv {level}</span>
        {status==='dead'&&<span style={{color:'#FF6B35',fontWeight:700}}>GAME OVER!</span>}
      </div>
      <div style={{width:'min(400px,95vw)',height:300,background:'rgba(15,12,41,0.9)',borderRadius:16,border:'1px solid rgba(67,233,123,0.3)',position:'relative',overflow:'hidden',boxShadow:'0 0 30px rgba(67,233,123,0.1)'}}>
        {Array.from({length:10}).map((_,i)=>(
          <div key={i} style={{position:'absolute',bottom:0,left:`${i*10+5}%`,width:1,height:'100%',background:'rgba(67,233,123,0.05)'}} />
        ))}
        <div style={{position:'absolute',bottom:0,left:0,right:0,height:4,background:'linear-gradient(90deg,#43E97B,#06B6D4)'}} />
        {fallingWords.map(w=>(
          <div key={w.id} style={{position:'absolute',left:`${w.x}%`,top:`${w.y}%`,fontFamily:"'Exo 2',sans-serif",fontSize:13,fontWeight:700,color:w.y>80?'#FF6B35':w.y>60?'#F59E0B':'#43E97B',padding:'2px 8px',background:'rgba(0,0,0,0.6)',borderRadius:6,border:`1px solid ${w.y>80?'#FF6B35':'rgba(67,233,123,0.3)'}`,whiteSpace:'nowrap'}}>
            {w.word}
          </div>
        ))}
        {status!=='running'&&<div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontFamily:"'Exo 2',sans-serif",fontSize:16,color:'rgba(67,233,123,0.5)'}}>Words fall — type them fast!</span></div>}
      </div>
      <input ref={inputRef} value={input} onChange={handleType} disabled={status!=='running'} placeholder="Type words here…"
        style={{width:'min(300px,90vw)',background:'rgba(15,12,41,0.9)',border:'2px solid rgba(67,233,123,0.4)',borderRadius:12,padding:'12px 16px',color:'#fff',fontSize:16,fontFamily:"'Exo 2',sans-serif",textAlign:'center'}} />
      <GameBtn onClick={startGame} color="#43E97B">{status==='idle'?'▶ START':status==='dead'?'↺ RETRY':'↺ RESTART'}</GameBtn>
    </div>
  );
}
