import { useState, useEffect, useRef } from 'react';
import GameBtn from '../components/GameBtn';

export default function PongGame({ onScore }) {
  const canvasRef = useRef(null);
  const gRef = useRef({ ball:{x:200,y:200,vx:4,vy:3}, p1:{y:170}, p2:{y:170}, score:{p1:0,p2:0}, running:false, anim:null, keys:{} });
  const [scores,setScores] = useState({p1:0,p2:0});
  const [status,setStatus] = useState('idle');
  const PH=80, PW=12, BR=8;

  const startGame = () => {
    const g=gRef.current; const c=canvasRef.current; if(!c)return;
    g.ball={x:c.width/2,y:c.height/2,vx:4*(Math.random()>.5?1:-1),vy:3*(Math.random()>.5?1:-1)};
    g.p1={y:c.height/2-PH/2}; g.p2={y:c.height/2-PH/2};
    g.score={p1:0,p2:0}; g.running=true;
    setScores({p1:0,p2:0}); setStatus('running');
    if(g.anim)cancelAnimationFrame(g.anim);
    const ctx=c.getContext('2d');
    const loop=()=>{
      ctx.fillStyle='#040814'; ctx.fillRect(0,0,c.width,c.height);
      ctx.setLineDash([10,10]);ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(c.width/2,0);ctx.lineTo(c.width/2,c.height);ctx.stroke();ctx.setLineDash([]);
      // AI
      const aiT=g.ball.y-PH/2; g.p2.y+=(aiT-g.p2.y)*0.08; g.p2.y=Math.max(0,Math.min(c.height-PH,g.p2.y));
      // Player
      if(g.keys['w']||g.keys['ArrowUp'])   g.p1.y=Math.max(0,g.p1.y-6);
      if(g.keys['s']||g.keys['ArrowDown']) g.p1.y=Math.min(c.height-PH,g.p1.y+6);
      // Ball
      g.ball.x+=g.ball.vx; g.ball.y+=g.ball.vy;
      if(g.ball.y<=BR||g.ball.y>=c.height-BR) g.ball.vy*=-1;
      if(g.ball.x<=30+PW&&g.ball.y>=g.p1.y&&g.ball.y<=g.p1.y+PH&&g.ball.vx<0){g.ball.vx=Math.abs(g.ball.vx)*1.05;g.ball.vy+=(g.ball.y-(g.p1.y+PH/2))*0.2;}
      if(g.ball.x>=c.width-30-PW&&g.ball.y>=g.p2.y&&g.ball.y<=g.p2.y+PH&&g.ball.vx>0){g.ball.vx=-Math.abs(g.ball.vx)*1.05;g.ball.vy+=(g.ball.y-(g.p2.y+PH/2))*0.2;}
      g.ball.vx=Math.max(-10,Math.min(10,g.ball.vx)); g.ball.vy=Math.max(-8,Math.min(8,g.ball.vy));
      if(g.ball.x<0){g.score.p2++;setScores({...g.score});onScore&&onScore(0);g.ball={x:c.width/2,y:c.height/2,vx:4,vy:3*(Math.random()>.5?1:-1)};}
      if(g.ball.x>c.width){g.score.p1++;setScores({...g.score});onScore&&onScore(g.score.p1*10);g.ball={x:c.width/2,y:c.height/2,vx:-4,vy:3*(Math.random()>.5?1:-1)};}
      if(g.score.p1>=7||g.score.p2>=7){g.running=false;cancelAnimationFrame(g.anim);setStatus(g.score.p1>=7?'won':'lost');return;}
      [[30,g.p1.y,'#FF3CAC'],[c.width-30-PW,g.p2.y,'#A78BFA']].forEach(([x,y,col])=>{ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=15;ctx.beginPath();ctx.roundRect(x,y,PW,PH,6);ctx.fill();});
      ctx.fillStyle='#fff';ctx.shadowColor='#fff';ctx.shadowBlur=20;ctx.beginPath();ctx.arc(g.ball.x,g.ball.y,BR,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
      ctx.fillStyle='rgba(255,255,255,0.6)';ctx.font="bold 36px 'Fredoka One',cursive";ctx.textAlign='center';ctx.textBaseline='alphabetic';
      ctx.fillText(g.score.p1,c.width/4,44);ctx.fillText(g.score.p2,3*c.width/4,44);
      g.anim=requestAnimationFrame(loop);
    };
    g.anim=requestAnimationFrame(loop);
  };

  useEffect(()=>{
    const kd=e=>{gRef.current.keys[e.key]=true;}; const ku=e=>{gRef.current.keys[e.key]=false;};
    window.addEventListener('keydown',kd);window.addEventListener('keyup',ku);
    const c=canvasRef.current;if(c){const ctx=c.getContext('2d');ctx.fillStyle='#040814';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='rgba(255,61,172,0.4)';ctx.font="16px 'Exo 2',sans-serif";ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('Press START to play',c.width/2,c.height/2);}
    return()=>{window.removeEventListener('keydown',kd);window.removeEventListener('keyup',ku);if(gRef.current.anim)cancelAnimationFrame(gRef.current.anim);};
  },[]);

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12,width:'100%'}}>
      <div style={{display:'flex',gap:16,fontFamily:"'Exo 2',sans-serif",fontSize:14}}>
        <span style={{color:'#FF3CAC',fontWeight:700}}>YOU: {scores.p1}</span>
        <span style={{color:'#64748B'}}>vs</span>
        <span style={{color:'#A78BFA',fontWeight:700}}>AI: {scores.p2}</span>
        {status==='won'&&<span style={{color:'#43E97B',fontWeight:700}}>YOU WIN! 🎉</span>}
        {status==='lost'&&<span style={{color:'#FF6B35',fontWeight:700}}>AI WINS! 🤖</span>}
      </div>
      <canvas ref={canvasRef} width={420} height={320} style={{borderRadius:16,border:'1px solid rgba(255,61,172,0.3)',boxShadow:'0 0 30px rgba(255,61,172,0.1)',width:'100%',maxWidth:480}} />
      <GameBtn onClick={startGame} color="#FF3CAC">{status==='idle'?'▶ START':'↺ RESTART'}</GameBtn>
      <p style={{fontFamily:"'Exo 2',sans-serif",fontSize:11,color:'#64748B'}}>W / S or ↑ ↓ to move paddle</p>
    </div>
  );
}
