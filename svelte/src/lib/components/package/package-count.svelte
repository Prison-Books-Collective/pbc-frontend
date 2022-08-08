<script lang="ts">
  import { focusedPackages } from '$stores/package'
  import { formatDate } from '$util/time'
  import PackageTable from './package-table.svelte'

  const today = formatDate(new Date())
  focusedPackages.fetchForDate(today)
</script>

{#if $focusedPackages}
  <p>
    You have completed <span id="package-count">{$focusedPackages.length}</span> packages on
    <date>{today}</date>
  </p>
  {#if $focusedPackages.length > 0}
    <PackageTable header="Today's Packages" packages={$focusedPackages} />
  {/if}
{/if}

<style>
  #package-count,
  date {
    font-weight: 700;
  }
</style>
