let board = [
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', '']
  ];
  
  let score = 0;
  let gameover = false;
  
  function newGame() {
    board = [
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', '']
    ];
    score = 0;
    gameover = false;
    addTile();
    addTile();
    updateBoard();
  }
  
  function addTile() {
    let options = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === '') {
          options.push({ x: i, y: j });
        }
      }
    }
    if (options.length > 0) {
      let spot = options[Math.floor(Math.random() * options.length)];
      let val = Math.random() < 0.9 ? 2 : 4;
      board[spot.x][spot.y] = val;
    }
  }
  
  function slide(row) {
    let arr = row.filter(val => val);
    let missing = 4 - arr.length;
    let zeros = Array(missing).fill('');
    arr = zeros.concat(arr);
    return arr;
  }
  
  function combine(row) {
    for (let i = 3; i >= 1; i--) {
      let a = row[i];
      let b = row[i - 1];
      if (a == b) {
        row[i] = a + b;
        score += row[i];
        row[i - 1] = '';
      }
    }
    return row;
  }
  
  function operate(row) {
    row = slide(row);
    row = combine(row);
    row = slide(row);
    return row;
  }
  
  function copyBoard(board) {
    let newBoard = [];
    for (let i = 0; i < 4; i++) {
      newBoard.push(board[i].slice());
    }
    return newBoard;
  }
  
  function flipBoard(board) {
    for (let i = 0; i < 4; i++) {
      board[i].reverse();
    }
    return board;
  }
  
  function transposeBoard(board) {
    let newBoard = copyBoard(board);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        newBoard[i][j] = board[j][i];
      }
    }
    return newBoard;
  }
  
  function moveRight() {
    board.forEach(row => {
      row = operate(row);
    });
    addTile();
    updateBoard();
  }
  
  function moveLeft() {
    board = flipBoard(board);
    board.forEach(row => {
      row = operate(row);
    });
    board = flipBoard(board);
    addTile();
    updateBoard();
  }
  
  function moveDown() {
    board = transposeBoard(board);
    board.forEach(row => {
      row = operate(row);
    });
    board = transposeBoard(board);
    addTile();
    updateBoard();
  }
  
  function moveUp() {
    board = transposeBoard(board);
    board = flipBoard(board);
    board.forEach(row => {
      row = operate(row);
    });
    board = flipBoard(board);
    board = transposeBoard(board);
    addTile();
    updateBoard();
  }
  
  function checkWin() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 2048) {
          return true;
        }
      }
    }
    return false;
  }
  
  function updateBoard() {
    let tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
      tile.parentNode.removeChild(tile);
    });
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let tile = document.createElement('div');
        let val = board[i][j];
        tile.classList.add('tile');
        tile.setAttribute('data-value', val);
        if (val !== '') {
          tile.innerText = val;
        }
        let boardEl = document.querySelector('.board');
        boardEl.appendChild(tile);
      }
    }
    let scoreEl = document.querySelector('.score');
    scoreEl.innerText = `Score: ${score}`;
    if (gameover) {
      let gameoverEl = document.querySelector('.gameover');
      gameoverEl.style.display = 'block';
    }
  }
  
  function isGameOver() {
    let emptySpots = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === '') {
          emptySpots++;
        }
        if (board[i][j] === 2048) {
          return true;
        }
        if (j < 3 && board[i][j] === board[i][j + 1]) {
          return false;
        }
        if (i < 3 && board[i][j] === board[i + 1][j]) {
          return false;
        }
      }
    }
    if (emptySpots === 0) {
      return true;
    }
    return false;
  }
  
  newGame();
  
  document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight') {
      moveRight();
    } else if (event.key === 'ArrowLeft') {
      moveLeft();
    } else if (event.key === 'ArrowDown') {
      moveDown();
    } else if (event.key === 'ArrowUp') {
      moveUp();
    }
  });
  
  let newGameButton = document.querySelector('.new-game');
  newGameButton.addEventListener('click', function() {
    let gameoverEl = document.querySelector('.gameover');
    gameoverEl.style.display = 'none';
    newGame();
  });
  
  let boardEl = document.querySelector('.board');
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let cell = document.createElement('div');
      cell.classList.add('cell');
      boardEl.appendChild(cell);
    }
  }
  