<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { formatDate } from '$util/time'

  enum SearchType {
    DATE,
    DATE_RANGE
  }

  const dispatch = createEventDispatcher()

  export let searchType: SearchType = SearchType.DATE;
  export let date = formatDate(new Date())
  export let [startDate, endDate] = [formatDate(new Date()), formatDate(new Date())]

  $: submitText = searchType === SearchType.DATE
    ? 'Search Packages by Date'
    : 'Search Packages by Date Range';
  $: searchText = searchType === SearchType.DATE
    ? 'Search packages by date range instead?'
    : 'Search packages by single date instead?';
  $: shouldDisableForm = () => {
    const today = new Date()
    if(searchType === SearchType.DATE) {
      return new Date(date) >= today;
    } else {
      const [_startDate, _endDate] = [new Date(startDate), new Date(endDate)]
      const areDatesValid = _startDate <= today && _endDate <= today;
      const areDatesOrdered = _startDate <= _endDate;
      return !areDatesValid || !areDatesOrdered;
    }
  }

  const toggleSearch = () => {
    searchType = searchType === SearchType.DATE 
      ? SearchType.DATE_RANGE
      : SearchType.DATE;
  }

  const submitForm = () => {
    if(searchType === SearchType.DATE) {
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
      <input name="date" id="date" type="date" bind:value={date}>
    </label>
  {:else}
    <label for="start-date">
      Start Date
      <input name="start-date" id="start-date" type="date" bind:value={startDate}>
    </label>

    <label for="end-date">
      End Date
      <input name="end-date" id="end-date" type="date" bind:value={endDate}>
    </label>
  {/if}

  <button disabled={shouldDisableForm()} class="button-success">
    {submitText}
  </button>

  <p class="toggle-search" on:click={toggleSearch}>
		{searchText}
	</p>
</form>

<style>
  #date-search {
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: center;
	}

	label {
		width: 100%;
		margin-bottom: 1.5em;
		text-align: left;
		font-weight: 700;
	}

	label:last-of-type {
		margin-bottom: 0.5em;
	}

  input[type='date'] {
		padding: 0.5em;
		width: 95%;
		max-width: auto;
		font-size: 1rem;
		background: none;
		border: 1px solid rgba(0, 0, 0, 0.3);
		border-radius: 3px;
	}

	input[disabled] {
		cursor: not-allowed;
	}

	button {
		width: 100%;
	}

  .toggle-search {
		color: blue;
		font-size: 1rem;
		position: relative;
	}

	.toggle-search::before {
		content: '';
		position: absolute;
		width: 100%;
		height: 1px;
		bottom: -2px;
		background-color: blue;

		transition: transform 250ms ease-in-out;
		transform: scale(0);
		transform-origin: right;
	}

	.toggle-search:hover::before,
	.toggle-search:focus-visible::before {
		transform: scale(1);
		transform-origin: left;
	}
</style>