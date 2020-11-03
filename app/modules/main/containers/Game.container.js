import { useState, useRef } from 'react';
import ReactCSSTransitionReplace from 'react-css-transition-replace';
import * as R from 'ramda';
import { withErrorBoundary } from '$components/ErrorBoundary';
import Board from '../components/Board';

const MIN_SIZE = 3;
const MAX_SIZE = 10;

const Container = () => {
  const [size, setSize] = useState(MIN_SIZE);

  const initBoard = () => R.repeat(R.repeat('', size), size);
  const initScores = () => {
    const sum = (size * (size + 1)) / 2;
    return [
      {
        row: R.repeat(sum, size),
        col: R.repeat(sum, size),
        diag: [sum * 2, sum * 2],
      },
      {
        row: R.repeat(sum, size),
        col: R.repeat(sum, size),
        diag: [sum * 2, sum * 2],
      },
    ];
  };

  const [board, setBoard] = useState(() => initBoard());
  const moves = useRef(0);
  const scores = useRef(initScores());
  const [winner, setWinner] = useState(null);
  const [winCount, setWinCount] = useState({ 0: 0, 1: 0 });

  const player = moves.current % 2; // 0: Player O, 1: Player X

  const reset = () => {
    moves.current = 0;
    scores.current = initScores();
    setBoard(initBoard());
    setWinner(null);
  };

  const handleTileClick = (r, c) => {
    // Update the board
    const newBoard = JSON.parse(JSON.stringify(board));
    newBoard[r][c] = player ? 'x' : 'o';
    moves.current += 1;
    setBoard(newBoard);

    // Update scores
    scores.current[player].row[r] -= c + 1;
    scores.current[player].col[c] -= r + 1;
    scores.current[player].diag[0] -= r + c === size - 1 ? c + 1 + r + 1 : 0;
    scores.current[player].diag[1] -= r - c === 0 ? c + 1 + r + 1 : 0;

    // Check for winning move
    if (
      scores.current[player].row[r] === 0 ||
      scores.current[player].col[c] === 0 ||
      scores.current[player].diag[0] === 0 ||
      scores.current[player].diag[1] === 0
    ) {
      setWinner(player ? 'x' : 'o');
      setWinCount({
        ...winCount,
        [player]: winCount[player] + 1,
      });
      return;
    }

    // Check for last move
    if (moves.current >= size * size) {
      setWinner('=');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-indigo-500 text-6xl font-bold">Tic Tac Toe</div>
      <div className="text-teal-500 text-xl font-semibold">
        Player O wins {winCount[0]} times
      </div>
      <div className="text-red-500 text-xl font-semibold mb-10">
        Player X wins {winCount[1]} times
      </div>
      <Board board={board} disabled={!!winner} onTileClick={handleTileClick} />
      <ReactCSSTransitionReplace
        transitionName="roll-up"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
      >
        {winner && (
          <div className="text-yellow-500 text-3xl font-semibold">
            {winner === '='
              ? 'It is a tie!'
              : `Player ${winner.toUpperCase()} wins`}
          </div>
        )}
      </ReactCSSTransitionReplace>
      <input
        type="number"
        placeholder="Board size"
        className="w-20 mt-5"
        value={size}
        onChange={({ target: { value } }) => {
          const newSize = parseInt(value, 10);
          if (newSize >= MIN_SIZE && newSize <= MAX_SIZE) {
            setSize(newSize);
          }
        }}
      />
      <button type="button" className="btn-simple mt-2" onClick={reset}>
        Restart
      </button>
    </div>
  );
};

Container.displayName = 'GameContainer';

export default withErrorBoundary(Container);
