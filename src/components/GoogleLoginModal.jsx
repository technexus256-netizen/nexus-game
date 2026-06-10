import { useState } from 'react';
import { loginWithGoogle } from '../firebase';

export default function GoogleLoginModal({ open, onClose, onLogin, gameTitle }) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  if (!open) return null;

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const user = await loginWithGoogle();
      onLogin(user);
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes modalFadeIn {
          from { opacity:0; transform:scale(0.92) translateY(-12px); }
          to   { opacity:1; transform:scale(1)    translateY(0);      }
        }
        .glogin-google-btn {
          display:flex; align-items:center; justify-content:center; gap:12px;
          width:100%; padding:14px 20px;
          background:#fff; color:#3c4043;
          border:none; border-radius:12px;
          font-family:'Exo 2',sans-serif; font-size:15px; font-weight:700;
          cursor:pointer; transition:all 0.2s;
          box-shadow:0 2px 10px rgba(0,0,0,0.3);
        }
        .glogin-google-btn:hover:not(:disabled) {
          background:#f1f1f1; transform:translateY(-2px);
          box-shadow:0 6px 20px rgba(0,0,0,0.35);
        }
        .glogin-google-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .glogin-close-btn {
          position:absolute; top:14px; right:16px;
          background:rgba(124,58,237,0.15); border:1px solid rgba(124,58,237,0.3);
          border-radius:8px; width:32px; height:32px;
          color:#A78BFA; font-size:18px; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          transition:all 0.2s;
        }
        .glogin-close-btn:hover { background:rgba(124,58,237,0.3); }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position:'fixed', inset:0, zIndex:2000,
          background:'rgba(0,0,0,0.75)',
          backdropFilter:'blur(6px)',
          display:'flex', alignItems:'center', justifyContent:'center',
          padding:16,
        }}
      >
        {/* Modal card */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position:'relative',
            background:'linear-gradient(135deg,rgba(15,12,41,0.98),rgba(20,10,50,0.98))',
            border:'1px solid rgba(124,58,237,0.4)',
            borderRadius:20,
            padding:'40px 32px 32px',
            width:'100%', maxWidth:380,
            boxShadow:'0 24px 60px rgba(0,0,0,0.6), 0 0 60px rgba(124,58,237,0.12)',
            animation:'modalFadeIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            textAlign:'center',
          }}
        >
          {/* Close */}
          <button className="glogin-close-btn" onClick={onClose}>✕</button>

          {/* Icon */}
          <div style={{ fontSize:48, marginBottom:12 }}>🎮</div>

          {/* Heading */}
          <div style={{
            fontFamily:"'Fredoka One',cursive", fontSize:26,
            background:'linear-gradient(135deg,#A78BFA,#EC4899)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            marginBottom:8,
          }}>
            Sign In to Play
          </div>

          <p style={{
            fontFamily:"'Exo 2',sans-serif", fontSize:14, color:'#94A3B8',
            marginBottom:28, lineHeight:1.6,
          }}>
            {gameTitle
              ? `Sign in to play ${gameTitle} — and save your scores, favorites, and reviews.`
              : 'Save your scores, track favorites, and compete on the leaderboard.'}
          </p>

          {/* Google Button */}
          <button
            className="glogin-google-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {/* Google "G" SVG icon */}
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Signing in…' : 'Continue with Google'}
          </button>

          {/* Error */}
          {error && (
            <p style={{
              fontFamily:"'Exo 2',sans-serif", fontSize:13,
              color:'#F87171', marginTop:16,
              background:'rgba(239,68,68,0.1)', borderRadius:8,
              padding:'8px 12px', border:'1px solid rgba(239,68,68,0.2)',
            }}>
              ⚠️ {error}
            </p>
          )}

          {/* Footer note */}
          <p style={{
            fontFamily:"'Exo 2',sans-serif", fontSize:11,
            color:'#475569', marginTop:20, lineHeight:1.5,
          }}>
            By signing in you agree to our{' '}
            <span style={{ color:'#A78BFA', cursor:'pointer' }}>Terms</span> &amp;{' '}
            <span style={{ color:'#A78BFA', cursor:'pointer' }}>Privacy Policy</span>.
          </p>
        </div>
      </div>
    </>
  );
}
