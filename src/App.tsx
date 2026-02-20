
import { useGameLogic } from './hooks/useGameLogic';
import { GameLayout } from './components/GameLayout';
import { MainMenu } from './components/MainMenu';
import { SpellingGame } from './components/SpellingGame';
import { FillBlanksGame } from './components/FillBlanksGame';
import { MemoryGame } from './components/MemoryGame';
import { ListeningGame } from './components/ListeningGame';
import { CategoryGame } from './components/CategoryGame';
import { MeteorTypingGame } from './components/MeteorTypingGame';
import { AdventureGame } from './components/AdventureGame';



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

  console.log('Current Mode:', mode);

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
          key={currentWord.word}
          currentWord={currentWord}
          onCheck={checkAnswer}
          onSpeak={speak}
          onBack={goHome}
        />
      )}

      {mode === 'fillBlanks' && currentWord && (
        <FillBlanksGame
          key={currentWord.word}
          currentWord={currentWord}
          onCheck={checkAnswer}
          onSpeak={speak}
          onBack={goHome}
        />
      )}

      {mode === 'listening' && currentWord && (
        <ListeningGame
          key={currentWord.word}
          currentWord={currentWord}
          onCheck={checkAnswer}
          onSpeak={speak}
          onBack={goHome}
        />
      )}

      {mode === 'category' && currentWord && (
        <CategoryGame
          key={currentWord.word}
          currentWord={currentWord}
          onCheck={checkAnswer}
          onSpeak={speak}
          onBack={goHome}
          onScoreUpdate={addScore}
          nextWord={nextWord}
        />
      )}

      {mode === 'typing' && (
        <MeteorTypingGame
          onBack={goHome}
          onScoreUpdate={addScore}
        />
      )}

      {mode === 'adventure' && (
        <AdventureGame
          onBack={goHome}
        />
      )}
    </GameLayout>
  );
}


export default App;
