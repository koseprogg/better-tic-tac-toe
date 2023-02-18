import type { TicTacToe } from "../game/ticTacToe";

export const gameDataToBots = (game: TicTacToe): string => {
  // Get relevant game data as a JSON string
  const data = {
    board: new Array(3)
      .fill(0)
      .map((_, y) => new Array(3).fill(0).map((_, x) => game.getCell(x, y))),
    history: game.history,
    currentPlayer: game.current,
    legalMoves: game.legalMoves,
  };
  return JSON.stringify(data);
};
