import { useState, useCallback } from 'react';
import GameBtn from '../components/GameBtn';

const SUITS = ['♠','♥','♦','♣'];
const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const RED   = new Set(['♥','♦']);

function makeDeck() {
  const d = [];
  for (const s of SUITS) for (const r of RANKS) d.push({s,r});
  for (let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[d[i],d[j]]=[d[j],d[i]];}
  return d;
}

function cardVal(r) {
  if (['J','Q','K'].includes(r)) return 10;
  if (r==='A') return 11;
  return parseInt(r);
}

function handVal(hand) {
  let total=0, aces=0;
  for (const c of hand) { total+=cardVal(c.r); if(c.r==='A')aces++; }
  while (total>21&&aces>0){total-=10;aces--;}
  return total;
}

function Card({card, hidden}) {
  if (hidden) return (
    <div style={{width:56,height:80,borderRadius:10,background:'linear-gradient(135deg,#1e3a8a,#312e81)',border:'2px solid rgba(124,58,237,0.4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,boxShadow:'0 4px 12px rgba(0,0,0,0.4)',flexShrink:0}}>
      🂠
    </div>
  );
  const red = RED.has(card.s);
  return (
    <div style={{width:56,height:80,borderRadius:10,background:'#fff',border:'2px solid #e5e7eb',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2,boxShadow:'0 4px 12px rgba(0,0,0,0.3)',flexShrink:0}}>
      <div style={{fontFamily:"'Fredoka One',cursive",fontSize:18,color:red?'#EF4444':'#111',lineHeight:1}}>{card.r}</div>
      <div style={{fontSize:20,color:red?'#EF4444':'#111',lineHeight:1}}>{card.s}</div>
    </div>
  );
}

export default function BlackjackGame({ onScore }) {
  const [deck,      setDeck]      = useState([]);
  const [player,    setPlayer]    = useState([]);
  const [dealer,    setDealer]    = useState([]);
  const [phase,     setPhase]     = useState('idle');  // idle bet playing dealer result
  const [chips,     setChips]     = useState(1000);
  const [bet,       setBet]       = useState(0);
  const [msg,       setMsg]       = useState('');
  const [wins,      setWins]      = useState(0);

  const deal = useCallback(() => {
    if (bet===0||chips<bet) return;
    const d = makeDeck();
    const p = [d.pop(),d.pop()];
    const dl= [d.pop(),d.pop()];
    setDeck(d); setPlayer(p); setDealer(dl); setChips(c=>c-bet); setPhase('playing'); setMsg('');
    if (handVal(p)===21) { setTimeout(()=>stand(dl,p,d),400); }
  }, [bet, chips]);

  const hit = useCallback(() => {
    if (phase!=='playing') return;
    setDeck(d=>{
      const nd=[...d]; const card=nd.pop();
      setPlayer(p=>{
        const np=[...p,card];
        const val=handVal(np);
        if (val>21) { setPhase('result'); setMsg('💥 Bust! You lose.'); }
        else if (val===21) { setTimeout(()=>doStand(nd,np),300); }
        return np;
      });
      return nd;
    });
  }, [phase]);

  const doStand = useCallback((deckRef, playerRef) => {
    setPhase('dealer');
    let d=[...dealer]; let dk=[...deckRef];
    while(handVal(d)<17){d=[...d,dk.pop()];}
    setDealer(d);
    setTimeout(()=>{
      const pv=handVal(playerRef), dv=handVal(d);
      let m='';
      if (dv>21||pv>dv)      { m='🎉 You Win!'; setChips(c=>c+bet*2); setWins(w=>w+1); onScore&&onScore(bet*2); }
      else if (pv===dv)      { m='🤝 Push — Bet returned!'; setChips(c=>c+bet); }
      else                   { m='😔 Dealer wins!'; }
      setMsg(m); setPhase('result');
    }, 600);
  }, [dealer, bet, onScore]);

  const stand = useCallback((dl, pl, dk) => {
    doStand(dk||deck, pl||player);
  }, [deck, player, doStand]);

  const newHand = () => { setPlayer([]); setDealer([]); setBet(0); setPhase('idle'); setMsg(''); };
  const addBet  = (n)  => { if(phase==='idle'&&chips>=n) { setBet(b=>b+n); setChips(c=>c-n); } };
  const clearBet= ()   => { if(phase==='idle') { setChips(c=>c+bet); setBet(0); } };

  const pv = handVal(player), dv = handVal(dealer);

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14,width:'100%',maxWidth:480}}>
      <style>{`.bj-chip{cursor:pointer;border:none;border-radius:50%;width:48px;height:48px;font-family:'Fredoka One',cursive;font-size:13px;transition:all 0.2s;}.bj-chip:hover{transform:translateY(-3px) scale(1.1);}`}</style>

      {/* Stats */}
      <div style={{display:'flex',gap:20,alignItems:'center'}}>
        <div style={{textAlign:'center'}}><div style={{fontFamily:"'Fredoka One',cursive",fontSize:22,color:'#22c55e'}}>💵 {chips}</div><div style={{fontFamily:"'Exo 2',sans-serif",fontSize:11,color:'#64748B'}}>Chips</div></div>
        <div style={{textAlign:'center'}}><div style={{fontFamily:"'Fredoka One',cursive",fontSize:22,color:'#F59E0B'}}>🎯 {bet}</div><div style={{fontFamily:"'Exo 2',sans-serif",fontSize:11,color:'#64748B'}}>Bet</div></div>
        <div style={{textAlign:'center'}}><div style={{fontFamily:"'Fredoka One',cursive",fontSize:22,color:'#A78BFA'}}>🏆 {wins}</div><div style={{fontFamily:"'Exo 2',sans-serif",fontSize:11,color:'#64748B'}}>Wins</div></div>
      </div>

      {/* Dealer hand */}
      <div style={{background:'rgba(15,12,41,0.7)',border:'1px solid rgba(34,197,94,0.3)',borderRadius:16,padding:'16px 20px',width:'100%'}}>
        <div style={{fontFamily:"'Exo 2',sans-serif",fontSize:12,color:'#64748B',marginBottom:10,fontWeight:700}}>
          DEALER {phase!=='idle'&&phase!=='playing'?`— ${dv}`:dealer.length>0?`— ${cardVal(dealer[0].r)}+?`:''}
        </div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap',minHeight:84}}>
          {dealer.map((c,i)=><Card key={i} card={c} hidden={i===1&&phase==='playing'}/>)}
          {dealer.length===0&&<div style={{fontFamily:"'Exo 2',sans-serif",fontSize:13,color:'#374151',display:'flex',alignItems:'center'}}>Cards appear here</div>}
        </div>
      </div>

      {/* Player hand */}
      <div style={{background:'rgba(15,12,41,0.7)',border:'1px solid rgba(124,58,237,0.3)',borderRadius:16,padding:'16px 20px',width:'100%'}}>
        <div style={{fontFamily:"'Exo 2',sans-serif",fontSize:12,color:'#64748B',marginBottom:10,fontWeight:700}}>
          YOU {player.length>0?`— ${pv}`:''}
          {pv===21&&player.length===2&&<span style={{color:'#F59E0B',marginLeft:8}}>BLACKJACK!</span>}
          {pv>21&&<span style={{color:'#EF4444',marginLeft:8}}>BUST!</span>}
        </div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap',minHeight:84}}>
          {player.map((c,i)=><Card key={i} card={c} hidden={false}/>)}
          {player.length===0&&<div style={{fontFamily:"'Exo 2',sans-serif",fontSize:13,color:'#374151',display:'flex',alignItems:'center'}}>Cards appear here</div>}
        </div>
      </div>

      {/* Message */}
      {msg&&<div style={{fontFamily:"'Fredoka One',cursive",fontSize:22,color: msg.includes('Win')?'#43E97B':msg.includes('Push')?'#F59E0B':'#FF6B35',animation:'pop-in 0.3s ease'}}>{msg}</div>}

      {/* Chip buttons */}
      {phase==='idle'&&(
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10,width:'100%'}}>
          <div style={{fontFamily:"'Exo 2',sans-serif",fontSize:12,color:'#64748B',fontWeight:700}}>PLACE BET</div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center'}}>
            {[[10,'#EF4444'],[25,'#3B82F6'],[50,'#22C55E'],[100,'#F59E0B'],[200,'#A78BFA']].map(([v,c])=>(
              <button key={v} className="bj-chip" onClick={()=>addBet(v)} disabled={chips<v}
                style={{background:c,color:'#fff',boxShadow:`0 4px 12px ${c}60`,opacity:chips<v?0.4:1}}>
                {v}
              </button>
            ))}
            <button className="bj-chip" onClick={clearBet} style={{background:'rgba(100,116,139,0.4)',border:'1px solid rgba(100,116,139,0.4)',color:'#94A3B8',fontSize:11}}>
              Clear
            </button>
          </div>
          <GameBtn onClick={deal} color="#22c55e" style={{opacity:bet===0?0.5:1}}>
            {bet>0?`🃏 Deal (Bet: ${bet})`:'🃏 Deal'}
          </GameBtn>
          {chips===0&&<div style={{fontFamily:"'Exo 2',sans-serif",fontSize:13,color:'#EF4444'}}>Out of chips!</div>}
        </div>
      )}

      {/* Action buttons */}
      {phase==='playing'&&(
        <div style={{display:'flex',gap:10}}>
          <GameBtn onClick={hit}             color="#22c55e">🃏 Hit</GameBtn>
          <GameBtn onClick={()=>stand(null,null,null)} color="#EF4444">✋ Stand</GameBtn>
        </div>
      )}

      {/* New hand */}
      {phase==='result'&&(
        <div style={{display:'flex',gap:10}}>
          <GameBtn onClick={newHand} color="#22c55e">↺ New Hand</GameBtn>
          {chips===0&&<GameBtn onClick={()=>{setChips(1000);newHand();}} color="#F59E0B">💵 Reload Chips</GameBtn>}
        </div>
      )}
    </div>
  );
}
