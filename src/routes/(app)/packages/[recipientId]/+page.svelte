<script lang="ts">
  import { ERROR_MESSAGE_SERVER_COMMUNICATION } from '$util/error'

  import RecipientName from '$components/recipient/recipient-name.svelte'
  import PackageTable from '$components/package/package-table.svelte'
  import { onDestroy, onMount } from 'svelte'

  import { recipient } from '$lib/data/recipient.data'
  import { shipments } from '$lib/data/shipment.data'

  import type { Recipient } from '$models/pbc/recipient'
  export let data

  let { recipientId, isAssignedId } = data

  if (!$recipient || $recipient.id === -1) {
    if (isAssignedId) recipient.fetch({ id: recipientId })
    else recipient.fetchByDatabaseId({ id: recipientId })
  }

  let packageTable: PackageTable
  let presentCreatePackage = () => {}

  const updateRecipient = async (r: Recipient) => {
    recipient.load(r)
    recipient.sync()
  }
  const updateRecipientError = (error: any) => {
    alert(ERROR_MESSAGE_SERVER_COMMUNICATION)
    console.error(error)
  }

  onMount(async () => {
    presentCreatePackage = () => {
      packageTable.presentCreatePackageModal()
    }
  })
  onDestroy(() => {
    shipments.reset()
  })
</script>

<svelte:head>
  <title>BellBooks - Packages for {$recipient.firstName} {$recipient.lastName}</title>
</svelte:head>

<main data-layout="page">
  <RecipientName
    shipments={$shipments}
    on:update={({ detail }) => updateRecipient(detail)}
    on:error={({ detail }) => updateRecipientError(detail)}
  />

  <button id="add-package-button" class="success" on:click={presentCreatePackage}>
    Add a <strong><u>new package</u></strong> (books or zines)
  </button>

  <PackageTable bind:this={packageTable} />
</main>

<style lang="scss">
  .page {
    justify-content: flex-start;
    text-align: center;
    height: auto;
  }

  [data-layout='page'] {
    display: grid;
    margin-top: 2rem;
    grid-template-areas:
      'info'
      'cta'
      'table';
    grid-template-rows:
      1fr
      auto
      auto;
    place-items: center;
    gap: 1rem;
  }
</style>
