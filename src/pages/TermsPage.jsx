const TERMS = [
  {
    icon: '✅',
    title: '1. Acceptance of Terms',
    text: 'By accessing or using Nexus Play ("the Platform"), you agree to be bound by these Terms of Use. If you do not agree, please discontinue use of the Platform immediately. We reserve the right to update these terms at any time — continued use constitutes acceptance of any changes.',
  },
  {
    icon: '🎮',
    title: '2. Use of the Platform',
    text: 'Nexus Play is a free-to-play browser gaming platform. You may play all games without registration. An optional Google Sign-In allows you to save scores and access leaderboards. You agree not to exploit bugs, use cheats, or attempt to manipulate game scores or leaderboards.',
  },
  {
    icon: '👶',
    title: '3. Age Requirements',
    text: 'Nexus Play is designed for users of all ages. Users under 13 should have a parent or guardian review these terms. We do not knowingly allow children under 13 to create accounts without verified parental consent. Parents may contact us to remove their child\'s data.',
  },
  {
    icon: '🚫',
    title: '4. Prohibited Conduct',
    text: 'You agree not to: (a) attempt to reverse-engineer, hack, or disrupt the Platform; (b) impersonate other players or staff; (c) upload malicious code or attempt XSS/injection attacks; (d) use the Platform for commercial purposes without written permission; (e) violate any applicable laws while using the Platform.',
  },
  {
    icon: '🏆',
    title: '5. Leaderboards & Scores',
    text: 'Leaderboard scores are saved locally and optionally synced via your account. We reserve the right to remove scores that appear to be the result of cheating, exploitation, or automated play. Decisions about score validity are final.',
  },
  {
    icon: '🔗',
    title: '6. Third-Party Services',
    text: 'The Platform uses Google Sign-In (subject to Google\'s own Terms of Service and Privacy Policy) and may include links to third-party websites. Nexus Play is not responsible for the content or practices of any third-party service.',
  },
  {
    icon: '⚖️',
    title: '7. Disclaimer of Warranties',
    text: 'The Platform is provided "as-is" without warranties of any kind. We do not guarantee uninterrupted availability, error-free operation, or that games will function on every device or browser. Use is at your own risk.',
  },
  {
    icon: '🛡️',
    title: '8. Limitation of Liability',
    text: 'To the maximum extent permitted by law, Nexus Play and its creators shall not be liable for any indirect, incidental, or consequential damages arising from your use of or inability to use the Platform.',
  },
  {
    icon: '✏️',
    title: '9. Changes to Terms',
    text: 'We may revise these Terms at any time. The "Last updated" date at the top of this page reflects when the most recent changes were made. We encourage you to review this page periodically.',
  },
  {
    icon: '📧',
    title: '10. Contact',
    text: 'If you have questions about these Terms, contact us at legal@nexusplay.com. We aim to respond to all inquiries within 5 business days.',
  },
];

export default function TermsPage() {
  return (
    <div style={{ maxWidth:860, margin:'0 auto', padding:'clamp(32px,6vw,60px) 16px 80px' }}>
      <style>{`
        .tm-section {
          border-left:3px solid rgba(124,58,237,0.4); padding:0 0 0 24px; margin-bottom:32px;
          transition:border-color 0.2s;
        }
        .tm-section:hover { border-left-color:#A78BFA; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign:'center', marginBottom:52 }}>
        <div style={{ fontSize:52, marginBottom:16 }}>📄</div>
        <h1 style={{ fontFamily:"'Fredoka One',cursive", fontSize:'clamp(28px,5vw,42px)',
          background:'linear-gradient(135deg,#A78BFA,#EC4899)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:12 }}>
          Terms of Use
        </h1>
        <p style={{ fontFamily:"'Exo 2',sans-serif", fontSize:15, color:'#94A3B8', maxWidth:500, margin:'0 auto', lineHeight:1.7 }}>
          Please read these terms carefully before using the Nexus Play platform.
        </p>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginTop:16, background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.25)', borderRadius:10, padding:'8px 18px' }}>
          <span style={{ color:'#A78BFA', fontSize:13, fontFamily:"'Exo 2',sans-serif" }}>Last updated: May 2026 · Effective immediately</span>
        </div>
      </div>

      {/* TL;DR banner */}
      <div style={{ background:'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(236,72,153,0.1))', border:'1px solid rgba(124,58,237,0.3)', borderRadius:16, padding:'20px 24px', marginBottom:40, display:'flex', gap:14, alignItems:'center' }}>
        <span style={{ fontSize:28 }}>⚡</span>
        <div>
          <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:17, color:'#A78BFA', marginBottom:4 }}>TL;DR</div>
          <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:13, color:'#94A3B8', lineHeight:1.6 }}>
            Play fair. Don't cheat. Don't hack. Respect others. Use the platform for fun. That's it! 🎮
          </div>
        </div>
      </div>

      {/* Sections */}
      {TERMS.map(({ icon, title, text }) => (
        <div key={title} className="tm-section">
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
            <span style={{ fontSize:20 }}>{icon}</span>
            <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:19, color:'#E2E8F0' }}>{title}</h2>
          </div>
          <p style={{ fontFamily:"'Exo 2',sans-serif", fontSize:14, color:'#94A3B8', lineHeight:1.8, margin:0 }}>{text}</p>
        </div>
      ))}

      {/* Footer note */}
      <div style={{ background:'rgba(15,12,41,0.6)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:16, padding:'22px', textAlign:'center', marginTop:8 }}>
        <p style={{ fontFamily:"'Exo 2',sans-serif", fontSize:13, color:'#64748B', margin:0 }}>
          These terms were written to be read by actual humans. If something is unclear, just{' '}
          <span style={{ color:'#A78BFA', fontWeight:700, cursor:'pointer' }}>contact us</span>{' '}
          and we'll explain it in plain English.
        </p>
      </div>
    </div>
  );
}
