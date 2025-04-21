class Tetris {
    constructor() {
        // ... existing constructor code ...
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
        if (this.gameOver || this.isPaused) return;
        
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

    // ... rest of the existing methods ...
} 