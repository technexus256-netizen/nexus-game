const FAQS = [
  {
    q: 'Is Nexus Play safe for young children?',
    a: 'Yes! All games on Nexus Play are hand-picked to be age-appropriate, non-violent, and educational or skill-building. There is no chat, no user-generated content, and no contact with strangers.',
  },
  {
    q: 'Does my child need to create an account?',
    a: 'No. All 9 games are completely free to play with no account required. The optional Google Sign-In is only needed to save scores to a leaderboard. Children can enjoy every game as a guest.',
  },
  {
    q: 'Are there in-app purchases or ads?',
    a: 'Nexus Play is 100% free with no in-app purchases, no loot boxes, and no gambling mechanics. We do not show third-party advertisements to any user on the platform.',
  },
  {
    q: 'Can I see what my child has been playing?',
    a: 'All game history and scores are stored locally on the device your child plays on. You can view them by opening the browser\'s Developer Tools → Application → Local Storage, or simply ask your child to show you their leaderboard.',
  },
  {
    q: 'How do I delete my child\'s data?',
    a: 'If your child used Guest mode, simply clearing the browser\'s local storage removes all data. If they signed in with Google, contact us at privacy@nexusplay.com and we will delete the account within 5 business days.',
  },
  {
    q: 'Does Nexus Play use social features or chat?',
    a: 'No. There is no in-game chat, messaging, friend lists, or any form of social interaction. The leaderboard only shows scores — no usernames from other players are displayed to your child.',
  },
];

const GAMES_INFO = [
  { icon:'🐍', name:'Neon Snake',     age:'4+', type:'Arcade',     skill:'Hand-eye coordination' },
  { icon:'⭕', name:'Tic Tac Toe',    age:'4+', type:'Strategy',   skill:'Critical thinking' },
  { icon:'🚀', name:'Flappy Rocket',  age:'6+', type:'Arcade',     skill:'Persistence & patience' },
  { icon:'🃏', name:'Memory Cards',   age:'4+', type:'Memory',     skill:'Memory & concentration' },
  { icon:'🧱', name:'Brick Breaker',  age:'6+', type:'Arcade',     skill:'Aim & reaction time' },
  { icon:'☄️', name:'Asteroid Dodge', age:'7+', type:'Action',     skill:'Multi-tasking' },
  { icon:'⌨️', name:'Word Blast',     age:'8+', type:'Educational',skill:'Spelling & vocabulary' },
  { icon:'🏓', name:'Cyber Pong',     age:'5+', type:'Sports',     skill:'Coordination' },
  { icon:'🛸', name:'Space Shooter',  age:'7+', type:'Arcade',     skill:'Focus & strategy' },
];

