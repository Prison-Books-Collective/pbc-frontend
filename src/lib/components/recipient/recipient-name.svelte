<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import editIcon from '$assets/icons/edit.png'
  import Modal from '$components/modal.svelte'
  import EditRecipient from '$components/recipient/edit-recipient.svelte'
  import type { Recipient } from '$models/pbc/recipient'
  import type { Shipment } from '$models/pbc/shipment'
  import { recipientClient } from '$services/bellbooks-backend/recipient.client'
  import { recipient } from '$lib/data/recipient.data'

  const dispatch = createEventDispatcher()

  export let shipments: Shipment[]
  export let shouldDisplayModal = false

  let currentLocation = new Promise(() => {})

  $: {
    currentLocation = $recipient.assignedId
      ? recipientClient.getRecipientLocation($recipient.assignedId)
      : ''
  }

  const presentModal = () => (shouldDisplayModal = true)
  const closeModal = () => (shouldDisplayModal = false)

  $: didReceivePackageLastTwoMonths = (): boolean => {
    if (!shipments || shipments.length === 0) return false
    return getDaysSinceLastShipment(shipments[0]) < 60
  }

  const getDaysSinceLastShipment = (shipment: Shipment) => {
    const DAYS_IN_MS = 86400000 // 1000ms/sec * 60sec/min * 60min/hr * 24hr/day = 86,400,000ms/day
    const now = new Date().getTime()
    const lastShipmentTime = new Date(shipment.date).getTime()

    return Math.floor((now - lastShipmentTime) / DAYS_IN_MS)
  }

  const getFormattedShipmentDate = (shipment: Shipment) => {
    const shipmentDate = new Date(shipment.date)
    console.log({ date: shipment.date })
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeZone: 'UTC' }).format(
      shipmentDate,
    )
  }

  const getSubtitleLabel = (recipient: Recipient) => {
    if (!recipient.assignedId && !recipient.facility) return null
    if (recipient.assignedId) return "Recipient's assigned OPUS ID"
    if (recipient.facility) return "Recipient's current assigned facility"
  }

  const getSubtitle = (recipient: Recipient) => {
    if (!recipient.assignedId && !recipient.facility) return 'Unknown ID & Facility'
    if (recipient.assignedId) return `ID#${recipient.assignedId}`
    if (recipient.facility) return recipient.facility.name
  }

  const onUpdateRecipient = (event: { detail: any }) => {
    closeModal()
    dispatch('update', event.detail)
  }
  const onUpdateRecipientError = (event: { detail: any }) => {
    closeModal()
    dispatch('error', event.detail)
  }
</script>

<Modal bind:visible={shouldDisplayModal}>
  <EditRecipient on:update={onUpdateRecipient} on:error={onUpdateRecipientError} />
</Modal>

<div data-layout="list">
  <section class="recipient-display" on:click={presentModal}>
    <h1 aria-label="Recipient's first and last name, and OPUS ID if available">
      {$recipient.firstName}
      {$recipient.lastName}
    </h1>

    <h2 aria-label={getSubtitleLabel($recipient)}>
      {getSubtitle($recipient)}
    </h2>

    <img src={editIcon} class="icon" alt="edit icon; click to edit recipient information" />
  </section>

  {#if didReceivePackageLastTwoMonths()}
    <p class="text-center cannot-receive-packages">
      Recipient received a package

      {#if getDaysSinceLastShipment(shipments[0]) === 0}
        <strong>Today</strong>
      {:else}
        <strong>
          {getDaysSinceLastShipment(shipments[0])} days ago,
        </strong>on
        <strong>
          {getFormattedShipmentDate(shipments[0])}
        </strong>
      {/if}
    </p>
  {/if}

  {#if $recipient.assignedId}
    <span class="location">
      <a
        href={`https://webapps.doc.state.nc.us/opi/viewoffender.do?method=view&offenderID=${$recipient.assignedId}`}
        target="_blank"
        class="text-center"
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
</div>

<style lang="scss">
  [data-layout='list'] {
    display: grid;
    grid-template-areas:
      'info'
      'last-package'
      'location';
    grid-template-rows:
      auto
      auto
      auto;
    place-items: center;
    gap: 1rem;

    .recipient-display {
      grid-area: info;
    }
    .cannot-receive-packages {
      grid-area: last-package;
    }
    .location {
      grid-area: location;
      a {
        width: 100%;
      }
    }
  }

  .recipient-display {
    display: grid;
    grid-template-areas:
      '. name edit'
      '. subtitle edit';
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.5rem;

    place-items: center;

    cursor: pointer;

    h1 {
      grid-area: name;
      font-size: 2rem;
      line-height: 3rem;
      margin: 0px;
      margin-inline: 0.5rem;
    }
    h2 {
      grid-area: subtitle;
      margin: 0px;
    }
    img {
      grid-area: edit;
      align-self: center;
      justify-self: start;
    }

    &:hover img {
      opacity: 1;
    }
  }

  p {
    margin: 0;
  }

  .cannot-receive-packages {
    background-color: #f7bbbb;
    border-radius: 3px;
    padding: 0.7rem;
  }
</style>
