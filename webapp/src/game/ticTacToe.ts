import type { MakeOptional } from "../util/makeOptional";
import { Board } from "./board";
import { CellValue } from "./types";
import type { Move, PlayerPiece } from "./types";

class TicTacToe {
  private board: Board;
  private currentPlayer: PlayerPiece;
  history: Move[];
  constructor(startingPlayer: PlayerPiece) {
    this.board = new Board();
    this.currentPlayer = startingPlayer;
    this.history = [];
  }

  makeMove(move: MakeOptional<Move, "player">): void {
    // Make a move on the board

    // Thow an error if trying to make a move with the wrong player
    if (move.player !== undefined && move.player !== this.currentPlayer) {
      throw new Error(`It is not ${move.player}'s turn`);
    }
    // Throw an error if the move is illegal

    if (
      !this.legalMoves.some(
        (legalMove) => legalMove.x === move.x && legalMove.y === move.y
      )
    ) {
      throw new Error("Illegal move");
    }

    this.board.doMove({ ...move, player: this.currentPlayer });
    this.history.push({ ...move, player: this.currentPlayer });
    this.currentPlayer =
      this.currentPlayer === CellValue.FirstHalf
        ? CellValue.SecondHalf
        : CellValue.FirstHalf;
  }

  getCell(x: number, y: number): CellValue {
    return this.board.getCell(x, y);
  }

  restart(): void {
    this.board = new Board();
    this.history = [];
    this.currentPlayer =
      Math.random() < 0.5 ? CellValue.FirstHalf : CellValue.SecondHalf;
  }

  get winner(): CellValue {
    // Return the winner of the entire board
    return this.board.hasWinner ? this.history.at(-1).player : CellValue.Empty;
  }

  get current(): PlayerPiece {
    return this.currentPlayer;
  }

  get legalMoves(): Move[] {
    // If the board has a winner, no moves are legal
    if (this.winner !== CellValue.Empty) {
      return [];
    }

    return Array(3 * 3)
      .fill(0)
      .map((_, i) => {
        return {
          x: Math.floor(i / 3),
          y: i % 3,
          player: this.currentPlayer,
        };
      })
      .filter((move) => {
        const cell = this.board.getCell(move.x, move.y);
        //Cells where player has already placed is illegal
        const alreadyPlaced =
          cell === CellValue.Full || cell === this.currentPlayer;
        //Cell played last move is illegal
        const lastMove = this.history.at(-1);
        const placedLastMove =
          lastMove && lastMove.x === move.x && lastMove.y === move.y;
        return !alreadyPlaced && !placedLastMove;
      });
  }
}

export { TicTacToe };
