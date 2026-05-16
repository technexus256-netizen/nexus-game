import { useState, useRef } from 'react';
import GameBtn from '../components/GameBtn';

function getHint(guess, secret) {
  const diff = Math.abs(guess - secret);
  if (diff === 0)  return { text: '🎯 CORRECT!',      color: '#43E97B', hot: 100 };
  if (diff <= 3)   return { text: '🔥 Scorching HOT!', color: '#EF4444', hot: 95  };
  if (diff <= 7)   return { text: '🌡️ Very Warm',      color: '#F97316', hot: 80  };
  if (diff <= 15)  return { text: '☀️ Warm',           color: '#F59E0B', hot: 60  };
  if (diff <= 25)  return { text: '🌤️ Lukewarm',       color: '#EAB308', hot: 40  };
  if (diff <= 40)  return { text: '🌊 Cool',           color: '#06B6D4', hot: 25  };
  if (diff <= 60)  return { text: '❄️ Cold',           color: '#3B82F6', hot: 10  };
  return              { text: '🧊 Freezing!',          color: '#A78BFA', hot: 0   };
}

export default function NumberGuessGame({ onScore }) {
  const [secret,   setSecret]   = useState(null);
  const [guesses,  setGuesses]  = useState([]);
  const [input,    setInput]    = useState('');
  const [status,   setStatus]   = useState('idle');
  const [bestScore,setBestScore]= useState(null);
  const inputRef = useRef(null);

  const newGame = () => {
    setSecret(Math.floor(Math.random()*100)+1);
    setGuesses([]); setInput(''); setStatus('playing');
    setTimeout(()=>inputRef.current?.focus(), 100);
  };

  const guess = () => {
    const n = parseInt(input);
    if (isNaN(n)||n<1||n>100) return;
    const hint = getHint(n, secret);
    const ng = [...guesses, {n, hint}];
    setGuesses(ng); setInput('');
    if (n===secret) {
      setStatus('won');
      const s = Math.max(0, 500 - (ng.length-1)*40);
      onScore&&onScore(s);
      if (!bestScore||ng.length<bestScore) setBestScore(ng.length);
    }
    setTimeout(()=>inputRef.current?.focus(),50);
  };

  const hot = guesses.length > 0 ? guesses[guesses.length-1].hint.hot : 0;

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14,width:'100%',maxWidth:420}}>
      {/* Header */}
      <div style={{textAlign:'center'}}>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:26,color:'#A78BFA'}}>🔢 Number Guess</div>
        <div style={{fontFamily:"'Exo 2',sans-serif",fontSize:13,color:'#64748B'}}>Guess 1–100 using hot/cold hints!</div>
        {bestScore&&<div style={{fontFamily:"'Exo 2',sans-serif",fontSize:12,color:'#F59E0B',marginTop:4}}>🏆 Best: {bestScore} guesses</div>}
      </div>

      {/* Thermometer */}
      {status==='playing'&&(
        <div style={{width:'100%',height:12,background:'rgba(15,12,41,0.8)',borderRadius:99,overflow:'hidden',border:'1px solid rgba(124,58,237,0.2)'}}>
          <div style={{height:'100%',width:`${hot}%`,background:`linear-gradient(90deg,#3B82F6,#F59E0B,#EF4444)`,borderRadius:99,transition:'width 0.4s'}}/>
        </div>
      )}

      {/* Guess display */}
      {guesses.length>0&&(
        <div style={{width:'100%',maxHeight:200,overflowY:'auto',display:'flex',flexDirection:'column',gap:6}}>
          {[...guesses].reverse().map((g,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(15,12,41,0.7)',border:`1px solid ${g.hint.color}40`,borderRadius:10,padding:'8px 14px',animation:'pop-in 0.3s ease'}}>
              <span style={{fontFamily:"'Fredoka One',cursive",fontSize:18,color:'#fff'}}>{g.n}</span>
              <span style={{fontFamily:"'Exo 2',sans-serif",fontSize:13,fontWeight:700,color:g.hint.color}}>{g.hint.text}</span>
              <span style={{fontFamily:"'Exo 2',sans-serif",fontSize:11,color:'#64748B'}}>Guess #{guesses.length-i}</span>
            </div>
          ))}
        </div>
      )}

      {/* Won message */}
      {status==='won'&&(
        <div style={{textAlign:'center',animation:'pop-in 0.4s ease'}}>
          <div style={{fontFamily:"'Fredoka One',cursive",fontSize:28,color:'#43E97B'}}>🎉 Got it!</div>
          <div style={{fontFamily:"'Exo 2',sans-serif",fontSize:14,color:'#94A3B8'}}>The number was <strong style={{color:'#F59E0B'}}>{secret}</strong> — found in {guesses.length} guess{guesses.length!==1?'es':''}!</div>
          <div style={{fontFamily:"'Fredoka One',cursive",fontSize:18,color:'#A78BFA',marginTop:4}}>Score: {Math.max(0,500-(guesses.length-1)*40)}</div>
        </div>
      )}

      {/* Input */}
      {status==='playing'&&(
        <div style={{display:'flex',gap:8,width:'100%'}}>
          <input
            ref={inputRef}
            type="number" min="1" max="100"
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&guess()}
            placeholder="Enter 1–100…"
            style={{flex:1,background:'rgba(15,12,41,0.8)',border:'1px solid rgba(124,58,237,0.4)',borderRadius:10,padding:'12px 16px',color:'#fff',fontSize:16,fontFamily:"'Exo 2',sans-serif"}}
          />
          <GameBtn onClick={guess} color="#A78BFA">Guess!</GameBtn>
        </div>
      )}

      {/* Range hint */}
      {status==='playing'&&guesses.length>0&&(()=>{
        const above = guesses.filter(g=>g.n>secret).map(g=>g.n);
        const below = guesses.filter(g=>g.n<secret).map(g=>g.n);
        const lo = below.length?Math.max(...below):1;
        const hi = above.length?Math.min(...above):100;
        return <div style={{fontFamily:"'Exo 2',sans-serif",fontSize:12,color:'#64748B'}}>Range narrowed: <span style={{color:'#A78BFA',fontWeight:700}}>{lo} – {hi}</span></div>;
      })()}

      <div style={{display:'flex',gap:10}}>
        <GameBtn onClick={newGame} color="#A78BFA">{status==='idle'?'▶ Start':status==='won'?'↺ Play Again':'↺ New Number'}</GameBtn>
      </div>
    </div>
  );
}
