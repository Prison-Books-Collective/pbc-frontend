<script lang="ts">
	import { facilities } from '$stores/facility';
	import Facility from './facility.svelte';
</script>

<details>
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

<style>
	summary {
		font-weight: 600;
		font-size: 1.25rem;
		color: darkslategray;
		text-align: center;
	}

	details,
	summary {
		outline: none;
	}

	details {
		width: 100%;
		padding-top: 1rem;
		padding-bottom: 1rem;
		border-radius: 3px;
		border: 1px solid rgba(0, 0, 0, 0.3);
	}

	details[open] {
		max-height: 40ch;
		overflow-y: scroll;
	}
</style>
