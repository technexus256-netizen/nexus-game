import { useState, useCallback } from 'react';

const WORDS = [
  'PIXEL', 'DRAGON', 'WIZARD', 'ROCKET', 'GALAXY', 'PORTAL',
  'KNIGHT', 'CIPHER', 'TURBO', 'PHOENIX', 'LEGEND', 'QUEST',
  'SHIELD', 'DUNGEON', 'VORTEX', 'BLASTER', 'MECHA', 'TITAN',
  'NEBULA', 'WYVERN',
];

const MAX_WRONG = 6;
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const pickWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

function HangmanSVG({ wrong }) {
  return (
    <svg width="140" height="150" viewBox="0 0 140 150" fill="none">
      {/* Gallows */}
      <line x1="10" y1="145" x2="130" y2="145" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />
      <line x1="30" y1="145" x2="30" y2="10" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />
      <line x1="30" y1="10" x2="85" y2="10" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />
      <line x1="85" y1="10" x2="85" y2="28" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />
      {/* Head */}
      {wrong >= 1 && <circle cx="85" cy="38" r="10" stroke="#EC4899" strokeWidth="2.5" />}
      {/* Body */}
      {wrong >= 2 && <line x1="85" y1="48" x2="85" y2="90" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" />}
      {/* Left arm */}
      {wrong >= 3 && <line x1="85" y1="60" x2="65" y2="78" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" />}
      {/* Right arm */}
      {wrong >= 4 && <line x1="85" y1="60" x2="105" y2="78" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" />}
      {/* Left leg */}
      {wrong >= 5 && <line x1="85" y1="90" x2="65" y2="115" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" />}
      {/* Right leg */}
      {wrong >= 6 && <line x1="85" y1="90" x2="105" y2="115" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" />}
    </svg>
  );
}

export default function HangmanGame({ onScore }) {
  const [word, setWord] = useState(pickWord);
  const [guessed, setGuessed] = useState(new Set());
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const wrongLetters = [...guessed].filter(l => !word.includes(l));
  const wrongCount = wrongLetters.length;
  const isWordComplete = word.split('').every(l => guessed.has(l));

  const guess = useCallback((letter) => {
    if (guessed.has(letter) || gameOver) return;
    const newGuessed = new Set(guessed);
    newGuessed.add(letter);
    setGuessed(newGuessed);

    const newWrong = [...newGuessed].filter(l => !word.includes(l)).length;
    const complete = word.split('').every(l => newGuessed.has(l));

    if (complete) {
      setWon(true);
      setGameOver(true);
      onScore && onScore(10);
    } else if (newWrong >= MAX_WRONG) {
      setWon(false);
      setGameOver(true);
    }
  }, [guessed, word, gameOver, onScore]);

  const newGame = () => {
    setWord(pickWord());
    setGuessed(new Set());
    setGameOver(false);
    setWon(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}>
      {/* Wrong count */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: '#EF4444' }}>{wrongCount}</div>
          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 11, color: '#64748B', textTransform: 'uppercase' }}>Wrong</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {Array.from({ length: MAX_WRONG }).map((_, i) => (
            <div key={i} style={{
              width: 12, height: 12, borderRadius: '50%',
              background: i < wrongCount ? '#EF4444' : 'rgba(255,255,255,0.1)',
              border: `2px solid ${i < wrongCount ? '#EF4444' : 'rgba(255,255,255,0.2)'}`,
              transition: 'all 0.3s',
            }} />
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: '#10B981' }}>
            {MAX_WRONG - wrongCount}
          </div>
          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 11, color: '#64748B', textTransform: 'uppercase' }}>Left</div>
        </div>
      </div>

      {/* Hangman drawing */}
      <HangmanSVG wrong={wrongCount} />

      {/* Word display */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {word.split('').map((letter, i) => {
          const revealed = guessed.has(letter);
          const isWrong = gameOver && !won && !revealed;
          return (
            <div key={i} style={{
              width: 36, height: 46, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'flex-end', gap: 4,
            }}>
              <div style={{
                fontFamily: "'Fredoka One', cursive", fontSize: 24,
                color: won ? '#10B981' : isWrong ? '#EF4444' : '#fff',
                minHeight: 30,
              }}>
                {revealed || (gameOver && !won) ? letter : ''}
              </div>
              <div style={{ width: 36, height: 2, background: '#7C3AED', borderRadius: 2 }} />
            </div>
          );
        })}
      </div>

      {/* Wrong letters */}
      {wrongLetters.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          {wrongLetters.map(l => (
            <span key={l} style={{
              fontFamily: "'Exo 2', sans-serif", fontSize: 13,
              color: '#EF4444', background: 'rgba(239,68,68,0.1)',
              borderRadius: 8, padding: '2px 8px',
              border: '1px solid rgba(239,68,68,0.3)', textDecoration: 'line-through',
            }}>{l}</span>
          ))}
        </div>
      )}

      {/* Game over overlay */}
      {gameOver && (
        <div style={{
          background: won ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.1)',
          border: `2px solid ${won ? '#10B981' : '#EF4444'}`,
          borderRadius: 16, padding: '12px 24px', textAlign: 'center',
          fontFamily: "'Fredoka One', cursive", fontSize: 20,
          color: won ? '#10B981' : '#EF4444',
          boxShadow: `0 0 24px ${won ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
        }}>
          {won ? '🎉 You Won! +10 pts' : `💀 The word was "${word}"`}
        </div>
      )}

      {/* Keyboard */}
      {!gameOver && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', maxWidth: 360 }}>
          {ALPHA.map(letter => {
            const used = guessed.has(letter);
            const correct = used && word.includes(letter);
            const wrong = used && !word.includes(letter);
            return (
              <button
                key={letter}
                onClick={() => guess(letter)}
                disabled={used}
                style={{
                  width: 36, height: 36, border: 'none', borderRadius: 8, cursor: used ? 'default' : 'pointer',
                  fontFamily: "'Fredoka One', cursive", fontSize: 15,
                  background: correct ? 'rgba(16,185,129,0.3)' : wrong ? 'rgba(239,68,68,0.15)' : 'rgba(124,58,237,0.2)',
                  color: correct ? '#10B981' : wrong ? '#6B7280' : '#A78BFA',
                  border: `2px solid ${correct ? '#10B981' : wrong ? 'rgba(239,68,68,0.2)' : 'rgba(124,58,237,0.4)'}`,
                  opacity: wrong ? 0.5 : 1,
                  transition: 'all 0.1s',
                }}
              >
                {letter}
              </button>
            );
          })}
        </div>
      )}

      <button
        onClick={newGame}
        style={{
          border: 'none', borderRadius: 14, padding: '10px 32px', cursor: 'pointer',
          fontFamily: "'Fredoka One', cursive", fontSize: 16,
          background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
          color: '#fff', boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
        }}
      >
        New Word
      </button>
    </div>
  );
}
