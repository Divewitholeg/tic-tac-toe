import { useState } from "react";

//Props validation for Square component
import PropTypes from "prop-types";
Square.propTypes = {
  value: PropTypes.string,
};
Square.propTypes = {
  onSquareClick: PropTypes.func,
};
Board.propTypes = {
  xIsNext: PropTypes.bool,
  squares: PropTypes.array,
  onPlay: PropTypes.func,
};

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return; // [2]
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares); // [3]
  }

  const winner = calculateWinner(squares); // [8]
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O"); // [9]
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0); // [1

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // [3]
    [3, 4, 5], // [3]
    [6, 7, 8], // [3]
    [0, 3, 6], // [3]
    [1, 4, 7], // [3]
    [2, 5, 8], // [3]
    [0, 4, 8], // [3]
    [2, 4, 6], // [3]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]; // [4]
    if (
      squares[a] && // [5]
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a]; // [6]
    }
  }
  return null; // [7]
}

// [1] The currentMove state variable keeps track of which move we’re currently viewing.
// [2] If the square is already filled or if there’s a winner, we don’t want to do anything when the square is clicked.
// [3] The onPlay prop is a function that we call when a square is clicked. We pass it the nextSquares array, which is the squares array with the new move added.
// [4] The lines array contains all the possible winning combinations.
// [5] If the first square in the line is empty, we can skip the rest of the line.
// [6] If the first square in the line is filled and all three squares in the line are the same, we have a winner.
// [7] If none of the lines have a winner, we return null.
