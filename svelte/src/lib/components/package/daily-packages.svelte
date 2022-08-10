<script lang="ts">
  import { focusedPackages } from '$stores/package'
  import { formatDate } from '$util/time'
  import { onDestroy } from 'svelte'
  import PackageTable from './package-table.svelte'

  const today = formatDate(new Date())
  focusedPackages.fetchForDate(today)

  let isExpanded = true

  onDestroy(() => {
    focusedPackages.set([])
  })
</script>

{#if $focusedPackages}
  <p class:link={$focusedPackages.length > 0} on:click={() => (isExpanded = !isExpanded)}>
    {#if $focusedPackages.length > 0}
      <span class="small">
        {#if isExpanded}
          &#9660;
        {:else}
          &#9654;
        {/if}
      </span>
    {/if}
    <span>
      You have completed <span id="package-count">{$focusedPackages.length}</span> packages on
      <date>{today}</date>
    </span>
  </p>

  {#if isExpanded && $focusedPackages.length > 0}
    <PackageTable header="Today's Packages" packages={$focusedPackages} />
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
</style>
