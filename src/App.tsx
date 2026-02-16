
import { useGameLogic } from './hooks/useGameLogic';
import { GameLayout } from './components/GameLayout';
import { MainMenu } from './components/MainMenu';
import { SpellingGame } from './components/SpellingGame';
import { FillBlanksGame } from './components/FillBlanksGame';
import { MemoryGame } from './components/MemoryGame';
import { ListeningGame } from './components/ListeningGame';
import { CategoryGame } from './components/CategoryGame';



function App() {
  const {
    mode,
    score,
    highScore,
    currentWord,
    startGame,
    checkAnswer,
    addScore,
    goHome,
    speak,
    nextWord
  } = useGameLogic();


  return (
    <GameLayout score={score} highScore={highScore} onHome={goHome}>
      {mode === 'menu' && (
        <MainMenu onSelectMode={startGame} />
      )}

      {mode === 'memory' && (
        <MemoryGame
          onBack={goHome}
          onSpeak={speak}
          onScoreUpdate={addScore}
        />
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

      {mode === 'listening' && currentWord && (
        <ListeningGame
          currentWord={currentWord}
          onCheck={checkAnswer}
          onSpeak={speak}
          onBack={goHome}
        />
      )}

      {mode === 'category' && currentWord && (
        <CategoryGame
          currentWord={currentWord}
          onCheck={checkAnswer}
          onSpeak={speak}
          onBack={goHome}
          onScoreUpdate={addScore}
          nextWord={nextWord}
        />
      )}
    </GameLayout>
  );
}


export default App;
