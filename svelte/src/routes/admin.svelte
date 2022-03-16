<script lang="ts">
	import { ERROR_MESSAGE_SERVER_COMMUNICATION } from '$lib/util/error';
	import ZineList from '$lib/components/zine/zine-list.svelte';
	import FacilityList from '$lib/components/facility/facility-list.svelte';
	import CreateZine from '$lib/components/zine/create-zine.svelte';
	import CreateFacility from '$lib/components/facility/create-facility.svelte';

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
</script>

<svelte:head>
	<title>BellBooks - Settings & Configuration</title>
</svelte:head>

<main class="svelte-page">
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
</style>
