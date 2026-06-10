import { useState, useEffect, useRef } from 'react';

export default function SearchModal({ open, onClose, games, onPlay }) {
  const [q, setQ] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQ('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const term = q.trim().toLowerCase();
  const results = term
    ? games.filter(g =>
        g.title.toLowerCase().includes(term) ||
        g.category.toLowerCase().includes(term))
    : games.slice(0, 8); // show a few suggestions before typing

  const handlePick = g => { onClose(); onPlay(g); };

  return (
    <>
      <style>{`
        @keyframes searchFadeIn {
          from { opacity:0; transform:translateY(-16px); }
          to   { opacity:1; transform:translateY(0);     }
        }
        .search-result-row {
          display:flex; align-items:center; gap:14px;
          padding:12px 14px; border-radius:12px; cursor:pointer;
          border:1px solid transparent; transition:all 0.15s;
        }
        .search-result-row:hover {
          background:rgba(124,58,237,0.14);
          border-color:rgba(124,58,237,0.3);
        }
        .search-results::-webkit-scrollbar { width:8px; }
        .search-results::-webkit-scrollbar-thumb {
          background:rgba(124,58,237,0.4); border-radius:8px;
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position:'fixed', inset:0, zIndex:3000,
          background:'rgba(0,0,0,0.78)', backdropFilter:'blur(6px)',
          display:'flex', alignItems:'flex-start', justifyContent:'center',
          padding:'80px 16px 16px',
        }}
      >
        {/* Panel */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width:'100%', maxWidth:560,
            background:'linear-gradient(135deg,rgba(15,12,41,0.98),rgba(20,10,50,0.98))',
            border:'1px solid rgba(124,58,237,0.4)', borderRadius:18,
            boxShadow:'0 24px 60px rgba(0,0,0,0.6)',
            animation:'searchFadeIn 0.25s ease', overflow:'hidden',
          }}
        >
          {/* Search input */}
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'16px 18px', borderBottom:'1px solid rgba(124,58,237,0.2)' }}>
            <span style={{ fontSize:18, color:'#A78BFA' }}>🔍</span>
            <input
              ref={inputRef}
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search games by name or category…"
              style={{
                flex:1, background:'transparent', border:'none', outline:'none',
                color:'#fff', fontSize:16, fontFamily:"'Exo 2',sans-serif",
              }}
            />
            <button
              onClick={onClose}
              style={{ background:'rgba(124,58,237,0.15)', border:'1px solid rgba(124,58,237,0.3)', borderRadius:8, padding:'4px 10px', color:'#A78BFA', fontSize:12, cursor:'pointer', fontFamily:"'Exo 2',sans-serif" }}
            >
              Esc
            </button>
          </div>

          {/* Results */}
          <div className="search-results" style={{ maxHeight:'52vh', overflowY:'auto', padding:10 }}>
            {!term && (
              <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:12, color:'#64748B', padding:'4px 8px 10px' }}>
                Suggested games
              </div>
            )}

            {results.length === 0 ? (
              <div style={{ textAlign:'center', padding:'40px 16px', color:'#64748B', fontFamily:"'Exo 2',sans-serif" }}>
                No games found for “{q}” 😔
              </div>
            ) : (
              results.map(g => (
                <div key={g.id} className="search-result-row" onClick={() => handlePick(g)}>
                  <div style={{ width:44, height:44, borderRadius:12, background:`linear-gradient(135deg,${g.color}33,rgba(15,12,41,0.9))`, border:`1px solid ${g.color}55`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>
                    {g.emoji}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:"'Exo 2',sans-serif", fontWeight:700, fontSize:14, color:'#E2E8F0' }}>{g.title}</div>
                    <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:11, color:'#64748B' }}>⭐ {g.rating} • {g.category} • {g.plays} plays</div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); handlePick(g); }}
                    style={{ background:`linear-gradient(135deg,${g.color},${g.color}99)`, border:'none', borderRadius:9, padding:'7px 16px', color:'#fff', fontSize:12, fontFamily:"'Fredoka One',cursive", cursor:'pointer', flexShrink:0 }}
                  >
                    ▶ Play
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
