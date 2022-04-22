<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { formatDate, getLastMonth } from '$util/time'

  enum SearchType {
    DATE,
    DATE_RANGE
  }

  const dispatch = createEventDispatcher()

  export let searchType: SearchType = SearchType.DATE_RANGE
  export let date = formatDate(new Date())
  export let [startDate, endDate] = [formatDate(getLastMonth()), formatDate(new Date())]

  $: submitText =
    searchType === SearchType.DATE ? 'Search Packages by Date' : 'Search Packages by Date Range'
  $: searchText =
    searchType === SearchType.DATE
      ? 'Search packages by date range instead?'
      : 'Search packages by single date instead?'
  $: shouldDisableForm = () => {
    const today = new Date()
    if (searchType === SearchType.DATE) {
      return new Date(date) >= today
    } else {
      const [_startDate, _endDate] = [new Date(startDate), new Date(endDate)]
      const areDatesValid = _startDate <= today && _endDate <= today
      const areDatesOrdered = _startDate <= _endDate
      return !areDatesValid || !areDatesOrdered
    }
  }

  const toggleSearch = () => {
    searchType = searchType === SearchType.DATE ? SearchType.DATE_RANGE : SearchType.DATE
  }

  const submitForm = () => {
    if (searchType === SearchType.DATE) {
      dispatch('search', { date })
    } else {
      dispatch('search', { startDate, endDate })
    }
  }
</script>

<form id="date-search" on:submit|preventDefault={submitForm}>
  {#if searchType === SearchType.DATE}
    <label for="date">
      Date
      <input
        name="date"
        id="date"
        type="date"
        bind:value={date}
        max={new Date().toISOString().split('T')[0]}
      />
    </label>
  {:else}
    <label for="start-date">
      Start Date
      <input name="start-date" id="start-date" type="date" bind:value={startDate} max={endDate} />
    </label>

    <label for="end-date">
      End Date
      <input
        name="end-date"
        id="end-date"
        type="date"
        bind:value={endDate}
        min={startDate}
        max={new Date().toISOString().split('T')[0]}
      />
    </label>
  {/if}

  <button disabled={shouldDisableForm()} class="success">
    {submitText}
  </button>

  <p class="link" on:click={toggleSearch}>
    {searchText}
  </p>
</form>

<style lang="scss">
  #date-search {
    max-width: 400px;
    width: 100%;
  }

  label {
    display: flex;
    flex-flow: column nowrap;
    justify-content: stretch;
  }

  input[type='date'] {
    width: auto;
  }

  button {
    width: 100%;
    margin: 0px;
  }

  p {
    width: fit-content;
    margin-inline: auto;
  }
</style>
