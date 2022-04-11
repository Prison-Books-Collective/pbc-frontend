<script lang="ts" context="module">
import { formatDate } from "$lib/util/time";
  export enum SearchMode {
    DATE = 'by-date',
    DATE_RANGE = 'by-date-range',
    BOOK = 'by-book',
  }

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
  import PackageTable from "$lib/components/package/table.svelte";
  import { focusedPackage, focusedPackages } from '$stores/package'
  import { printPackage } from '$util/routing';
  import CreatePackageModal, { VALID_MODAL } from "$components/package/create-package-modal.svelte";
  import type { Package } from "$models/pbc/package";
import { focusedInmate } from "$lib/stores/inmate";

  export let searchMode = SearchMode.DATE;

  export let date: string = formatDate(new Date())
  export let startDate: string = formatDate(new Date())
  export let endDate: string = formatDate(new Date())

  let activeModal: VALID_MODAL;
  let activeModalParams = {};

  $: switch(searchMode) {
    case SearchMode.DATE:
      focusedPackages.fetchForDate(date);
      break;
    case SearchMode.DATE_RANGE:
      focusedPackages.fetchForDateRange(startDate, endDate);
      break;
  }

  const presentEditPackageModal = (pbcPackage: Package) => {
		focusedPackage.load(pbcPackage);
		activeModal = VALID_MODAL.EDIT_PACKAGE;
	};

  const presentAlertModal = (pbcPackage: Package) => {
		focusedPackage.load(pbcPackage);
		activeModal = VALID_MODAL.VIEW_ALERT;
		activeModalParams = { packageId: pbcPackage.id };
	};
</script>

<CreatePackageModal bind:activeModal bind:activeModalParams />

<main class="svelte-page">
  <PackageTable 
    isPackagesForInmate={false}
    on:edit={({ detail: pbcPackage }) => presentEditPackageModal(pbcPackage)}
    on:print={({ detail: pbcPackage }) => printPackage(pbcPackage)}
    on:alert={({ detail: pbcPackage }) => presentAlertModal(pbcPackage)}/>
</main>

<style>
  main {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: stretch;
		text-align: center;
	}
</style>