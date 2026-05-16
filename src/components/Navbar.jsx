import { useState, useEffect } from 'react';
import logo from '../assest/img/logo-gamin.png'

const NAV_LINKS = [
  { icon: '🏠', label: 'Home',        key: 'home'        },
  { icon: '🎮', label: 'Games',       key: 'games'       },
  { icon: '⭐', label: 'Favorites',   key: 'favorites'   },
  { icon: '🏆', label: 'Leaderboard', key: 'leaderboard' },
];

export default function Navbar({ page, setPage, search, setSearch, user, onLoginOpen, onLogout }) {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [isMobile,    setIsMobile]    = useState(window.innerWidth < 768);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    const onResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) { setMenuOpen(false); setSearchOpen(false); }
    };
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // close mobile menu on nav
  const navigate = (key) => {
    setPage(key);
    setMenuOpen(false);
    setSearchOpen(false);
  };

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity:0; transform:translateY(-12px); }
          to   { opacity:1; transform:translateY(0);     }
        }
        .nb-link {
          display:flex; align-items:center; gap:7px;
          padding:9px 14px; border-radius:10px;
          font-family:'Exo 2',sans-serif; font-weight:700; font-size:13px;
          cursor:pointer; transition:all 0.2s; border:1px solid transparent;
          white-space:nowrap;
        }
        .nb-link:hover { color:#A78BFA !important; background:rgba(124,58,237,0.1) !important; }
        .nb-link.active { color:#A78BFA; background:rgba(124,58,237,0.15); border-color:rgba(124,58,237,0.35); }
        .ham-line { display:block; width:22px; height:2px; background:#A78BFA; border-radius:2px; transition:all 0.3s; }
        .search-bar { transition:all 0.35s cubic-bezier(0.4,0,0.2,1); }
        .nb-play-btn {
          background:linear-gradient(135deg,#7C3AED,#EC4899);
          border:none; border-radius:10px; padding:9px 18px;
          color:#fff; font-family:'Fredoka One',cursive; font-size:14px;
          cursor:pointer; transition:all 0.25s; white-space:nowrap;
          box-shadow:0 4px 15px rgba(124,58,237,0.4);
        }
        .nb-play-btn:hover { transform:translateY(-2px) scale(1.04); box-shadow:0 8px 24px rgba(124,58,237,0.55); }
      `}</style>

      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:1000,
        background: scrolled ? 'rgba(4,8,20,0.97)' : 'rgba(4,8,20,0.75)',
        backdropFilter:'blur(24px)',
        borderBottom:'1px solid rgba(124,58,237,0.2)',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none',
        transition:'all 0.35s',
      }}>

        {/* ── Main bar ─────────────────────────────── */}
        <div style={{
          maxWidth:1280, margin:'0 auto',
          padding:'0 20px', height:64,
          display:'flex', alignItems:'center', gap:12,
        }}>

          {/* Logo */}
          <div
            onClick={() => navigate('home')}
            style={{ display:'flex', alignItems:'center', gap:9, cursor:'pointer', flexShrink:0, marginRight:8 }}
          >
            <span style={{ fontSize:28 }} className="float-anim">🎮</span>
            {/* <img src={logo} alt="logo" style={{width: "80px"}} /> */}
            <div>
              <div
                className="neon-text"
                style={{ fontFamily:"'Fredoka One',cursive", fontSize:20, lineHeight:1,
                  background:'linear-gradient(135deg,#A78BFA,#EC4899)',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}
              >
                NEXUS PLAY
              </div>
              <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:9, color:'#64748B', letterSpacing:2, marginTop:1 }}>
                GAMING PLATFORM
              </div>
            </div>
          </div>

          {/* Desktop nav links */}
          {!isMobile && (
            <div style={{ display:'flex', gap:2, alignItems:'center', flex:1 }}>
              {NAV_LINKS.map(({ icon, label, key }) => (
                <span
                  key={key}
                  className={`nb-link${page === key ? ' active' : ''}`}
                  onClick={() => navigate(key)}
                  style={{ color: page === key ? '#A78BFA' : '#94A3B8' }}
                >
                  <span>{icon}</span> {label}
                </span>
              ))}
            </div>
          )}

          {/* Spacer on mobile */}
          {isMobile && <div style={{ flex:1 }} />}

          {/* Desktop search box */}
          {!isMobile && (
            <div style={{ position:'relative', width:240 }}>
              <span style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', fontSize:14, color:'#64748B', pointerEvents:'none' }}>🔍</span>
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage('home'); }}
                placeholder="Search games…"
                style={{
                  width:'100%', background:'rgba(15,12,41,0.85)',
                  border:'1px solid rgba(124,58,237,0.3)', borderRadius:10,
                  padding:'9px 12px 9px 34px', color:'#fff', fontSize:13,
                  fontFamily:"'Exo 2',sans-serif",
                }}
              />
            </div>
          )}

          {/* Play free button (desktop) */}
          {!isMobile && (
            <button className="nb-play-btn" onClick={() => navigate('games')}>
              ▶ Play Free
            </button>
          )}

          {/* Login / User avatar (desktop) */}
          {!isMobile && (
            user ? (
              <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  title={user.displayName}
                  style={{ width:34, height:34, borderRadius:'50%', border:'2px solid #A78BFA', objectFit:'cover' }}
                />
                <button
                  onClick={onLogout}
                  style={{
                    background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.35)',
                    borderRadius:9, padding:'7px 12px', color:'#F87171',
                    fontFamily:"'Exo 2',sans-serif", fontWeight:700, fontSize:12,
                    cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap',
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginOpen}
                style={{
                  background:'rgba(124,58,237,0.18)', border:'1px solid rgba(124,58,237,0.4)',
                  borderRadius:10, padding:'9px 16px', color:'#A78BFA',
                  fontFamily:"'Exo 2',sans-serif", fontWeight:700, fontSize:13,
                  cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap',
                }}
              >
                🔑 Sign In
              </button>
            )
          )}

          {/* Mobile: search icon */}
          {isMobile && (
            <button
              onClick={() => setSearchOpen(o => !o)}
              style={{ background:'rgba(124,58,237,0.15)', border:'1px solid rgba(124,58,237,0.3)', borderRadius:9, width:38, height:38, cursor:'pointer', fontSize:16, color:'#A78BFA', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}
            >
              🔍
            </button>
          )}

          {/* Hamburger */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{ background:'rgba(124,58,237,0.15)', border:'1px solid rgba(124,58,237,0.3)', borderRadius:9, width:38, height:38, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:5, flexShrink:0 }}
              aria-label="Menu"
            >
              <span className="ham-line" style={{ transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
              <span className="ham-line" style={{ opacity: menuOpen ? 0 : 1 }} />
              <span className="ham-line" style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
            </button>
          )}
        </div>

        {/* ── Mobile search bar ────────────────────── */}
        {isMobile && searchOpen && (
          <div style={{ padding:'0 16px 14px', animation:'slideDown 0.25s ease' }}>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', fontSize:14, color:'#64748B' }}>🔍</span>
              <input
                autoFocus
                value={search}
                onChange={e => { setSearch(e.target.value); setPage('home'); }}
                placeholder="Search games…"
                style={{
                  width:'100%', background:'rgba(15,12,41,0.9)',
                  border:'1px solid rgba(124,58,237,0.4)', borderRadius:10,
                  padding:'11px 12px 11px 34px', color:'#fff', fontSize:14,
                  fontFamily:"'Exo 2',sans-serif",
                }}
              />
            </div>
          </div>
        )}

        {/* ── Mobile dropdown menu ─────────────────── */}
        {isMobile && menuOpen && (
          <div style={{
            background:'rgba(4,8,20,0.98)', borderTop:'1px solid rgba(124,58,237,0.2)',
            padding:'8px 12px 16px', animation:'slideDown 0.3s ease',
          }}>
            {NAV_LINKS.map(({ icon, label, key }) => (
              <div
                key={key}
                onClick={() => navigate(key)}
                style={{
                  display:'flex', alignItems:'center', gap:12,
                  padding:'13px 16px', borderRadius:12, cursor:'pointer',
                  margin:'3px 0', transition:'all 0.2s',
                  background: page === key ? 'rgba(124,58,237,0.18)' : 'transparent',
                  border: page === key ? '1px solid rgba(124,58,237,0.35)' : '1px solid transparent',
                }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(124,58,237,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = page===key ? 'rgba(124,58,237,0.18)' : 'transparent'}
              >
                <span style={{ fontSize:20 }}>{icon}</span>
                <span style={{ fontFamily:"'Exo 2',sans-serif", fontWeight:700, fontSize:15, color: page===key ? '#A78BFA' : '#CBD5E1' }}>
                  {label}
                </span>
                {page === key && <span style={{ marginLeft:'auto', color:'#A78BFA', fontSize:12 }}>●</span>}
              </div>
            ))}

            {/* Divider */}
            <div style={{ height:1, background:'rgba(124,58,237,0.15)', margin:'10px 4px' }} />

            {/* Play button in mobile menu */}
            <button
              className="nb-play-btn"
              onClick={() => navigate('games')}
              style={{ width:'100%', padding:'13px', fontSize:15 }}
            >
              ▶ Play Free Now
            </button>

            {/* Sign In / Out in mobile menu */}
            {user ? (
              <div style={{ display:'flex', alignItems:'center', gap:12, marginTop:10, padding:'10px 14px', background:'rgba(124,58,237,0.08)', borderRadius:12 }}>
                <img src={user.photoURL} alt={user.displayName} style={{ width:36, height:36, borderRadius:'50%', border:'2px solid #A78BFA' }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Exo 2',sans-serif", fontWeight:700, fontSize:13, color:'#CBD5E1' }}>{user.displayName}</div>
                  <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:11, color:'#64748B' }}>{user.email}</div>
                </div>
                <button onClick={onLogout} style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'6px 10px', color:'#F87171', fontFamily:"'Exo 2',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer' }}>Out</button>
              </div>
            ) : (
              <button
                onClick={() => { setMenuOpen(false); onLoginOpen(); }}
                style={{ width:'100%', marginTop:10, padding:'13px', background:'rgba(124,58,237,0.18)', border:'1px solid rgba(124,58,237,0.4)', borderRadius:12, color:'#A78BFA', fontFamily:"'Exo 2',sans-serif", fontWeight:700, fontSize:15, cursor:'pointer' }}
              >
                🔑 Sign In with Google
              </button>
            )}

            {/* Stats strip */}
            <div style={{ display:'flex', justifyContent:'space-around', marginTop:14, padding:'12px 0', background:'rgba(124,58,237,0.08)', borderRadius:12 }}>
              {[['9','Games'],['Free','Forever'],['No','Download']].map(([v,l]) => (
                <div key={l} style={{ textAlign:'center' }}>
                  <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:16, background:'linear-gradient(135deg,#A78BFA,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{v}</div>
                  <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:10, color:'#64748B', marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
