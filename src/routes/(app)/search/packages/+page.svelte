<script lang="ts">
  import { onDestroy } from 'svelte'
  import { focusedPackages } from '$stores/package'
  import { isEmpty } from '$util/strings'

  import filterIcon from '$assets/icons/filter.png'
  import PackageTable from '$components/package/package-table.svelte'
  import FilterPackages from '$components/package/search/filter/filter-packages.svelte'
  import BookTitleResolver from '$components/book-title-resolver.svelte'
  import { formatDate } from '$util/time'
  import { PackageSearchMode } from '$util/routing'
  import type { PageData } from './$types'
  import { loading } from '$stores/loading'
  export let data: PageData

  export let date: string = formatDate(new Date())
  export let startDate = data.startDate || formatDate(new Date())
  export let endDate = data.endDate || formatDate(new Date())
  export let isbn = ''
  export let [author, title] = ['', '']
  export let searchMode
  let showFilters = false
  let shouldFilter = false
  let filteredPackages = []

  const toggleShowFilters = () => (showFilters = !showFilters)

  let previousQuery
  const createQuery = ({ searchMode, date, startDate, endDate, isbn, author, title }) => {
    return [searchMode, date, startDate, endDate, isbn, author, title]
      .filter((input) => !isEmpty(input))
      .join('-')
  }

  const loadPackages = (searchMode: PackageSearchMode) => {
    const currentQuery = createQuery({
      searchMode,
      date,
      startDate,
      endDate,
      isbn,
      author,
      title,
    })
    if (previousQuery === currentQuery) return
    previousQuery = currentQuery
    console.log('search mode: ' + searchMode)
    switch (searchMode) {
      case PackageSearchMode.DATE:
        loading.start()
        focusedPackages.fetchForDate(date).then(() => loading.end())
        break
      case PackageSearchMode.DATE_RANGE:
        console.log('in date range switch case')
        loading.start()
        focusedPackages.fetchForDateRange(startDate, endDate).then(() => loading.end())
        break
      case PackageSearchMode.ISBN:
        if (!isEmpty(isbn)) {
          loading.start()
          focusedPackages.fetchForISBN(isbn).then(() => loading.end())
        }
        break
      case PackageSearchMode.AUTHOR_AND_TITLE:
        loading.start()
        if (!isEmpty(author) && !isEmpty(title)) {
          focusedPackages.fetchForAuthorAndTitle(author, title).then(() => loading.end())
        }
        break
    }
  }

  $: {
    searchMode = data.searchMode

    loadPackages(searchMode)
    ;[date, startDate, endDate, isbn, author, title]
  }

  onDestroy(() => {
    focusedPackages.set([])
  })
</script>

<svelte:head>
  <title>BellBooks - Search Packages</title>
</svelte:head>

<main class="page">
  {#if searchMode === PackageSearchMode.DATE || searchMode === PackageSearchMode.DATE_RANGE}
    <header id="date-header">
      {#if loading}
        <h2>Searching Date(s)</h2>
      {:else}
        <h2>Displaying results for &emsp;</h2>
      {/if}
      {#if searchMode === PackageSearchMode.DATE}
        <input type="date" bind:value={date} max={new Date().toISOString().split('T')[0]} />
      {:else if searchMode === PackageSearchMode.DATE_RANGE}
        <input type="date" bind:value={startDate} max={endDate} />
        <span class="through" />
        <input
          type="date"
          bind:value={endDate}
          min={startDate}
          max={new Date().toISOString().split('T')[0]}
        />
      {/if}

      <img
        src={filterIcon}
        class="icon filter"
        class:active={showFilters}
        class:passive={!showFilters && shouldFilter}
        width="20"
        height="20"
        alt="filter icon; click to filter the list of packages"
        on:click={toggleShowFilters}
      />
    </header>
  {/if}

  {#if searchMode === PackageSearchMode.ISBN || searchMode === PackageSearchMode.AUTHOR_AND_TITLE}
    <header id="book-header">
      <h2>
        Displaying Packages containing
        <img
          src={filterIcon}
          class="icon filter"
          class:active={showFilters}
          class:passive={!showFilters && shouldFilter}
          width="20"
          height="20"
          alt="filter icon; click to filter the list of packages"
          on:click={toggleShowFilters}
        />
      </h2>
      {#if !loading && $focusedPackages.length > 0}
        <BookTitleResolver pbcPackage={$focusedPackages[0]} {author} {title} {isbn} />
      {/if}
    </header>
  {/if}

  <FilterPackages
    visible={showFilters}
    packages={$focusedPackages}
    on:update={({ detail }) => (filteredPackages = detail)}
    on:should-filter={({ detail }) => (shouldFilter = detail)}
  />

  {#if !loading}
    {#if !shouldFilter}
      <p>
        <strong>{$focusedPackages.length}</strong> Packages
      </p>
    {:else if shouldFilter && filteredPackages.length > 0}
      <p>
        Showing <strong
          ><span>{shouldFilter ? filteredPackages.length : $focusedPackages.length}</span></strong
        >
        of
        <strong>{$focusedPackages.length}</strong> Packages
      </p>
    {/if}

    <PackageTable packages={shouldFilter ? filteredPackages : $focusedPackages} />
  {/if}
</main>

<style lang="scss">
  h2 {
    text-align: center !important;
  }

  input[type='date'] {
    flex-basis: 10rem;
  }

  #date-header {
    display: flex;
    flex-flow: row nowrap;
    align-items: baseline;
    justify-content: center;
    gap: 1rem;
  }

  #book-header {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
  }

  .page {
    justify-content: flex-start;
    align-items: stretch;
    text-align: center;
  }

  .through::before {
    content: '\2192';
  }

  .filter {
    margin-left: 1rem;

    &.active {
      filter: invert(57%) sepia(89%) saturate(225%) hue-rotate(159deg) brightness(102%)
        contrast(93%);
      opacity: 1;
    }
    &.passive {
      filter: invert(74%) sepia(48%) saturate(4112%) hue-rotate(91deg) brightness(94%) contrast(98%);
    }
  }
</style>
