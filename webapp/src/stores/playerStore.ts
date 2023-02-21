import { CellValue } from "../game/types";
import { derived, writable } from "svelte/store";
import { game } from "./gameStore";
import { debounce } from "../util/debounce";
import { fetchGroupInfo } from "../util/fetchGroupInfo";

export const firstPlayer = writable("");
export const secondPlayer = writable("");

const emptyInfo = { groupName: "", groupNumber: "" };

const fetchPlayerInfo = debounce(async (url, set) => {
  const info = await fetchGroupInfo(url);
  set(info || emptyInfo);
}, 1000);

const firstPlayerInfo = derived(
  firstPlayer,
  ($firstPlayer, set) => {
    fetchPlayerInfo($firstPlayer, set);
  },
  emptyInfo
);

export const firstPlayerName = derived(
  firstPlayerInfo,
  ($firstPlayerInfo, set) => {
    set($firstPlayerInfo.groupName);
  }
);

export const firstPlayerGroup = derived(
  firstPlayerInfo,
  ($firstPlayerInfo, set) => {
    set(/\d+/.exec($firstPlayerInfo.groupNumber)?.[0] ?? "");
  }
);

const secondPlayerInfo = derived(
  secondPlayer,
  ($secondPlayer, set) => {
    fetchPlayerInfo($secondPlayer, set);
  },
  emptyInfo
);

export const secondPlayerName = derived(
  secondPlayerInfo,
  ($secondPlayerInfo, set) => {
    set($secondPlayerInfo.groupName);
  }
);

export const secondPlayerGroup = derived(
  secondPlayerInfo,
  ($secondPlayerInfo, set) => {
    set(/\d+/.exec($secondPlayerInfo.groupNumber)?.[0] ?? "");
  }
);

export const currentPlayer = derived(
  [game, firstPlayer, secondPlayer],
  ([game, firstPlayer, secondPlayer]) =>
    game.current === CellValue.FirstHalf ? firstPlayer : secondPlayer
);
