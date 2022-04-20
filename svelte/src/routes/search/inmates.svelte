<script lang="ts" context="module">
  import { getQueryParam } from '$util/web'
  export function load({ url }) {
    let firstName = getQueryParam(url, 'first name')
    let lastName = getQueryParam(url, 'last name')
    return { props: { firstName, lastName } }
  }
</script>

<script lang="ts">
  import { InmateService } from '$services/pbc/inmate.service'
  import { ROUTE_PACKAGES_FOR_INMATE, ROUTE_INMATE_CREATE_NAMED } from '$util/routing'
  import Loading from '$components/loading.svelte'

  export let firstName = null
  export let lastName = null
  const getInmates = InmateService.getAllInmatesByName({ firstName, lastName })
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
        <p>
          <a href={ROUTE_PACKAGES_FOR_INMATE(inmate.id)}>
            {#if inmate.location}
              <strong>{inmate.location}</strong> &mdash;
            {:else if inmate.id}
              <strong>ID #{inmate.id}</strong> &mdash;
            {/if}
            {inmate.firstName}
            {inmate.middleInitial ? inmate.middleInitial + '. ' : ''}{inmate.lastName}
          </a>
        </p>
      {/each}

      <a
        id="create-new-inmate"
        class="text-normal link"
        href={ROUTE_INMATE_CREATE_NAMED({ firstName, lastName })}
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
