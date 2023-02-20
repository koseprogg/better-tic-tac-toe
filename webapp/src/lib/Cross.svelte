<script lang="ts">
  import { CellValue } from "../game/types";

  export let value;
</script>

<svg width="30" height="30">
  {#if value === CellValue.FirstHalf || value == CellValue.Full}
    <rect width="6" height="30" x="12" style="fill:rgb(0,0,255)" />
  {/if}
  {#if value === CellValue.SecondHalf || value == CellValue.Full}
    <rect width="30" height="6" y="12" style="fill:rgb(255,0,0)" />
  {/if}
</svg>
