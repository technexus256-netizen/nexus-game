import { useState, useEffect, useRef, useCallback } from 'react';
import GameBtn from '../components/GameBtn';

export default function FlappyGame({ onScore }) {
  const canvasRef = useRef(null);
  const gRef = useRef({ bird:{y:200,vy:0}, pipes:[], score:0, running:false, started:false, anim:null, frame:0 });
  const [score,setScore] = useState(0);
  const [status,setStatus] = useState('idle');

  const jump = useCallback(() => {
    const g=gRef.current;
    if(!g.started){g.started=true;g.running=true;setStatus('running');}
    if(g.running) g.bird.vy=-7;
  },[]);

  useEffect(()=>{ const h=e=>{if(e.code==='Space'||e.key===' '){e.preventDefault();jump();}}; window.addEventListener('keydown',h); return()=>window.removeEventListener('keydown',h); },[jump]);

  const startGame = useCallback(() => {
    const g=gRef.current;
    g.bird={y:200,vy:0}; g.pipes=[]; g.score=0; g.running=false; g.started=false; g.frame=0;
    setScore(0); setStatus('idle');
    if(g.anim) cancelAnimationFrame(g.anim);
    const c=canvasRef.current; if(!c) return;
    const ctx=c.getContext('2d');
    const GAP=140, SPEED=2.5, PW=50;

    const loop=()=>{
      g.frame++;
      ctx.fillStyle='#040814'; ctx.fillRect(0,0,c.width,c.height);
      ctx.fillStyle='rgba(255,255,255,0.4)';
      for(let i=0;i<40;i++) ctx.fillRect((i*137+g.frame*(i%3===0?.3:i%3===1?.5:.8))%c.width,(i*173)%c.height,i%3===0?1:2,i%3===0?1:2);

      if(g.started){
        g.bird.vy+=0.35; g.bird.y+=g.bird.vy;
        if(g.frame%90===0||g.pipes.length===0) g.pipes.push({x:c.width,top:60+Math.random()*(c.height-GAP-80),passed:false});
        g.pipes.forEach(p=>p.x-=SPEED);
        g.pipes=g.pipes.filter(p=>p.x>-PW);
        g.pipes.forEach(p=>{if(!p.passed&&p.x+PW<80){p.passed=true;g.score++;setScore(g.score);onScore&&onScore(g.score);}});
        if(g.bird.y<0||g.bird.y>c.height-24){g.running=false;cancelAnimationFrame(g.anim);setStatus('dead');return;}
        for(const p of g.pipes){ if(80+18>p.x&&80-18<p.x+PW&&(g.bird.y-18<p.top||g.bird.y+18>p.top+GAP)){g.running=false;cancelAnimationFrame(g.anim);setStatus('dead');return;} }
      }

      g.pipes.forEach(p=>{
        const grad=ctx.createLinearGradient(p.x,0,p.x+PW,0); grad.addColorStop(0,'#FF6B35'); grad.addColorStop(1,'#F59E0B');
        ctx.fillStyle=grad; ctx.shadowColor='#FF6B35'; ctx.shadowBlur=10;
        ctx.beginPath(); ctx.roundRect(p.x,0,PW,p.top,4); ctx.fill();
        ctx.beginPath(); ctx.roundRect(p.x,p.top+GAP,PW,c.height,4); ctx.fill();
        ctx.shadowBlur=0;
      });

      ctx.save(); ctx.translate(80,g.bird.y); ctx.rotate(Math.max(-30,Math.min(30,g.bird.vy*3))*Math.PI/180);
      ctx.font='30px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.shadowColor='#FF6B35'; ctx.shadowBlur=20; ctx.fillText('🚀',0,0);
      ctx.restore(); ctx.shadowBlur=0;

      ctx.fillStyle='#fff'; ctx.font="bold 20px 'Exo 2',sans-serif"; ctx.textAlign='center'; ctx.textBaseline='alphabetic';
      ctx.fillText(g.score,c.width/2,40);
      if(!g.started){ctx.fillStyle='rgba(255,255,255,0.6)';ctx.font="16px 'Exo 2',sans-serif";ctx.fillText('Tap / Space to fly!',c.width/2,c.height/2);}
      g.anim=requestAnimationFrame(loop);
    };
    g.anim=requestAnimationFrame(loop);
  },[onScore]);

  useEffect(()=>{ startGame(); return()=>{if(gRef.current.anim)cancelAnimationFrame(gRef.current.anim);}; },[startGame]);

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12,width:'100%'}}>
      <div style={{fontFamily:"'Exo 2',sans-serif",fontSize:18,fontWeight:800,color:'#FF6B35'}}>
        Score: {score} {status==='dead'&&<span style={{fontSize:14}}> CRASHED! 💥</span>}
      </div>
      <canvas ref={canvasRef} width={400} height={400} onClick={jump}
        style={{borderRadius:16,border:'1px solid rgba(255,107,53,0.3)',boxShadow:'0 0 30px rgba(255,107,53,0.15)',width:'100%',maxWidth:480,cursor:'pointer'}} />
      {status==='dead'&&<GameBtn onClick={startGame} color="#FF6B35">↺ Try Again</GameBtn>}
    </div>
  );
}
