

import { useGameLogic } from './hooks/useGameLogic';
import { GameLayout } from './components/GameLayout';
import { MainMenu } from './components/MainMenu';
import { SpellingGame } from './components/SpellingGame';
import { FillBlanksGame } from './components/FillBlanksGame';
import { MemoryGame } from './components/MemoryGame';

function App() {
  const {
    mode,
    score,
    highScore,
    currentWord,
    // feedback, // feedback is handled locally in components based on checkAnswer result but checkAnswer in hook sets legacy feedback state - we might not need it globally if components manage visual feedback.

    startGame,
    checkAnswer,
    addScore,
    goHome,
    speak,
    // nextWord
  } = useGameLogic();

  return (
    <GameLayout score={score} highScore={highScore} onHome={goHome}>
      {mode === 'menu' && (
        <MainMenu onSelectMode={startGame} />
      )}

      {mode === 'spelling' && currentWord && (
        <SpellingGame
          currentWord={currentWord}
          onCheck={checkAnswer}
          onSpeak={speak}
          onBack={goHome}
        />
      )}

      {mode === 'fillBlanks' && currentWord && (
        <FillBlanksGame
          currentWord={currentWord}
          onCheck={checkAnswer}
          onSpeak={speak}
          onBack={goHome}
        />
      )}

      {mode === 'memory' && (
        <MemoryGame
          onBack={goHome}
          onSpeak={speak}
          onScoreUpdate={addScore}
        />
      )}
    </GameLayout>
  );
}

export default App;
