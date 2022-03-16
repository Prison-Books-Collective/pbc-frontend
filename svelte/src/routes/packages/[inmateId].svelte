<script lang="ts" context="module">
	export function load({ params }) {
		const { inmateId } = params;
		return { props: { inmateId } };
	}
</script>

<script lang="ts">
	import PackageTable from '$lib/components/package/table.svelte';
	import Modal from '$lib/components/modal.svelte';
	import EditInmate from '$lib/components/inmate/edit.svelte';
	import PackageOverview from '$lib/components/package/overview.svelte';
	import EditPackage from '$lib/components/package/edit.svelte';
	import PrintPackage from '$lib/components/package/print.svelte';
	import AddZine from '$lib/components/package/zine/add.svelte';
	import AddBook from '$lib/components/package/book/add.svelte';
	import BookDetail from '$lib/components/package/book/detail.svelte';
	import PackageAlert from '$lib/components/package/alert.svelte';

	import { focusedInmate } from '$lib/stores/inmate';
	import { focusedPackage } from '$lib/stores/package';
	import { isInmateNoID } from '$lib/services/pbc-service/inmate.service';
	import type { Package } from '$lib/services/pbc-service/models/package';
	import { delay } from '$lib/util/time';

	import editIcon from '$lib/assets/icons/edit.png';

	export let inmateId: string;

	enum VALID_MODAL {
		EDIT_INMATE = 'edit_inmate',

		OVERVIEW_PACKAGE = 'overview_package',
		EDIT_PACKAGE = 'edit_package',
		PRINT_PACKAGE = 'print_package',

		ADD_ZINE = 'add_zine',
		ADD_BOOK = 'add_book',
		DETAIL_BOOK = 'detail_book',

		VIEW_ALERT = 'view_alert'
	}

	let isModalVisible = false;
	let activeModal: VALID_MODAL;
	let searchISBN = null;

	focusedInmate.fetch(inmateId);

	const presentModal = (modal: VALID_MODAL) => {
		activeModal = modal;
		isModalVisible = true;
	};
	const closeModal = () => {
		isModalVisible = false;
	};
	const refresh = (inmate) => {
		inmateId = inmate.id;
		focusedInmate.fetch(inmateId);
		closeModal();
	};
	const printPackage = async (pbcPackage: Package) => {
		const url = `/invoice/${pbcPackage.id}?print=true`;
		const printWindow = window.open(url, 'title', 'attributes');
		printWindow.focus();
		await delay(3500);
		printWindow.document.close();
		printWindow.close();
	};

	const presentPrintModal = () => {
		refresh($focusedInmate);
		presentModal(VALID_MODAL.PRINT_PACKAGE);
	};
	const presentAlertModal = (pbcPackage: Package) => {
		focusedPackage.load(pbcPackage);
		presentModal(VALID_MODAL.VIEW_ALERT);
	};
	const presentCreatePackageModal = () => {
		presentModal(VALID_MODAL.OVERVIEW_PACKAGE);
	};
	const presentEditPackageModal = (pbcPackage: Package) => {
		focusedPackage.load(pbcPackage);
		presentModal(VALID_MODAL.EDIT_PACKAGE);
	};
	const presentBookDetail = (isbn) => {
		searchISBN = isbn;
		presentModal(VALID_MODAL.DETAIL_BOOK);
	};
</script>

<svelte:head>
	<title>BellBooks - Packages for {$focusedInmate.firstName} {$focusedInmate.lastName}</title>
</svelte:head>

{#if $focusedInmate.id}
	<main>
		<Modal bind:visible={isModalVisible}>
			{#if activeModal == VALID_MODAL.EDIT_INMATE}
				<EditInmate
					id={inmateId}
					on:update={(e) => refresh(e.detail)}
					on:error={(e) => console.error(e.detail)}
				/>
			{:else if activeModal == VALID_MODAL.OVERVIEW_PACKAGE}
				<PackageOverview
					on:add-zines={() => presentModal(VALID_MODAL.ADD_ZINE)}
					on:add-books={() => presentModal(VALID_MODAL.ADD_BOOK)}
					on:update={() => presentPrintModal()}
					on:error={(e) => console.error(e)}
				/>
			{:else if activeModal == VALID_MODAL.EDIT_PACKAGE}
				<EditPackage
					on:update={() => presentPrintModal()}
					on:error={(e) => console.error(e.detail)}
					on:add-items={() => presentCreatePackageModal()}
					on:delete={() => {
						closeModal();
						refresh($focusedInmate);
					}}
					on:reject={() => presentAlertModal($focusedPackage)}
				/>
			{:else if activeModal == VALID_MODAL.ADD_ZINE}
				<AddZine
					on:add-zines={() => presentCreatePackageModal()}
					on:cancel={() => presentCreatePackageModal()}
				/>
			{:else if activeModal == VALID_MODAL.ADD_BOOK}
				<AddBook
					on:cancel={() => presentCreatePackageModal()}
					on:search={({ detail: isbn }) => presentBookDetail(isbn)}
					on:update={() => presentModal(VALID_MODAL.OVERVIEW_PACKAGE)}
				/>
			{:else if activeModal == VALID_MODAL.DETAIL_BOOK}
				<BookDetail
					isbn={searchISBN}
					on:cancel={() => presentCreatePackageModal()}
					on:search={() => presentModal(VALID_MODAL.ADD_BOOK)}
					on:add-book={() => presentCreatePackageModal()}
				/>
			{:else if activeModal == VALID_MODAL.PRINT_PACKAGE}
				<PrintPackage
					on:done={closeModal}
					on:print={() => {
						printPackage($focusedPackage);
						closeModal();
					}}
				/>
			{:else if activeModal == VALID_MODAL.VIEW_ALERT}
				<PackageAlert
					on:update={(_) => refresh($focusedInmate)}
					on:error={(e) => console.error(e.detail)}
				/>
			{/if}
		</Modal>

		<div id="inmate-name">
			<h1 aria-label="Inmate's first and last name, and inmate ID if available">
				{#if isInmateNoID($focusedInmate)}
					{$focusedInmate.firstName}
					{$focusedInmate.middleInitial
						? $focusedInmate.middleInitial + '. '
						: ''}{$focusedInmate.lastName}
					- <span>{$focusedInmate.location}</span>
				{:else}
					{$focusedInmate.firstName}
					{$focusedInmate.middleInitial
						? $focusedInmate.middleInitial + '. '
						: ''}{$focusedInmate.lastName}&ensp;
					<span>ID#{$focusedInmate.id}</span>
				{/if}

				<img
					src={editIcon}
					class="editIcon"
					width="20"
					height="20"
					alt="edit icon; click to edit inmate information"
					on:click={() => presentModal(VALID_MODAL.EDIT_INMATE)}
				/>
			</h1>
		</div>

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
{/if}

<style lang="scss">
	main {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: stretch;
		text-align: center;
	}

	#inmate-name {
		display: flex;
		flex-flow: row wrap;
		align-self: center;

		justify-content: space-between;
		align-items: center;

		h1 {
			font-size: 2rem;
			text-align: center;
			margin-bottom: 0;
		}

		span {
			color: darkslategray;
			font-weight: 700;
			font-size: 1.75rem;
		}
	}

	#add-package-button {
		align-self: center;
	}
</style>
