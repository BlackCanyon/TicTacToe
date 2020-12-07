
//AI Logic (This implementation uses Minimax with no pruning because the search
//space is so small. For a good explanation, see
//https://en.wikipedia.org/wiki/Minimax)

function getMinimaxScore(board, depth, computerLetter, opponentLetter, maximixingPlayer) {
  let bestValue = undefined;
  if (isWinner(board, computerLetter) === true) {
    return 1;
  } else if (isWinner(board, opponentLetter) === true) {
    return -1;
  } else if (isBoardFull(board) === true) {
    return 0;
  }

  if (maximixingPlayer === true) {
    bestValue = -10;
    let possibleMoves = findLegalMoves(board);
    possibleMoves.forEach(function(move) {
      let boardCopy = [...board];
      makeMove(move, boardCopy, computerLetter);
      v = getMinimaxScore(boardCopy, depth - 1, computerLetter, opponentLetter, false);
      bestValue = Math.max(bestValue, v);
    })
  } else {
    bestValue = 10;
    let possibleMoves = findLegalMoves(board);
    possibleMoves.forEach(function(move) {
      let boardCopy = [...board];
      makeMove(move, boardCopy, opponentLetter);
      v = getMinimaxScore(boardCopy, depth - 1, computerLetter, opponentLetter, true);
      bestValue = Math.min(bestValue, v);
    });
  }
  return bestValue;
}

function getMinimaxMove(board, computerLetter, playerLetter) {
  let bestScore = -2;
  let bestMove = undefined;
  let i = 0
  let legalMoveArray = findLegalMoves(board)
  legalMoveArray.forEach(function(move) {
    let boardCopy = [...board];
    makeMove(move, boardCopy, computerLetter);
    score = getMinimaxScore(boardCopy, 9, computerLetter, playerLetter, false);

    if (score > bestScore) {
      bestMove = move;
      bestScore = score;
    }
  })
  return bestMove;
}

//helper functions

function makeMove(move, board, letter) {
  board[move] = letter;
}

function isWinner(b, l) {
  if ((b[0] == l && b[1] == l && b[2] == l) || //horizontal first row
    (b[3] == l && b[4] == l && b[5] == l) || //horizontal second row
    (b[6] == l && b[7] == l && b[8] == l) || //horizontal third row
    (b[0] == l && b[3] == l && b[6] == l) || //vertical first column
    (b[1] == l && b[4] == l && b[7] == l) || //vertical middle column
    (b[2] == l && b[5] == l && b[8] == l) || //vertical third column
    (b[0] == l && b[4] == l && b[8] == l) || //diagonal top to bottom
    (b[6] == l && b[4] == l && b[2] == l)) {
    return true
  } //diagonal bottom to top
}

function isBoardFull(board) {
  for (let i = 0; i < 9; i++) {
    if (isSpaceFree(board, i) === true) {
      return false;
    }
  }
  return true;
}

function findLegalMoves(board) {
  let legalMoves = [];
  for (let i = 0; i < 9; i++) {
    if (isSpaceFree(board, i) === true) {
      legalMoves.push(i)
    }
  }
  return legalMoves
}

function isSpaceFree(board, move) {
  if (board[move] == ' ') {
    return true;
  }
}

//Rendering-related functions
function updateGameBoard(move, letter) {
  document.querySelector("#a"+move).innerHTML = "<h3>"+letter+"</h3>"
}

//Main gameplay loop

function startGame() {
  if (gameStarted === false) {
    document.querySelector(".press-key").classList.add("invisible");
    document.querySelector(".board").classList.remove("invisible");
    let gameBoard = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
    let playerLetter = "X";
    let computerLetter = "O";
    let playerMove = undefined;
    let computerMove = undefined;
    gameStarted = true;

    for (let i = 0; i < document.querySelectorAll(".tile").length; i++) {
      document.querySelectorAll(".tile > button")[i].addEventListener("click", function() {
        playerMove = this.parentElement.id.slice(1);
        if (isSpaceFree(gameBoard, playerMove) === true) {
          makeMove(playerMove, gameBoard, playerLetter);
          updateGameBoard(playerMove, playerLetter)
          if (isWinner(gameBoard, playerLetter) === true) {
            document.querySelector(".postgame").classList.remove("invisible");
            gameStarted = false;
          } else if (isBoardFull(gameBoard) === true) {
            document.querySelector(".postgame").innerText = "The game is a tie!";
            document.querySelector(".postgame").classList.remove("invisible")
            gameStarted = false;
            //Tie game stuff here.
          } else {
            computerMove = getMinimaxMove(gameBoard, computerLetter, playerLetter);
            makeMove(computerMove, gameBoard, computerLetter);
            updateGameBoard(computerMove, computerLetter)
            if (isWinner(gameBoard, computerLetter) === true) {
              document.querySelector(".postgame").innerText = "You lost!";
              document.querySelector(".postgame").classList.remove("invisible");
              gameStarted = false;
              //Make some visual changes here.
            } else if (isBoardFull(gameBoard) == true) {
              document.querySelector(".postgame").innerText = "The game is a tie!";
              document.querySelector(".postgame").classList.remove("invisible");
              gameStarted = false;
            }
          }
        }
      })
    }
  }
}

let gameStarted = false;

document.addEventListener("keydown", startGame)
