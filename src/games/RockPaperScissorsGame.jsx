import { useState } from 'react';

const CHOICES = ['🪨', '📄', '✂️'];
const NAMES = ['Rock', 'Paper', 'Scissors'];

const getResult = (player, ai) => {
  if (player === ai) return 'draw';
  if (
    (player === 0 && ai === 2) ||
    (player === 1 && ai === 0) ||
    (player === 2 && ai === 1)
  ) return 'win';
  return 'lose';
};

const RESULT_COLORS = { win: '#10B981', lose: '#EF4444', draw: '#F59E0B' };
const RESULT_TEXT = { win: '🎉 You Win!', lose: '💀 You Lose!', draw: '🤝 Draw!' };

export default function RockPaperScissorsGame({ onScore }) {
  const [scores, setScores] = useState({ W: 0, L: 0, D: 0 });
  const [playerChoice, setPlayerChoice] = useState(null);
  const [aiChoice, setAiChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [flash, setFlash] = useState(false);

  const play = (choice) => {
    if (animating) return;
    setAnimating(true);
    setFlash(false);
    setPlayerChoice(choice);
    setAiChoice(null);
    setResult(null);

    setTimeout(() => {
      const ai = Math.floor(Math.random() * 3);
      const res = getResult(choice, ai);
      setAiChoice(ai);
      setResult(res);
      setFlash(true);
      setScores(s => ({
        ...s,
        W: s.W + (res === 'win' ? 1 : 0),
        L: s.L + (res === 'lose' ? 1 : 0),
        D: s.D + (res === 'draw' ? 1 : 0),
      }));
      if (res === 'win') onScore && onScore(3);
      setAnimating(false);
    }, 600);
  };

  const reset = () => {
    setPlayerChoice(null);
    setAiChoice(null);
    setResult(null);
    setFlash(false);
  };

  const baseBtn = {
    border: 'none', borderRadius: 16, cursor: 'pointer',
    fontFamily: "'Fredoka One', cursive", transition: 'all 0.15s',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%' }}>
      {/* Scoreboard */}
      <div style={{ display: 'flex', gap: 28 }}>
        {[['W', '#10B981', 'Wins'], ['L', '#EF4444', 'Losses'], ['D', '#F59E0B', 'Draws']].map(([k, c, label]) => (
          <div key={k} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 28, color: c, lineHeight: 1 }}>{scores[k]}</div>
            <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 11, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Choice buttons */}
      <div style={{ display: 'flex', gap: 16 }}>
        {CHOICES.map((emoji, i) => (
          <button
            key={i}
            onClick={() => play(i)}
            disabled={animating}
            style={{
              ...baseBtn,
              width: 100, height: 100, fontSize: 36,
              background: playerChoice === i && result
                ? (result === 'win' ? 'rgba(16,185,129,0.25)' : result === 'lose' ? 'rgba(239,68,68,0.18)' : 'rgba(245,158,11,0.2)')
                : 'rgba(124,58,237,0.18)',
              border: `2px solid ${playerChoice === i && result ? RESULT_COLORS[result] : '#7C3AED'}`,
              boxShadow: playerChoice === i && result ? `0 0 18px ${RESULT_COLORS[result]}66` : 'none',
              opacity: animating && playerChoice !== i ? 0.5 : 1,
              transform: playerChoice === i && flash ? 'scale(1.12)' : 'scale(1)',
            }}
          >
            <span>{emoji}</span>
            <span style={{ fontSize: 12, color: '#A78BFA', marginTop: 4 }}>{NAMES[i]}</span>
          </button>
        ))}
      </div>

      {/* Battle area */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24,
        minHeight: 120, width: '100%',
        background: 'rgba(15,10,40,0.6)', borderRadius: 20, padding: '16px 24px',
        border: '1px solid rgba(124,58,237,0.3)',
      }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: 11, color: '#64748B', fontFamily: "'Exo 2', sans-serif", marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>You</div>
          <div style={{ fontSize: 56 }}>{playerChoice !== null ? CHOICES[playerChoice] : '❓'}</div>
        </div>

        <div style={{ textAlign: 'center', minWidth: 80 }}>
          {result ? (
            <div style={{
              fontFamily: "'Fredoka One', cursive", fontSize: 20,
              color: RESULT_COLORS[result],
              textShadow: `0 0 12px ${RESULT_COLORS[result]}`,
              animation: flash ? 'none' : undefined,
            }}>
              {RESULT_TEXT[result]}
            </div>
          ) : (
            <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: '#475569' }}>
              {animating ? '⚡ ...' : 'VS'}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: 11, color: '#64748B', fontFamily: "'Exo 2', sans-serif", marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>AI</div>
          <div style={{ fontSize: 56 }}>
            {animating ? '🤔' : aiChoice !== null ? CHOICES[aiChoice] : '❓'}
          </div>
        </div>
      </div>

      {result && (
        <button
          onClick={reset}
          style={{
            ...baseBtn, padding: '10px 32px', fontSize: 16,
            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
            color: '#fff', boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
          }}
        >
          Play Again
        </button>
      )}

      {!result && !animating && playerChoice === null && (
        <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 14, color: '#64748B' }}>
          Pick a choice to play!
        </div>
      )}
    </div>
  );
}
