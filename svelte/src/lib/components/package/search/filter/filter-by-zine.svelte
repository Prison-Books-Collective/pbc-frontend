<script lang="ts">
	import type { Package } from '$lib/models/pbc/package';
	import type { Zine } from '$lib/models/pbc/zine';

	type Mode = 'any' | 'all' | 'none';
	const defaultFn = (packages: Package[]) => packages;

	export let packages: Package[] = [];
	export let fn = defaultFn;

	let mode: Mode = 'any';
	let availableZines: Zine[] = [];
	let selectedZines: Zine[] = [];

	const parsePackages = (packages) => {
		packages.forEach((p) => {
			const zines = p.zines;
			if (zines && zines.length > 0) {
				zines.forEach((zine) => {
					if (!availableZines.find((z) => z.id === zine.id)) {
						availableZines.push(zine);
					}
				});
				availableZines.sort((a, b) => (a.threeLetterCode < b.threeLetterCode ? -1 : 1));
			}
		});
	};

	const getFilterFn = (mode: Mode, selectedZines: Zine[]) => {
		if (mode === 'none') {
			if (!selectedZines || selectedZines.length === 0)
				return (packages: Package[]) => packages.filter((p) => !p.zines || p.zines.length === 0);
			return (packages: Package[]) =>
				packages.filter((p) => {
					if (!p.zines || p.zines.length === 0) return true;
					for (let fz of selectedZines) {
						if (p.zines.find((z) => fz.id === z.id)) return false;
					}
					return true;
				});
		}

		if (mode === 'any') {
			if (!selectedZines || selectedZines.length === 0)
				return (packages: Package[]) => packages.filter((p) => p.zines && p.zines.length > 0);
			return (packages: Package[]) =>
				packages.filter((p) => {
					if (!p.zines || p.zines.length === 0) return false;
					for (let z of p.zines) {
						if (selectedZines.find((fz) => fz.id === z.id)) return true;
					}
					return false;
				});
		}

		if (!selectedZines || selectedZines.length === 0) return defaultFn;
		return (packages: Package[]) =>
			packages.filter((p) => {
				if (!p.zines || p.zines.length === 0) return false;
				for (let fz of selectedZines) {
					if (!p.zines.find((z) => fz.id === z.id)) return false;
				}
				return true;
			});
	};

	const isSelected = (zine: Zine) => selectedZines.includes(zine);

	const toggleSelection = (zine: Zine) => {
		if (!isSelected(zine)) {
			return (selectedZines = [...selectedZines, zine]);
		}
		const removeIndex = selectedZines.indexOf(zine);
		selectedZines.splice(removeIndex, 1);
		selectedZines = selectedZines;
	};

	$: parsePackages(packages);
	$: fn = getFilterFn(mode, selectedZines);
</script>

<section class="filter-options">
	<label for="any-zines" class="checkbox outline font-normal">
		<input id="any-zines" name="any-zines" type="radio" value="any" bind:group={mode} />
		Contains <span class="any">Any</span> of the Zines
	</label>
	<label for="all-zines" class="checkbox outline font-normal">
		<input id="all-zines" name="all-zines" type="radio" value="all" bind:group={mode} />
		Contains <span class="all">All</span> of the Zines
	</label>
	<label for="no-zines" class="checkbox outline font-normal">
		<input id="no-zines" name="no-zines" type="radio" value="none" bind:group={mode} />
		<strong>Does not</strong> contain Zines
	</label>
</section>

<section class="inner-window">
	{#each availableZines as zine}
		<label for={zine.id.toString()} class="checkbox item">
			{#key packages}
				<input
					type="checkbox"
					id={zine.id.toString()}
					value={zine}
					checked={isSelected(zine)}
					on:change={() => toggleSelection(zine)}
				/>
				{zine.threeLetterCode} &mdash; {zine.title}
			{/key}
		</label>
	{/each}
</section>

<style>
	.filter-options {
		display: flex;
		flex-flow: row nowrap;
		justify-content: stretch;
		align-items: stretch;
		gap: 1rem;
	}

	.all {
		font-weight: bold;
		text-decoration: underline;
	}

	.any {
		font-weight: bold;
		border-bottom: dotted 3px black;
	}

	.item {
		margin: 0px;
	}
</style>
