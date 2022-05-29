<script lang="ts">
  import type { Facility } from '$models/pbc/facility'

  export let facility: Facility = null
</script>

{#if facility}
  [{facility.state}] {facility.facility_name} &mdash; {facility.facility_type}
{/if}
