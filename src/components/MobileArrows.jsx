export default function MobileArrows({ onDir, onRelease }) {
  const dirs = [['↑','up'],['←','left'],['↓','down'],['→','right']];
  return (
    <div style={{ display:'flex', gap:6, marginTop:4 }}>
      {dirs.map(([label, dir]) => (
        <button
          key={dir}
          onPointerDown={() => onDir(dir)}
          onPointerUp={onRelease}
          onPointerLeave={onRelease}
          style={{
            width:44, height:44,
            background:'rgba(124,58,237,0.3)',
            border:'1px solid rgba(124,58,237,0.5)',
            borderRadius:10, color:'#fff',
            fontSize:16, cursor:'pointer',
            userSelect:'none', touchAction:'none',
            fontFamily:'monospace',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
