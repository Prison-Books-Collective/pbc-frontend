<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { focusedInmate } from '$stores/inmate';
	import { focusedPackage } from '$stores/package';
	import { printPackage } from '$util/routing';
	import { ValidCreatePackageModal } from '$models/create-package-modal';
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

	export let inmate = null;
	export let activeModal: ValidCreatePackageModal = ValidCreatePackageModal.NONE;
	export let activeModalParams = {};

	const refresh = () => dispatch('refresh')

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
			inmate={inmate}
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
		<BookDetail
			{...activeModalParams}
			on:cancel={() => presentModal(ValidCreatePackageModal.VIEW_PACKAGE)}
			on:search={() => presentModal(ValidCreatePackageModal.ADD_BOOK)}
			on:add-book={() => presentModal(ValidCreatePackageModal.VIEW_PACKAGE)}
		/>
	{:else if activeModal == ValidCreatePackageModal.VIEW_ALERT}
		<PackageAlert
			{...activeModalParams}
			on:update={() => {
				refresh();
				closeModal();
			}}
			on:error={(e) => console.error(e.detail)}
		/>
	{:else if activeModal == ValidCreatePackageModal.PRINT_PACKAGE}
		<PrintPackage
			on:done={closeModal}
			on:print={() => {
				printPackage($focusedPackage);
				closeModal();
			}}
		/>
	{/if}
</Modal>
