import { useState, useEffect, useRef } from 'react';
import GameBtn from '../components/GameBtn';
import MobileArrows from '../components/MobileArrows';

export default function DodgeGame({ onScore }) {
  const canvasRef = useRef(null);
  const gRef = useRef({ ship:{x:200,y:320}, asteroids:[], score:0, running:false, anim:null, keys:{}, frame:0, speed:2 });
  const [score,setScore]   = useState(0);
  const [status,setStatus] = useState('idle');

  const startGame = () => {
    const g=gRef.current; const c=canvasRef.current; if(!c)return;
    g.ship={x:200,y:320}; g.asteroids=[]; g.score=0; g.running=true; g.frame=0; g.speed=2;
    setScore(0); setStatus('running');
    if(g.anim)cancelAnimationFrame(g.anim);
    const ctx=c.getContext('2d');
    const loop=()=>{
      g.frame++;
      ctx.fillStyle='#040814'; ctx.fillRect(0,0,c.width,c.height);
      ctx.fillStyle='rgba(255,255,255,0.5)';
      for(let i=0;i<50;i++) ctx.fillRect((i*137)%c.width,((i*173)+g.frame*(i%4===0?1:i%4===1?2:i%4===2?3:0.5))%c.height,i%3===0?1:2,i%3===0?1:2);
      const spd=5;
      if(g.keys['ArrowLeft']||g.keys['a'])  g.ship.x=Math.max(20,g.ship.x-spd);
      if(g.keys['ArrowRight']||g.keys['d']) g.ship.x=Math.min(c.width-20,g.ship.x+spd);
      if(g.keys['ArrowUp']||g.keys['w'])    g.ship.y=Math.max(20,g.ship.y-spd);
      if(g.keys['ArrowDown']||g.keys['s'])  g.ship.y=Math.min(c.height-20,g.ship.y+spd);
      if(g.frame%40===0) g.asteroids.push({x:Math.random()*c.width,y:-20,r:10+Math.random()*20,spd:g.speed+Math.random()*2});
      g.speed+=0.002;
      g.asteroids.forEach(a=>a.y+=a.spd);
      g.asteroids=g.asteroids.filter(a=>a.y<c.height+30);
      if(g.frame%30===0){g.score++;setScore(g.score);onScore&&onScore(g.score);}
      for(const a of g.asteroids){const dx=g.ship.x-a.x,dy=g.ship.y-a.y;if(Math.sqrt(dx*dx+dy*dy)<a.r+12){g.running=false;cancelAnimationFrame(g.anim);setStatus('dead');return;}}
      g.asteroids.forEach(a=>{ctx.fillStyle='#64748B';ctx.shadowColor='#94A3B8';ctx.shadowBlur=5;ctx.beginPath();ctx.arc(a.x,a.y,a.r,0,Math.PI*2);ctx.fill();});
      ctx.shadowBlur=0;
      ctx.save();ctx.translate(g.ship.x,g.ship.y);ctx.font='28px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor='#06B6D4';ctx.shadowBlur=20;ctx.fillText('🛸',0,0);ctx.restore();ctx.shadowBlur=0;
      ctx.fillStyle='#06B6D4';ctx.font="bold 16px 'Exo 2',sans-serif";ctx.textAlign='right';ctx.textBaseline='alphabetic';ctx.fillText(`Score: ${g.score}`,c.width-8,22);
      g.anim=requestAnimationFrame(loop);
    };
    g.anim=requestAnimationFrame(loop);
  };

  useEffect(()=>{
    const kd=e=>{gRef.current.keys[e.key]=true;e.preventDefault();};
    const ku=e=>{gRef.current.keys[e.key]=false;};
    window.addEventListener('keydown',kd);window.addEventListener('keyup',ku);
    const c=canvasRef.current;if(c){const ctx=c.getContext('2d');ctx.fillStyle='#040814';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='rgba(6,182,212,0.4)';ctx.font="16px 'Exo 2',sans-serif";ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('Press START to dodge!',c.width/2,c.height/2);}
    return()=>{window.removeEventListener('keydown',kd);window.removeEventListener('keyup',ku);if(gRef.current.anim)cancelAnimationFrame(gRef.current.anim);};
  },[]);

  const mobileDir=dir=>{const k=gRef.current.keys;Object.keys(k).forEach(k2=>delete k[k2]);if(dir==='up')k['ArrowUp']=true;if(dir==='down')k['ArrowDown']=true;if(dir==='left')k['ArrowLeft']=true;if(dir==='right')k['ArrowRight']=true;};
  const mobileRelease=()=>{const k=gRef.current.keys;Object.keys(k).forEach(k2=>delete k[k2]);};

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12,width:'100%'}}>
      <div style={{fontFamily:"'Exo 2',sans-serif",fontSize:18,fontWeight:800,color:'#06B6D4'}}>
        Score: {score} {status==='dead'&&<span style={{fontSize:14,color:'#FF6B35'}}> DESTROYED! 💥</span>}
      </div>
      <canvas ref={canvasRef} width={400} height={360} style={{borderRadius:16,border:'1px solid rgba(6,182,212,0.3)',boxShadow:'0 0 30px rgba(6,182,212,0.1)',width:'100%',maxWidth:480}} />
      <GameBtn onClick={startGame} color="#06B6D4">{status==='idle'?'▶ START':status==='dead'?'↺ RETRY':'↺ RESTART'}</GameBtn>
      <MobileArrows onDir={mobileDir} onRelease={mobileRelease} />
    </div>
  );
}
