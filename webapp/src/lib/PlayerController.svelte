<script lang="ts">
  import {
    firstPlayer,
    secondPlayer,
    firstPlayerName,
    secondPlayerName,
    currentPlayer,
  } from "../stores/playerStore";
  import { game } from "../stores/gameStore";
  import { CellValue, type Move } from "../game/types";
  import { gameDataToBots } from "../util/gameDataToBots";
  import Cross from "./Cross.svelte";

  let waitingForResponse = false;

  const makeBotMove = async () => {
    waitingForResponse = true;
    const response = await fetch($currentPlayer, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: gameDataToBots($game),
    });
    waitingForResponse = false;
    await response.json().then((res: { move: Move }) => {
      game.update((gm) => {
        gm.makeMove(res.move);
        return gm;
      });
    });
  };
</script>

<div class="playerController">
  <h2>Players</h2>
  <div class="playerSelectors">
    <div
      class="firstPlayerSelector"
      class:active={$game.current === CellValue.FirstHalf}
    >
      <h3>
        <Cross value={CellValue.FirstHalf} />
        {$firstPlayer === ""
          ? Math.random() < 0.5
            ? "👨"
            : "👩"
          : "🤖"}{$firstPlayerName === "" ? "" : ": " + $firstPlayerName}
      </h3>
      <input type="text" bind:value={$firstPlayer} placeholder="URL" />
    </div>

    <div
      class="secondPlayerSelector"
      class:active={$game.current === CellValue.SecondHalf}
    >
      <h3>
        <Cross value={CellValue.SecondHalf} />
        {$secondPlayer === ""
          ? Math.random() < 0.5
            ? "👨"
            : "👩"
          : "🤖"}{$secondPlayerName === "" ? "" : ": " + $secondPlayerName}
      </h3>
      <input type="text" bind:value={$secondPlayer} placeholder="URL" />
    </div>
  </div>
  <button
    disabled={$currentPlayer === "" || waitingForResponse}
    on:click={() => makeBotMove()}>Next Move</button
  ><br />
</div>

<style>
  .playerController {
    text-align: center;
  }
  .playerSelectors {
    display: flex;
    justify-content: space-around;
  }
  .active {
    border: 1px solid black;
  }
  input {
    width: 500px;
    margin: 20px;
    padding: 10px;
    font-size: large;
  }
  button {
    font-size: large;
    margin: 10px;
    padding: 10px;
  }
</style>
