enum CellValue {
  Empty = " ",
  FirstHalf = "|",
  SecondHalf = "-",
  Full = "+",
}

type PlayerPiece = CellValue.FirstHalf | CellValue.SecondHalf;

//This represents a 9x9 board
type Grid = CellValue[][];

type Move = {
  x: number;
  y: number;
  player: PlayerPiece;
};

export { CellValue };
export type { Grid, Move, PlayerPiece };
