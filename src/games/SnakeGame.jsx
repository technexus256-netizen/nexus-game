import { useState, useEffect, useRef, useCallback } from 'react';
import GameBtn from '../components/GameBtn';
import MobileArrows from '../components/MobileArrows';

const CELL = 20;

export default function SnakeGame({ onScore }) {
  const canvasRef = useRef(null);
  const gRef = useRef({ snake:[], food:{}, dir:{x:1,y:0}, nextDir:{x:1,y:0}, score:0, running:false, loop:null, speed:120 });
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('idle');

  const placeFood = () => {
    const c = canvasRef.current; if (!c) return;
    gRef.current.food = { x: Math.floor(Math.random()*(c.width/CELL)), y: Math.floor(Math.random()*(c.height/CELL)) };
  };

  const tick = useCallback(() => {
    const g = gRef.current; const c = canvasRef.current; if (!c||!g.running) return;
    const ctx = c.getContext('2d');
    const cols = Math.floor(c.width/CELL), rows = Math.floor(c.height/CELL);
    g.dir = g.nextDir;
    const head = { x:(g.snake[0].x+g.dir.x+cols)%cols, y:(g.snake[0].y+g.dir.y+rows)%rows };
    if (g.snake.some(s => s.x===head.x && s.y===head.y)) {
      g.running=false; clearInterval(g.loop); setStatus('dead'); return;
    }
    g.snake.unshift(head);
    if (head.x===g.food.x && head.y===g.food.y) {
      g.score+=10; setScore(g.score); onScore&&onScore(g.score); placeFood();
      if (g.score%50===0) { clearInterval(g.loop); g.speed=Math.max(60,g.speed-10); g.loop=setInterval(tick,g.speed); }
    } else g.snake.pop();

    ctx.fillStyle='#040814'; ctx.fillRect(0,0,c.width,c.height);
    ctx.strokeStyle='rgba(0,255,136,0.05)';
    for(let x=0;x<cols;x++) for(let y=0;y<rows;y++) ctx.strokeRect(x*CELL,y*CELL,CELL,CELL);
    ctx.fillStyle='#FF6B35'; ctx.shadowColor='#FF6B35'; ctx.shadowBlur=15;
    ctx.beginPath(); ctx.arc(g.food.x*CELL+CELL/2,g.food.y*CELL+CELL/2,CELL/2-2,0,Math.PI*2); ctx.fill();
    ctx.shadowBlur=0;
    g.snake.forEach((s,i) => {
      const r=1-i/g.snake.length;
      ctx.fillStyle=`rgba(0,${Math.floor(200+55*r)},${Math.floor(136*r)},${0.5+0.5*r})`;
      ctx.shadowColor='#00FF88'; ctx.shadowBlur=i===0?20:5;
      const p=i===0?0:2;
      ctx.beginPath(); ctx.roundRect(s.x*CELL+p,s.y*CELL+p,CELL-p*2,CELL-p*2,i===0?6:3); ctx.fill();
    });
    ctx.shadowBlur=0;
  }, [onScore]);

  const initGame = useCallback(() => {
    const g = gRef.current;
    g.snake=[{x:10,y:10},{x:9,y:10},{x:8,y:10}];
    g.dir={x:1,y:0}; g.nextDir={x:1,y:0}; g.score=0; g.speed=120; g.running=true;
    setScore(0); setStatus('running'); placeFood();
    if(g.loop) clearInterval(g.loop); g.loop=setInterval(tick,g.speed);
  }, [tick]);

  useEffect(() => {
    const handler = e => {
      const g=gRef.current; if(!g.running) return; const d=g.dir;
      if((e.key==='ArrowUp'||e.key==='w')&&d.y!==1)  g.nextDir={x:0,y:-1};
      if((e.key==='ArrowDown'||e.key==='s')&&d.y!==-1) g.nextDir={x:0,y:1};
      if((e.key==='ArrowLeft'||e.key==='a')&&d.x!==1)  g.nextDir={x:-1,y:0};
      if((e.key==='ArrowRight'||e.key==='d')&&d.x!==-1) g.nextDir={x:1,y:0};
      e.preventDefault();
    };
    window.addEventListener('keydown',handler);
    const c=canvasRef.current; if(c){const ctx=c.getContext('2d');ctx.fillStyle='#040814';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='rgba(0,255,136,0.25)';ctx.font='bold 18px monospace';ctx.textAlign='center';ctx.fillText('Press START to play',c.width/2,c.height/2);}
    return () => { window.removeEventListener('keydown',handler); clearInterval(gRef.current.loop); };
  }, []);

  const mobileDir = dir => {
    const g=gRef.current,d=g.dir;
    if(dir==='up'&&d.y!==1) g.nextDir={x:0,y:-1};
    if(dir==='down'&&d.y!==-1) g.nextDir={x:0,y:1};
    if(dir==='left'&&d.x!==1) g.nextDir={x:-1,y:0};
    if(dir==='right'&&d.x!==-1) g.nextDir={x:1,y:0};
  };

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12,width:'100%'}}>
      <div style={{display:'flex',gap:16,alignItems:'center'}}>
        <span style={{fontFamily:"'Exo 2',sans-serif",fontSize:18,fontWeight:800,color:'#00FF88'}}>Score: {score}</span>
        {status==='dead'&&<span style={{color:'#FF6B35',fontFamily:"'Exo 2',sans-serif",fontSize:14,fontWeight:700}}>GAME OVER!</span>}
      </div>
      <canvas ref={canvasRef} width={400} height={360} style={{borderRadius:16,border:'1px solid rgba(0,255,136,0.3)',boxShadow:'0 0 30px rgba(0,255,136,0.15)',width:'100%',maxWidth:480}} />
      <GameBtn onClick={initGame} color="#00FF88">{status==='idle'?'▶ START':status==='dead'?'↺ RETRY':'↺ RESTART'}</GameBtn>
      <MobileArrows onDir={mobileDir} onRelease={()=>{}} />
    </div>
  );
}
