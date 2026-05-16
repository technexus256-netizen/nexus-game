import { useState, useEffect, useRef } from 'react';
import GameBtn from '../components/GameBtn';
import MobileArrows from '../components/MobileArrows';

export default function ShooterGame({ onScore }) {
  const canvasRef = useRef(null);
  const gRef = useRef({ ship:{x:200,y:340}, bullets:[], enemies:[], score:0, running:false, anim:null, keys:{}, frame:0, lives:3, explosions:[] });
  const [score,setScore]   = useState(0);
  const [lives,setLives]   = useState(3);
  const [status,setStatus] = useState('idle');

  const startGame = () => {
    const g=gRef.current; const c=canvasRef.current; if(!c)return;
    g.ship={x:c.width/2,y:340}; g.bullets=[]; g.enemies=[]; g.score=0; g.lives=3; g.running=true; g.frame=0; g.explosions=[];
    setScore(0); setLives(3); setStatus('running');
    if(g.anim)cancelAnimationFrame(g.anim);
    const ctx=c.getContext('2d'); let lastShot=0;
    const loop=ts=>{
      g.frame++;
      ctx.fillStyle='rgba(4,8,20,0.85)'; ctx.fillRect(0,0,c.width,c.height);
      ctx.fillStyle='rgba(255,255,255,0.6)';
      for(let i=0;i<60;i++) ctx.fillRect((i*137)%c.width,(i*173+g.frame*0.5)%c.height,i%5===0?2:1,i%5===0?2:1);
      if(g.keys['ArrowLeft'])  g.ship.x=Math.max(20,g.ship.x-5);
      if(g.keys['ArrowRight']) g.ship.x=Math.min(c.width-20,g.ship.x+5);
      if(g.keys[' ']&&ts-lastShot>250){lastShot=ts;g.bullets.push({x:g.ship.x,y:g.ship.y-20});}
      if(g.frame%60===0){const wave=Math.floor(g.score/50)+1;for(let i=0;i<Math.min(wave,4);i++)g.enemies.push({x:20+Math.random()*(c.width-40),y:-20,spd:1+Math.random()*wave*0.5,hp:1});}
      g.bullets=g.bullets.filter(b=>b.y>-10).map(b=>({...b,y:b.y-8}));
      g.enemies=g.enemies.map(e=>({...e,y:e.y+e.spd}));
      g.bullets.forEach(b=>{g.enemies.forEach(e=>{if(e.hp>0&&Math.abs(b.x-e.x)<20&&Math.abs(b.y-e.y)<20){e.hp--;b.y=-100;if(e.hp<=0){g.score+=10;setScore(g.score);onScore&&onScore(g.score);g.explosions.push({x:e.x,y:e.y,t:0});}}});});
      const reached=g.enemies.filter(e=>e.y>c.height&&e.hp>0);
      if(reached.length){g.lives-=reached.length;setLives(g.lives);if(g.lives<=0){g.running=false;cancelAnimationFrame(g.anim);setStatus('dead');return;}}
      g.enemies=g.enemies.filter(e=>e.y<=c.height&&e.hp>0);
      g.explosions=g.explosions.map(ex=>({...ex,t:ex.t+1})).filter(ex=>ex.t<20);
      g.explosions.forEach(ex=>{ctx.fillStyle=`rgba(255,107,53,${1-ex.t/20})`;ctx.shadowColor='#FF6B35';ctx.shadowBlur=20;ctx.beginPath();ctx.arc(ex.x,ex.y,ex.t*2,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;});
      g.enemies.forEach(e=>{ctx.font='24px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor='#7C3AED';ctx.shadowBlur=10;ctx.fillText('👾',e.x,e.y);ctx.shadowBlur=0;});
      g.bullets.forEach(b=>{ctx.fillStyle='#F59E0B';ctx.shadowColor='#F59E0B';ctx.shadowBlur=10;ctx.beginPath();ctx.roundRect(b.x-3,b.y,6,14,3);ctx.fill();ctx.shadowBlur=0;});
      ctx.font='28px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor='#7C3AED';ctx.shadowBlur=20;ctx.fillText('🚀',g.ship.x,g.ship.y);ctx.shadowBlur=0;
      ctx.fillStyle='#F59E0B';ctx.font="bold 16px 'Exo 2',sans-serif";ctx.textAlign='left';ctx.textBaseline='alphabetic';ctx.fillText(`Score: ${g.score}`,8,22);
      for(let i=0;i<g.lives;i++){ctx.font='16px serif';ctx.fillText('❤️',c.width-30-i*22,22);}
      g.anim=requestAnimationFrame(loop);
    };
    g.anim=requestAnimationFrame(loop);
  };

  useEffect(()=>{
    const kd=e=>{gRef.current.keys[e.key]=true;if([' ','ArrowLeft','ArrowRight'].includes(e.key))e.preventDefault();};
    const ku=e=>{gRef.current.keys[e.key]=false;};
    window.addEventListener('keydown',kd);window.addEventListener('keyup',ku);
    const c=canvasRef.current;if(c){const ctx=c.getContext('2d');ctx.fillStyle='#040814';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='rgba(124,58,237,0.4)';ctx.font="16px 'Exo 2',sans-serif";ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('Press START to launch!',c.width/2,c.height/2);}
    return()=>{window.removeEventListener('keydown',kd);window.removeEventListener('keyup',ku);if(gRef.current.anim)cancelAnimationFrame(gRef.current.anim);};
  },[]);

  const mobileDir=dir=>{const k=gRef.current.keys;k['ArrowLeft']=dir==='left';k['ArrowRight']=dir==='right';if(dir==='up')k[' ']=true;};
  const mobileRelease=()=>{const k=gRef.current.keys;k['ArrowLeft']=false;k['ArrowRight']=false;k[' ']=false;};

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12,width:'100%'}}>
      <div style={{display:'flex',gap:16,alignItems:'center'}}>
        <span style={{fontFamily:"'Exo 2',sans-serif",fontSize:18,fontWeight:800,color:'#7C3AED'}}>Score: {score}</span>
        <span>{'❤️'.repeat(lives)}</span>
        {status==='dead'&&<span style={{color:'#FF6B35',fontWeight:700}}>GAME OVER!</span>}
      </div>
      <canvas ref={canvasRef} width={400} height={380} style={{borderRadius:16,border:'1px solid rgba(124,58,237,0.3)',boxShadow:'0 0 30px rgba(124,58,237,0.15)',width:'100%',maxWidth:480}} />
      <GameBtn onClick={startGame} color="#7C3AED">{status==='idle'?'▶ START':status==='dead'?'↺ RETRY':'↺ RESTART'}</GameBtn>
      <p style={{fontFamily:"'Exo 2',sans-serif",fontSize:11,color:'#64748B'}}>← → to move • Space to shoot</p>
      <MobileArrows onDir={mobileDir} onRelease={mobileRelease} />
    </div>
  );
}
