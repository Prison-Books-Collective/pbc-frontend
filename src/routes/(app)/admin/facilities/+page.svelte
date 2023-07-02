<script lang="ts">
  import { fly } from 'svelte/transition'

  import { facilities } from '$stores/facility'
  import trashIcon from '$assets/icons/trash.png'

  import { FacilityService } from '$services/pbc/facility.service'
  import { loading } from '$stores/loading'
  import { isEmpty } from 'lodash'
  import { type Facility, State } from '$models/pbc/facility'
  import Facility from '$components/facility/facility.svelte'

  let expandIndex: number | null = null

  let inputFacility: Omit<Facility, 'id'> = {
    name: '',
    additionalInfo: '',
    street: '',
    city: '',
    zip: '',
    state: State.NC,
  }

  const toggleExpand = (index: number) => {
    if (expandIndex == index) return (expandIndex = null)
    expandIndex = index

    inputFacility =
      index === -1
        ? {
            name: '',
            additionalInfo: '',
            street: '',
            city: '',
            zip: '',
            state: State.NC,
          }
        : { ...$facilities[index] }
  }

  const shouldDisableSubmit = (facility: Omit<Facility, 'id'>) => {
    return (
      isEmpty(facility.name) ||
      isEmpty(facility.city) ||
      isEmpty(facility.street) ||
      isEmpty(facility.zip) ||
      (facility.state !== State.NC && facility.state !== State.AL)
    )
  }

  const updateFacility = async (facility: Facility | Omit<Facility, 'id'>) => {
    if (!(facility as Facility).id) return

    loading.start()
    await FacilityService.updateFacility(facility as Facility)
    await facilities.fetch()
    loading.end()

    expandIndex = null
  }

  const createFacility = async (facility: Omit<Facility, 'id'>) => {
    loading.start()
    await FacilityService.createFacility(facility as any)
    await facilities.fetch()
    loading.end()

    expandIndex = null
  }

  const confirmDeleteFacility = (facility: Facility) => {
    const shouldDelete = confirm(
      `Are you sure you want to permanently delete "${facility.name}"? Note that this will not succeed if the Facility is listed by any existing packages.`,
    )
    if (!shouldDelete) return
    deleteFacility(facility.id as any)
  }

  const deleteFacility = async (id: string) => {
    loading.start()
    await FacilityService.deleteFacility(id)
    await facilities.fetch()
    loading.end()

    expandIndex = null
  }
</script>

