<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  import { CreatePackageModalState, printPackage } from '$util/routing'

  import Book from '$components/book.svelte'
  import Zine from '$components/zine/zine.svelte'
  import editIcon from '$assets/icons/edit.png'
  import printIcon from '$assets/icons/print.png'
  import CreatePackageModal from './create-package-modal.svelte'

  import { RecipientService } from '$services/pbc/recipient.service'
  import type { Shipment } from '$models/pbc/shipment'
  import type { Recipient } from '$models/pbc/recipient'
  import { createShipment, shipments } from '$lib/data/shipment.data'
  import { recipient } from '$lib/data/recipient.data'

  const dispatch = createEventDispatcher()

  enum TableMode {
    RECIPIENT = 'recipient', // view the shipments for a specific recipient
    COMPOSITE = 'composite', // view all shipments that meet a given criteria
  }

  export let header = 'Shipment'
  export let mode: TableMode = TableMode.RECIPIENT

  const alertPackageClicked = (pbcPackage: Shipment) => {
    dispatch('alert', pbcPackage)
    presentAlertModal(pbcPackage)
  }
  const editPackageClicked = (pbcPackage: Shipment) => {
    dispatch('edit', pbcPackage)
    presentEditPackageModal(pbcPackage)
  }
  const printPackageClicked = (pbcPackage: Shipment) => {
    dispatch('print', pbcPackage)
    printPackage(pbcPackage)
  }

  let transitionIn = $shipments.length < 300 ? fade : () => {}
  let transitionOut = $shipments.length < 300 ? fly : () => {}

  // -------------------- Modal Logic --------------------

  let activeModal: CreatePackageModalState
  let activeModalParams = {}

  export async function getRecipientByShipment(pbcPackage: Shipment) {
    let r = await RecipientService.getRecipientByShipmentId(pbcPackage.id)
    $recipient = r ?? $recipient
    return recipient
  }

  export function presentCreatePackageModal() {
    createShipment.reset()
    activeModal = CreatePackageModalState.VIEW_PACKAGE
  }

  export function presentEditPackageModal(pbcPackage: Shipment) {
    createShipment.load(pbcPackage)
    activeModal = CreatePackageModalState.EDIT_PACKAGE
  }

  export function presentAlertModal(pbcPackage: Shipment) {
    createShipment.load(pbcPackage)
    activeModal = CreatePackageModalState.VIEW_ALERT
    activeModalParams = { packageId: pbcPackage.id }
  }
</script>

<CreatePackageModal bind:activeModal bind:activeModalParams />

<section id="package-table-container">
  {#if $shipments.length === 0}
    <h2 class="no-packages-message">
      {#if mode === TableMode.RECIPIENT}
        No packages have been created for {$recipient.firstName} {$recipient.lastName} yet
      {:else}
        No packages found
      {/if}
    </h2>
  {:else}
    <table id="packageTable">
      <tr>
        <th style="width: 3ch;">!</th>
        <th>{header}</th>
        <th>Edit</th>
        <th>Print</th>
      </tr>

      {#each $shipments.sort((a, b) => {
        let dateA = new Date(a.date)
        let dateB = new Date(b.date)
        if (dateA < dateB) {
          return 1
        }
        if (dateA > dateB) {
          return -1
        }
        return 0
      }) as shipment}
        <tr in:transitionIn out:transitionOut|local={{ x: 200 }}>
          <td class="spacer-col">
            {#if shipment.notes && shipment.notes.length > 0}
              <div
                class="alert"
                data-tooltip={shipment.notes[0].content}
                on:click={() => alertPackageClicked(shipment)}
              >
                !
              </div>
            {/if}
          </td>
          <td class="package-col">
            <h2>
              <!-- {#if shipment.facility}
                <em class:text-normal={!!$recipient}>{shipment.facility.name}</em>,
              {/if} -->
              <date>
                {shipment.date}:
              </date>
            </h2>

            <!-- TODO: This does not work with the way that shipments have been rearchitected. Will need to rethink how we do this -->
            <!-- {#if !inmate}
              <h2 class="text-normal">
                <span
                  class="link"
                  on:click={async () => {
                    gotoPackagesForInmate(await getRecipientByShipment(shipment))
                  }}
                >
                  Click to go to recipient. -->

            <!-- {currentRecipientToLink.firstName}
                  {currentRecipientToLink.middleInitial
                    ? currentRecipientToLink.middleInitial + ' '
                    : ''}{currentRecipientToLink.lastName}

                  {#if currentRecipientToLink.id !== null}
                    #{currentRecipientToLink.id}
                  {:else}
                    (No ID available)
                  {/if} -->
            <!-- </span>
              </h2>
            {/if} -->

            <ul>
              {#each shipment.content as content}
                {#key content}
                  <li>
                    {#if content.type === 'book'}
                      <Book book={content} />
                    {:else if content.type === 'zine'}
                      <Zine zine={content} />
                    {/if}
                  </li>
                {/key}
              {/each}
            </ul>
          </td>
          <td class="edit-col">
            <img
              src={editIcon}
              alt="edit icon; click to edit this package"
              class="edit-icon"
              width="20"
              height="20"
              on:click={() => editPackageClicked(shipment)}
            />
          </td>
          <td class="print-col">
            <img
              src={printIcon}
              alt="print icon; click to print this package"
              class="print-icon"
              width="20"
              height="20"
              on:click={() => printPackageClicked(shipment)}
            />
          </td>
        </tr>
      {/each}
    </table>
  {/if}
</section>

<style lang="scss">
  #package-table-container {
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: stretch;
  }

  h2 {
    color: inherit;
    text-align: left;
    font-size: 1rem;
    margin-bottom: 0;
    margin-top: 0;
  }

  .alert {
    cursor: pointer;
    text-decoration: underline;
    color: blue;
    width: 10px;
    text-align: center;
  }

  .no-packages-message {
    margin-top: 3em;
    text-align: center;
  }
  .spacer-col {
    padding: 10px 13px;
  }
  .package-col {
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 15px;
    padding-left: 20px;
    text-align: left;
  }
  .edit-col {
    text-align: center;
    width: 40px;
  }
  .print-col {
    text-align: center;
    width: 40px;
  }

  .edit-icon,
  .print-icon {
    transition-duration: 0.3s;
    opacity: 0.5;
    cursor: pointer;

    &:hover {
      opacity: 0.9;
    }
  }

  [data-tooltip] {
    position: relative;
  }

  [data-tooltip]::before {
    content: attr(data-tooltip);

    position: absolute;
    top: 0px;
    left: 1em;

    padding: 1rem;
    width: clamp(20ch, 50ch, 80vw);

    text-align: left;
    color: transparent;
    background-color: #eee;
    border-radius: 3px;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);

    transform-origin: top left;
    transform: scale(0);
    transition: 200ms ease-in-out 300ms;

    z-index: 100;
  }

  [data-tooltip]:hover::before,
  [data-tooltip]:focus-visible::before {
    transform: scale(1);
    color: black;
  }

  .link {
    color: inherit;
  }

  .link::before {
    background-color: currentColor;
  }
</style>
