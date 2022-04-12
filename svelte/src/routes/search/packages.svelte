<script lang="ts" context="module">
  import { formatDate } from "$util/time";
  import { SearchMode } from '$models/search-packages-mode';

	export function load({ url }) {
		let searchMode: SearchMode = url.searchParams.get('search') 
      || url.searchParams.get('mode') 
      || url.searchParams.get('search-mode') 
      || url.searchParams.get('search_mode') 
      || url.searchParams.get('searchMode') 
      || null;
    
    const props = { searchMode }
    switch(searchMode) {
      case SearchMode.DATE:
        props['date'] = url.searchParams.get('date') || formatDate(new Date());
        break;
      case SearchMode.DATE_RANGE:
        props['startDate'] = url.searchParams.get('start-date') || url.searchParams.get('start_date') || url.searchParams.get('startDate') || formatDate(new Date());
        props['endDate'] = url.searchParams.get('end-date') || url.searchParams.get('end_date') || url.searchParams.get('endDate') || formatDate(new Date());
        break;
      case SearchMode.BOOK:
        
        break;
    }

		return { props };
	}
</script>

<script lang="ts">
  import { focusedPackage, focusedPackages } from '$stores/package'
  import { printPackage } from '$util/routing';
  import { ValidCreatePackageModal } from "$models/create-package-modal";
  import type { Package } from "$models/pbc/package";
  
  import filterIcon from '$assets/icons/filter.png'
  import PackageTable from "$lib/components/package/table.svelte";
  import CreatePackageModal from "$components/package/create-package-modal.svelte";
  import FacilitySelect from '$components/facility/select.svelte';

  export let searchMode = SearchMode.DATE;

  export let date: string = formatDate(new Date())
  export let startDate: string = formatDate(new Date())
  export let endDate: string = formatDate(new Date())

  let activeModal: ValidCreatePackageModal;
  let activeModalParams = {};

  let showFilters = false;

  let filterByFacilities = false;
  let availableFacilities = [];
  let facilitiesLoaded = new Promise(() => {})
  let filterFacilities = []
  let filteredPackages = []

  let filterByZines = false;
  let filterZinesMode: 'all'|'any' = 'any'

  $: switch(searchMode) {
    case SearchMode.DATE:
      focusedPackages.fetchForDate(date)
      break;
    case SearchMode.DATE_RANGE:
      focusedPackages.fetchForDateRange(startDate, endDate);
      break;
  }

  focusedPackages.subscribe(packages => {
    availableFacilities = [];
    const nullFacility = {
      id: undefined,
      facility_name: ' No Facility Provided ',
      state: '',
      facility_type: 'JAIL',
    }
    packages.forEach(p => {
      const facility = p.facility
      if(!facility && !availableFacilities.includes(nullFacility)) {
        availableFacilities.push(nullFacility);
      }
      if(facility && !availableFacilities.find(f => f.id === facility.id)) {
        availableFacilities.push(p.facility);
      }
    })

    availableFacilities.sort((a, b) => a.facility_name < b.facility_name ? -1 : 1);
    facilitiesLoaded = Promise.resolve()
  })

  const presentEditPackageModal = (pbcPackage: Package) => {
		focusedPackage.load(pbcPackage);
		activeModal = ValidCreatePackageModal.EDIT_PACKAGE;
	};

  const presentAlertModal = (pbcPackage: Package) => {
		focusedPackage.load(pbcPackage);
		activeModal = ValidCreatePackageModal.VIEW_ALERT;
		activeModalParams = { packageId: pbcPackage.id };
	};

  const toggleShowFilters = () => showFilters = !showFilters

  $: if(filterFacilities && filterFacilities.length > 0) {
    filteredPackages = $focusedPackages.filter(p => filterFacilities.find(f => f.id === p.facility?.id))
  }
</script>

<CreatePackageModal bind:activeModal bind:activeModalParams />

