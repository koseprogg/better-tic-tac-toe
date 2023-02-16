import { CellValue } from "../game/types";
import { derived, writable } from "svelte/store";
import { game } from "./gameStore";
import { debounce } from "../util/debounce";
import { fetchGroupName } from "../util/fetchGroupName";

export const firstPlayer = writable("");
export const secondPlayer = writable("");

const fetchFirstPlayerName = debounce(async (url, set) => {
  const name = await fetchGroupName(url);
  set(name || "");
}, 1000);

export const firstPlayerName = derived(
  firstPlayer,
  ($firstPlayer, set) => {
    fetchFirstPlayerName($firstPlayer, set);
  },
  ""
);

const fetchSecondPlayerName = debounce(async (url, set) => {
  const name = await fetchGroupName(url);
  set(name || "");
}, 1000);

export const secondPlayerName = derived(
  secondPlayer,
  ($secondPlayer, set) => {
    fetchSecondPlayerName($secondPlayer, set);
  },
  ""
);

export const currentPlayer = derived(
  [game, firstPlayer, secondPlayer],
  ([game, firstPlayer, secondPlayer]) =>
    game.current === CellValue.FirstHalf ? firstPlayer : secondPlayer
);