<main data-layout="page">
  <h1>Manage Facilities</h1>

  <section class="list">
    <article class="list-item list-header expandable" class:expanded={expandIndex === -1}>
      <h2 on:click={() => toggleExpand(-1)}>Add New Facility</h2>

      {#if -1 === expandIndex}
        <form
          class="create-form"
          out:fly
          on:submit|preventDefault={() => createFacility(inputFacility)}
        >
          <label for="create-facility-state">
            State
            <select
              name="create-facility-state"
              id="create-facility-state"
              bind:value={inputFacility.state}
            >
              <option value={null} disabled>Select State</option>
              <option value={State.NC}>NC</option>
              <option value={State.AL}>AL</option>
            </select>
          </label>

          <label for="create-facility-name">
            Name
            <input
              type="text"
              name="create-facility-name"
              id="create-facility-name"
              placeholder="Facility Name"
              bind:value={inputFacility.name}
            />
          </label>

          <label for="create-facility-street">
            Street Address
            <input
              type="text"
              name="create-facility-street"
              id="create-facility-street"
              placeholder="Facility Mailing Address"
              bind:value={inputFacility.street}
            />
          </label>

          <label for="create-facility-city">
            City
            <input
              type="text"
              name="create-facility-city"
              id="create-facility-city"
              placeholder="City"
              bind:value={inputFacility.city}
            />
          </label>

          <label for="create-facility-zip">
            ZIP Code
            <input
              type="text"
              name="create-facility-zip"
              id="create-facility-zip"
              placeholder="ZIP Code"
              bind:value={inputFacility.zip}
            />
          </label>

          <label for="create-facility-additional-info">
            Additional Information
            <textarea
              name="create-facility-additional-info"
              id="create-facility-additional-info"
              placeholder="Any other additional information that may be helpful for this facility"
              bind:value={inputFacility.additionalInfo}
            />
          </label>

          <section class="form-controls">
            <button type="button" on:click={() => toggleExpand(-1)}>Cancel</button>
            <button type="submit" class="success" disabled={shouldDisableSubmit(inputFacility)}>
              Update
            </button>
          </section>
        </form>
      {/if}
    </article>

    {#each $facilities as facility, index}
      <article class="list-item expandable" class:expanded={expandIndex === index}>
        <p on:click={() => toggleExpand(index)}>
          <span class="facility-state">{facility.state}</span>
          <span class="facility-name">{facility.name}</span>
        </p>

        {#if index === expandIndex}
          <form
            class="update-form"
            out:fly
            on:submit|preventDefault={() => updateFacility(inputFacility)}
          >
            <label for="update-facility-state">
              State
              <select
                name="update-facility-state"
                id="update-facility-state"
                bind:value={inputFacility.state}
              >
                <option value={null} disabled>Select State</option>
                <option value={State.NC}>NC</option>
                <option value={State.AL}>AL</option>
              </select>
            </label>

            <label for="update-facility-name">
              Name
              <input
                type="text"
                name="update-facility-name"
                id="update-facility-name"
                placeholder="Facility Name"
                bind:value={inputFacility.name}
              />
            </label>

            <label for="update-facility-street">
              Street Address
              <input
                type="text"
                name="update-facility-street"
                id="update-facility-street"
                placeholder="Facility Mailing Address"
                bind:value={inputFacility.street}
              />
            </label>

            <label for="update-facility-city">
              City
              <input
                type="text"
                name="update-facility-city"
                id="update-facility-city"
                placeholder="City"
                bind:value={inputFacility.city}
              />
            </label>

            <label for="update-facility-zip">
              ZIP Code
              <input
                type="text"
                name="update-facility-zip"
                id="update-facility-zip"
                placeholder="ZIP Code"
                bind:value={inputFacility.zip}
              />
            </label>

            <label for="update-facility-additional-info">
              Additional Information
              <textarea
                name="update-facility-additional-info"
                id="update-facility-additional-info"
                placeholder="Any other additional information that may be helpful for this facility"
                bind:value={inputFacility.additionalInfo}
              />
            </label>

            <section class="form-controls">
              <button type="button" on:click={() => toggleExpand(index)}>Cancel</button>
              <button type="button" class="danger" on:click={() => confirmDeleteFacility(facility)}>
                <img class="icon" alt="Delete Facility, Trash Icon" src={trashIcon} />
              </button>
              <button type="submit" class="success" disabled={shouldDisableSubmit(inputFacility)}>
                Update
              </button>
            </section>
          </form>
        {/if}
      </article>
    {/each}
  </section>
</main>

<style lang="scss">
  [data-layout='page'] {
    display: grid;
    grid-template-areas:
      'header'
      'content'
      'footer';
    grid-template-rows:
      7rem
      1fr
      7rem;
    margin: auto;
    max-width: 1200px;
  }

  h1 {
    line-height: 3rem;
    margin-block: 2rem;
  }

  .list {
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: stretch;
    width: 100%;

    &:has(.expanded) {
      .list-item {
        color: rgb(0 0 0 / 0.3);
      }
      .list-item.expanded {
        color: #232020;
      }
    }
  }

  .list-item {
    display: grid;
    grid-template-areas:
      'header'
      'form';
    grid-template-rows: auto 0px;
    transition-duration: 0.3s;

    padding: 1rem;
    background-color: #f6efe9;
    box-shadow: 0px 0px 10px rgb(0 0 0 / 0.3);

    &.expanded {
      grid-template-rows: auto 25rem;
    }

    p {
      grid-area: header;
      display: grid;
      grid-template-columns: 1fr 3fr;
      margin: 0.5rem;

      cursor: pointer;

      .facility-state {
        font-weight: 600;
        align-self: center;
      }
    }

    h2 {
      grid-area: header;
      text-align: center;

      cursor: pointer;
    }
  }

  .list-header {
    display: grid;
    grid-template-areas:
      'header'
      'form';
  }

  .expandable {
    transition: all 0.3s ease-in-out;
  }

  form {
    grid-area: form;
    display: grid;
    grid-template-areas:
      'state name name'
      'street street street'
      'city city zip'
      'info info info'
      'control control control';
    grid-template-columns: 7rem 1fr 7rem;
    grid-auto-rows: auto;
    gap: 0.5rem;

    label,
    select {
      margin-bottom: 0px;
      // margin-top: 1.25rem;
    }

    label[for$='state'] {
      grid-area: state;
    }

    label[for$='name'] {
      grid-area: name;
    }

    label[for$='street'] {
      grid-area: street;
    }

    label[for$='city'] {
      grid-area: city;
    }

    label[for$='zip'] {
      grid-area: zip;
    }

    label[for$='info'] {
      grid-area: info;
    }

    .form-controls {
      grid-area: control;
      display: flex;
      flex-flow: row nowrap;
      justify-content: stretch;
      align-items: stretch;
      gap: 0.5rem;
      overflow: hidden;

      [type='submit'] {
        flex-grow: 3;
        flex-shrink: 1;
      }

      [type='button'].danger {
        flex-shrink: 1;
      }

      [type='button']:not(.danger) {
        flex-grow: 1;
        flex-shrink: 3;
      }
    }
  }

  .icon {
    filter: invert(100%);
    -webkit-filter: invert(100%);
    opacity: 1;
    max-height: 0.6rem;
    transform: scale(2);
  }

  textarea {
    padding: 0.5rem;
    background: none;
  }
</style>
