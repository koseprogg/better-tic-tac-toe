<script lang="ts">
  import type { Move } from "../game/types";
  import type { MakeOptional } from "../util/makeOptional";
  import { game } from "../stores/gameStore";
  import { currentPlayer } from "../stores/playerStore";
  //create board object that is easy to use in svelte
  // It is a 3x3 array of 3x3 arrays (with a field for winner of the subBoard)

  const makeMove = (move: MakeOptional<Move, "player">) => {
    game.update((gm) => {
      gm.makeMove(move);
      return gm;
    });
  };

  let board;
  game.subscribe((game) => {
    board = [];
    for (let x = 0; x < 3; x++) {
      board.push([]);
      for (let y = 0; y < 3; y++) {
        board[x].push(game.getCell(x, y));
      }
    }
  });
</script>

<main>
  <div class="board">
    {#each board as row, x}
      <div class="row">
        {#each row as cell, y}
          <div
            class="cell"
            class:clickable={$game.legalMoves.some(
              (move) => move.x === x && move.y === y
            )}
            on:click={$currentPlayer == ""
              ? () => makeMove({ x: x, y: y })
              : () => {
                  throw new Error("Bot's turn");
                }}
          >
            {cell}
          </div>
        {/each}
      </div>
    {/each}
  </div>
</main>

<style>
  .cell {
    width: 50px;
    height: 50px;
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  main {
    display: flex;
    justify-content: center;
  }
  .board {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .row {
    display: flex;
    gap: 10px;
  }
  .subBoard {
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .subBoardWinner {
    font-size: 150px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    position: absolute;
    width: 100%;
    pointer-events: none;
  }
  .subRow {
    display: flex;
  }

  .clickable {
    background-color: #09501027;
  }
</style>
