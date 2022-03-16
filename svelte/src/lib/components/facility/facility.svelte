<script lang="ts">
	import type { Facility } from '$lib/services/pbc-service/models/facility';

	export let facility: Facility = null;
</script>

{#if facility}
	[{facility.state}] {facility.facility_name} &mdash; {facility.facility_type}
{/if}
