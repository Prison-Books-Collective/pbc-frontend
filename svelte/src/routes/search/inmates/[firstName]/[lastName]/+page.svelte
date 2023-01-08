<script lang="ts">
  import { ROUTE_PACKAGES_FOR_INMATE, ROUTE_RECIPIENT_CREATE_NAMED } from '$util/routing'
  import Loading from '$components/loading.svelte'
    import { RecipientService } from '$services/pbc/recipient.service'
    import { goto } from '$app/navigation'
    import InmateName from '$components/inmate/inmate-name.svelte'
    import RejectionLog from '$components/package/rejection-log.svelte'
    import { focusedInmate } from '$stores/inmate'
  export let data

  export let firstName: string = data.firstName || ""
  export let lastName: string = data.lastName || ""

  const getInmates = RecipientService.getRecipientsByName({ firstName, lastName })

  const findRecipient = async (assignedId) => {
    $focusedInmate = await RecipientService.getRecipientByAssignedId(assignedId)
    goto(ROUTE_PACKAGES_FOR_INMATE(assignedId))
  }
</script>

<svelte:head>
  <title>Search Results for: {firstName} {lastName}</title>
</svelte:head>

<main class="page">
  <h1>Inmate Selection</h1>
  <p>
    The following inmates with this name were found, please select which inmate you're creating a
    package for:
  </p>

  {#await getInmates}
    <Loading />
  {:then inmates}
    <nav>
      {#each inmates as inmate}
        <p on:click={() => {findRecipient(inmate.assignedId)}} style="color:blue; text-decoration:underline; cursor:pointer">
            {#if inmate.facility}
              <strong>{inmate.facility}</strong> &mdash;
            {:else if inmate.id}
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
        <p id="create-new-inmate" class="link">Click here to create a new inmate record</p>
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
