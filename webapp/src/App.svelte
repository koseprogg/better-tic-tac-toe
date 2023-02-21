<script lang="ts">
  import { CellValue } from "./game/types";
  import PlayerController from "./lib/PlayerController.svelte";
  import TicTacToeBoard from "./lib/TicTacToeBoard.svelte";
  import { game } from "./stores/gameStore";
  import JSConfetti from "js-confetti";
  import Cross from "./lib/Cross.svelte";
  import { get } from "./util/errorLogAPI";
  import { firstPlayerGroup } from "./stores/playerStore";
  import LogWindow from "./lib/LogWindow.svelte";
  import { logWindowOpen } from "./stores/logStore";

  const jsConfetti = new JSConfetti();

  let currentWinner = "";
  game.subscribe((game) => {
    if (game.winner !== currentWinner && game.winner !== CellValue.Empty) {
      jsConfetti.addConfetti();
    }
    currentWinner = game.winner;
  });

  const restartGame = () => {
    currentWinner = "";
    game.update((gm) => {
      gm.restart();
      return gm;
    });
  };

  const printErr = async () => {
    console.log("Hello");
  };
</script>

<main>
  <header>
    <h1>TickoaTTwo</h1>
  </header>
  {#if $game.winner !== CellValue.Empty}
    <div class="winner">
      <h2>The winner is <Cross value={$game.winner} />!</h2>
    </div>
  {/if}
  <TicTacToeBoard />
  <PlayerController />
  <button on:click={restartGame}> Restart </button>
  <LogWindow />
</main>
<div>
  <button id="log-button" on:click={() => logWindowOpen.set(true)}
    >Read lambda logs</button
  >
</div>

<style>
  button {
    font-size: large;
    margin: 10px;
    padding: 10px;
  }
  main {
    text-align: center;
  }
  #log-button {
    position: fixed;
    left: 0;
    bottom: 0;
  }
</style>
