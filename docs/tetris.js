class Tetris {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextPieceCanvas = document.getElementById('next-piece-canvas');
        this.nextPieceCtx = this.nextPieceCanvas.getContext('2d');
        
        // Game settings
        this.blockSize = 30;
        this.rows = 20;
        this.cols = 10;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        
        // Game state
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.currentPiece = null;
        this.nextPiece = null;
        this.gameOver = false;
        this.isPaused = false;
        
        // Tetromino shapes and colors
        this.shapes = [
            [[1, 1, 1, 1]], // I
            [[1, 1], [1, 1]], // O
            [[1, 1, 1], [0, 1, 0]], // T
            [[1, 1, 1], [1, 0, 0]], // L
            [[1, 1, 1], [0, 0, 1]], // J
            [[1, 1, 0], [0, 1, 1]], // S
            [[0, 1, 1], [1, 1, 0]]  // Z
        ];
        
        this.colors = [
            '#00f0f0', // I - Cyan
            '#f0f000', // O - Yellow
            '#a000f0', // T - Purple
            '#f0a000', // L - Orange
            '#0000f0', // J - Blue
            '#00f000', // S - Green
            '#f00000'  // Z - Red
        ];
        
        // Event listeners
        document.getElementById('start-button').addEventListener('click', () => this.startGame());
        document.getElementById('pause-button').addEventListener('click', () => this.togglePause());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Initialize game
        this.drawBoard();
    }
    
    startGame() {
        if (this.gameOver) {
            this.resetGame();
        }
        this.gameOver = false;
        this.isPaused = false;
        this.spawnPiece();
        this.gameLoop();
    }
    
    resetGame() {
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.updateScore();
        this.drawBoard();
    }
    
    spawnPiece() {
        if (!this.nextPiece) {
            this.nextPiece = {
                shape: this.shapes[Math.floor(Math.random() * this.shapes.length)],
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                x: Math.floor(this.cols / 2) - 1,
                y: 0
            };
        }
        
        this.currentPiece = this.nextPiece;
        this.nextPiece = {
            shape: this.shapes[Math.floor(Math.random() * this.shapes.length)],
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            x: Math.floor(this.cols / 2) - 1,
            y: 0
        };
        
        this.drawNextPiece();
        
        if (this.checkCollision()) {
            this.gameOver = true;
            alert('Game Over!');
        }
    }
    
    drawNextPiece() {
        this.nextPieceCtx.clearRect(0, 0, this.nextPieceCanvas.width, this.nextPieceCanvas.height);
        this.nextPieceCtx.fillStyle = this.nextPiece.color;
        
        const blockSize = 20;
        const offsetX = (this.nextPieceCanvas.width - this.nextPiece.shape[0].length * blockSize) / 2;
        const offsetY = (this.nextPieceCanvas.height - this.nextPiece.shape.length * blockSize) / 2;
        
        this.nextPiece.shape.forEach((row, i) => {
            row.forEach((value, j) => {
                if (value) {
                    this.nextPieceCtx.fillRect(
                        offsetX + j * blockSize,
                        offsetY + i * blockSize,
                        blockSize - 1,
                        blockSize - 1
                    );
                }
            });
        });
    }
    
    drawBoard() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw the board
        this.board.forEach((row, i) => {
            row.forEach((value, j) => {
                if (value) {
                    this.ctx.fillStyle = value;
                    this.ctx.fillRect(
                        j * this.blockSize,
                        i * this.blockSize,
                        this.blockSize - 1,
                        this.blockSize - 1
                    );
                }
            });
        });
        
        // Draw current piece
        if (this.currentPiece) {
            this.ctx.fillStyle = this.currentPiece.color;
            this.currentPiece.shape.forEach((row, i) => {
                row.forEach((value, j) => {
                    if (value) {
                        this.ctx.fillRect(
                            (this.currentPiece.x + j) * this.blockSize,
                            (this.currentPiece.y + i) * this.blockSize,
                            this.blockSize - 1,
                            this.blockSize - 1
                        );
                    }
                });
            });
        }
    }
    
    movePiece(dx, dy) {
        if (this.gameOver || this.isPaused) return;
        
        this.currentPiece.x += dx;
        this.currentPiece.y += dy;
        
        if (this.checkCollision()) {
            this.currentPiece.x -= dx;
            this.currentPiece.y -= dy;
            
            if (dy > 0) {
                this.lockPiece();
            }
            return false;
        }
        
        this.drawBoard();
        return true;
    }
    
    rotatePiece() {
        if (this.gameOver || this.isPaused) return;
        
        const originalShape = this.currentPiece.shape;
        this.currentPiece.shape = this.currentPiece.shape[0].map((_, i) =>
            this.currentPiece.shape.map(row => row[i]).reverse()
        );
        
        if (this.checkCollision()) {
            this.currentPiece.shape = originalShape;
        }
        
        this.drawBoard();
    }
    
    checkCollision() {
        return this.currentPiece.shape.some((row, i) => {
            return row.some((value, j) => {
                if (!value) return false;
                
                const newX = this.currentPiece.x + j;
                const newY = this.currentPiece.y + i;
                
                return (
                    newX < 0 ||
                    newX >= this.cols ||
                    newY >= this.rows ||
                    (newY >= 0 && this.board[newY][newX])
                );
            });
        });
    }
    
    lockPiece() {
        this.currentPiece.shape.forEach((row, i) => {
            row.forEach((value, j) => {
                if (value) {
                    const y = this.currentPiece.y + i;
                    if (y >= 0) {
                        this.board[y][this.currentPiece.x + j] = this.currentPiece.color;
                    }
                }
            });
        });
        
        this.clearLines();
        this.spawnPiece();
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let i = this.rows - 1; i >= 0; i--) {
            if (this.board[i].every(cell => cell)) {
                this.board.splice(i, 1);
                this.board.unshift(Array(this.cols).fill(0));
                linesCleared++;
                i++;
            }
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += linesCleared * 100 * this.level;
            this.level = Math.floor(this.lines / 10) + 1;
            this.updateScore();
        }
    }
    
    updateScore() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('lines').textContent = this.lines;
    }
    
    togglePause() {
        if (!this.gameOver) {
            this.isPaused = !this.isPaused;
            document.getElementById('pause-button').textContent = this.isPaused ? 'Resume' : 'Pause';
        }
    }
    
    handleKeyPress(e) {
        if (this.gameOver) return;
        
        switch (e.key) {
            case 'ArrowLeft':
                this.movePiece(-1, 0);
                break;
            case 'ArrowRight':
                this.movePiece(1, 0);
                break;
            case 'ArrowDown':
                this.movePiece(0, 1);
                break;
            case 'ArrowUp':
                this.rotatePiece();
                break;
            case ' ':
                while (this.movePiece(0, 1));
                break;
        }
    }
    
    gameLoop() {
        if (this.gameOver || this.isPaused) return;
        
        if (!this.movePiece(0, 1)) {
            this.lockPiece();
        }
        
        setTimeout(() => this.gameLoop(), 1000 / this.level);
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new Tetris();
}); 