const SECTIONS = [
  {
    icon: '🔍',
    title: 'Information We Collect',
    content: [
      'Game scores and progress saved locally in your browser (localStorage).',
      'Favorite games list stored on your device — never sent to a server.',
      'If you sign in with Google, we receive your display name, email, and profile photo from Google.',
      'We do NOT collect payment information, precise location, or device identifiers.',
    ],
  },
  {
    icon: '🎯',
    title: 'How We Use Your Information',
    content: [
      'To personalize your gaming experience (show your scores, favorites, recent games).',
      'To display your name/avatar in the leaderboard and navigation.',
      'We never sell, rent, or trade your personal data to third parties.',
      'We do not use your data for advertising or profiling.',
    ],
  },
  {
    icon: '🍪',
    title: 'Cookies & Local Storage',
    content: [
      'We use browser localStorage to remember your game state, scores, and preferences.',
      'No tracking cookies or third-party advertising cookies are used.',
      'You can clear your data at any time via your browser settings.',
    ],
  },
  {
    icon: '👶',
    title: "Children's Privacy",
    content: [
      'Nexus Play is designed to be a safe platform for players of all ages.',
      'We do not knowingly collect personal data from children under 13 without parental consent.',
      'Parents can request deletion of their child\'s data by contacting us.',
      'No behavioural advertising is shown to any user on this platform.',
    ],
  },
  {
    icon: '🔒',
    title: 'Data Security',
    content: [
      'All connections to Nexus Play are encrypted via HTTPS.',
      'Google Sign-In is handled entirely by Google\'s secure OAuth 2.0 system.',
      'We do not store passwords — authentication is fully delegated to Google.',
    ],
  },
  {
    icon: '✏️',
    title: 'Your Rights',
    content: [
      'You can delete your account and all associated data at any time.',
      'You can export or request a copy of your data by emailing us.',
      'You can opt out of Google Sign-In and play as a guest with no data collected.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth:860, margin:'0 auto', padding:'clamp(32px,6vw,60px) 16px 80px' }}>
      <style>{`
        .pp-section {
          background:rgba(124,58,237,0.05); border:1px solid rgba(124,58,237,0.18);
          border-radius:18px; padding:28px 32px; margin-bottom:20px;
          transition:border-color 0.2s;
        }
        .pp-section:hover { border-color:rgba(124,58,237,0.38); }
        .pp-bullet { display:flex; align-items:flex-start; gap:10px; margin-bottom:10px; }
        .pp-bullet:last-child { margin-bottom:0; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign:'center', marginBottom:52 }}>
        <div style={{ fontSize:52, marginBottom:16 }}>🛡️</div>
        <h1 style={{ fontFamily:"'Fredoka One',cursive", fontSize:'clamp(28px,5vw,42px)',
          background:'linear-gradient(135deg,#A78BFA,#EC4899)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:12 }}>
          Privacy Policy
        </h1>
        <p style={{ fontFamily:"'Exo 2',sans-serif", fontSize:15, color:'#94A3B8', maxWidth:520, margin:'0 auto', lineHeight:1.7 }}>
          Your privacy matters to us. Here's a plain-English explanation of what we collect and why.
        </p>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginTop:16, background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.25)', borderRadius:10, padding:'8px 18px' }}>
          <span style={{ color:'#A78BFA', fontSize:13, fontFamily:"'Exo 2',sans-serif" }}>Last updated: May 2026</span>
        </div>
      </div>

      {/* Highlight banner */}
      <div style={{ background:'linear-gradient(135deg,rgba(67,233,123,0.1),rgba(56,249,215,0.08))', border:'1px solid rgba(67,233,123,0.25)', borderRadius:16, padding:'20px 24px', marginBottom:32, display:'flex', gap:14, alignItems:'center' }}>
        <span style={{ fontSize:28 }}>✅</span>
        <div>
          <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:17, color:'#43E97B', marginBottom:4 }}>The short version</div>
          <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:13, color:'#94A3B8', lineHeight:1.6 }}>
            We don't sell your data. We don't track you across the web. Your game progress stays on your device. Google Sign-In is optional.
          </div>
        </div>
      </div>

      {/* Sections */}
      {SECTIONS.map(({ icon, title, content }) => (
        <div key={title} className="pp-section">
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
            <span style={{ fontSize:24 }}>{icon}</span>
            <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:20, color:'#fff' }}>{title}</h2>
          </div>
          {content.map((line, i) => (
            <div key={i} className="pp-bullet">
              <span style={{ color:'#7C3AED', fontSize:16, flexShrink:0, marginTop:1 }}>▸</span>
              <p style={{ fontFamily:"'Exo 2',sans-serif", fontSize:14, color:'#94A3B8', lineHeight:1.7, margin:0 }}>{line}</p>
            </div>
          ))}
        </div>
      ))}

      {/* Contact */}
      <div style={{ background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:16, padding:'24px', textAlign:'center', marginTop:12 }}>
        <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:18, color:'#fff', marginBottom:8 }}>Questions about your privacy?</div>
        <p style={{ fontFamily:"'Exo 2',sans-serif", fontSize:14, color:'#94A3B8', marginBottom:0 }}>
          Reach out at <span style={{ color:'#A78BFA', fontWeight:700 }}>privacy@nexusplay.com</span> — we'll respond within 48 hours.
        </p>
      </div>
    </div>
  );
}
