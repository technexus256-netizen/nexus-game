import { useState } from 'react';

const GAMES = ['🐍 Neon Snake','⭕ Tic Tac Toe','🚀 Flappy Rocket','🃏 Memory Cards','🧱 Brick Breaker','☄️ Asteroid Dodge','⌨️ Word Blast','🏓 Cyber Pong','🛸 Space Shooter','🌐 General / Website'];
const TYPES  = ['🐛 Game Crash / Freeze','🏆 Wrong Score / Leaderboard','🖥️ Display / Visual Glitch','📱 Mobile / Touch Issue','🔊 Sound Problem','🔐 Login / Account Issue','⚡ Slow / Performance','💡 Other'];

export default function ReportBugPage() {
  const [form, setForm] = useState({ game:'', type:'', desc:'', steps:'', browser:'', email:'' });
  const [sent, setSent] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    if (form.game && form.type && form.desc) setSent(true);
  };

  return (
    <div style={{ maxWidth:860, margin:'0 auto', padding:'clamp(32px,6vw,60px) 16px 80px' }}>
      <style>{`
        .rb-input {
          width:100%; background:rgba(15,12,41,0.8);
          border:1px solid rgba(124,58,237,0.3); border-radius:12px;
          padding:12px 16px; color:#fff; font-family:'Exo 2',sans-serif; font-size:14px;
          transition:all 0.2s;
        }
        .rb-input:focus { outline:none; border-color:#7C3AED; box-shadow:0 0 20px rgba(124,58,237,0.25); }
        .rb-label { font-family:'Exo 2',sans-serif; font-size:13px; color:#94A3B8; font-weight:700; margin-bottom:6px; display:block; }
        .rb-tip { background:rgba(96,165,250,0.08); border:1px solid rgba(96,165,250,0.2); border-radius:10px; padding:12px 16px; display:flex; gap:10px; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign:'center', marginBottom:52 }}>
        <div style={{ fontSize:52, marginBottom:16 }}>🐛</div>
        <h1 style={{ fontFamily:"'Fredoka One',cursive", fontSize:'clamp(28px,5vw,42px)',
          background:'linear-gradient(135deg,#A78BFA,#EC4899)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:12 }}>
          Report a Bug
        </h1>
        <p style={{ fontFamily:"'Exo 2',sans-serif", fontSize:15, color:'#94A3B8', maxWidth:500, margin:'0 auto', lineHeight:1.7 }}>
          Found something broken? Help us squash it! The more detail you provide, the faster we can fix it.
        </p>
      </div>

      {sent ? (
        <div style={{ textAlign:'center', padding:'60px 20px', background:'rgba(67,233,123,0.06)', border:'1px solid rgba(67,233,123,0.2)', borderRadius:24 }}>
          <div style={{ fontSize:64, marginBottom:20 }}>🎉</div>
          <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:28, color:'#43E97B', marginBottom:12 }}>Bug Report Received!</div>
          <p style={{ fontFamily:"'Exo 2',sans-serif", fontSize:15, color:'#94A3B8', maxWidth:420, margin:'0 auto 28px', lineHeight:1.7 }}>
            Thanks for helping improve Nexus Play! Our team will investigate and get back to you if needed.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <button
              onClick={() => { setSent(false); setForm({ game:'', type:'', desc:'', steps:'', browser:'', email:'' }); }}
              style={{ background:'rgba(124,58,237,0.2)', border:'1px solid rgba(124,58,237,0.4)', borderRadius:12, padding:'12px 24px', color:'#A78BFA', fontFamily:"'Exo 2',sans-serif", fontWeight:700, fontSize:14, cursor:'pointer' }}
            >
              Report Another Bug
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Tips */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:14, marginBottom:36 }}>
            {[
              { icon:'📸', tip:'Screenshots help us reproduce the issue faster.' },
              { icon:'🔁', tip:'Tell us the exact steps to reproduce the bug.' },
              { icon:'🌐', tip:'Mention your browser & device type (e.g. Chrome on iPhone).' },
            ].map(({ icon, tip }) => (
              <div key={tip} className="rb-tip">
                <span style={{ fontSize:20, flexShrink:0 }}>{icon}</span>
                <p style={{ fontFamily:"'Exo 2',sans-serif", fontSize:13, color:'#94A3B8', margin:0, lineHeight:1.6 }}>{tip}</p>
              </div>
            ))}
          </div>

          <style>{`@media(max-width:600px){.rb-2col{grid-template-columns:1fr!important;}}`}</style>
          <form onSubmit={handleSubmit} style={{ background:'rgba(15,12,41,0.6)', border:'1px solid rgba(124,58,237,0.25)', borderRadius:20, padding:'28px 20px', display:'flex', flexDirection:'column', gap:22 }}>

            <div className="rb-2col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
              <div>
                <label className="rb-label">Which game? *</label>
                <select className="rb-input" value={form.game} onChange={set('game')} required>
                  <option value="">Select game…</option>
                  {GAMES.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="rb-label">Bug type *</label>
                <select className="rb-input" value={form.type} onChange={set('type')} required>
                  <option value="">Select type…</option>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="rb-label">Describe the bug *</label>
              <textarea className="rb-input" rows={4} placeholder="What happened? What did you expect to happen instead?" value={form.desc} onChange={set('desc')} required style={{ resize:'vertical' }} />
            </div>

            <div>
              <label className="rb-label">Steps to reproduce</label>
              <textarea className="rb-input" rows={3} placeholder="1. Open the game&#10;2. Click play&#10;3. After 10 seconds…" value={form.steps} onChange={set('steps')} style={{ resize:'vertical' }} />
            </div>

            <div className="rb-2col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
              <div>
                <label className="rb-label">Browser &amp; Device</label>
                <input className="rb-input" placeholder="e.g. Chrome 124 on iPhone 15" value={form.browser} onChange={set('browser')} />
              </div>
              <div>
                <label className="rb-label">Your email (optional)</label>
                <input className="rb-input" type="email" placeholder="For follow-up questions" value={form.email} onChange={set('email')} />
              </div>
            </div>

            {/* Severity */}
            <div>
              <label className="rb-label">Severity</label>
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                {[['🟢','Minor'],['🟡','Moderate'],['🔴','Critical']].map(([dot, sev]) => (
                  <label key={sev} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:10, padding:'9px 16px' }}>
                    <input type="radio" name="severity" value={sev} style={{ accentColor:'#7C3AED' }} />
                    <span style={{ fontFamily:"'Exo 2',sans-serif", fontSize:13, color:'#CBD5E1' }}>{dot} {sev}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              style={{ background:'linear-gradient(135deg,#7C3AED,#EC4899)', border:'none', borderRadius:12, padding:'14px', color:'#fff', fontFamily:"'Fredoka One',cursive", fontSize:16, cursor:'pointer', transition:'all 0.25s', boxShadow:'0 4px 20px rgba(124,58,237,0.4)', marginTop:4 }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform='none'}
            >
              🐛 Submit Bug Report
            </button>
          </form>
        </>
      )}
    </div>
  );
}
