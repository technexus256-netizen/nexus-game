import { useState, useEffect, useRef } from 'react';

const TOTAL = 8;          // questions per game
const PER_Q = 12;         // seconds per question

/* family-friendly general-knowledge questions; answer index 0 is correct */
const BANK = [
  ['How many continents are there on Earth?', ['7', '5', '6', '8']],
  ['What is the largest planet in our solar system?', ['Jupiter', 'Saturn', 'Earth', 'Mars']],
  ['Which gas do plants absorb from the air?', ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Helium']],
  ['How many sides does a hexagon have?', ['6', '5', '7', '8']],
  ['What is the capital of Japan?', ['Tokyo', 'Kyoto', 'Osaka', 'Seoul']],
  ['Which is the largest ocean?', ['Pacific', 'Atlantic', 'Indian', 'Arctic']],
  ['What do bees make?', ['Honey', 'Milk', 'Silk', 'Wax only']],
  ['Which planet is known as the Red Planet?', ['Mars', 'Venus', 'Mercury', 'Neptune']],
  ['How many legs does a spider have?', ['8', '6', '10', '4']],
  ['What is H₂O commonly known as?', ['Water', 'Salt', 'Oxygen', 'Hydrogen']],
  ['Which animal is the fastest on land?', ['Cheetah', 'Lion', 'Horse', 'Greyhound']],
  ['What is 9 × 7?', ['63', '56', '72', '64']],
  ['Which country is home to the kangaroo?', ['Australia', 'India', 'Brazil', 'Kenya']],
  ['What colour do you get mixing blue and yellow?', ['Green', 'Purple', 'Orange', 'Brown']],
  ['How many days are in a leap year?', ['366', '365', '364', '367']],
  ['Which is the smallest prime number?', ['2', '1', '3', '0']],
  ['What is the freezing point of water in °C?', ['0', '32', '100', '-10']],
  ['Who wrote "Romeo and Juliet"?', ['Shakespeare', 'Dickens', 'Tolstoy', 'Homer']],
];

const buildQuestions = () => {
  const pool = [...BANK].sort(() => Math.random() - 0.5).slice(0, TOTAL);
  return pool.map(([text, opts]) => {
    const correct = opts[0];
    const choices = [...opts].sort(() => Math.random() - 0.5);
    return { text, choices, correct };
  });
};

export default function BrainQuizGame({ onScore }) {
  const [phase, setPhase]       = useState('idle'); // idle | playing | over
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx]           = useState(0);
  const [score, setScore]       = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(PER_Q);
  const [feedback, setFeedback] = useState(null);
  const [picked, setPicked]     = useState(null);
  const timerRef = useRef(null);

  const q = questions[idx];

  // per-question countdown
  useEffect(() => {
    if (phase !== 'playing' || feedback) return;
    setTimeLeft(PER_Q);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); reveal(null); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, idx, feedback]);

  useEffect(() => { if (phase === 'over') onScore && onScore(score); /* eslint-disable-next-line */ }, [phase]);

  const start = () => {
    setQuestions(buildQuestions());
    setIdx(0); setScore(0); setCorrectCount(0);
    setFeedback(null); setPicked(null); setTimeLeft(PER_Q);
    setPhase('playing');
  };

  const reveal = (choice) => {
    clearInterval(timerRef.current);
    const correct = choice === q.correct;
    setPicked(choice);
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) {
      setScore(s => s + 10 + Math.max(0, timeLeft)); // speed bonus
      setCorrectCount(c => c + 1);
    }
    setTimeout(() => {
      setFeedback(null); setPicked(null);
      if (idx + 1 >= questions.length) setPhase('over');
      else setIdx(i => i + 1);
    }, 850);
  };

  const answer = (choice) => { if (!feedback && phase === 'playing') reveal(choice); };

  const timerColor = timeLeft > 6 ? '#10B981' : timeLeft > 3 ? '#F59E0B' : '#EF4444';

  const startBtn = {
    border: 'none', borderRadius: 14, cursor: 'pointer', fontFamily: "'Fredoka One', cursive",
    background: 'linear-gradient(135deg, #7C3AED, #EC4899)', color: '#fff', fontSize: 18,
    padding: '12px 40px', boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}>
      {phase === 'idle' && (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 28, color: '#A78BFA' }}>Brain Quiz 🧠</div>
          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 15, color: '#64748B', maxWidth: 300 }}>
            {TOTAL} general-knowledge questions. You have {PER_Q}s each —<br />
            answer faster for a bigger speed bonus!
          </div>
          <button onClick={start} style={startBtn}>Start Quiz</button>
        </div>
      )}

      {phase === 'playing' && q && (
        <>
          {/* Progress + stats */}
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 13, color: '#A78BFA', fontWeight: 700 }}>
              Question {idx + 1}/{questions.length}
            </div>
            <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: '#EC4899' }}>{score} pts</div>
            <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: timerColor }}>⏱ {timeLeft}</div>
          </div>

          {/* Progress bar */}
          <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
            <div style={{ width: `${((idx) / questions.length) * 100}%`, height: '100%', borderRadius: 99, background: 'linear-gradient(90deg,#7C3AED,#EC4899)', transition: 'width 0.4s' }} />
          </div>

          {/* Question */}
          <div style={{
            background: 'rgba(15,10,40,0.8)', borderRadius: 20, padding: '24px 24px', width: '100%',
            border: '2px solid rgba(124,58,237,0.4)', textAlign: 'center', minHeight: 70,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: '#fff', lineHeight: 1.3 }}>{q.text}</div>
          </div>

          {/* Choices */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%' }}>
            {q.choices.map((c, i) => {
              let bg = 'rgba(124,58,237,0.18)', border = '2px solid rgba(124,58,237,0.4)', color = '#C4B5FD';
              if (feedback) {
                if (c === q.correct) { bg = 'rgba(16,185,129,0.22)'; border = '2px solid #10B981'; color = '#10B981'; }
                else if (picked === c) { bg = 'rgba(239,68,68,0.2)'; border = '2px solid #EF4444'; color = '#EF4444'; }
              }
              return (
                <button key={i} onClick={() => answer(c)} disabled={!!feedback} style={{
                  border, background: bg, color, borderRadius: 14, cursor: feedback ? 'default' : 'pointer',
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
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 24, color: '#A78BFA' }}>Quiz Complete!</div>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 56, color: '#EC4899' }}>{score}</div>
          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 15, color: '#64748B' }}>
            {correctCount}/{questions.length} correct
          </div>
          <button onClick={start} style={{ ...startBtn, marginTop: 6 }}>Play Again</button>
        </div>
      )}
    </div>
  );
}
