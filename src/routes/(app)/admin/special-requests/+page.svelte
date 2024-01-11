<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData
</script>

<h1>Special Requests</h1>

{#each data.specialRequests as specialRequest}
  <div class="item">
    <!-- TODO: Add recipient information from json response -->
    <h2>Recipient</h2>
    <h3>letter mailed: {specialRequest.letterMailedDate}</h3>
    <p>book requested: {specialRequest.request}</p>
    <p>request opened: {specialRequest.specialRequestDate}</p>
    <p>status: {specialRequest.status}</p>
    <p>volunteer: {specialRequest.volunteerName}</p>

    <pre>{JSON.stringify(specialRequest, null, '  ')}</pre>
  </div>
{/each}

<style lang="scss">
  .item {
    border: solid 1px red;
  }
</style>
