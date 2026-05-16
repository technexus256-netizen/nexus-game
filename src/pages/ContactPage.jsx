import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' });
  const [sent, setSent] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    if (form.name && form.email && form.message) setSent(true);
  };

  return (
    <div style={{ maxWidth:960, margin:'0 auto', padding:'clamp(32px,6vw,60px) 16px 80px' }}>
      <style>{`
        .ct-input {
          width:100%; background:rgba(15,12,41,0.8);
          border:1px solid rgba(124,58,237,0.3); border-radius:12px;
          padding:13px 16px; color:#fff; font-family:'Exo 2',sans-serif; font-size:14px;
          transition:all 0.2s;
        }
        .ct-input:focus { outline:none; border-color:#7C3AED; box-shadow:0 0 20px rgba(124,58,237,0.25); }
        .ct-label { font-family:'Exo 2',sans-serif; font-size:13px; color:#94A3B8; font-weight:700; margin-bottom:6px; display:block; }
        .ct-card {
          background:rgba(124,58,237,0.06); border:1px solid rgba(124,58,237,0.18);
          border-radius:16px; padding:24px; text-align:center;
          transition:all 0.2s;
        }
        .ct-card:hover { border-color:rgba(124,58,237,0.4); background:rgba(124,58,237,0.1); }
      `}</style>

      {/* Header */}
      <div style={{ textAlign:'center', marginBottom:52 }}>
        <div style={{ fontSize:52, marginBottom:16 }}>📧</div>
        <h1 style={{ fontFamily:"'Fredoka One',cursive", fontSize:'clamp(28px,5vw,42px)',
          background:'linear-gradient(135deg,#A78BFA,#EC4899)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:12 }}>
          Contact Us
        </h1>
        <p style={{ fontFamily:"'Exo 2',sans-serif", fontSize:15, color:'#94A3B8', maxWidth:500, margin:'0 auto', lineHeight:1.7 }}>
          Have a question, idea, or just want to say hi? We'd love to hear from you!
        </p>
      </div>

      <style>{`@media(max-width:700px){.ct-grid{grid-template-columns:1fr!important;}}`}</style>
      <div className="ct-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:32, alignItems:'start' }}>

        {/* Contact cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {[
            { icon:'📬', title:'Email Us', desc:'support@nexusplay.com', sub:'We reply within 24 hours' },
            { icon:'💬', title:'Discord', desc:'discord.gg/nexusplay', sub:'Chat with our community' },
            { icon:'🐦', title:'Twitter / X', desc:'@NexusPlayGames', sub:'Follow for updates' },
            { icon:'📍', title:'Based In', desc:'Planet Earth 🌍', sub:'Serving gamers worldwide' },
          ].map(({ icon, title, desc, sub }) => (
            <div key={title} className="ct-card">
              <div style={{ fontSize:28, marginBottom:8 }}>{icon}</div>
              <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:16, color:'#fff', marginBottom:4 }}>{title}</div>
              <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:14, color:'#A78BFA', fontWeight:700, marginBottom:2 }}>{desc}</div>
              <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:12, color:'#64748B' }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div style={{ background:'rgba(15,12,41,0.6)', border:'1px solid rgba(124,58,237,0.25)', borderRadius:20, padding:32 }}>
          {sent ? (
            <div style={{ textAlign:'center', padding:'40px 0' }}>
              <div style={{ fontSize:56, marginBottom:16 }}>✅</div>
              <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:24, color:'#43E97B', marginBottom:8 }}>Message Sent!</div>
              <p style={{ fontFamily:"'Exo 2',sans-serif", fontSize:14, color:'#94A3B8' }}>
                Thanks for reaching out. We'll get back to you soon!
              </p>
              <button
                onClick={() => { setSent(false); setForm({ name:'', email:'', subject:'', message:'' }); }}
                style={{ marginTop:20, background:'rgba(124,58,237,0.2)', border:'1px solid rgba(124,58,237,0.4)', borderRadius:10, padding:'10px 24px', color:'#A78BFA', fontFamily:"'Exo 2',sans-serif", fontWeight:700, fontSize:14, cursor:'pointer' }}
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
              <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:20, color:'#fff', marginBottom:4 }}>Send a Message</div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14 }}>
                <div>
                  <label className="ct-label">Your Name *</label>
                  <input className="ct-input" placeholder="Player One" value={form.name} onChange={set('name')} required />
                </div>
                <div>
                  <label className="ct-label">Email *</label>
                  <input className="ct-input" type="email" placeholder="you@email.com" value={form.email} onChange={set('email')} required />
                </div>
              </div>

              <div>
                <label className="ct-label">Subject</label>
                <select className="ct-input" value={form.subject} onChange={set('subject')}>
                  <option value="">Select a topic…</option>
                  <option>🐛 Bug Report</option>
                  <option>💡 Game Suggestion</option>
                  <option>🏆 Leaderboard Issue</option>
                  <option>🛡️ Safety Concern</option>
                  <option>💬 General Question</option>
                </select>
              </div>

              <div>
                <label className="ct-label">Message *</label>
                <textarea
                  className="ct-input" rows={5}
                  placeholder="Tell us what's on your mind…"
                  value={form.message} onChange={set('message')} required
                  style={{ resize:'vertical' }}
                />
              </div>

              <button
                type="submit"
                style={{ background:'linear-gradient(135deg,#7C3AED,#EC4899)', border:'none', borderRadius:12, padding:'14px', color:'#fff', fontFamily:"'Fredoka One',cursive", fontSize:16, cursor:'pointer', transition:'all 0.25s', boxShadow:'0 4px 20px rgba(124,58,237,0.4)' }}
                onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform='none'}
              >
                🚀 Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
