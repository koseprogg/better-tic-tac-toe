import { CellValue } from "../game/types";
import { writable } from "svelte/store";
import { TicTacToe } from "../game/ticTacToe";

export const game = writable(
  new TicTacToe(
    Math.random() < 0.5 ? CellValue.FirstHalf : CellValue.SecondHalf
  )
);
