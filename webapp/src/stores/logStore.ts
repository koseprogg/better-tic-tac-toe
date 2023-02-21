import { get } from "../util/errorLogAPI";
import { firstPlayerGroup, secondPlayerGroup } from "../stores/playerStore";
import { derived, writable } from "svelte/store";

export const logWindowOpen = writable(false);

export const firstPlayerLog = derived(
  [logWindowOpen, firstPlayerGroup],
  ([$logWindowOpen, $firstPlayerGroup], set) => {
    (async () => {
      const info = await get($firstPlayerGroup);
      set([...info.data.listKoseproggLogs.items].reverse().map((item) => item.log_events));
    })();
  },
  []
);

export const secondPlayerLog = derived(
  [logWindowOpen, secondPlayerGroup],
  ([$logWindowOpen, $secondPlayerGroup], set) => {
    (async () => {
      const info = await get($secondPlayerGroup);
      set(info.data.listKoseproggLogs.items.map((item) => item.log_events));
    })();
  },
  []
);
