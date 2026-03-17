# neriskuj — Customized Jeopardy Game

## Purpose
A customized Jeopardy game player for local use. Based on the open-source app by Brian Yu (https://jeopardy.brianyu.me/).

## Customizations from Upstream
- **Czech Kč currency**: Values shown as `{number} Kč` instead of `${number}`
- **No player tracking**: No player names, scores, or scoreboard
- **No solution display**: Clicking a clue shows only the clue text; clicking again returns to the board

## Game Definition
Edit `game.json` at the project root to change categories and clues. The file is automatically copied to `public/game.json` before each start/build.

Structure:
```json
{
  "game": {
    "single": [
      {
        "category": "Category Name",
        "clues": [
          { "value": 200, "clue": "Clue text", "solution": "Optional, not shown" }
        ]
      }
    ],
    "final": {
      "category": "Final Category",
      "clue": "Final clue text",
      "solution": "Optional, not shown"
    }
  }
}
```

## Running Locally
```
npm install
npm start
```

The browser opens at http://localhost:3000. The game board renders automatically from `game.json`.
