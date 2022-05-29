<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { Package } from '$models/pbc/package'
  import { focusedPackage } from '$stores/package'
  import { printPackage, CreatePackageModalState } from '$util/routing'

  import Modal from '$components/modal.svelte'
  import PackageOverview from '$components/package/package-overview.svelte'
  import EditPackage from '$components/package/edit-package.svelte'
  import ConfirmPrint from '$components/package/confirm-print.svelte'
  import AddZine from '$components/package/zine/add-zine.svelte'
  import AddBook from '$components/package/book/add-book.svelte'
  import BookDetails from '$components/package/book/book-details.svelte'
  import RejectionLog from '$components/package/rejection-log.svelte'

  const dispatch = createEventDispatcher()

  export let inmate = null
  export let activeModal: CreatePackageModalState = CreatePackageModalState.NONE
  export let activeModalParams = {}

  const closeModal = () => {
    activeModal = CreatePackageModalState.NONE
    dispatch('close')
  }
  const presentModal = (modal: CreatePackageModalState, params?: any) => {
    activeModal = modal
    activeModalParams = { ...params }
    dispatch('switch', { modal, params })
  }
  const presentAlertModal = (pbcPackage: Package) => {
    focusedPackage.load(pbcPackage)
    presentModal(CreatePackageModalState.VIEW_ALERT, { packageId: pbcPackage.id })
  }

  $: shouldConfirmCancel =
    activeModal !== CreatePackageModalState.EDIT_PACKAGE &&
    activeModal !== CreatePackageModalState.VIEW_ALERT &&
    activeModal !== CreatePackageModalState.PRINT_PACKAGE &&
    ($focusedPackage.books.length > 0 ||
      $focusedPackage.noISBNBooks.length > 0 ||
      $focusedPackage.zines.length > 0)
</script>

<Modal
  visible={activeModal !== CreatePackageModalState.NONE}
  on:close={closeModal}
  on:cancel={closeModal}
  confirmCancel={shouldConfirmCancel}
  confirmCancelText="Are you sure you want to close this window? You will lose all unsaved changes in this package."
>
  {#if activeModal == CreatePackageModalState.VIEW_PACKAGE}
    <PackageOverview
      {inmate}
      on:add-zines={() => presentModal(CreatePackageModalState.ADD_ZINE)}
      on:add-books={() => presentModal(CreatePackageModalState.ADD_BOOK)}
      on:update={() => presentModal(CreatePackageModalState.PRINT_PACKAGE)}
      on:error={(e) => console.error(e)}
    />
  {:else if activeModal == CreatePackageModalState.EDIT_PACKAGE}
    <EditPackage
      on:update={() => presentModal(CreatePackageModalState.PRINT_PACKAGE)}
      on:error={(e) => console.error(e.detail)}
      on:add-items={() => presentModal(CreatePackageModalState.VIEW_PACKAGE)}
      on:delete={() => closeModal()}
      on:reject={() => presentAlertModal($focusedPackage)}
    />
  {:else if activeModal == CreatePackageModalState.ADD_ZINE}
    <AddZine
      on:add-zines={() => presentModal(CreatePackageModalState.VIEW_PACKAGE)}
      on:cancel={() => presentModal(CreatePackageModalState.VIEW_PACKAGE)}
    />
  {:else if activeModal == CreatePackageModalState.ADD_BOOK}
    <AddBook
      on:cancel={() => presentModal(CreatePackageModalState.VIEW_PACKAGE)}
      on:search={({ detail: isbn }) => presentModal(CreatePackageModalState.DETAIL_BOOK, { isbn })}
      on:update={() => presentModal(CreatePackageModalState.VIEW_PACKAGE)}
    />
  {:else if activeModal == CreatePackageModalState.DETAIL_BOOK}
    <BookDetails
      {...activeModalParams}
      on:cancel={() => presentModal(CreatePackageModalState.VIEW_PACKAGE)}
      on:search={() => presentModal(CreatePackageModalState.ADD_BOOK)}
      on:add-book={() => presentModal(CreatePackageModalState.VIEW_PACKAGE)}
    />
  {:else if activeModal == CreatePackageModalState.VIEW_ALERT}
    <RejectionLog
      {...activeModalParams}
      on:update={() => {
        closeModal()
      }}
      on:error={(e) => console.error(e.detail)}
    />
  {:else if activeModal == CreatePackageModalState.PRINT_PACKAGE}
    <ConfirmPrint
      on:done={closeModal}
      on:print={() => {
        printPackage($focusedPackage)
        closeModal()
      }}
    />
  {/if}
</Modal>
