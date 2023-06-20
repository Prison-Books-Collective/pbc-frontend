<script lang="ts">
  import { facilities } from '$stores/facility'
  import Facility from './facility.svelte'
</script>

<details class="outline">
  <summary>All Facilities</summary>

  <div>
    <ul>
      {#each $facilities as facility}
        <li>
          <Facility {facility} />
        </li>
      {/each}
    </ul>
  </div>
</details>

<style lang="scss">
  details,
  summary {
    outline: none;
  }

  summary {
    font-weight: 600;
    font-size: 1.25rem;
    color: var(--color-text-subtitle);
    text-align: center;
  }

  details {
    width: 100%;
    padding-top: 1rem;
    padding-bottom: 1rem;

    &[open] {
      max-height: 40ch;
      overflow-y: scroll;
    }
  }
</style>
