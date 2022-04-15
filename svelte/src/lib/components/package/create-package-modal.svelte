<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { focusedPackage } from '$stores/package';
	import { printPackage } from '$util/routing';
	import { ValidCreatePackageModal } from '$models/create-package-modal';
	import type { Package } from '$models/pbc/package';

	import Modal from '$components/modal.svelte';
	import PackageOverview from '$lib/components/package/package-overview.svelte';
	import EditPackage from '$lib/components/package/edit-package.svelte';
	import ConfirmPrint from '$lib/components/package/confirm-print.svelte';
	import AddZine from '$lib/components/package/zine/add-zine.svelte';
	import AddBook from '$lib/components/package/book/add-book.svelte';
	import BookDetails from '$lib/components/package/book/book-details.svelte';
	import RejectionLog from '$lib/components/package/rejection-log.svelte';

	const dispatch = createEventDispatcher();

	export let inmate = null;
	export let activeModal: ValidCreatePackageModal = ValidCreatePackageModal.NONE;
	export let activeModalParams = {};

	const refresh = () => dispatch('refresh');

	const closeModal = () => {
		activeModal = ValidCreatePackageModal.NONE;
		dispatch('close');
	};
	const presentModal = (modal: ValidCreatePackageModal, params?: any) => {
		activeModal = modal;
		activeModalParams = { ...params };
		dispatch('switch', { modal, params });
	};
	const presentAlertModal = (pbcPackage: Package) => {
		focusedPackage.load(pbcPackage);
		presentModal(ValidCreatePackageModal.VIEW_ALERT, { packageId: pbcPackage.id });
	};
	const presentPrintModal = () => {
		refresh();
		presentModal(ValidCreatePackageModal.PRINT_PACKAGE);
	};

	$: shouldConfirmCancel =
		activeModal !== ValidCreatePackageModal.EDIT_PACKAGE &&
		activeModal !== ValidCreatePackageModal.VIEW_ALERT &&
		activeModal !== ValidCreatePackageModal.PRINT_PACKAGE &&
		($focusedPackage.books.length > 0 ||
			$focusedPackage.noISBNBooks.length > 0 ||
			$focusedPackage.zines.length > 0);
</script>

<Modal
	visible={activeModal !== ValidCreatePackageModal.NONE}
	on:close={closeModal}
	on:cancel={closeModal}
	confirmCancel={shouldConfirmCancel}
	confirmCancelText="Are you sure you want to close this window? You will lose all unsaved changes in this package."
>
	{#if activeModal == ValidCreatePackageModal.VIEW_PACKAGE}
		<PackageOverview
			{inmate}
			on:add-zines={() => presentModal(ValidCreatePackageModal.ADD_ZINE)}
			on:add-books={() => presentModal(ValidCreatePackageModal.ADD_BOOK)}
			on:update={() => presentPrintModal()}
			on:error={(e) => console.error(e)}
		/>
	{:else if activeModal == ValidCreatePackageModal.EDIT_PACKAGE}
		<EditPackage
			on:update={() => presentPrintModal()}
			on:error={(e) => console.error(e.detail)}
			on:add-items={() => presentModal(ValidCreatePackageModal.VIEW_PACKAGE)}
			on:delete={() => {
				closeModal();
				refresh();
			}}
			on:reject={() => presentAlertModal($focusedPackage)}
		/>
	{:else if activeModal == ValidCreatePackageModal.ADD_ZINE}
		<AddZine
			on:add-zines={() => presentModal(ValidCreatePackageModal.VIEW_PACKAGE)}
			on:cancel={() => presentModal(ValidCreatePackageModal.VIEW_PACKAGE)}
		/>
	{:else if activeModal == ValidCreatePackageModal.ADD_BOOK}
		<AddBook
			on:cancel={() => presentModal(ValidCreatePackageModal.VIEW_PACKAGE)}
			on:search={({ detail: isbn }) => presentModal(ValidCreatePackageModal.DETAIL_BOOK, { isbn })}
			on:update={() => presentModal(ValidCreatePackageModal.VIEW_PACKAGE)}
		/>
	{:else if activeModal == ValidCreatePackageModal.DETAIL_BOOK}
		<BookDetails
			{...activeModalParams}
			on:cancel={() => presentModal(ValidCreatePackageModal.VIEW_PACKAGE)}
			on:search={() => presentModal(ValidCreatePackageModal.ADD_BOOK)}
			on:add-book={() => presentModal(ValidCreatePackageModal.VIEW_PACKAGE)}
		/>
	{:else if activeModal == ValidCreatePackageModal.VIEW_ALERT}
		<RejectionLog
			{...activeModalParams}
			on:update={() => {
				refresh();
				closeModal();
			}}
			on:error={(e) => console.error(e.detail)}
		/>
	{:else if activeModal == ValidCreatePackageModal.PRINT_PACKAGE}
		<ConfirmPrint
			on:done={closeModal}
			on:print={() => {
				printPackage($focusedPackage);
				closeModal();
			}}
		/>
	{/if}
</Modal>
