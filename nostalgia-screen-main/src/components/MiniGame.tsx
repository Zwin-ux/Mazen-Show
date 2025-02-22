
import { useEffect, useState, useCallback, useRef } from 'react';

export const MiniGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const obstacleRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const scoreIntervalRef = useRef<NodeJS.Timeout>();

  const jump = useCallback(() => {
    if (!isJumping && isPlaying) {
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 500);
    }
  }, [isJumping, isPlaying]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setGameOver(false);
  };

  const checkCollision = useCallback(() => {
    const player = playerRef.current;
    const obstacle = obstacleRef.current;

    if (!player || !obstacle) return;

    const playerRect = player.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    if (
      playerRect.right > obstacleRect.left &&
      playerRect.left < obstacleRect.right &&
      playerRect.bottom > obstacleRect.top &&
      !isJumping
    ) {
      setIsPlaying(false);
      setGameOver(true);
      if (scoreIntervalRef.current) {
        clearInterval(scoreIntervalRef.current);
      }
    }
  }, [isJumping]);

  useEffect(() => {
    if (isPlaying) {
      const updateGame = () => {
        checkCollision();
        animationFrameRef.current = requestAnimationFrame(updateGame);
      };
      animationFrameRef.current = requestAnimationFrame(updateGame);

      scoreIntervalRef.current = setInterval(() => {
        setScore(prev => prev + 1);
      }, 100);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (scoreIntervalRef.current) {
        clearInterval(scoreIntervalRef.current);
      }
    };
  }, [isPlaying, checkCollision]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        if (!isPlaying && !gameOver) {
          startGame();
        } else {
          jump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, jump, gameOver]);

  if (!isPlaying && !gameOver) {
    return (
      <div className="text-center p-4">
        <button 
          onClick={startGame}
          className="bg-museum-tile text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
        >
          Start Game
        </button>
        <p className="mt-2 text-sm text-museum-text">Press SPACE to jump</p>
      </div>
    );
  }

  return (
    <div className="relative h-32 w-full max-w-md mx-auto bg-museum-tile rounded-lg overflow-hidden">
      <div className="absolute top-2 right-2 text-white">Score: {score}</div>
      <div
        ref={playerRef}
        className={`absolute left-8 w-6 h-6 bg-white rounded-full transition-transform duration-500 ${
          isJumping ? 'translate-y-2' : 'translate-y-20'
        }`}
      />
      {isPlaying && (
        <div
          ref={obstacleRef}
          className="absolute bottom-4 w-4 h-8 bg-white animate-obstacle"
          style={{
            right: '-16px',
            animation: 'obstacle 2s linear infinite',
          }}
        />
      )}
      {gameOver && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center flex-col">
          <p className="text-white mb-2">Game Over! Score: {score}</p>
          <button
            onClick={startGame}
            className="bg-white text-museum-tile px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};
