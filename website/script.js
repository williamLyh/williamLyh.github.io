class Game2048 {
    constructor(boardElement) {
        this.boardElement = boardElement;
        this.board = this.initBoard();
        this.addRandomTile();
        this.addRandomTile();
        this.render();
        this.listen();
    }

    initBoard() {
        const board = new Array(4);
        for (let i = 0; i < 4; i++) {
            board[i] = new Array(4).fill(0);
        }
        return board;
    }

    addRandomTile() {
        const emptyCells = this.getEmptyCells();
        if (emptyCells.length > 0) {
            const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    getEmptyCells() {
        const emptyCells = [];
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (this.board[row][col] === 0) {
                    emptyCells.push([row, col]);
                }
            }
        }
        return emptyCells;
    }

    render() {
        this.boardElement.innerHTML = '';
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const value = this.board[row][col];
                const tile = document.createElement('div');
                if (value !== 0) {
                    tile.textContent = value;
                    tile.className = 'tile';
                    tile.dataset.value = value;
                }
                this.boardElement.appendChild(tile);
            }
        }
    }

    listen() {
        document.addEventListener('keydown', (e) => {
            const keyMap = {
                ArrowUp: 'up',
                ArrowDown: 'down',
                ArrowLeft: 'left',
                ArrowRight: 'right',
            };
            const direction = keyMap[e.key];
            if (direction) {
                const moved = this.move(direction);
                if (moved) {
                    this.addRandomTile();
                    this.render();
                }
            }
        });
    }

    move(direction) {
        const boardBeforeMove = JSON.stringify(this.board);
        if (direction === 'up' || direction === 'down') {
            this.transposeBoard();
        }
        if (direction === 'right' || direction === 'down') {
            this.reverseBoard();
        }
        for (let row = 0; row < 4; row++) {
            this.board[row] = this.collapseRow(this.board[row]);
        }
        if (direction === 'right' || direction === 'down') {
            this.reverseBoard();
        }
        if (direction === 'up' || direction === 'down') {
            this.transposeBoard();
        }
        const boardAfterMove = JSON.stringify(this.board);
        return boardBeforeMove !== boardAfterMove;
    }

    transposeBoard() {
        const transposed = this.initBoard();
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                transposed[row][col] = this.board[col][row];
            }
        }
        this.board = transposed;
    }

    reverseBoard() {
        for (let row = 0; row < 4; row++) {
            this.board[row] = this.board[row].reverse();
        }
    }

    collapseRow(row) {
        const newRow = row.filter(val => val !== 0);
        const zeros = new Array(4 - newRow.length).fill(0);
        const collapsed = newRow.concat(zeros);
        for (let i = 0; i < collapsed.length - 1; i++) {
            if (collapsed[i] === collapsed[i + 1]) {
                collapsed[i] *= 2;
                collapsed.splice(i + 1, 1);
                collapsed.push(0);
            }
        }
        return collapsed;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    new Game2048(boardElement);
});


