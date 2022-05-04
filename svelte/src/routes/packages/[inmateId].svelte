<script lang="ts" context="module">
  export function load({ params }) {
    const { inmateId } = params
    return { props: { inmateId } }
  }
</script>

<script lang="ts">
  import type { Package } from '$models/pbc/package'
  import { focusedInmate } from '$stores/inmate'
  import { focusedPackage, focusedPackages } from '$stores/package'
  import { ERROR_MESSAGE_SERVER_COMMUNICATION } from '$util/error'
  import { printPackage, CreatePackageModalState } from '$util/routing'

  import InmateName from '$components/inmate/inmate-name.svelte'
  import PackageTable from '$components/package/package-table.svelte'
  import CreatePackageModal from '$components/package/create-package-modal.svelte'
  import Loading from '$components/loading.svelte'
  import { onDestroy } from 'svelte'

  export let inmateId: string

  let activeModal: CreatePackageModalState
  let activeModalParams = {}

  const inmateIsLoaded =
    $focusedInmate.id === inmateId && $focusedPackages.length > 0
      ? Promise.resolve
      : focusedInmate.fetch(inmateId)

  const presentAlertModal = (pbcPackage: Package) => {
    focusedPackage.load(pbcPackage)
    activeModal = CreatePackageModalState.VIEW_ALERT
    activeModalParams = { packageId: pbcPackage.id }
  }
  const presentCreatePackageModal = () => {
    focusedPackage.reset()
    activeModal = CreatePackageModalState.VIEW_PACKAGE
  }
  const presentEditPackageModal = (pbcPackage: Package) => {
    focusedPackage.load(pbcPackage)
    activeModal = CreatePackageModalState.EDIT_PACKAGE
  }

  const refresh = async () => {
    return await focusedInmate.fetch($focusedInmate.id)
  }
  const updateInmate = async (inmate) => focusedInmate.set(inmate)
  const updateInmateError = (error) => {
    alert(ERROR_MESSAGE_SERVER_COMMUNICATION)
    console.error(error)
  }

  onDestroy(() => {
    focusedPackages.set([])
  })
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
  <Loading />
{:then}
  <main class="page">
    <InmateName
      inmate={$focusedInmate}
      on:update={({ detail }) => updateInmate(detail)}
      on:error={({ detail }) => updateInmateError(detail)}
    />

    <button id="add-package-button" class="success" on:click={() => presentCreatePackageModal()}>
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
  .page {
    justify-content: flex-start;
    text-align: center;
  }

  #add-package-button {
    align-self: center;
  }
</style>
