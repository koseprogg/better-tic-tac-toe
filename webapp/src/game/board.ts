import { CellValue } from "./types";
import type { Move, PlayerPiece, Grid } from "./types";

class Board {
  private board: Grid;

  constructor() {
    // Construct a 3x3 board of empty cells
    this.board = [];
    for (let x = 0; x < 3; x++) {
      this.board.push([]);
      for (let y = 0; y < 3; y++) {
        this.board[x].push(CellValue.Empty);
      }
    }
  }

  get hasWinner(): boolean {
    //Calculate winner of a 3x3 board
    const winningCombinations = [
      //Horizontal
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      //Vertical
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      //Diagonal
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    ];

    for (let combination of winningCombinations) {
      let [a, b, c] = combination;

      if (
        this.board[a[0]][a[1]] === CellValue.Full &&
        this.board[a[0]][a[1]] === this.board[b[0]][b[1]] &&
        this.board[a[0]][a[1]] === this.board[c[0]][c[1]]
      ) {
        return true;
      }
    }

    //If no winner is found
    return false;
  }

  getCell(x: number, y: number): CellValue {
    return this.board[x][y];
  }

  doMove(move: Move): void {
    // Place a value on the board
    const prevValue = this.getCell(move.x, move.y);
    if (
      prevValue != move.player &&
      prevValue != CellValue.Full &&
      prevValue != CellValue.Empty
    ) {
      this.board[move.x][move.y] = CellValue.Full;
    } else {
      this.board[move.x][move.y] = move.player;
    }
  }
}

export { Board };
