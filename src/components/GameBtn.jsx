import { useState } from 'react';

export default function GameBtn({ children, onClick, color = '#7C3AED', style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: `linear-gradient(135deg,${color},${color}99)`,
        border: 'none', borderRadius: 12,
        padding: '12px 28px', color: '#fff',
        fontSize: 14, fontFamily: "'Fredoka One',cursive",
        cursor: 'pointer', transition: 'all 0.2s',
        transform: hov ? 'translateY(-2px) scale(1.05)' : 'scale(1)',
        boxShadow: hov ? `0 8px 24px ${color}60` : `0 4px 12px ${color}30`,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
