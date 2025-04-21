# Tetris Game

A classic Tetris game built with HTML5 Canvas and JavaScript.

## How to Play

1. Open `index.html` in your web browser
2. Click the "Start Game" button to begin
3. Use the following controls:
   - Left Arrow: Move piece left
   - Right Arrow: Move piece right
   - Down Arrow: Move piece down faster
   - Up Arrow: Rotate piece
   - Space: Hard drop (instantly drop piece to bottom)
   - Pause Button: Pause/Resume game

## Game Features

- Score tracking
- Level progression (speed increases with level)
- Next piece preview
- Line clearing
- Game over detection
- Pause functionality

## Scoring System

- 1 line cleared: 100 points × level
- 2 lines cleared: 200 points × level
- 3 lines cleared: 400 points × level
- 4 lines cleared: 800 points × level

Level increases every 10 lines cleared.

## Technical Details

The game is built using:
- HTML5 Canvas for rendering
- JavaScript for game logic
- CSS for styling

No external dependencies required - just open the HTML file in a modern web browser to play!