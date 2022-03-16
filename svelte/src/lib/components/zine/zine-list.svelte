<script lang="ts">
	import { zines } from '$lib/stores/zine';
	import Zine from '$lib/components/zine/zine.svelte';
</script>

<details>
	<summary>All Zines</summary>

	<div>
		<ul>
			{#each $zines as zine}
				<li>
					<Zine {zine} />
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
		width: 100%;
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
