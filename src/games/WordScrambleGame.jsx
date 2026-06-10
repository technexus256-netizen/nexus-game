import { useState, useEffect, useRef } from 'react';

const GAME_TIME = 60;

/* word + a short hint to make it educational and fair */
const WORDS = [
  ['planet',   'A world that orbits a star'],
  ['guitar',   'A musical instrument with strings'],
  ['dolphin',  'A clever ocean mammal'],
  ['volcano',  'A mountain that can erupt'],
  ['rainbow',  'Colours in the sky after rain'],
  ['library',  'A place full of books'],
  ['diamond',  'A very hard, sparkling gem'],
  ['octopus',  'A sea creature with eight arms'],
  ['galaxy',   'A huge group of stars'],
  ['compass',  'A tool that points north'],
  ['penguin',  'A bird that swims but cannot fly'],
  ['cactus',   'A spiky desert plant'],
  ['bridge',   'It lets you cross a river'],
  ['rocket',   'It blasts off into space'],
  ['castle',   'A large fortified building'],
  ['jungle',   'A thick tropical forest'],
  ['anchor',   'It keeps a ship in place'],
  ['magnet',   'It attracts metal'],
  ['pyramid',  'A famous Egyptian monument'],
  ['harvest',  'Gathering ripe crops'],
];

const shuffle = (word) => {
  const letters = word.split('');
  let out = word;
  // keep shuffling until it differs from the original
  while (out === word) {
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    out = letters.join('');
  }
  return out;
};

const pickWord = () => {
  const [word, hint] = WORDS[Math.floor(Math.random() * WORDS.length)];
  return { word, hint, scrambled: shuffle(word) };
};

