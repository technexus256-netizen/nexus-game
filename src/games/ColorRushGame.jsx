import { useState, useEffect, useRef, useCallback } from 'react';

const COLORS = ['Red', 'Blue', 'Green', 'Yellow'];

const COLOR_MAP = {
  Red: '#ef4444',
  Blue: '#3b82f6',
  Green: '#22c55e',
  Yellow: '#eab308',
};

function getRandomColor(exclude) {
  const options = exclude ? COLORS.filter(c => c !== exclude) : COLORS;
  return options[Math.floor(Math.random() * options.length)];
}

function generateRound() {
  const word = COLORS[Math.floor(Math.random() * COLORS.length)];
  const inkColor = getRandomColor(word);
  return { word, inkColor };
}

export default function ColorRushGame({ onScore }) {
  const [round, setRound] = useState(generateRound);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [questionNum, setQuestionNum] = useState(1);
  const timerRef = useRef(null);
  const finalScoreRef = useRef(0);
  const feedbackTimeout = useRef(null);

  const endGame = useCallback((finalScore) => {
    clearInterval(timerRef.current);
    setGameOver(true);
    setRunning(false);
    onScore(Math.max(0, finalScore));
  }, [onScore]);

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          endGame(finalScoreRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [running, endGame]);

  function startGame() {
    setScore(0);
    setTimeLeft(20);
    setGameOver(false);
    setFeedback(null);
    setQuestionNum(1);
    setRound(generateRound());
    finalScoreRef.current = 0;
    setRunning(true);
  }

  function handleAnswer(colorName) {
    if (!running) return;
    clearTimeout(feedbackTimeout.current);
    const correct = colorName === round.inkColor;
    const gained = correct ? 10 : -5;
    setScore(s => {
      const ns = s + gained;
      finalScoreRef.current = ns;
      return ns;
    });
    setFeedback({ correct, text: correct ? '+10 Correct!' : '-5 Wrong!', color: correct ? '#22c55e' : '#ef4444' });
    feedbackTimeout.current = setTimeout(() => {
      setFeedback(null);
      setRound(generateRound());
      setQuestionNum(n => n + 1);
    }, 400);
  }

  const styles = {
    container: {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '500px', padding: '30px 20px',
      fontFamily: "'Exo 2', sans-serif", color: '#fff', background: '#040814',
    },
    title: {
      fontFamily: "'Fredoka One', cursive", fontSize: '2.5rem',
      background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      marginBottom: '8px',
    },
    subtitle: { color: '#9d6fef', marginBottom: '24px', textAlign: 'center', maxWidth: '320px', fontSize: '0.9rem' },
    statsRow: { display: 'flex', gap: '20px', marginBottom: '30px' },
    statBox: {
      background: '#1a0a2e', border: '1px solid #7C3AED',
      borderRadius: '10px', padding: '10px 24px', textAlign: 'center',
    },
    statLabel: { fontSize: '0.65rem', color: '#9d6fef', textTransform: 'uppercase', letterSpacing: '1px' },
    statVal: { fontSize: '1.6rem', fontWeight: '700', color: '#EC4899' },
    wordCard: {
      background: '#0d0520', border: '2px solid #7C3AED',
      borderRadius: '16px', padding: '40px 60px', marginBottom: '30px',
      textAlign: 'center', minWidth: '280px',
      boxShadow: '0 0 30px rgba(124,58,237,0.3)',
    },
    instruction: { color: '#9d6fef', fontSize: '0.85rem', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' },
    word: (color) => ({
      fontFamily: "'Fredoka One', cursive", fontSize: '3.5rem',
      color: COLOR_MAP[color], textShadow: `0 0 20px ${COLOR_MAP[color]}88`,
    }),
    buttonsGrid: {
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      gap: '12px', marginBottom: '20px',
    },
    colorBtn: (color, feedback) => ({
      padding: '16px 30px', borderRadius: '12px',
      border: `2px solid ${COLOR_MAP[color]}`,
      background: feedback?.correct === false && feedback?.colorName === color
        ? 'rgba(239,68,68,0.2)'
        : `${COLOR_MAP[color]}22`,
      color: COLOR_MAP[color],
      fontFamily: "'Fredoka One', cursive", fontSize: '1.3rem',
      cursor: 'pointer', transition: 'all 0.15s',
      boxShadow: `0 0 10px ${COLOR_MAP[color]}44`,
    }),
    feedback: (color) => ({
      fontSize: '1.4rem', fontWeight: '700', color,
      minHeight: '2rem', textAlign: 'center', marginBottom: '10px',
      transition: 'opacity 0.2s',
    }),
    btn: {
      padding: '12px 35px',
      background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
      border: 'none', borderRadius: '25px', color: '#fff',
      fontFamily: "'Fredoka One', cursive", fontSize: '1.2rem',
      cursor: 'pointer',
    },
    timerBar: {
      width: '320px', height: '6px', background: '#1a0a2e',
      borderRadius: '3px', overflow: 'hidden', marginBottom: '24px',
    },
    timerFill: {
      height: '100%', borderRadius: '3px',
      width: `${(timeLeft / 20) * 100}%`,
      background: timeLeft <= 5 ? '#ef4444' : 'linear-gradient(90deg, #7C3AED, #EC4899)',
      transition: 'width 1s linear, background 0.3s',
    },
  };

  if (!running && !gameOver) {
    return (
      <div style={styles.container}>
        <div style={styles.title}>Color Rush</div>
        <div style={{ ...styles.subtitle, marginBottom: '30px' }}>
          The Stroop Effect Challenge! Click the color of the INK, not the word meaning.
        </div>
        <div style={styles.wordCard}>
          <div style={styles.instruction}>Example — click the ink color:</div>
          <div style={styles.word('Blue')}>RED</div>
          <div style={{ color: '#9d6fef', fontSize: '0.85rem', marginTop: '12px' }}>Answer: Blue (the ink color)</div>
        </div>
        <button style={styles.btn} onClick={startGame}>Start Game</button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div style={styles.container}>
        <div style={styles.title}>Game Over!</div>
        <div style={{ fontSize: '1.2rem', color: '#9d6fef', marginBottom: '10px' }}>Questions answered: {questionNum - 1}</div>
        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#EC4899', marginBottom: '24px' }}>Score: {score}</div>
        <button style={styles.btn} onClick={startGame}>Play Again</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.title}>Color Rush</div>
      <div style={styles.statsRow}>
        <div style={styles.statBox}>
          <div style={styles.statLabel}>Score</div>
          <div style={styles.statVal}>{score}</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statLabel}>Time</div>
          <div style={{ ...styles.statVal, color: timeLeft <= 5 ? '#ef4444' : '#EC4899' }}>{timeLeft}s</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statLabel}>Q #</div>
          <div style={styles.statVal}>{questionNum}</div>
        </div>
      </div>
      <div style={styles.timerBar}><div style={styles.timerFill} /></div>
      <div style={styles.wordCard}>
        <div style={styles.instruction}>Click the INK COLOR (not the word!)</div>
        <div style={styles.word(round.inkColor)}>{round.word}</div>
      </div>
      <div style={styles.feedback(feedback?.color || 'transparent')}>
        {feedback?.text || ' '}
      </div>
      <div style={styles.buttonsGrid}>
        {COLORS.map(color => (
          <button
            key={color}
            style={styles.colorBtn(color)}
            onClick={() => handleAnswer(color)}
          >
            {color}
          </button>
        ))}
      </div>
    </div>
  );
}
