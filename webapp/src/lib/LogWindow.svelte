<script lang="ts">
  import { clickOutside } from "../util/clickOutside";
  import {
    firstPlayerLog,
    logWindowOpen,
    secondPlayerLog,
  } from "../stores/logStore";
  import { firstPlayerName, secondPlayerName } from "../stores/playerStore";
  let showingFirstPlayer = true;

  const close = () => logWindowOpen.set(false);
</script>

<div class="modal" class:open={$logWindowOpen}>
  <div class="modalContent" use:clickOutside on:click_outside={close}>
    <h1>Lambda logs</h1>
    <p>
      Showing: {(showingFirstPlayer ? $firstPlayerName : $secondPlayerName) ||
        (showingFirstPlayer ? "Player 1" : "Player 2")}
      <button on:click={() => (showingFirstPlayer = !showingFirstPlayer)}
        >Switch</button
      >
    </p>
    <div class="log">
      {#each (showingFirstPlayer ? $firstPlayerLog : $secondPlayerLog)
        .slice()
        .reverse() as entry}
        {#each JSON.parse(entry).reverse() as message}
          <div class="message">
            <p>{new Date(message.timestamp).toLocaleString("no-NO")}</p>
            <p>{message.message}</p>
          </div>
        {/each}
      {/each}
    </div>
    <button on:click={close}>Close</button>
  </div>
</div>

<style>
  .modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0, 0, 0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
  }
  .open {
    display: block;
  }
  .modalContent {
    background-color: #fefefe;
    margin: 30px auto; /* 15% from the top and centered */
    padding: 20px;
    border: 1px solid #888;
    width: 80%; /* Could be more or less, depending on screen size */
  }
  .log {
    text-align: left;
  }
  .message {
    background-color: #00000010;
    margin: 10px;
    padding: 5px;
  }
  button {
    font-size: large;
    margin: 10px;
    padding: 10px;
  }
</style>
