<script lang="ts" context="module">
	export function load({ params }) {
		const { inmateId } = params;
		return { props: { inmateId } };
	}
</script>

<script lang="ts">
	import { focusedInmate } from '$stores/inmate';
	import { focusedPackage, focusedPackages } from '$stores/package';
	import { printPackage } from '$util/routing';
	import { ValidCreatePackageModal } from '$models/create-package-modal';
	import type { Package } from '$models/pbc/package';

	import InmateName from '$components/inmate/inmate-name.svelte';
	import PackageTable from '$lib/components/package/package-table.svelte';
	import CreatePackageModal from '$components/package/create-package-modal.svelte';

	export let inmateId: string;

	let activeModal: ValidCreatePackageModal;
	let activeModalParams = {};

	const inmateIsLoaded = focusedInmate.fetch(inmateId);

	const presentAlertModal = (pbcPackage: Package) => {
		focusedPackage.load(pbcPackage);
		activeModal = ValidCreatePackageModal.VIEW_ALERT;
		activeModalParams = { packageId: pbcPackage.id };
	};
	const presentCreatePackageModal = () => {
		activeModal = ValidCreatePackageModal.VIEW_PACKAGE;
	};
	const presentEditPackageModal = (pbcPackage: Package) => {
		focusedPackage.load(pbcPackage);
		activeModal = ValidCreatePackageModal.EDIT_PACKAGE;
	};
	const refresh = async () => {
		return await focusedInmate.fetch($focusedInmate.id);
	};
</script>

<svelte:head>
	<title>BellBooks - Packages for {$focusedInmate.firstName} {$focusedInmate.lastName}</title>
</svelte:head>

<CreatePackageModal
	inmate={$focusedInmate}
	bind:activeModal
	bind:activeModalParams
	on:refresh={refresh}
/>

{#await inmateIsLoaded}
	<h1>Loading</h1>
{:then}
	<main class="page">
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
			packages={$focusedPackages}
			inmate={$focusedInmate}
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
