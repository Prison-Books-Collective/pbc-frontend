<script lang="ts">
	import { isEmpty } from '$util/strings';
	import { stringify, type Package } from '$models/pbc/package';

	type Mode = 'any' | 'all' | 'none';
	const defaultFn = (packages: Package[]) => packages;

	export let fn = defaultFn;

	let mode: Mode = 'any';
	let keywordInput: string = '';
	let keywords: string[] = [];

	const addKeyword = (keyword: string) => {
		keywordInput = '';
		keyword = keyword.trim().toLowerCase();
		if (!keywords.includes(keyword)) keywords = [...keywords, keyword];
	};

	const removeKeyword = (index: number) => {
		keywords.splice(index, 1);
		keywords = keywords;
	};

	const shouldDisableAddKeyword = (keyword: string) => isEmpty(keyword);

	const getFilterFn = (mode: Mode, keywords: string[]) => {
		if (!keywords || keywords.length === 0) return defaultFn;
		if (mode === 'any') {
			return (packages: Package[]) =>
				packages.filter((p) => {
					const packageString = stringify(p);
					for (let keyword of keywords) {
						if (packageString.includes(keyword)) return true;
					}
					return false;
				});
		}
		if (mode === 'none') {
			return (packages: Package[]) =>
				packages.filter((p) => {
					const packageString = stringify(p);
					for (let keyword of keywords) {
						if (packageString.includes(keyword)) return false;
					}
					return true;
				});
		}
		return (packages: Package[]) =>
			packages.filter((p) => {
				const packageString = stringify(p);
				for (let keyword of keywords) {
					if (!packageString.includes(keyword)) return false;
				}
				return true;
			});
	};

	$: fn = getFilterFn(mode, keywords);
</script>

<section class="filter-options">
	<label for="any-keywords" class="checkbox outline font-normal">
		<input id="any-keywords" name="any-keywords" type="radio" value="any" bind:group={mode} />
		Contains <span class="any">Any</span> of the Keywords
	</label>
	<label for="all-keywords" class="checkbox outline font-normal">
		<input id="all-keywords" name="all-keywords" type="radio" value="all" bind:group={mode} />
		Contains <span class="all">All</span> of the Keywords
	</label>
	<label for="remove-keywords" class="checkbox outline font-normal">
		<input
			id="remove-keywords"
			name="remove-keywords"
			type="radio"
			value="none"
			bind:group={mode}
		/>
		<strong>Remove</strong> the Keywords
	</label>
</section>

<form on:submit|preventDefault={() => addKeyword(keywordInput)}>
	<label for="keyword-input">
		Keyword
		<span class="light-text">
			(<em>All or part of: Author, Title, ISBN, Inmate Name, etc.</em>)
		</span>
	</label>
	<div class="input-group">
		<input id="keyword-input" type="text" bind:value={keywordInput} placeholder="Keyword" />
		<button
			class="button-success slim"
			type="submit"
			disabled={shouldDisableAddKeyword(keywordInput)}
		>
			Add
		</button>
	</div>
</form>

{#if keywords && keywords.length > 0}
	<section class="inner-window">
		{#each keywords as keyword, index}
			<span class="chip">
				{keyword}
				<button class="chip-close" on:click={() => removeKeyword(index)}>&times;</button>
			</span>
		{/each}
	</section>
{/if}

<style>
	form {
		display: contents;
	}

	input[type='text'] {
		width: auto;
		flex-basis: 100%;
	}

	.input-group {
		display: flex;
		flex-flow: row nowrap;
		justify-content: stretch;
		align-items: baseline;
		gap: 1rem;
		margin-top: -0.5rem;
		margin-bottom: 1rem;
	}

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
</style>
