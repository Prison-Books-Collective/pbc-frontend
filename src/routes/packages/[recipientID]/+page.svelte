<script lang="ts">
  import { ERROR_MESSAGE_SERVER_COMMUNICATION } from '$util/error'

  import RecipientName from '$components/recipient/recipient-name.svelte'
  import PackageTable from '$components/package/package-table.svelte'
  import { onDestroy, onMount } from 'svelte'

  import { recipient } from '$lib/data/recipient.data'
  import { shipments } from '$lib/data/shipment.data'
  import { recipientClient } from '$services/bellbooks-backend/recipient.client'

  import type { Recipient } from '$models/pbc/recipient'
  export let data: PageData

  let { recipientId, isAssignedId } = data

  let packageTable: PackageTable
  let presentCreatePackage = () => {}
  let currentLocation = new Promise(() => {})

  const isLoaded =
    $recipient && $recipient.id?.toString() === recipientId
      ? Promise.resolve()
      : isAssignedId
      ? recipient.fetch({ id: recipientId })
      : recipient.fetchByDatabaseId({ id: recipientId })

  isLoaded.then(() => {
    currentLocation = $recipient.assignedId
      ? recipientClient.getRecipientLocation($recipient.assignedId)
      : ''
  })

  const updateRecipient = async (r: Recipient) => {
    recipient.load(r)
    recipient.sync()
  }
  const updateRecipientError = (error) => {
    alert(ERROR_MESSAGE_SERVER_COMMUNICATION)
    console.error(error)
  }

  onMount(async () => {
    presentCreatePackage = () => {
      packageTable.presentCreatePackageModal($recipient)
    }
  })
  onDestroy(() => {
    shipments.reset()
  })
</script>

<svelte:head>
  <title>BellBooks - Packages for {$recipient.firstName} {$recipient.lastName}</title>
</svelte:head>

{#await isLoaded then}
  <main class="page">
    <RecipientName
      recipient={$recipient}
      shipments={$shipments}
      on:update={({ detail }) => updateRecipient(detail)}
      on:error={({ detail }) => updateRecipientError(detail)}
    />
    {#if $recipient.assignedId}
      <span style="margin-bottom:10px">
        <a
          href={`https://webapps.doc.state.nc.us/opi/viewoffender.do?method=view&offenderID=${$recipient.assignedId}`}
          target="_blank"
        >
          {#await currentLocation}
            Loading current location.
          {:then location}
            {#if location === ''}
              Released
            {:else if location == 'Id.length != 7' || location == 'ERROR'}
              Location information is not available for this recipient.
            {:else}
              {location}
            {/if}
          {/await}
        </a>
      </span>
    {/if}
    <button id="add-package-button" class="success" on:click={presentCreatePackage}>
      Add a <strong><u>new package</u></strong> (books or zines)
    </button>

    <PackageTable bind:this={packageTable} />
  </main>
{/await}

<style lang="scss">
  .page {
    justify-content: flex-start;
    text-align: center;
    height: auto;
  }

  #add-package-button {
    align-self: center;
  }
</style>
