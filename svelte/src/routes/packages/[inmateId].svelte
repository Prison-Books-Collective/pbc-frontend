<script lang="ts" context="module">
	export function load({ params }) {
		const { inmateId } = params;
		return { props: { inmateId } };
	}
</script>

<script lang="ts">
	import { focusedInmate } from '$lib/stores/inmate';
	import { focusedPackage } from '$lib/stores/package';
	import { delay } from '$lib/util/time';
	import { printPackage } from '$lib/util/routing';
	import type { Package } from '$lib/services/pbc-service/models/package';

	import InmateName from '$lib/components/inmate/inmate-name.svelte';
	import PackageTable from '$lib/components/package/table.svelte';
	import CreatePackageModal from '$lib/components/package/create-package-modal.svelte';
	import { VALID_MODAL } from '$lib/components/package/create-package-modal.svelte';

	export let inmateId: string;

	let activeModal: VALID_MODAL;
	let activeModalParams = {};

	const inmateIsLoaded = focusedInmate.fetch(inmateId);

	const presentAlertModal = (pbcPackage: Package) => {
		focusedPackage.load(pbcPackage);
		activeModal = VALID_MODAL.VIEW_ALERT;
		activeModalParams = { packageId: pbcPackage.id };
	};
	const presentCreatePackageModal = () => {
		activeModal = VALID_MODAL.VIEW_PACKAGE;
	};
	const presentEditPackageModal = (pbcPackage: Package) => {
		focusedPackage.load(pbcPackage);
		activeModal = VALID_MODAL.EDIT_PACKAGE;
	};
</script>

<svelte:head>
	<title>BellBooks - Packages for {$focusedInmate.firstName} {$focusedInmate.lastName}</title>
</svelte:head>

<CreatePackageModal bind:activeModal bind:activeModalParams />

{#await inmateIsLoaded}
	<h1>Loading</h1>
{:then}
	<main class="svelte-page">
		<InmateName />

		<button
			id="add-package-button"
			class="button-success"
			on:click={() => {
				focusedPackage.reset();
				presentCreatePackageModal();
			}}
		>
			Add a <strong><u>new package</u></strong> (books or zines)
		</button>

		<PackageTable
			on:edit={({ detail: pbcPackage }) => presentEditPackageModal(pbcPackage)}
			on:print={({ detail: pbcPackage }) => printPackage(pbcPackage)}
			on:alert={({ detail: pbcPackage }) => presentAlertModal(pbcPackage)}
		/>
	</main>
{/await}

<style lang="scss">
	main {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: stretch;
		text-align: center;
	}

	h1 {
		width: 100%;
		text-align: center;
	}

	#add-package-button {
		align-self: center;
	}
</style>