<main class="svelte-page">

  {#if searchMode === SearchMode.DATE || searchMode === SearchMode.DATE_RANGE}
    <header id="date-header">
      <h2>
        Displaying results for &emsp;
      </h2>
      {#if searchMode === SearchMode.DATE}
        <input type="date" bind:value={date}/>
      {:else if searchMode === SearchMode.DATE_RANGE}
        <input type="date" bind:value={startDate}/>
        <input type="date" bind:value={endDate}/>
      {/if}

      <img
        src={filterIcon}
        class="icon filter-icon active"
        class:active={showFilters}
        width="20"
        height="20"
        alt="filter icon; click to filter the list of packages"
        on:click={toggleShowFilters}
      />
    </header>
  {/if}


  <section id="filters" class:active={showFilters}>
    <label for="facility-select">
      <input type="checkbox" id="facility-select" bind:checked={filterByFacilities}/>
      Filter by Facility
      {#await facilitiesLoaded then}
        <FacilitySelect multiple disabled={!filterByFacilities} facilityList={availableFacilities} bind:multipleFacilities={filterFacilities}/>
      {/await}
    </label>

    <label for="zine-select">
      <input type="checkbox" id="zine-select" bind:checked={filterByZines}/>
      Filter by Zines
    </label>
    <div id="zine-options">
      <label for="any-zines" class="non-bold" class:disabled={!filterByZines}>
        <input type="radio" id="any-zines" value="any" disabled={!filterByZines} bind:group={filterZinesMode}/>
        May contain <strong class="any">Any</strong> of the Zines
      </label>
      <label for="all-zines" class="non-bold" class:disabled={!filterByZines}>
        <input type="radio" id="all-zines" value="all" disabled={!filterByZines} bind:group={filterZinesMode}/>
        Must contain <strong class="all">All</strong> of the Zines
      </label>
    </div>
  </section>

  <PackageTable 
    packages={filterByFacilities && filteredPackages && filteredPackages.length > 0 ? filteredPackages : $focusedPackages}
    on:edit={({ detail: pbcPackage }) => presentEditPackageModal(pbcPackage)}
    on:print={({ detail: pbcPackage }) => printPackage(pbcPackage)}
    on:alert={({ detail: pbcPackage }) => presentAlertModal(pbcPackage)}/>
</main>

<style lang="scss">
  main {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: stretch;
		text-align: center;
	}

  h2 {
    text-align: center !important;
  }

  .non-bold {
		font-weight: normal;
	}

  #date-header {
    display: flex; 
    flex-flow: row nowrap; 
    align-items: baseline; 
    justify-content: center;
  }

  #filters {
    border-radius: 3px;
    max-width: 100vw;
    // height: 10rem;
    padding: 1rem;
    padding-bottom: 0px;
    border: solid 1px black;
    transition-duration: 0.3s;

    transform-origin: top;
    transform: scale(1, 0);
    opacity: 0;
    margin-bottom: -12rem;

    display: flex;
    flex-flow: column nowrap;
  }

  #filters.active {
    margin-bottom: 0px;
    transform: scale(1, 1);
    opacity: 1;
  }

  input[type=date] {
    flex-basis: 10rem;
  }

  input[type=date]:last-of-type {
    margin-left: 1rem;
  }

  .filter-icon {
		transition-duration: 0.3s;
		opacity: 0.5;
		cursor: pointer;
    margin-left: 1rem;

		&:hover {
			opacity: 0.9;
		}
	}

  .filter-icon.active {
    filter: invert(57%) sepia(89%) saturate(225%) hue-rotate(159deg) brightness(102%) contrast(93%);
    opacity: 1;
  }

  .all {
    text-decoration: underline;
  }

  .any {
    border-bottom: dotted 3px black;
  }

  label.disabled {
    opacity: 0.4;
  }

  [for=any-zines], [for=all-zines] {
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 3px;
    padding: 0.25rem;
  }

  #zine-options {
    display: flex;
    flex-flow: row nowrap;
    gap: 1rem;
  }
</style>