<script lang="ts">
  import { resolveInmate, type Package } from '$models/pbc/package'

  import { PackageService } from '$services/pbc/package.service'
  import { focusedPackage, focusedPackages } from '$stores/package'
  import { CreatePackageModalState, printPackage } from '$util/routing'
  import { formatDate } from '$util/time'
  import CreatePackageModal from './create-package-modal.svelte'
  import PackageTable from './package-table.svelte'

  const today = formatDate(new Date())
  let getPackages = PackageService.getPackagesForDate(today)

  getPackages.then((packages) => focusedPackages.set(packages))

  let activeModal: CreatePackageModalState
  let activeModalParams = {}
  let selectedInmate = null

  const selectInmate = (pbcPackage: Package) => (selectedInmate = resolveInmate(pbcPackage))

  const presentEditPackageModal = (pbcPackage: Package) => {
    selectInmate(pbcPackage)
    focusedPackage.load(pbcPackage)
    activeModal = CreatePackageModalState.EDIT_PACKAGE
  }

  const presentAlertModal = (pbcPackage: Package) => {
    selectInmate(pbcPackage)
    focusedPackage.load(pbcPackage)
    activeModal = CreatePackageModalState.VIEW_ALERT
    activeModalParams = { packageId: pbcPackage.id }
  }
</script>

<CreatePackageModal bind:activeModal bind:activeModalParams inmate={selectedInmate} />

{#await getPackages then}
  <p>
    You have completed <span id="package-count">{$focusedPackages.length}</span> packages on
    <date>{today}</date>
  </p>
  {#if $focusedPackages && $focusedPackages.length > 0}
    <PackageTable
      header="Today's Packages"
      packages={$focusedPackages}
      on:edit={({ detail: pbcPackage }) => presentEditPackageModal(pbcPackage)}
      on:print={({ detail: pbcPackage }) => printPackage(pbcPackage)}
      on:alert={({ detail: pbcPackage }) => presentAlertModal(pbcPackage)}
    />
  {/if}
{/await}

<style>
  #package-count,
  date {
    font-weight: 700;
  }
</style>
