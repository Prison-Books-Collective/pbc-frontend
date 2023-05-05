<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { Package } from '$models/pbc/package'

  import FilterByFacility from './filter-by-facility.svelte'
  import FilterByZine from './filter-by-zine.svelte'
  import FilterByKeyword from './filter-by-keyword.svelte'
  import FilterByRejection from './filter-by-rejection.svelte'

  const dispatch = createEventDispatcher()

  export let visible = false
  export let packages: Package[]

  let shouldFilterByFacility = false
  let shouldFilterByZine = false
  let shouldFilterByKeyword = false
  let shouldFilterByRejection = false

  const fnDefault = (packages) => packages
  let fnFilterByFacility = fnDefault
  let fnFilterByZine = fnDefault
  let fnFilterByKeyword = fnDefault
  let fnFilterByRejection = fnDefault

  const update = (packages) => {
    let filteredPackages = packages

    if (shouldFilterByFacility) filteredPackages = fnFilterByFacility(filteredPackages)
    if (shouldFilterByZine) filteredPackages = fnFilterByZine(filteredPackages)
    if (shouldFilterByKeyword) filteredPackages = fnFilterByKeyword(filteredPackages)
    if (shouldFilterByRejection) filteredPackages = fnFilterByRejection(filteredPackages)

    if (
      shouldFilterByFacility ||
      shouldFilterByZine ||
      shouldFilterByKeyword ||
      shouldFilterByRejection
    ) {
      dispatch('should-filter', true)
      dispatch('update', filteredPackages)
    } else {
      dispatch('should-filter', false)
    }
  }

  $: {
    ;[shouldFilterByFacility, shouldFilterByZine, shouldFilterByKeyword, shouldFilterByRejection]
    ;[fnFilterByFacility, fnFilterByZine, fnFilterByKeyword, fnFilterByRejection]

    update(packages)
  }
</script>

<section id="filters" class:hidden={!visible}>
  <label for="facility-switch" class="checkbox">
    <input
      id="facility-switch"
      name="facility-switch"
      type="checkbox"
      bind:checked={shouldFilterByFacility}
    />
    Filter by Facility
  </label>
  {#if shouldFilterByFacility}
    <FilterByFacility {packages} bind:fn={fnFilterByFacility} />
  {/if}

  <label for="zine-switch" class="checkbox">
    <input id="zine-switch" name="zine-switch" type="checkbox" bind:checked={shouldFilterByZine} />
    Filter by Zine(s)
  </label>
  {#if shouldFilterByZine}
    <FilterByZine {packages} bind:fn={fnFilterByZine} />
  {/if}

  <label for="keyword-switch" class="checkbox">
    <input
      id="keyword-switch"
      name="keyword-switch"
      type="checkbox"
      bind:checked={shouldFilterByKeyword}
    />
    Filter by Keyword(s)
  </label>
  {#if shouldFilterByKeyword}
    <FilterByKeyword bind:fn={fnFilterByKeyword} />
  {/if}

  <label for="rejection-switch" class="checkbox">
    <input
      id="rejection-switch"
      name="rejection-switch"
      type="checkbox"
      bind:checked={shouldFilterByRejection}
    />
    Filter by Rejection Status
  </label>
  {#if shouldFilterByRejection}
    <FilterByRejection bind:fn={fnFilterByRejection} />
  {/if}
</section>

<style lang="scss">
  #filters {
    display: flex;
    flex-flow: column nowrap;

    margin-bottom: 1rem;
    padding: 1rem;
    padding-bottom: 0px;
    border: solid 1px black;
    border-radius: 3px;

    transition-duration: 0.3s;
  }
</style>
