import { useState, useEffect, useRef } from 'react';

const GAME_TIME = 30;

const generate = () => {
  const ops = ['+', '-', '×'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, answer;
  if (op === '+') { a = Math.floor(Math.random() * 20) + 1; b = Math.floor(Math.random() * 20) + 1; answer = a + b; }
  else if (op === '-') { a = Math.floor(Math.random() * 20) + 5; b = Math.floor(Math.random() * a) + 1; answer = a - b; }
  else { a = Math.floor(Math.random() * 9) + 2; b = Math.floor(Math.random() * 9) + 2; answer = a * b; }

  const wrongs = new Set();
  while (wrongs.size < 3) {
    const offset = Math.floor(Math.random() * 10) + 1;
    const w = Math.random() < 0.5 ? answer + offset : Math.max(1, answer - offset);
    if (w !== answer) wrongs.add(w);
  }
  const choices = [...wrongs, answer].sort(() => Math.random() - 0.5);
  return { a, b, op, answer, choices };
};

export default function MathBlitzGame({ onScore }) {
  const [phase, setPhase] = useState('idle'); // idle | playing | over
  const [problem, setProblem] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'wrong'
  const [lastAnswer, setLastAnswer] = useState(null);
  const timerRef = useRef(null);
  const feedbackRef = useRef(null);

  useEffect(() => {
    if (phase === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setPhase('over');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  useEffect(() => {
    if (phase === 'over') {
      onScore && onScore(score);
    }
  }, [phase]);

  const start = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(GAME_TIME);
    setProblem(generate());
    setFeedback(null);
    setLastAnswer(null);
    setPhase('playing');
  };

  const answer = (choice) => {
    if (feedback || phase !== 'playing') return;
    const correct = choice === problem.answer;
    setLastAnswer(choice);
    setFeedback(correct ? 'correct' : 'wrong');

    if (correct) {
      const newStreak = streak + 1;
      const mult = newStreak >= 5 ? 3 : newStreak >= 3 ? 2 : 1;
      setScore(s => s + 10 * mult);
      setStreak(newStreak);
    } else {
      setStreak(0);
    }

    feedbackRef.current = setTimeout(() => {
      setFeedback(null);
      setLastAnswer(null);
      setProblem(generate());
    }, 500);
  };

  const mult = streak >= 5 ? 3 : streak >= 3 ? 2 : 1;
  const timerPct = (timeLeft / GAME_TIME) * 100;
  const timerColor = timeLeft > 15 ? '#10B981' : timeLeft > 8 ? '#F59E0B' : '#EF4444';

  const btnBase = {
    border: 'none', borderRadius: 14, cursor: 'pointer',
    fontFamily: "'Fredoka One', cursive", fontSize: 22,
    width: '100%', padding: '14px 8px',
    transition: 'all 0.12s',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}>
      {phase === 'idle' && (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 28, color: '#A78BFA' }}>Math Blitz ⚡</div>
          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 15, color: '#64748B', maxWidth: 280 }}>
            Solve as many math problems as you can in {GAME_TIME} seconds!<br />
            Build streaks for bonus multipliers!
          </div>
          <button onClick={start} style={{
            ...btnBase, width: 'auto', padding: '12px 40px',
            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
            color: '#fff', fontSize: 18, boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
          }}>
            Start Game
          </button>
        </div>
      )}

      {phase === 'playing' && problem && (
        <>
          {/* Stats bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 26, color: '#EC4899' }}>{score}</div>
              <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 11, color: '#64748B', textTransform: 'uppercase' }}>Score</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              {streak >= 3 && (
                <div style={{
                  fontFamily: "'Fredoka One', cursive", fontSize: 15,
                  color: mult === 3 ? '#F59E0B' : '#A78BFA',
                  background: mult === 3 ? 'rgba(245,158,11,0.15)' : 'rgba(124,58,237,0.15)',
                  borderRadius: 10, padding: '4px 12px',
                  border: `1px solid ${mult === 3 ? 'rgba(245,158,11,0.4)' : 'rgba(124,58,237,0.4)'}`,
                }}>
                  🔥 x{mult} Streak {streak}
                </div>
              )}
              {streak < 3 && streak > 0 && (
                <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 13, color: '#A78BFA' }}>
                  Streak: {streak}
                </div>
              )}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 26, color: timerColor }}>{timeLeft}</div>
              <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 11, color: '#64748B', textTransform: 'uppercase' }}>Secs</div>
            </div>
          </div>

          {/* Timer bar */}
          <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
            <div style={{
              width: `${timerPct}%`, height: '100%', borderRadius: 99,
              background: timerColor, transition: 'width 1s linear, background 0.5s',
            }} />
          </div>

          {/* Problem */}
          <div style={{
            background: 'rgba(15,10,40,0.8)', borderRadius: 20, padding: '24px 32px',
            border: `2px solid ${feedback === 'correct' ? '#10B981' : feedback === 'wrong' ? '#EF4444' : 'rgba(124,58,237,0.4)'}`,
            boxShadow: feedback === 'correct' ? '0 0 24px rgba(16,185,129,0.3)' : feedback === 'wrong' ? '0 0 24px rgba(239,68,68,0.3)' : 'none',
            textAlign: 'center', transition: 'all 0.15s', width: '100%',
          }}>
            <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 44, color: '#fff' }}>
              {problem.a} {problem.op} {problem.b} = ?
            </div>
          </div>

          {/* Answer buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%' }}>
            {problem.choices.map((c, i) => {
              let bg = 'rgba(124,58,237,0.18)';
              let border = '2px solid rgba(124,58,237,0.4)';
              let color = '#A78BFA';
              if (feedback && lastAnswer === c) {
                if (feedback === 'correct') { bg = 'rgba(16,185,129,0.25)'; border = '2px solid #10B981'; color = '#10B981'; }
                else { bg = 'rgba(239,68,68,0.2)'; border = '2px solid #EF4444'; color = '#EF4444'; }
              } else if (feedback === 'wrong' && c === problem.answer) {
                bg = 'rgba(16,185,129,0.15)'; border = '2px solid #10B981'; color = '#10B981';
              }
              return (
                <button key={i} onClick={() => answer(c)} style={{ ...btnBase, background: bg, border, color }}>
                  {c}
                </button>
              );
            })}
          </div>
        </>
      )}

      {phase === 'over' && (
        <div style={{
          textAlign: 'center', width: '100%',
          background: 'rgba(15,10,40,0.85)', borderRadius: 24, padding: 32,
          border: '2px solid rgba(124,58,237,0.4)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
        }}>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 24, color: '#A78BFA' }}>Game Over!</div>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 56, color: '#EC4899' }}>{score}</div>
          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 15, color: '#64748B' }}>Final Score</div>
          <button onClick={start} style={{
            ...btnBase, width: 'auto', padding: '12px 40px',
            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
            color: '#fff', fontSize: 18, boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
          }}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
