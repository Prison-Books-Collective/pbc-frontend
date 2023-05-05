<script lang="ts">
  import type { Zine } from '$models/pbc/shipment'

  export let zine: Zine = null
  export let formatForInvoice = false
</script>

{#if zine}
  <strong>
    {#if formatForInvoice}
      ZINE
    {:else}
      {zine.code}
    {/if}
  </strong>
  &mdash;
  {zine.title}
{/if}
