import { useState, useEffect, useRef } from 'react';

const GAME_TIME = 40;

const COUNTRIES = [
  ['🇯🇵', 'Japan'], ['🇮🇳', 'India'], ['🇧🇷', 'Brazil'], ['🇫🇷', 'France'],
  ['🇩🇪', 'Germany'], ['🇮🇹', 'Italy'], ['🇨🇦', 'Canada'], ['🇦🇺', 'Australia'],
  ['🇪🇸', 'Spain'], ['🇬🇧', 'United Kingdom'], ['🇺🇸', 'United States'], ['🇨🇳', 'China'],
  ['🇰🇷', 'South Korea'], ['🇲🇽', 'Mexico'], ['🇿🇦', 'South Africa'], ['🇪🇬', 'Egypt'],
  ['🇸🇪', 'Sweden'], ['🇳🇱', 'Netherlands'], ['🇨🇭', 'Switzerland'], ['🇦🇷', 'Argentina'],
  ['🇵🇹', 'Portugal'], ['🇬🇷', 'Greece'], ['🇹🇷', 'Turkey'], ['🇳🇬', 'Nigeria'],
  ['🇸🇦', 'Saudi Arabia'], ['🇹🇭', 'Thailand'], ['🇮🇩', 'Indonesia'], ['🇷🇺', 'Russia'],
];

const generate = () => {
  const idx = Math.floor(Math.random() * COUNTRIES.length);
  const [flag, name] = COUNTRIES[idx];
  const wrongs = new Set();
  while (wrongs.size < 3) {
    const w = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)][1];
    if (w !== name) wrongs.add(w);
  }
  const choices = [...wrongs, name].sort(() => Math.random() - 0.5);
  return { flag, name, choices };
};

export default function FlagQuizGame({ onScore }) {
  const [phase, setPhase]       = useState('idle');
  const [q, setQ]               = useState(null);
  const [score, setScore]       = useState(0);
  const [streak, setStreak]     = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [feedback, setFeedback] = useState(null);
  const [picked, setPicked]     = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (phase === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); setPhase('over'); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  useEffect(() => { if (phase === 'over') onScore && onScore(score); }, [phase]);

  const start = () => {
    setScore(0); setStreak(0); setTimeLeft(GAME_TIME);
    setQ(generate()); setFeedback(null); setPicked(null);
    setPhase('playing');
  };

  const answer = (choice) => {
    if (feedback || phase !== 'playing') return;
    const correct = choice === q.name;
    setPicked(choice);
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) {
      const ns = streak + 1;
      setScore(s => s + (ns >= 3 ? 20 : 10));
      setStreak(ns);
    } else setStreak(0);
    setTimeout(() => { setFeedback(null); setPicked(null); setQ(generate()); }, 550);
  };

  const timerPct   = (timeLeft / GAME_TIME) * 100;
  const timerColor = timeLeft > 20 ? '#10B981' : timeLeft > 10 ? '#F59E0B' : '#EF4444';

  const startBtn = {
    border: 'none', borderRadius: 14, cursor: 'pointer', fontFamily: "'Fredoka One', cursive",
    background: 'linear-gradient(135deg, #7C3AED, #EC4899)', color: '#fff', fontSize: 18,
    padding: '12px 40px', boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}>
      {phase === 'idle' && (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 28, color: '#A78BFA' }}>Flag Quiz 🌍</div>
          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 15, color: '#64748B', maxWidth: 300 }}>
            Which country does the flag belong to? Answer as many as you can in {GAME_TIME} seconds.<br />
            Build a streak for double points!
          </div>
          <button onClick={start} style={startBtn}>Start Game</button>
        </div>
      )}

      {phase === 'playing' && q && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 26, color: '#EC4899' }}>{score}</div>
              <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 11, color: '#64748B', textTransform: 'uppercase' }}>Score</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              {streak >= 3
                ? <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 15, color: '#F59E0B', background: 'rgba(245,158,11,0.15)', borderRadius: 10, padding: '4px 12px', border: '1px solid rgba(245,158,11,0.4)' }}>🔥 x2 Streak {streak}</div>
                : streak > 0 ? <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 13, color: '#A78BFA' }}>Streak: {streak}</div> : null}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 26, color: timerColor }}>{timeLeft}</div>
              <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 11, color: '#64748B', textTransform: 'uppercase' }}>Secs</div>
            </div>
          </div>

          <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
            <div style={{ width: `${timerPct}%`, height: '100%', borderRadius: 99, background: timerColor, transition: 'width 1s linear, background 0.5s' }} />
          </div>

          {/* Flag */}
          <div style={{
            background: 'rgba(15,10,40,0.8)', borderRadius: 20, padding: '20px 32px',
            border: `2px solid ${feedback === 'correct' ? '#10B981' : feedback === 'wrong' ? '#EF4444' : 'rgba(124,58,237,0.4)'}`,
            boxShadow: feedback === 'correct' ? '0 0 24px rgba(16,185,129,0.3)' : feedback === 'wrong' ? '0 0 24px rgba(239,68,68,0.3)' : 'none',
            textAlign: 'center', transition: 'all 0.15s', width: '100%',
          }}>
            <div style={{ fontSize: 90, lineHeight: 1.1 }}>{q.flag}</div>
            <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 13, color: '#64748B', marginTop: 4 }}>Which country is this?</div>
          </div>

          {/* Choices */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%' }}>
            {q.choices.map((c, i) => {
              let bg = 'rgba(124,58,237,0.18)', border = '2px solid rgba(124,58,237,0.4)', color = '#C4B5FD';
              if (feedback && picked === c) {
                if (feedback === 'correct') { bg = 'rgba(16,185,129,0.25)'; border = '2px solid #10B981'; color = '#10B981'; }
                else { bg = 'rgba(239,68,68,0.2)'; border = '2px solid #EF4444'; color = '#EF4444'; }
              } else if (feedback === 'wrong' && c === q.name) {
                bg = 'rgba(16,185,129,0.15)'; border = '2px solid #10B981'; color = '#10B981';
              }
              return (
                <button key={i} onClick={() => answer(c)} style={{
                  border, background: bg, color, borderRadius: 14, cursor: 'pointer',
                  fontFamily: "'Fredoka One', cursive", fontSize: 16, padding: '14px 8px', transition: 'all 0.12s',
                }}>{c}</button>
              );
            })}
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
          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 15, color: '#64748B' }}>Final Score</div>
          <button onClick={start} style={{ ...startBtn, marginTop: 6 }}>Play Again</button>
        </div>
      )}
    </div>
  );
}
