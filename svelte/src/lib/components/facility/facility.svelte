<script lang="ts">
  import type { Facility } from '$models/pbc/facility'

  export let facility: Facility = null
</script>

{#if facility}
  {facility.name} [{facility.state}]
{/if}
