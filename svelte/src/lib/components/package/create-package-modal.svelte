<script lang="ts" context="module">
	export enum VALID_MODAL {
		NONE,

		VIEW_PACKAGE = 'view_package',
		EDIT_PACKAGE = 'edit_package',

		ADD_BOOK = 'add_book_to_package',
		ADD_ZINE = 'add_zine_to_package',
		DETAIL_BOOK = 'view_create_edit_book',

		VIEW_ALERT = 'view_alert',
		PRINT_PACKAGE = 'print_package'
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { focusedInmate } from '$stores/inmate';
	import { focusedPackage } from '$stores/package';
	import { printPackage } from '$util/routing';
	import type { Package } from '$models/pbc/package';

	import Modal from '$components/modal.svelte';
	import PackageOverview from '$components/package/overview.svelte';
	import EditPackage from '$components/package/edit.svelte';
	import PrintPackage from '$components/package/print.svelte';
	import AddZine from '$components/package/zine/add.svelte';
	import AddBook from '$components/package/book/add.svelte';
	import BookDetail from '$components/package/book/detail.svelte';
	import PackageAlert from '$components/package/alert.svelte';

	const dispatch = createEventDispatcher();

	export let activeModal: VALID_MODAL = VALID_MODAL.NONE;
	export let activeModalParams = {};

	const refresh = async () => {
		return await focusedInmate.fetch($focusedInmate.id);
	};

	const closeModal = () => {
		activeModal = VALID_MODAL.NONE;
		dispatch('close');
	};
	const presentModal = (modal: VALID_MODAL, params?: any) => {
		activeModal = modal;
		activeModalParams = { ...params };
		dispatch('switch', { modal, params });
	};
	const presentAlertModal = (pbcPackage: Package) => {
		focusedPackage.load(pbcPackage);
		presentModal(VALID_MODAL.VIEW_ALERT, { packageId: pbcPackage.id });
	};
	const presentPrintModal = () => {
		refresh();
		presentModal(VALID_MODAL.PRINT_PACKAGE);
	};

	$: shouldConfirmCancel =
		activeModal !== VALID_MODAL.EDIT_PACKAGE &&
		activeModal !== VALID_MODAL.VIEW_ALERT &&
		activeModal !== VALID_MODAL.PRINT_PACKAGE &&
		($focusedPackage.books.length > 0 ||
			$focusedPackage.noISBNBooks.length > 0 ||
			$focusedPackage.zines.length > 0);
</script>

<Modal
	visible={activeModal !== VALID_MODAL.NONE}
	on:close={closeModal}
	on:cancel={closeModal}
	confirmCancel={shouldConfirmCancel}
>
	{#if activeModal == VALID_MODAL.VIEW_PACKAGE}
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
			on:add-items={() => presentModal(VALID_MODAL.VIEW_PACKAGE)}
			on:delete={() => {
				closeModal();
				refresh();
			}}
			on:reject={() => presentAlertModal($focusedPackage)}
		/>
	{:else if activeModal == VALID_MODAL.ADD_ZINE}
		<AddZine
			on:add-zines={() => presentModal(VALID_MODAL.VIEW_PACKAGE)}
			on:cancel={() => presentModal(VALID_MODAL.VIEW_PACKAGE)}
		/>
	{:else if activeModal == VALID_MODAL.ADD_BOOK}
		<AddBook
			on:cancel={() => presentModal(VALID_MODAL.VIEW_PACKAGE)}
			on:search={({ detail: isbn }) => presentModal(VALID_MODAL.DETAIL_BOOK, { isbn })}
			on:update={() => presentModal(VALID_MODAL.VIEW_PACKAGE)}
		/>
	{:else if activeModal == VALID_MODAL.DETAIL_BOOK}
		<BookDetail
			{...activeModalParams}
			on:cancel={() => presentModal(VALID_MODAL.VIEW_PACKAGE)}
			on:search={() => presentModal(VALID_MODAL.ADD_BOOK)}
			on:add-book={() => presentModal(VALID_MODAL.VIEW_PACKAGE)}
		/>
	{:else if activeModal == VALID_MODAL.VIEW_ALERT}
		<PackageAlert
			{...activeModalParams}
			on:update={() => {
				refresh();
				closeModal();
			}}
			on:error={(e) => console.error(e.detail)}
		/>
	{:else if activeModal == VALID_MODAL.PRINT_PACKAGE}
		<PrintPackage
			on:done={closeModal}
			on:print={() => {
				printPackage($focusedPackage);
				closeModal();
			}}
		/>
	{/if}
</Modal>
