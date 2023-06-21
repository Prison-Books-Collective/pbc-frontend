<script lang="ts">
  import { ROUTE_RECIPIENT_CREATE_NAMED, ROUTE_PACKAGES_FOR_RECIPIENT } from '$util/routing'
  import Loading from '$components/loading.svelte'
  import { RecipientService } from '$services/pbc/recipient.service'
  import { goto } from '$app/navigation'
  import { focusedInmate } from '$stores/inmate'
  import { loading } from '$stores/loading.js'
  import { recipient } from '$lib/data/recipient.data.js'
  export let data

  export let firstName: string = data.firstName || ''
  export let lastName: string = data.lastName || ''

  loading.start()
  const getInmates = RecipientService.getRecipientsByName({ firstName, lastName })
  getInmates.then(() => loading.end())

  const findRecipient = async (id) => {
    const foundRecipient = await RecipientService.getRecipientByDatabaseId(id)
    if (foundRecipient) {
      recipient.set(foundRecipient)
      goto(ROUTE_PACKAGES_FOR_RECIPIENT(foundRecipient.id))
    }
  }
</script>

<svelte:head>
  <title>Search Results for: {firstName} {lastName}</title>
</svelte:head>

<main class="page">
  <h1>Recipient Selection</h1>
  <p>
    The following recipients with this name were found, please select which recipient you're
    creating a package for:
  </p>

  {#await getInmates then inmates}
    <nav>
      {#each inmates as inmate}
        <p
          on:click={() => {
            findRecipient(inmate.id)
          }}
          style="color:blue; text-decoration:underline; cursor:pointer"
        >
          {#if inmate.facility}
            <strong>{inmate.facility.name}</strong> &mdash;
          {:else if inmate.assignedId}
            <strong>ID #{inmate.assignedId}</strong> &mdash;
          {/if}
          {inmate.firstName}
          {inmate.middleName ? inmate.middleName + '. ' : ''}{inmate.lastName}
        </p>
      {/each}

      <a
        id="create-new-inmate"
        class="text-normal link"
        href={ROUTE_RECIPIENT_CREATE_NAMED({ firstName, lastName })}
      >
        <p id="create-new-inmate" class="link">Click here to create a new recipient record</p>
      </a>
    </nav>
  {/await}
</main>

<style lang="scss">
  #create-new-inmate {
    margin-top: 3em;
    text-align: center;
  }
</style>