export default function ParentGuidePage() {
  return (
    <div style={{ maxWidth:960, margin:'0 auto', padding:'clamp(32px,6vw,60px) 16px 80px' }}>
      <style>{`
        .pg-faq {
          background:rgba(124,58,237,0.06); border:1px solid rgba(124,58,237,0.18);
          border-radius:16px; padding:24px; margin-bottom:14px; transition:all 0.2s;
        }
        .pg-faq:hover { border-color:rgba(124,58,237,0.38); background:rgba(124,58,237,0.1); }
        .pg-badge {
          display:inline-block; background:rgba(67,233,123,0.12); border:1px solid rgba(67,233,123,0.3);
          border-radius:8px; padding:2px 8px; font-family:'Exo 2',sans-serif;
          font-size:11px; color:#43E97B; font-weight:700;
        }
      `}</style>

      {/* Header */}
      <div style={{ textAlign:'center', marginBottom:52 }}>
        <div style={{ fontSize:52, marginBottom:16 }}>👨‍👩‍👧</div>
        <h1 style={{ fontFamily:"'Fredoka One',cursive", fontSize:'clamp(28px,5vw,42px)',
          background:'linear-gradient(135deg,#A78BFA,#EC4899)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:12 }}>
          Parent Guide
        </h1>
        <p style={{ fontFamily:"'Exo 2',sans-serif", fontSize:15, color:'#94A3B8', maxWidth:540, margin:'0 auto', lineHeight:1.7 }}>
          Everything parents need to know about Nexus Play — our safety features, game content, and how we protect young players.
        </p>
      </div>

      {/* Safety highlights */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:48 }}>
        {[
          { icon:'🛡️', label:'100% Kid-Safe Content', color:'#43E97B' },
          { icon:'🚫', label:'Zero Ads or Purchases', color:'#60A5FA' },
          { icon:'💬', label:'No Chat or Social', color:'#F472B6' },
          { icon:'🔒', label:'No Personal Data Sold', color:'#A78BFA' },
        ].map(({ icon, label, color }) => (
          <div key={label} style={{ background:'rgba(15,12,41,0.6)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:16, padding:'22px 20px', textAlign:'center' }}>
            <div style={{ fontSize:32, marginBottom:10 }}>{icon}</div>
            <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:13, color, fontWeight:700, lineHeight:1.4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Games table */}
      <div style={{ marginBottom:48 }}>
        <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:24, color:'#fff', marginBottom:20 }}>
          🎮 Game Content Guide
        </h2>
        <style>{`
          @media(max-width:640px){
            .pg-table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;}
            .pg-table{min-width:560px;}
          }
        `}</style>
        <div className="pg-table-wrap">
          <div className="pg-table" style={{ background:'rgba(15,12,41,0.6)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:18, overflow:'hidden' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 80px 100px 1fr', padding:'12px 20px', background:'rgba(124,58,237,0.12)', borderBottom:'1px solid rgba(124,58,237,0.2)' }}>
              {['Game','Type','Age','Rating','Skill Built'].map(h => (
                <div key={h} style={{ fontFamily:"'Exo 2',sans-serif", fontSize:11, color:'#A78BFA', fontWeight:700, letterSpacing:1, textTransform:'uppercase' }}>{h}</div>
              ))}
            </div>
            {GAMES_INFO.map(({ icon, name, type, age, skill }, i) => (
              <div key={name} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 80px 100px 1fr', padding:'14px 20px', borderBottom: i < GAMES_INFO.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems:'center' }}>
                <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:14, color:'#E2E8F0', display:'flex', alignItems:'center', gap:8 }}><span>{icon}</span>{name}</div>
                <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:13, color:'#94A3B8' }}>{type}</div>
                <div><span className="pg-badge">{age}</span></div>
                <div style={{ display:'flex', gap:2 }}>{[0,1,2,3,4].map(j => <span key={j} style={{ fontSize:11 }}>⭐</span>)}</div>
                <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:12, color:'#64748B' }}>{skill}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ marginBottom:48 }}>
        <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:24, color:'#fff', marginBottom:20 }}>
          ❓ Frequently Asked Questions
        </h2>
        {FAQS.map(({ q, a }) => (
          <div key={q} className="pg-faq">
            <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:17, color:'#fff', marginBottom:8 }}>Q: {q}</div>
            <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:14, color:'#94A3B8', lineHeight:1.7 }}>A: {a}</div>
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div style={{ background:'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(236,72,153,0.1))', border:'1px solid rgba(124,58,237,0.3)', borderRadius:18, padding:'32px', textAlign:'center' }}>
        <div style={{ fontSize:36, marginBottom:12 }}>📬</div>
        <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:22, color:'#fff', marginBottom:8 }}>Have more questions?</div>
        <p style={{ fontFamily:"'Exo 2',sans-serif", fontSize:14, color:'#94A3B8', marginBottom:0 }}>
          Email us at <span style={{ color:'#A78BFA', fontWeight:700 }}>parents@nexusplay.com</span> — a real human will respond within 24 hours.
        </p>
      </div>
    </div>
  );
}