export default function WordScrambleGame({ onScore }) {
  const [phase, setPhase]       = useState('idle'); // idle | playing | over
  const [round, setRound]       = useState(null);
  const [guess, setGuess]       = useState('');
  const [score, setScore]       = useState(0);
  const [solved, setSolved]     = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'wrong'
  const [showHint, setShowHint] = useState(false);
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (phase === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); setPhase('over'); return 0; }
          return t - 1;
        });
      }, 1000);
      inputRef.current?.focus();
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  useEffect(() => { if (phase === 'over') onScore && onScore(score); }, [phase]);

  const start = () => {
    setScore(0); setSolved(0); setTimeLeft(GAME_TIME);
    setRound(pickWord()); setGuess(''); setFeedback(null); setShowHint(false);
    setPhase('playing');
  };

  const next = (correct) => {
    if (correct) { setScore(s => s + (showHint ? 5 : 10)); setSolved(n => n + 1); }
    setRound(pickWord()); setGuess(''); setShowHint(false);
  };

  const submit = () => {
    if (!guess.trim() || phase !== 'playing') return;
    const correct = guess.trim().toLowerCase() === round.word;
    setFeedback(correct ? 'correct' : 'wrong');
    setTimeout(() => { setFeedback(null); if (correct) next(true); else inputRef.current?.focus(); }, 450);
  };

  const skip = () => { setRound(pickWord()); setGuess(''); setShowHint(false); setFeedback(null); inputRef.current?.focus(); };

  const timerPct   = (timeLeft / GAME_TIME) * 100;
  const timerColor = timeLeft > 30 ? '#10B981' : timeLeft > 12 ? '#F59E0B' : '#EF4444';

  const startBtn = {
    border: 'none', borderRadius: 14, cursor: 'pointer', fontFamily: "'Fredoka One', cursive",
    background: 'linear-gradient(135deg, #7C3AED, #EC4899)', color: '#fff', fontSize: 18,
    padding: '12px 40px', boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}>
      {phase === 'idle' && (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 28, color: '#A78BFA' }}>Word Scramble 🔡</div>
          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 15, color: '#64748B', maxWidth: 300 }}>
            Unscramble as many words as you can in {GAME_TIME} seconds!<br />
            Solve without a hint for full points. 💡
          </div>
          <button onClick={start} style={startBtn}>Start Game</button>
        </div>
      )}

      {phase === 'playing' && round && (
        <>
          {/* Stats bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 26, color: '#EC4899' }}>{score}</div>
              <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 11, color: '#64748B', textTransform: 'uppercase' }}>Score</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 26, color: '#A78BFA' }}>{solved}</div>
              <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 11, color: '#64748B', textTransform: 'uppercase' }}>Solved</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 26, color: timerColor }}>{timeLeft}</div>
              <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 11, color: '#64748B', textTransform: 'uppercase' }}>Secs</div>
            </div>
          </div>

          {/* Timer bar */}
          <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
            <div style={{ width: `${timerPct}%`, height: '100%', borderRadius: 99, background: timerColor, transition: 'width 1s linear, background 0.5s' }} />
          </div>

          {/* Scrambled letters */}
          <div style={{
            background: 'rgba(15,10,40,0.8)', borderRadius: 20, padding: '24px 20px', width: '100%',
            border: `2px solid ${feedback === 'correct' ? '#10B981' : feedback === 'wrong' ? '#EF4444' : 'rgba(124,58,237,0.4)'}`,
            boxShadow: feedback === 'correct' ? '0 0 24px rgba(16,185,129,0.3)' : feedback === 'wrong' ? '0 0 24px rgba(239,68,68,0.3)' : 'none',
            textAlign: 'center', transition: 'all 0.15s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
              {round.scrambled.split('').map((ch, i) => (
                <span key={i} style={{
                  fontFamily: "'Fredoka One', cursive", fontSize: 30, color: '#fff',
                  background: 'rgba(124,58,237,0.25)', border: '1px solid rgba(124,58,237,0.5)',
                  borderRadius: 10, width: 44, height: 52, display: 'inline-flex',
                  alignItems: 'center', justifyContent: 'center', textTransform: 'uppercase',
                }}>{ch}</span>
              ))}
            </div>
            {showHint && (
              <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 13, color: '#F59E0B', marginTop: 14 }}>
                💡 {round.hint}
              </div>
            )}
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            value={guess}
            onChange={e => setGuess(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="Type your answer…"
            autoComplete="off"
            style={{
              width: '100%', boxSizing: 'border-box', textAlign: 'center',
              background: 'rgba(4,8,20,0.7)', border: '2px solid rgba(124,58,237,0.4)',
              borderRadius: 12, padding: '14px', color: '#fff', fontSize: 22,
              fontFamily: "'Fredoka One', cursive", letterSpacing: 2,
            }}
          />

          {/* Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, width: '100%' }}>
            <button onClick={() => setShowHint(true)} disabled={showHint} style={{
              border: '2px solid rgba(245,158,11,0.4)', borderRadius: 12, cursor: showHint ? 'default' : 'pointer',
              background: 'rgba(245,158,11,0.12)', color: '#F59E0B', fontFamily: "'Fredoka One', cursive",
              fontSize: 14, padding: '12px 8px', opacity: showHint ? 0.5 : 1,
            }}>💡 Hint</button>
            <button onClick={skip} style={{
              border: '2px solid rgba(148,163,184,0.3)', borderRadius: 12, cursor: 'pointer',
              background: 'rgba(148,163,184,0.1)', color: '#94A3B8', fontFamily: "'Fredoka One', cursive",
              fontSize: 14, padding: '12px 8px',
            }}>⏭ Skip</button>
            <button onClick={submit} style={{
              border: 'none', borderRadius: 12, cursor: 'pointer',
              background: 'linear-gradient(135deg, #7C3AED, #EC4899)', color: '#fff',
              fontFamily: "'Fredoka One', cursive", fontSize: 14, padding: '12px 8px',
            }}>✓ Check</button>
          </div>
        </>
      )}

      {phase === 'over' && (
        <div style={{
          textAlign: 'center', width: '100%', background: 'rgba(15,10,40,0.85)', borderRadius: 24, padding: 32,
          border: '2px solid rgba(124,58,237,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 24, color: '#A78BFA' }}>Time's Up!</div>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 56, color: '#EC4899' }}>{score}</div>
          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 15, color: '#64748B' }}>
            Final Score · {solved} words solved
          </div>
          <button onClick={start} style={{ ...startBtn, marginTop: 6 }}>Play Again</button>
        </div>
      )}
    </div>
  );
}
