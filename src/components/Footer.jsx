import { useState } from 'react';

const FOOTER_LINKS = {
  'Quick Links': [
    { label: '🏠 Home',        key: 'home'        },
    { label: '🎮 All Games',   key: 'games'       },
    { label: '⭐ Favorites',   key: 'favorites'   },
    { label: '🏆 Leaderboard', key: 'leaderboard' },
  ],
  'Game Categories': [
    { label: '🏎️ Racing',      key: 'games' },
    { label: '⚔️ Action',      key: 'games' },
    { label: '🧩 Puzzle',      key: 'games' },
    { label: '📚 Educational', key: 'games' },
    { label: '⚽ Sports',      key: 'games' },
    { label: '🕹️ Arcade',      key: 'games' },
  ],
  'Support': [
    { label: '📧 Contact Us',    key: 'contact' },
    { label: '🛡️ Privacy Policy', key: 'privacy' },
    { label: '📄 Terms of Use',  key: 'terms' },
    { label: '👨‍👩‍👧 Parent Guide',  key: 'parent-guide' },
    { label: '🐛 Report a Bug',  key: 'report-bug' },
  ],
};

const SOCIALS = [
  { icon: '𝕏',  label: 'Twitter',  color: '#1DA1F2' },
  { icon: 'f',  label: 'Facebook', color: '#1877F2' },
  { icon: '▶',  label: 'YouTube',  color: '#FF0000' },
  { icon: '📸', label: 'Instagram',color: '#E1306C' },
  { icon: '💬', label: 'Discord',  color: '#5865F2' },
];

const GAMES_LIST = ['🐍 Neon Snake','⭕ Tic Tac Toe','🚀 Flappy Rocket','🃏 Memory Cards','🧱 Brick Breaker','☄️ Asteroid Dodge','⌨️ Word Blast','🏓 Cyber Pong','🛸 Space Shooter'];

