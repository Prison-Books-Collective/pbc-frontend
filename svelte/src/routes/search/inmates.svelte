<script lang="ts" context="module">
	export function load({ url }) {
		const firstName =
			url.searchParams.get('firstName') || url.searchParams.get('first_name') || null;
		const lastName = url.searchParams.get('lastName') || url.searchParams.get('last_name') || null;
		return { props: { firstName, lastName } };
	}
</script>

<script lang="ts">
	import { InmateService } from '$lib/services/pbc-service/inmate.service';
	import { ROUTE_PACKAGES_FOR_INMATE, ROUTE_INMATE_CREATE_NAMED } from '$lib/util/routing';

	export let firstName = null;
	export let lastName = null;
	const getInmates = InmateService.getAllInmatesByName({ firstName, lastName });
</script>

<svelte:head>
	<title>Search Results for: {firstName} {lastName}</title>
</svelte:head>

<main class="svelte-page">
	<h1>Inmate Selection</h1>
	<p>
		The following inmates with this name were found, please select which inmate you're creating a
		package for:
	</p>

	{#await getInmates}
		<p>Loading...</p>
	{:then inmates}
		<nav>
			{#each inmates as inmate}
				<p>
					<a href={ROUTE_PACKAGES_FOR_INMATE(inmate.id)}>
						{#if inmate.location}
							<strong>{inmate.location}</strong> &mdash;
						{:else if inmate.id}
							<strong>ID #{inmate.id}</strong> &mdash;
						{/if}
						{inmate.firstName}
						{inmate.middleInitial ? inmate.middleInitial + '. ' : ''}{inmate.lastName}
					</a>
				</p>
			{/each}

			<p id="create-new-inmate">
				<a href={ROUTE_INMATE_CREATE_NAMED({ firstName, lastName })}>
					Click here to create a new inmate record
				</a>
			</p>
		</nav>
	{/await}
</main>

<style lang="scss">
	#create-new-inmate {
		margin-top: 3em;
		text-align: center;
	}
</style>
