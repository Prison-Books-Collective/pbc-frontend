<script lang="ts">
	import { ERROR_MESSAGE_SERVER_COMMUNICATION } from '$util/error';
	import ZineList from '$components/zine/zine-list.svelte';
	import FacilityList from '$components/facility/facility-list.svelte';
	import CreateZine from '$components/zine/create-zine.svelte';
	import CreateFacility from '$components/facility/create-facility.svelte';
	import SearchByDate from '$components/package/search/search-by-date.svelte';
	import SearchByBook from '$components/package/search/search-by-book.svelte';
	import {
		searchByDate,
		searchByDateRange,
		searchByISBN,
		searchByAuthorAndTitle
	} from '$util/routing';

	const alertZineCreated = ({ detail: zine }) =>
		alert(`Successfully added new Zine "${zine.threeLetterCode} - ${zine.title}"`);
	const alertFacilityCreated = ({ detail: facility }) =>
		alert(
			`Successfully added new Facility "[${facility.state}] ${facility.facility_name} - ${facility.facility_type}"`
		);
	const alertCreationError = ({ detail: error }) => {
		alert(ERROR_MESSAGE_SERVER_COMMUNICATION);
		console.error(error);
	};

	enum PackageSearch {
		NONE,
		DATE,
		DATE_RANGE,
		BOOK,
		FACILITY
	}

	const gotoPackageSearch = (detail) => {
		if (detail.date) {
			searchByDate(detail.date);
		} else if (detail.startDate && detail.endDate) {
			searchByDateRange(detail.startDate, detail.endDate);
		} else if (detail.isbn) {
			searchByISBN(detail.isbn);
		} else if (detail.author && detail.title) {
			searchByAuthorAndTitle(detail.author, detail.title);
		}
	};
</script>

<svelte:head>
	<title>BellBooks - Settings & Configuration</title>
</svelte:head>

<main class="page">
	<section>
		<h2>Packages</h2>

		<h3>Search Packages by Date</h3>
		<SearchByDate on:search={({ detail }) => gotoPackageSearch(detail)} />

		<h3>Search Packages by Book</h3>
		<SearchByBook on:search={({ detail }) => gotoPackageSearch(detail)} />
	</section>

	<section>
		<h2>Zines</h2>
		<CreateZine on:update={alertZineCreated} on:error={alertCreationError} />
		<div class="spacer" />
		<ZineList />
	</section>

	<div class="spacer" />
	<div class="spacer" />

	<section>
		<h2>Facilities</h2>
		<CreateFacility on:update={alertFacilityCreated} on:error={alertCreationError} />
		<div class="spacer" />
		<FacilityList />
	</section>
</main>

<style lang="scss">
	section {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: center;
		max-width: 800px !important;
	}

	h2 {
		font-size: 2rem;
		text-align: center;
		color: inherit;
	}

	main {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
	}

	section {
		display: flex;
		flex-flow: column nowrap;
		max-width: calc(100vw - 2rem);
		width: 100%;
	}

	.spacer {
		width: 1px;
		height: 2rem;
	}

	h3 {
		font-weight: 600;
		font-size: 1.25rem;
		color: darkslategray;
		text-align: center;
		width: 100%;
	}
</style>