export default function Footer({ onNav }) {
  const [email, setEmail]   = useState('');
  const [subbed, setSubbed] = useState(false);
  const year = new Date().getFullYear();

  const handleSub = () => {
    if (email.includes('@')) { setSubbed(true); setEmail(''); }
  };

  return (
    <footer style={{ background:'#020510', borderTop:'1px solid rgba(124,58,237,0.2)', marginTop:0 }}>
      <style>{`
        .ft-link {
          font-family:'Exo 2',sans-serif; font-size:13px; color:#64748B;
          cursor:pointer; transition:all 0.2s; display:block; padding:5px 0;
          text-decoration:none;
        }
        .ft-link:hover { color:#A78BFA; padding-left:6px; }
        .ft-social {
          width:40px; height:40px; border-radius:10px;
          display:flex; align-items:center; justify-content:center;
          font-size:16px; font-weight:900; cursor:pointer;
          transition:all 0.25s; border:1px solid rgba(255,255,255,0.08);
          background:rgba(255,255,255,0.04);
          font-family:Georgia,serif;
        }
        .ft-social:hover { transform:translateY(-4px) scale(1.12); border-color:rgba(124,58,237,0.5); }
        .ft-game-tag {
          background:rgba(124,58,237,0.1); border:1px solid rgba(124,58,237,0.2);
          borderRadius:8px; padding:5px 10px; font-family:'Exo 2',sans-serif;
          font-size:12px; color:#94A3B8; cursor:pointer; transition:all 0.2s;
          white-space:nowrap;
        }
        .ft-game-tag:hover { background:rgba(124,58,237,0.2); color:#A78BFA; }
        .ft-sub-btn {
          background:linear-gradient(135deg,#7C3AED,#EC4899); border:none;
          border-radius:0 10px 10px 0; padding:0 18px; color:#fff;
          font-family:'Fredoka One',cursive; font-size:14px; cursor:pointer;
          transition:all 0.2s; white-space:nowrap;
        }
        .ft-sub-btn:hover { filter:brightness(1.15); }
        .ft-col-title {
          font-family:'Fredoka One',cursive; font-size:16px; color:#fff;
          margin-bottom:16px; display:flex; align-items:center; gap:8px;
        }
        .ft-col-title::after {
          content:''; flex:1; height:1px;
          background:linear-gradient(90deg,rgba(124,58,237,0.5),transparent);
        }
      `}</style>

      {/* ── Top band: newsletter ─────────────────────── */}
      <div style={{display:"none", background:'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(236,72,153,0.1))', borderBottom:'1px solid rgba(124,58,237,0.15)', padding:'28px 24px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', gap:20, flexWrap:'wrap' }}>
          <div>
            <h3 style={{ fontFamily:"'Fredoka One',cursive", fontSize:'clamp(18px,3vw,24px)', color:'#fff', marginBottom:4 }}>
              📬 Stay in the Game!
            </h3>
            <p style={{ fontFamily:"'Exo 2',sans-serif", fontSize:13, color:'#94A3B8' }}>
              Get notified about new games, tournaments & updates.
            </p>
          </div>
          {subbed ? (
            <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:18, color:'#43E97B', display:'flex', alignItems:'center', gap:8 }}>
              ✅ You're subscribed!
            </div>
          ) : (
            <div style={{ display:'flex', borderRadius:10, overflow:'hidden', border:'1px solid rgba(124,58,237,0.4)', maxWidth:380, width:'100%' }}>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key==='Enter' && handleSub()}
                placeholder="your@email.com"
                style={{ flex:1, background:'rgba(4,8,20,0.8)', border:'none', padding:'12px 16px', color:'#fff', fontSize:14, fontFamily:"'Exo 2',sans-serif", minWidth:0 }}
              />
              <button className="ft-sub-btn" onClick={handleSub}>Subscribe →</button>
            </div>
          )}
        </div>
      </div>

      {/* ── Main footer grid ────────────────────────── */}
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'52px 24px 32px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'40px 32px' }}>

          {/* Brand column */}
          <div style={{ gridColumn:'span 1' }}>
            {/* Logo */}
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16, cursor:'pointer' }} onClick={() => onNav('home')}>
              <span style={{ fontSize:32 }}>🎮</span>
              <div>
                <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:22, background:'linear-gradient(135deg,#A78BFA,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                  NEXUS PLAY
                </div>
                <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:9, color:'#64748B', letterSpacing:2 }}>GAMING PLATFORM</div>
              </div>
            </div>

            <p style={{ fontFamily:"'Exo 2',sans-serif", fontSize:13, color:'#64748B', lineHeight:1.8, marginBottom:20 }}>
              The ultimate kid-safe gaming platform with 9 real playable HTML5 games. No downloads, no installs — just play! 🚀
            </p>

            {/* Badges */}
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
              {[['🛡️','100% Safe'],['✅','Free to Play'],['📱','Mobile Ready']].map(([ico,txt]) => (
                <span key={txt} style={{ background:'rgba(124,58,237,0.12)', border:'1px solid rgba(124,58,237,0.25)', borderRadius:8, padding:'4px 10px', fontFamily:"'Exo 2',sans-serif", fontSize:11, color:'#A78BFA', display:'flex', alignItems:'center', gap:4 }}>
                  {ico} {txt}
                </span>
              ))}
            </div>

            {/* Socials */}
            <div style={{ display:'none', gap:8, flexWrap:'wrap' }}>
              {SOCIALS.map(s => (
                <div key={s.label} className="ft-social" title={s.label} style={{ color:s.color }}>
                  {s.icon}
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <div className="ft-col-title">{title}</div>
              {links.map(({ label, key }) => (
                <span key={label} className="ft-link" onClick={() => key && onNav(key)}>
                  {label}
                </span>
              ))}
            </div>
          ))}

          {/* Stats column */}
          <div>
            <div className="ft-col-title">Platform Stats</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
              {[['25','Games'],['HTML5','Engine'],['Free','Forever'],['0','Downloads'],['25+','Categories'],['100%','Kid Safe']].map(([v,l]) => (
                <div key={l} style={{ background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.15)', borderRadius:10, padding:'10px 12px', textAlign:'center' }}>
                  <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:18, background:'linear-gradient(135deg,#A78BFA,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{v}</div>
                  <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:10, color:'#64748B', marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>

            {/* Play button */}
            <button
              onClick={() => onNav('games')}
              style={{ width:'100%', background:'linear-gradient(135deg,#7C3AED,#EC4899)', border:'none', borderRadius:12, padding:'13px', color:'#fff', fontFamily:"'Fredoka One',cursive", fontSize:15, cursor:'pointer', transition:'all 0.25s', boxShadow:'0 4px 20px rgba(124,58,237,0.4)' }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform='none'}
            >
              ▶ Start Playing Now
            </button>
          </div>
        </div>

        {/* ── Games tag cloud ──────────────────────── */}
        <div style={{ marginTop:40, paddingTop:28, borderTop:'1px solid rgba(124,58,237,0.12)', display: "none" }}>
          <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:12, color:'#374151', marginBottom:12, fontWeight:700, letterSpacing:1, textTransform:'uppercase' }}>
            Playable Games on Platform
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {GAMES_LIST.map(g => (
              <span key={g} className="ft-game-tag" onClick={() => onNav('games')} style={{ background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:8, padding:'5px 10px', fontFamily:"'Exo 2',sans-serif", fontSize:12, color:'#94A3B8', cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap' }}>
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ───────────────────────────── */}
        <div style={{ marginTop:28, paddingTop:20, borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', justifyContent:'center', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <p style={{ fontFamily:"'Exo 2',sans-serif", fontSize:12, color:'#374151' }}>
            © {year} Nexus Play. Made with ❤️ for gamers everywhere. All rights reserved.
          </p>
          <div style={{ display:'none', gap:16 }}>
            {['Privacy','Terms','Cookies','Sitemap'].map(t => (
              <span key={t} style={{ fontFamily:"'Exo 2',sans-serif", fontSize:11, color:'#374151', cursor:'pointer', transition:'color 0.2s' }}
                onMouseEnter={e => e.target.style.color='#A78BFA'}
                onMouseLeave={e => e.target.style.color='#374151'}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
