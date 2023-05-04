<script lang="ts">
  import { ERROR_MESSAGE_SERVER_COMMUNICATION } from '$util/error'
  import ZineList from '$components/zine/zine-list.svelte'
  import FacilityList from '$components/facility/facility-list.svelte'
  import CreateZine from '$components/zine/create-zine.svelte'
  import CreateFacility from '$components/facility/create-facility.svelte'
  import SearchByDate from '$components/package/search/search-by-date.svelte'
  import SearchByBook from '$components/package/search/search-by-book.svelte'
  import { gotoPackageSearch } from '$util/routing'

  const alertZineCreated = ({ detail: zine }) => {
    alert(`Successfully added new Zine "${zine.code} - ${zine.title}"`)
  }
  const alertFacilityCreated = ({ detail: facility }) =>
    alert(
      `Successfully added new Facility "[${facility.state}] ${facility.facility_name} - ${facility.facility_type}"`
    )
  const alertCreationError = ({ detail: error }) => {
    alert(ERROR_MESSAGE_SERVER_COMMUNICATION)
    console.error(error)
  }
</script>

<svelte:head>
  <title>BellBooks - Settings & Configuration</title>
</svelte:head>

<main class="page">
  <section>
    <h1>Packages</h1>

    <h2>Search Packages by Date</h2>
    <SearchByDate on:search={({ detail }) => gotoPackageSearch(detail)} />

    <h2>Search Packages by Book</h2>
    <SearchByBook on:search={({ detail }) => gotoPackageSearch(detail)} />
  </section>

  <section>
    <h1>Zines</h1>
    <CreateZine on:update={alertZineCreated} on:error={alertCreationError} />
    <div class="spacer" />
    <ZineList />
  </section>

  <div class="spacer" />
  <div class="spacer" />

  <section>
    <h1>Facilities</h1>
    <CreateFacility on:update={alertFacilityCreated} on:error={alertCreationError} />
    <div class="spacer" />
    <FacilityList />
  </section>
</main>

<style lang="scss">
  section {
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;
    max-width: 800px !important;
  }

  section {
    display: flex;
    flex-flow: column nowrap;
    max-width: calc(100vw - 2rem);
    width: 100%;
  }

  .page {
    justify-content: flex-start;
  }

  .spacer {
    width: 1px;
    height: 2rem;
  }
</style>
