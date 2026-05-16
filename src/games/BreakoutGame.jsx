import { useState, useEffect, useRef } from 'react';
import GameBtn from '../components/GameBtn';

const COLS=['#FF6B35','#F59E0B','#43E97B','#06B6D4','#A78BFA','#EC4899'];
const makeBricks=()=>{const b=[];for(let r=0;r<5;r++)for(let c=0;c<8;c++)b.push({x:c*47+8,y:r*28+40,w:42,h:20,alive:true,color:COLS[r%COLS.length]});return b;};

export default function BreakoutGame({ onScore }) {
  const canvasRef = useRef(null);
  const gRef = useRef({ ball:{x:200,y:300,vx:3,vy:-4}, paddle:{x:155,w:90}, bricks:[], score:0, running:false, lives:3, anim:null });
  const [score,setScore]   = useState(0);
  const [lives,setLives]   = useState(3);
  const [status,setStatus] = useState('idle');

  const startGame = () => {
    const g=gRef.current; const c=canvasRef.current; if(!c)return;
    g.ball={x:200,y:280,vx:3+(Math.random()-.5),vy:-4}; g.paddle={x:155,w:90};
    g.bricks=makeBricks(); g.score=0; g.lives=3; g.running=true;
    setScore(0); setLives(3); setStatus('running');
    if(g.anim)cancelAnimationFrame(g.anim);
    const ctx=c.getContext('2d');
    const loop=()=>{
      if(!g.running)return;
      ctx.fillStyle='#040814'; ctx.fillRect(0,0,c.width,c.height);
      g.ball.x+=g.ball.vx; g.ball.y+=g.ball.vy;
      if(g.ball.x<=8||g.ball.x>=c.width-8) g.ball.vx*=-1;
      if(g.ball.y<=8) g.ball.vy*=-1;
      if(g.ball.y>=c.height-40&&g.ball.y<=c.height-30&&g.ball.x>=g.paddle.x&&g.ball.x<=g.paddle.x+g.paddle.w){
        const rel=(g.ball.x-g.paddle.x)/g.paddle.w-.5; g.ball.vx=rel*8; g.ball.vy=-Math.abs(g.ball.vy);
      }
      if(g.ball.y>c.height){
        g.lives--; setLives(g.lives);
        if(g.lives<=0){g.running=false;cancelAnimationFrame(g.anim);setStatus('dead');return;}
        g.ball={x:g.paddle.x+g.paddle.w/2,y:c.height-60,vx:3,vy:-4};
      }
      let won=true;
      g.bricks.forEach(b=>{
        if(!b.alive)return; won=false;
        if(g.ball.x>=b.x&&g.ball.x<=b.x+b.w&&g.ball.y>=b.y&&g.ball.y<=b.y+b.h){
          b.alive=false; g.ball.vy*=-1; g.score+=10; setScore(g.score); onScore&&onScore(g.score);
        }
      });
      if(won){g.running=false;cancelAnimationFrame(g.anim);setStatus('won');return;}
      g.bricks.filter(b=>b.alive).forEach(b=>{ctx.fillStyle=b.color;ctx.shadowColor=b.color;ctx.shadowBlur=8;ctx.beginPath();ctx.roundRect(b.x,b.y,b.w,b.h,4);ctx.fill();});
      ctx.shadowBlur=0;
      const pg=ctx.createLinearGradient(g.paddle.x,0,g.paddle.x+g.paddle.w,0);
      pg.addColorStop(0,'#7C3AED');pg.addColorStop(1,'#EC4899');
      ctx.fillStyle=pg;ctx.shadowColor='#A78BFA';ctx.shadowBlur=15;
      ctx.beginPath();ctx.roundRect(g.paddle.x,c.height-38,g.paddle.w,14,7);ctx.fill();
      ctx.fillStyle='#fff';ctx.shadowColor='#fff';ctx.shadowBlur=20;
      ctx.beginPath();ctx.arc(g.ball.x,g.ball.y,8,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
      ctx.fillStyle='#EC4899';ctx.font="14px 'Exo 2',sans-serif";ctx.textAlign='left';ctx.textBaseline='alphabetic';
      for(let i=0;i<g.lives;i++)ctx.fillText('❤️',8+i*22,22);
      ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font="bold 16px 'Exo 2',sans-serif";ctx.fillText(g.score,c.width/2,22);
      g.anim=requestAnimationFrame(loop);
    };
    g.anim=requestAnimationFrame(loop);
  };

  useEffect(()=>{
    const mov=e=>{const c=canvasRef.current;if(!c||!gRef.current.running)return;const r=c.getBoundingClientRect();const mx=(e.clientX||e.touches?.[0]?.clientX||0)-r.left;const scale=c.width/r.width;gRef.current.paddle.x=Math.max(0,Math.min(c.width-gRef.current.paddle.w,mx*scale-gRef.current.paddle.w/2));};
    const kh=e=>{const g=gRef.current;if(!g.running)return;if(e.key==='ArrowLeft')g.paddle.x=Math.max(0,g.paddle.x-18);if(e.key==='ArrowRight')g.paddle.x=Math.min(400-g.paddle.w,g.paddle.x+18);};
    window.addEventListener('mousemove',mov);window.addEventListener('touchmove',mov,{passive:true});window.addEventListener('keydown',kh);
    const c=canvasRef.current;if(c){const ctx=c.getContext('2d');ctx.fillStyle='#040814';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='rgba(167,139,250,0.4)';ctx.font="18px 'Exo 2',sans-serif";ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('Press START to play',c.width/2,c.height/2);}
    return()=>{window.removeEventListener('mousemove',mov);window.removeEventListener('touchmove',mov);window.removeEventListener('keydown',kh);if(gRef.current.anim)cancelAnimationFrame(gRef.current.anim);};
  },[]);

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12,width:'100%'}}>
      <div style={{display:'flex',gap:20,alignItems:'center'}}>
        <span style={{fontFamily:"'Exo 2',sans-serif",fontSize:18,fontWeight:800,color:'#F59E0B'}}>Score: {score}</span>
        <span>{'❤️'.repeat(lives)}</span>
        {status==='won'&&<span style={{color:'#43E97B',fontFamily:"'Fredoka One',cursive",fontSize:18}}>YOU WIN! 🎉</span>}
        {status==='dead'&&<span style={{color:'#FF6B35',fontFamily:"'Fredoka One',cursive",fontSize:18}}>GAME OVER!</span>}
      </div>
      <canvas ref={canvasRef} width={400} height={360} style={{borderRadius:16,border:'1px solid rgba(245,158,11,0.3)',boxShadow:'0 0 30px rgba(245,158,11,0.1)',width:'100%',maxWidth:480,cursor:'none'}} />
      <GameBtn onClick={startGame} color="#F59E0B">{status==='idle'?'▶ START':'↺ RESTART'}</GameBtn>
      <p style={{fontFamily:"'Exo 2',sans-serif",fontSize:11,color:'#64748B'}}>Move mouse over canvas to control paddle</p>
    </div>
  );
}
