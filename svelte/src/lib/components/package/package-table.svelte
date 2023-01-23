<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  import { focusedPackage, focusedPackages } from '$stores/package'
  import { resolveInmate, type Package } from '$models/pbc/package'
  import type { Inmate } from '$models/pbc/inmate'
  import { CreatePackageModalState, gotoPackagesForInmate, printPackage } from '$util/routing'

  import Book from '$components/book.svelte'
  import Zine from '$components/zine/zine.svelte'
  import editIcon from '$assets/icons/edit.png'
  import printIcon from '$assets/icons/print.png'
  import CreatePackageModal from './create-package-modal.svelte'
  import type { Shipment, Book as BookModel } from '$models/pbc/shipment'
    import AddBook from './book/add-book.svelte'

  const dispatch = createEventDispatcher()

  export let header = 'Shipment'
  export let packages: Shipment[]
  export let inmate: Inmate = null

  if (!packages || packages.length === 0) {
    packages = $focusedPackages
  }


  $: {
    console.log('here are the packages', { packages })}

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

  let transitionIn = $focusedPackages.length < 300 ? fade : () => {}
  let transitionOut = $focusedPackages.length < 300 ? fly : () => {}

  // -------------------- Modal Logic --------------------

  let activeModal: CreatePackageModalState
  let activeModalParams = {}
  let selectedInmate = null

  export function selectInmate(pbcPackage: Package) {
    selectedInmate = resolveInmate(pbcPackage)
  }

  export function presentCreatePackageModal(inmate) {
    selectedInmate = inmate
    focusedPackage.reset()
    activeModal = CreatePackageModalState.VIEW_PACKAGE
  }

  export function presentEditPackageModal(pbcPackage: Shipment) {
    selectInmate(pbcPackage)
    focusedPackage.load(pbcPackage)
    activeModal = CreatePackageModalState.EDIT_PACKAGE
  }

  export function presentAlertModal(pbcPackage: Shipment) {
    selectInmate(pbcPackage)
    focusedPackage.load(pbcPackage)
    activeModal = CreatePackageModalState.VIEW_ALERT
    activeModalParams = { packageId: pbcPackage.id }
  }
</script>

<CreatePackageModal bind:activeModal bind:activeModalParams inmate={selectedInmate} />

<section id="package-table-container">
  {#if packages.length === 0}
    <h2 class="no-packages-message">
      {#if inmate}
        No packages have been created for {inmate.firstName} {inmate.lastName} yet
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

      {#each packages.sort((a,b) => {
        if (a.date < b.date){
          return 1
        }if (a.date > b.date){
          return -1
        } 
        return 0}) as pbcPackage}
        <tr in:transitionIn out:transitionOut|local={{ x: 200 }}>
          <td class="spacer-col">
            {#if pbcPackage.notes && pbcPackage.notes.length > 0}
              <div
                class="alert"
                data-tooltip={pbcPackage.notes[0].content}
                on:click={() => alertPackageClicked(pbcPackage)}
              >
                !
              </div>
            {/if}
          </td>
          <td class="package-col">
            <h2>
              {#if pbcPackage.facility}
                <em class:text-normal={!!inmate}>{pbcPackage.facility.name}</em>,
              {/if}
              <date>
                {pbcPackage.date}:
              </date>
            </h2>
            {#if !inmate}
              <h2 class="text-normal">
                <span
                  class="link"
                  on:click={() => gotoPackagesForInmate(resolveInmate(pbcPackage))}
                >
                  {resolveInmate(pbcPackage).firstName}
                  {resolveInmate(pbcPackage).middleInitial
                    ? resolveInmate(pbcPackage).middleInitial + ' '
                    : ''}{resolveInmate(pbcPackage).lastName}

                  {#if !resolveInmate(pbcPackage)['location']}
                    #{pbcPackage.inmate.id}
                  {:else}
                    (No ID available)
                  {/if}
                </span>
              </h2>
            {/if}
            <ul>
              {#each pbcPackage.content as content}
                <li>
                  {#if content.type === 'book'}
                    <Book book={content} />
                  {:else if content.type === 'zine'}
                    <Zine zine={content} />
                  {/if}
                </li>
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
              on:click={() => editPackageClicked(pbcPackage)}
            />
          </td>
          <td class="print-col">
            <img
              src={printIcon}
              alt="print icon; click to print this package"
              class="print-icon"
              width="20"
              height="20"
              on:click={() => printPackageClicked(pbcPackage)}
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
