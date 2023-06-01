<script lang="ts">
  import { formatDate } from '$util/time'
  import { onDestroy } from 'svelte'
  import PackageTable from './package-table.svelte'
  import { shipments } from '$lib/data/shipment.data'

  const today = formatDate(new Date())
  shipments.fetchForDate(today)

  let isExpanded = true

  onDestroy(() => {
    shipments.reset()
  })
</script>

{#if $shipments}
  <p class:link={$shipments.length > 0} on:click={() => (isExpanded = !isExpanded)}>
    {#if $shipments.length > 0}
      <span class="small">
        {#if isExpanded}
          &#9660;
        {:else}
          &#9654;
        {/if}
      </span>
    {/if}
    <span>
      {#if !isExpanded && $shipments.length > 0}
        <span class="expand-table">&lt;Click to Expand&gt;</span>
      {/if}
      You have completed <span id="package-count">{$shipments.length}</span> packages on
      <date>{today}</date>
    </span>
  </p>

  {#if isExpanded && $shipments.length > 0}
    <PackageTable header="Today's Packages" packages={$shipments.reverse()} />
  {/if}
{/if}

<style>
  #package-count,
  date {
    font-weight: 700;
  }

  .link {
    display: flex;
    color: inherit;
    flex-flow: row nowrap;
    align-items: center;
  }

  .link::before {
    background-color: currentColor;
  }

  .small {
    font-size: 0.7rem;
    margin-right: 0.4rem;
  }

  .expand-table {
    color: blue;
  }
</style>
