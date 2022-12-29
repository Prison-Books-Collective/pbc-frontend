<script lang="ts" context="module">
  export function load({ params }) {
    const { inmateId } = params
    return { props: { inmateId } }
  }
</script>

<script lang="ts">
  import { focusedInmate } from '$stores/inmate'
  import { focusedPackages } from '$stores/package'
  import { ERROR_MESSAGE_SERVER_COMMUNICATION } from '$util/error'

  import InmateName from '$components/inmate/inmate-name.svelte'
  import PackageTable from '$components/package/package-table.svelte'
  import Loading from '$components/loading.svelte'
  import { onDestroy, onMount } from 'svelte'

  export let inmateId: string
  let packageTable: PackageTable
  let presentCreatePackage = () => {}

  const inmateIsLoaded =
    $focusedInmate.id === inmateId && $focusedPackages.length > 0
      ? Promise.resolve
      : focusedInmate.fetch(inmateId)

  const updateInmate = async (inmate) => focusedInmate.set(inmate)
  const updateInmateError = (error) => {
    alert(ERROR_MESSAGE_SERVER_COMMUNICATION)
    console.error(error)
  }

  onMount(() => {
    presentCreatePackage = () => {
      packageTable.presentCreatePackageModal($focusedInmate)
    }
  })
  onDestroy(() => {
    focusedPackages.set([])
  })
</script>

<svelte:head>
  <title>BellBooks - Packages for {$focusedInmate.firstName} {$focusedInmate.lastName}</title>
</svelte:head>

{#await inmateIsLoaded}
  <Loading />
{:then}
  <main class="page">
    <InmateName
      inmate={$focusedInmate}
      on:update={({ detail }) => updateInmate(detail)}
      on:error={({ detail }) => updateInmateError(detail)}
    />

    <button id="add-package-button" class="success" on:click={presentCreatePackage}>
      Add a <strong><u>new package</u></strong> (books or zines)
    </button>

    <PackageTable bind:this={packageTable} packages={$focusedPackages} inmate={$focusedInmate} />
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
