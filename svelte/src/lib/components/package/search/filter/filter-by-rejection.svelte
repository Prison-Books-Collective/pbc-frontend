<script lang="ts">
	import type { Package } from '$models/pbc/package';

	type Mode = 'only' | 'remove';
	const defaultFn = (packages: Package[]) => packages;

	export let fn = defaultFn;

	let mode: Mode = 'only';

	const getFilterFn = (mode: Mode) => {
		return mode === 'only'
			? (packages: Package[]) => packages.filter((p) => p.alert)
			: (packages: Package[]) => packages.filter((p) => !p.alert);
	};

	$: fn = getFilterFn(mode);
</script>

<section class="filter-options">
	<label for="only-rejected" class="checkbox outline font-normal">
		<input id="only-rejected" name="only-rejected" type="radio" value="only" bind:group={mode} />
		<strong>Only</strong> Rejected Packages
	</label>
	<label for="remove-rejected" class="checkbox outline font-normal">
		<input
			id="remove-rejected"
			name="remove-rejected"
			type="radio"
			value="remove"
			bind:group={mode}
		/>
		<strong>Remove</strong> Rejected Packages
	</label>
</section>

<style>
	.filter-options {
		display: flex;
		flex-flow: row nowrap;
		justify-content: stretch;
		align-items: stretch;
		gap: 1rem;
	}
</style>
