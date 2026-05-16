import { useState, useCallback } from 'react';
import GameBtn from '../components/GameBtn';

const SUITS  = ['♠','♥','♦','♣'];
const RANKS  = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
const VALUES = Object.fromEntries(RANKS.map((r,i)=>[r,i+2]));
const RED    = new Set(['♥','♦']);

function makeDeck() {
  const d=[];
  for(const s of SUITS) for(const r of RANKS) d.push({s,r,v:VALUES[r]});
  for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[d[i],d[j]]=[d[j],d[i]];}
  return d;
}

function MiniCard({card, big=false}) {
  if (!card) return null;
  const red = RED.has(card.s);
  return (
    <div style={{
      width: big?70:52, height: big?96:72, borderRadius:10,
      background:'#fff', border:'2px solid #e5e7eb',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      boxShadow:'0 4px 14px rgba(0,0,0,0.35)', flexShrink:0, gap:2,
    }}>
      <div style={{fontFamily:"'Fredoka One',cursive",fontSize:big?22:16,color:red?'#EF4444':'#111',lineHeight:1}}>{card.r}</div>
      <div style={{fontSize:big?26:20,color:red?'#EF4444':'#111',lineHeight:1}}>{card.s}</div>
    </div>
  );
}

function CardBack({big=false}) {
  return (
    <div style={{width:big?70:52,height:big?96:72,borderRadius:10,background:'linear-gradient(135deg,#1e3a8a,#312e81)',border:'2px solid rgba(124,58,237,0.4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:big?28:22,boxShadow:'0 4px 14px rgba(0,0,0,0.4)',flexShrink:0}}>
      🂠
    </div>
  );
}

export default function CardWarGame({ onScore }) {
  const [playerDeck, setPlayerDeck] = useState([]);
  const [aiDeck,     setAiDeck]     = useState([]);
  const [playerCard, setPlayerCard] = useState(null);
  const [aiCard,     setAiCard]     = useState(null);
  const [roundMsg,   setRoundMsg]   = useState('');
  const [status,     setStatus]     = useState('idle');
  const [warPile,    setWarPile]    = useState([]);
  const [wins,       setWins]       = useState(0);
  const [roundNum,   setRoundNum]   = useState(0);

  const newGame = () => {
    const d = makeDeck();
    const half = Math.floor(d.length/2);
    setPlayerDeck(d.slice(0,half));
    setAiDeck(d.slice(half));
    setPlayerCard(null); setAiCard(null);
    setRoundMsg(''); setStatus('playing');
    setWarPile([]); setRoundNum(0);
  };

  const flip = useCallback(() => {
    if (status!=='playing') return;
    if (playerDeck.length===0||aiDeck.length===0) {
      setStatus('over'); return;
    }
    const pd=[...playerDeck], ad=[...aiDeck], wp=[...warPile];
    const pc=pd.shift(), ac=ad.shift();
    setPlayerCard(pc); setAiCard(ac);
    const rn = roundNum+1; setRoundNum(rn);

    setTimeout(()=>{
      if (pc.v>ac.v) {
        const won=[...wp,pc,ac];
        pd.push(...won.sort(()=>Math.random()-0.5));
        setRoundMsg(`🎉 You win the round! +${won.length} cards`);
        setWarPile([]);
        setWins(w=>w+1);
        onScore&&onScore(won.length*5);
      } else if (ac.v>pc.v) {
        const won=[...wp,pc,ac];
        ad.push(...won.sort(()=>Math.random()-0.5));
        setRoundMsg(`😔 AI wins the round! -${won.length} cards`);
        setWarPile([]);
      } else {
        // WAR
        const warCards=[];
        for(let i=0;i<3&&pd.length>0;i++) warCards.push(pd.shift());
        for(let i=0;i<3&&ad.length>0;i++) warCards.push(ad.shift());
        setWarPile([...wp,pc,ac,...warCards]);
        setRoundMsg(`⚔️ WAR! ${warCards.length} cards in the pile!`);
      }
      setPlayerDeck(pd); setAiDeck(ad);
      if (pd.length===0){setStatus('lost');}
      else if (ad.length===0){setStatus('won');onScore&&onScore(500);}
    }, 600);
  }, [playerDeck, aiDeck, warPile, status, roundNum, onScore]);

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14,width:'100%',maxWidth:440}}>
      {/* Stats */}
      <div style={{display:'flex',gap:20}}>
        {[['Your Cards',playerDeck.length,'#A78BFA'],['AI Cards',aiDeck.length,'#EF4444'],['Round',roundNum,'#F59E0B']].map(([l,v,c])=>(
          <div key={l} style={{textAlign:'center'}}>
            <div style={{fontFamily:"'Fredoka One',cursive",fontSize:20,color:c}}>{v}</div>
            <div style={{fontFamily:"'Exo 2',sans-serif",fontSize:10,color:'#64748B'}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Battle area */}
      <div style={{background:'rgba(15,12,41,0.7)',border:'1px solid rgba(124,58,237,0.25)',borderRadius:20,padding:'24px 32px',width:'100%'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-around',gap:16}}>
          {/* Player side */}
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
            <div style={{fontFamily:"'Exo 2',sans-serif",fontSize:11,color:'#A78BFA',fontWeight:700}}>YOU</div>
            {playerCard ? <MiniCard card={playerCard} big/> : <CardBack big/>}
            {playerCard&&<div style={{fontFamily:"'Fredoka One',cursive",fontSize:14,color:'#A78BFA'}}>{playerCard.r}{playerCard.s} = {playerCard.v}</div>}
          </div>

          {/* VS */}
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
            <div style={{fontFamily:"'Fredoka One',cursive",fontSize:22,color:'#fff'}}>VS</div>
            {warPile.length>0&&<div style={{fontFamily:"'Exo 2',sans-serif",fontSize:11,color:'#F59E0B',textAlign:'center'}}>⚔️ War pile:<br/>{warPile.length} cards</div>}
          </div>

          {/* AI side */}
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
            <div style={{fontFamily:"'Exo 2',sans-serif",fontSize:11,color:'#EF4444',fontWeight:700}}>AI</div>
            {aiCard ? <MiniCard card={aiCard} big/> : <CardBack big/>}
            {aiCard&&<div style={{fontFamily:"'Fredoka One',cursive",fontSize:14,color:'#EF4444'}}>{aiCard.r}{aiCard.s} = {aiCard.v}</div>}
          </div>
        </div>

        {roundMsg&&(
          <div style={{textAlign:'center',marginTop:14,fontFamily:"'Fredoka One',cursive",fontSize:16,
            color:roundMsg.includes('You win')?'#43E97B':roundMsg.includes('AI wins')?'#FF6B35':'#F59E0B',
            animation:'pop-in 0.3s ease'}}>
            {roundMsg}
          </div>
        )}
      </div>

      {/* Progress bar */}
      {status==='playing'&&(
        <div style={{width:'100%',height:10,background:'rgba(15,12,41,0.8)',borderRadius:99,overflow:'hidden',border:'1px solid rgba(124,58,237,0.2)',position:'relative'}}>
          <div style={{position:'absolute',left:0,top:0,height:'100%',width:`${(playerDeck.length/52)*100}%`,background:'linear-gradient(90deg,#A78BFA,#EC4899)',transition:'width 0.4s',borderRadius:99}}/>
          <div style={{position:'absolute',right:0,top:0,height:'100%',width:`${(aiDeck.length/52)*100}%`,background:'linear-gradient(90deg,#EF4444,#F97316)',transition:'width 0.4s',borderRadius:99,transformOrigin:'right'}}/>
        </div>
      )}

      {/* End messages */}
      {(status==='won'||status==='lost'||status==='over')&&(
        <div style={{textAlign:'center',animation:'pop-in 0.4s ease'}}>
          <div style={{fontFamily:"'Fredoka One',cursive",fontSize:28,color:status==='won'?'#43E97B':'#FF6B35'}}>
            {status==='won'?'🎉 You Win the War!':status==='lost'?'😔 AI Wins the War!':'🤝 All cards used!'}
          </div>
          <div style={{fontFamily:"'Exo 2',sans-serif",fontSize:13,color:'#94A3B8',marginTop:4}}>
            Completed in {roundNum} rounds • {wins} round wins
          </div>
        </div>
      )}

      <GameBtn onClick={status==='idle'?newGame:status==='playing'?flip:newGame} color="#dc2626">
        {status==='idle'?'▶ Start Game':status==='playing'?'🃏 Flip Cards!':'↺ New Game'}
      </GameBtn>
    </div>
  );
}
