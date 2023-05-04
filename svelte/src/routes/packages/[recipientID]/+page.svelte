<script lang="ts">
  import { focusedInmate } from '$stores/inmate'
  import { focusedPackages } from '$stores/package'
  import { ERROR_MESSAGE_SERVER_COMMUNICATION } from '$util/error'

  import InmateName from '$components/inmate/inmate-name.svelte'
  import PackageTable from '$components/package/package-table.svelte'
  import Loading from '$components/loading.svelte'
  import Modal from '$components/modal.svelte'
  import { onDestroy, onMount } from 'svelte'
  import { RecipientService } from '$services/pbc/recipient.service'

  export let data;
  let { recipientId, isAssignedId } = data
  let specialRequestModalIsVisible = false
  
  let packageTable: PackageTable
  let presentCreatePackage = () => {}
  let presentSpecialRequestModal = () => {
    //presentCreatePackageModal($focusedInmate)
    specialRequestModalIsVisible = true
  } 
  
  let currentLocation = Promise.resolve(' ')

  const inmateIsLoaded =
    $focusedInmate.id === recipientId
      ? Promise.resolve
      : isAssignedId
        ? focusedInmate.TODO_fetchByAssignedId(recipientId) 
        : focusedInmate.TODO_fetchById(recipientId)
  
  console.log({ recipientId })

  inmateIsLoaded.then(() => {
    if($focusedInmate.assignedId) {
      currentLocation = RecipientService.getRecipientLocation($focusedInmate.assignedId)
    }
  })

  const updateRecipient = async (recipient) => focusedInmate.set(recipient)
  const updateRecipientError = (error) => {
    alert(ERROR_MESSAGE_SERVER_COMMUNICATION)
    console.error(error)
  }

  onMount(async () => {
    presentCreatePackage = () => {
      packageTable.presentCreatePackageModal($focusedInmate)
    }
  
  })
  onDestroy(() => {
    focusedPackages.set([])
  })

  focusedPackages.subscribe(d => console.log({focusedPackages: d}))
</script>

<svelte:head>
  <title>BellBooks - Packages for {$focusedInmate.firstName} {$focusedInmate.lastName}</title>
</svelte:head>

{#await inmateIsLoaded}
  <Loading />
{:then}
  <Modal 
    visible={specialRequestModalIsVisible} on:close={() => { specialRequestModalIsVisible = false }}  showConfirm={true}>
    <h1>Hello!</h1>
    <form>
      <label for="special-request-q1">
        <input
        name="special-request-q1"
        id="special-request-q1"
        type="checkbox"
        />
        Is this a high priority for the letter writer?
      </label>

      <label for="special-request-q2">
        <input
        name="special-request-q2"
        id="special-request-q2"
        type="checkbox"
        />
        Can this request not be fulfilled with our stock?
      </label>

      <label for="special-request-q3">
        <input
        name="special-request-q3"
        id="special-request-q3"
        type="checkbox"
        />
        Online enterer only: Person has not received another special request in this quarter.
      </label>

    </form>
  </Modal>

  <main class="page">
    <InmateName
      recipient={$focusedInmate}
      on:update={({ detail }) => updateRecipient(detail)}
      on:error={({ detail }) => updateRecipientError(detail)}
    />
    <span style="margin-bottom:10px">
    {#await currentLocation} 
      Loading current location.
    {:then location}
      {#if location === ''}
        Released
      {:else}
        {location}
      {/if}
    {/await}
    </span>
    <button id="add-package-button" class="success" on:click={presentCreatePackage}>
      Add a <strong><u>new package</u></strong> (books or zines)
    </button>

    <!-- TODO: (andrewalson) add create new special request button here  -->
    <button id="add-special-request-button" class="info" on:click={presentSpecialRequestModal}>
      Add a <strong><u>new special request</u></strong>
    </button>

    <PackageTable bind:this={packageTable} packages={$focusedPackages} inmate={$focusedInmate} />
  </main>
{/await}

<style lang="scss">
  .page {
    justify-content: flex-start;
    text-align: center;
  }

  #add-package-button, #add-special-request-button {
    align-self: center;
  }
</style>
