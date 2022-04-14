<script lang="ts" context="module">
	import { formatDate } from '$util/time';
	import { getQueryParam } from '$lib/util/web';
	import { SearchMode } from '$models/search-packages-mode';

	export function load({ url }) {
		let searchMode: SearchMode = getQueryParam(url, 'search mode', 'search', 'mode') as SearchMode;

		const props = { searchMode };
		switch (searchMode) {
			case SearchMode.DATE:
				props['date'] = url.searchParams.get('date') || formatDate(new Date());
				break;
			case SearchMode.DATE_RANGE:
				props['startDate'] = getQueryParam(url, 'start date') || formatDate(new Date());
				props['endDate'] = getQueryParam(url, 'end date') || formatDate(new Date());
				break;
			case SearchMode.ISBN:
				props['isbn'] = url.searchParams.get('isbn') || null;
				break;
			case SearchMode.AUTHOR_AND_TITLE:
				props['author'] = url.searchParams.get('author') || null;
				props['title'] = url.searchParams.get('title') || null;
				break;
		}

		return { props };
	}
</script>

<script lang="ts">
	import { fade } from 'svelte/transition';
	import { focusedPackage, focusedPackages } from '$stores/package';
	import { printPackage } from '$util/routing';
	import { isEmpty } from '$util/strings';
	import { ValidCreatePackageModal } from '$models/create-package-modal';
	import { resolveInmate, stringify, type Package } from '$models/pbc/package';
	import type { Book } from '$models/pbc/book';

	import filterIcon from '$assets/icons/filter.png';
	import PackageTable from '$lib/components/package/table.svelte';
	import CreatePackageModal from '$components/package/create-package-modal.svelte';
	import FacilitySelect from '$components/facility/select.svelte';

	export let searchMode = SearchMode.DATE;

	export let date: string = formatDate(new Date());
	export let startDate: string = formatDate(new Date());
	export let endDate: string = formatDate(new Date());

	export let isbn = '';
	export let [author, title] = ['', ''];

	let activeModal: ValidCreatePackageModal;
	let activeModalParams = {};
	let selectedInmate = null;

	let book: Book;

	let showFilters = false;
	let filteredPackages = [];

	let filterByFacilities = false;
	let availableFacilities = [];
	let facilitiesLoaded = new Promise(() => {});
	let filterFacilities = [];

	let filterByZines = false;
	let availableZines = [];
	let filterZinesMode: 'all' | 'any' = 'any';
	let filterZinesList = [];

	let filterByKeyword = false;
	let filterKeywordMode: 'all' | 'any' = 'any';
	let filterKeywordList = [];
	let keywordInput = '';

	let filterByRejected = false;
	let filterRejectedMode: 'only' | 'remove' = 'only';

	$: {
		loadPackages(searchMode)
		;[date, startDate, endDate, isbn, author, title];
	}

	const findBook = (searchMode) => (packages) => {
		console.log('searching for the book')
		if(packages && packages.length > 0) {
			let p = packages[0];
			if(searchMode === SearchMode.AUTHOR_AND_TITLE && p.noISBNBooks && p.noISBNBooks.length > 0) {
				const matchingBook = p.noISBNBooks.find(book => book.authors.map(s => s.toLowerCase()).join(',').includes(author.toLowerCase()) && book.title.toLowerCase().includes(title.toLowerCase()));
				if(matchingBook) {
					book = matchingBook;
					return;
				}
			}

			if(searchMode === SearchMode.AUTHOR_AND_TITLE) {
				console.log('searching by author and title through book books')
				const matchingBook = p.books.find(book => book.authors.map(s => s.toLowerCase()).join(',').includes(author.toLowerCase()) && book.title.toLowerCase().includes(title.toLowerCase()));
				if(matchingBook) {
					book = matchingBook;
					return;
				}
			}

			if(searchMode === SearchMode.ISBN) {
				const matchingBook = p.books.find(book => book.isbn10 === isbn || book.isbn13 === isbn);
				console.log(matchingBook)
				if(matchingBook) {
					book = matchingBook;
					return;
				}
			}
		}
	}

	const nullFacility = {
		id: undefined,
		facility_name: ' No Facility Provided ',
		state: '',
		facility_type: ''
	};

	const loadPackages = (searchMode: SearchMode) => {
		switch (searchMode) {
			case SearchMode.DATE:
				focusedPackages.fetchForDate(date);
				break;
			case SearchMode.DATE_RANGE:
				focusedPackages.fetchForDateRange(startDate, endDate);
				break;
			case SearchMode.ISBN:
				if(!isEmpty(isbn)) {
					focusedPackages.fetchForISBN(isbn).then(findBook(searchMode));
				}
			case SearchMode.AUTHOR_AND_TITLE:
				if(!isEmpty(author) && !isEmpty(title)) {
					focusedPackages.fetchForAuthorAndTitle(author, title).then(findBook(searchMode));
				}
		}
	};
	const parsePackages = (packages: Package[]) => {
		availableFacilities = [];
		availableZines = [];
		packages.forEach((p) => {
			const facility = p.facility;
			const zines = p.zines;
			if (!facility && !availableFacilities.includes(nullFacility)) {
				availableFacilities.push(nullFacility);
			}
			if (facility && !availableFacilities.find((f) => f.id === facility.id)) {
				availableFacilities.push(facility);
			}
			if (zines && zines.length > 0) {
				zines.forEach((zine) => {
					if (!availableZines.find((z) => z.id === zine.id)) {
						availableZines.push(zine);
					}
				});
			}
		});

		availableFacilities.sort((a, b) => (a.facility_name < b.facility_name ? -1 : 1));
		availableZines.sort((a, b) => (a.threeLetterCode < b.threeLetterCode ? -1 : 1));
		facilitiesLoaded = Promise.resolve();
	};

	const selectInmate = (pbcPackage: Package) => {
		selectedInmate = resolveInmate(pbcPackage);
	};

	const presentEditPackageModal = (pbcPackage: Package) => {
		selectInmate(pbcPackage);
		focusedPackage.load(pbcPackage);
		activeModal = ValidCreatePackageModal.EDIT_PACKAGE;
	};

	const presentAlertModal = (pbcPackage: Package) => {
		selectInmate(pbcPackage);
		focusedPackage.load(pbcPackage);
		activeModal = ValidCreatePackageModal.VIEW_ALERT;
		activeModalParams = { packageId: pbcPackage.id };
	};

	const toggleShowFilters = () => (showFilters = !showFilters);

	const shouldDisableAddKeyword = (keyword) => isEmpty(keyword);

	const addKeyword = (keyword) => {
		keywordInput = '';
		keyword = keyword.trim().toLowerCase();
		if (!filterKeywordList.includes(keyword)) {
			filterKeywordList = [...filterKeywordList, keyword];
		}
	};

	const removeKeyword = (index) => {
		filterKeywordList.splice(index, 1);
		filterKeywordList = filterKeywordList;
	};

	$: if (shouldFilter()) {
		filteredPackages = $focusedPackages;

		if (filterByFacilities && filterFacilities && filterFacilities.length > 0) {
			filteredPackages = applyFacilityFilter(filteredPackages, filterFacilities);
		}
		if (filterByZines && filterZinesList && filterZinesList.length > 0) {
			filteredPackages = applyZineFilter(filteredPackages, filterZinesList, filterZinesMode);
		}
		if (filterByKeyword && filterKeywordList && filterKeywordList.length > 0) {
			filteredPackages = applyKeywordFilter(filteredPackages, filterKeywordList, filterKeywordMode);
		}
		if (filterByRejected) {
			filteredPackages = applyRejectionFilter(filteredPackages, filterRejectedMode)
		}
	}

	focusedPackages.subscribe(parsePackages);

	const applyFacilityFilter = (packages, filterFacilities) => {
		return packages.filter((p) => filterFacilities.find((f) => f.id === p.facility?.id));
	};

	const applyZineFilter = (packages, filterZinesList, filterZinesMode: 'any' | 'all') => {
		if (filterZinesMode === 'any') {
			return packages.filter((p) => {
				if (!p.zines || p.zines.length === 0) return false;
				for (let z of p.zines) {
					if (filterZinesList.find((fz) => fz.id === z.id)) return true;
				}
				return false;
			});
		} else {
			return packages.filter((p) => {
				if (!p.zines || p.zines.length === 0) return false;
				for (let fz of filterZinesList) {
					if (!p.zines.find((z) => fz.id === z.id)) return false;
				}
				return true;
			});
		}
	};

	const applyKeywordFilter = (packages, filterKeywordList, filterKeywordMode: 'any' | 'all') => {
		if (filterKeywordMode === 'any') {
			return packages.filter((p) => {
				const packageString = stringify(p);
				for (let keyword of filterKeywordList) {
					if (packageString.includes(keyword)) return true;
				}
				return false;
			});
		} else {
			return packages.filter((p) => {
				const packageString = stringify(p);
				for (let keyword of filterKeywordList) {
					if (!packageString.includes(keyword)) return false;
				}
				return true;
			});
		}
	};

	const applyRejectionFilter = (packages, rejectionFilterMode: 'only' | 'remove') => {
		return rejectionFilterMode === 'only'
			? packages.filter(p => p.alert)
			: packages.filter(p => !p.alert)
	}

	$: shouldFilter = () => {
		return filterByFacilities || filterByZines || filterByKeyword || filterByRejected;
	};

	const refresh = (searchMode: SearchMode) => {
		loadPackages(searchMode);
	};
</script>

<CreatePackageModal
	bind:activeModal
	bind:activeModalParams
	inmate={selectedInmate}
	on:refresh={() => refresh(searchMode)}
/>

<main class="svelte-page">
	{#if searchMode === SearchMode.DATE || searchMode === SearchMode.DATE_RANGE}
		<header id="date-header">
			<h2>Displaying results for &emsp;</h2>
			{#if searchMode === SearchMode.DATE}
				<input type="date" bind:value={date} max={new Date().toISOString().split('T')[0]} />
			{:else if searchMode === SearchMode.DATE_RANGE}
				<input type="date" bind:value={startDate} max={endDate} />
				<input
					type="date"
					bind:value={endDate}
					min={startDate}
					max={new Date().toISOString().split('T')[0]}
				/>
			{/if}

			<img
				src={filterIcon}
				class="icon filter-icon active"
				class:active={showFilters}
				width="20"
				height="20"
				alt="filter icon; click to filter the list of packages"
				on:click={toggleShowFilters}
			/>
		</header>
	{/if}

	{#if (searchMode === SearchMode.ISBN || searchMode === SearchMode.AUTHOR_AND_TITLE) && book}
		<header id="book-header">
			<h2>
				Displaying Packages containing
				<img
					src={filterIcon}
					class="icon filter-icon active"
					class:active={showFilters}
					width="20"
					height="20"
					alt="filter icon; click to filter the list of packages"
					on:click={toggleShowFilters}
				/>
			</h2>
			<h2> 
				<span class="book-title">{book.title}</span>
				<span class="book-text">&emsp;by&emsp;</span>
				<span class="book-author">{book.authors?.[0]}</span>
			</h2>
		</header>
	{/if}

	{#if showFilters}
		<section id="filters" transition:fade>
			<label for="facility-select" class="checkbox">
				<input type="checkbox" id="facility-select" bind:checked={filterByFacilities} />
				Filter by Facility
				{#if filterByFacilities}
					{#await facilitiesLoaded then}
						<FacilitySelect
							multiple
							disabled={!filterByFacilities}
							facilityList={availableFacilities}
							bind:multipleFacilities={filterFacilities}
						/>
					{/await}
				{/if}
			</label>

			<label for="zine-select" class="checkbox">
				<input type="checkbox" id="zine-select" bind:checked={filterByZines} />
				Filter by Zines
			</label>
			{#if filterByZines}
				<div class="options">
					<label for="any-zines" class="non-bold checkbox" class:disabled={!filterByZines}>
						<input
							type="radio"
							id="any-zines"
							value="any"
							disabled={!filterByZines}
							bind:group={filterZinesMode}
						/>
						Contains <strong class="any">Any</strong> of the Zines
					</label>
					<label for="all-zines" class="non-bold checkbox" class:disabled={!filterByZines}>
						<input
							type="radio"
							id="all-zines"
							value="all"
							disabled={!filterByZines}
							bind:group={filterZinesMode}
						/>
						Contains <strong class="all">All</strong> of the Zines
					</label>
				</div>

				<section class="keywords">
					{#each availableZines as zine}
						<label for={zine.id} class="zine-item checkbox">
							<input type="checkbox" id={zine.id} bind:group={filterZinesList} value={zine} />
							{zine.threeLetterCode} &mdash; {zine.title}
						</label>
					{/each}
				</section>
			{/if}

			<label for="keyword-select" class="checkbox">
				<input type="checkbox" id="keyword-select" bind:checked={filterByKeyword} />
				Filter by Keywords
			</label>

			{#if filterByKeyword}
				<div class="options">
					<label for="any-keywords" class="non-bold checkbox" class:disabled={!filterByKeyword}>
						<input
							type="radio"
							id="any-keywords"
							value="any"
							disabled={!filterByKeyword}
							bind:group={filterKeywordMode}
						/>
						Contains <strong class="any">Any</strong> of the Keywords
					</label>
					<label for="all-keywords" class="non-bold checkbox" class:disabled={!filterByKeyword}>
						<input
							type="radio"
							id="all-keywords"
							value="all"
							disabled={!filterByKeyword}
							bind:group={filterKeywordMode}
						/>
						Contains <strong class="all">All</strong> of the Keywords
					</label>
				</div>

				<form on:submit|preventDefault={() => addKeyword(keywordInput)}>
					<label for="keyword-input">
						Keyword <span class="light-text"
							>(<em>All or part of: Author, Title, ISBN, Inmate Name, etc.</em>)</span
						>
						<div class="options">
							<input
								id="keyword-input"
								type="text"
								bind:value={keywordInput}
								placeholder="Keyword"
							/>
							<button
								class="button-success"
								type="submit"
								disabled={shouldDisableAddKeyword(keywordInput)}>Add</button
							>
						</div>
					</label>
				</form>

				{#if filterKeywordList && filterKeywordList.length > 0}
					<section class="keywords">
						{#each filterKeywordList as keyword, index}
							<span class="chip">
								{keyword}
								<button class="chip-close" on:click={() => removeKeyword(index)}>&times;</button>
							</span>
						{/each}
					</section>
				{/if}
			{/if}

			<label for="rejected" class="checkbox">
				<input type="checkbox" id="rejected" bind:checked={filterByRejected}/>
				Filter by Rejection Status
			</label>

			{#if filterByRejected}
				<div class="options">
					<label for="only-rejected" class="non-bold checkbox" class:disabled={!filterByRejected}>
						<input
							type="radio"
							id="only-rejected"
							value="only"
							disabled={!filterByRejected}
							bind:group={filterRejectedMode}
						/>
						<strong>Only</strong> Rejected Packages
					</label>
					<label for="remove-rejected" class="non-bold checkbox" class:disabled={!filterByRejected}>
						<input
							type="radio"
							id="remove-rejected"
							value="remove"
							disabled={!filterByRejected}
							bind:group={filterRejectedMode}
						/>
						<strong>Remove</strong> Rejected Packages
					</label>
				</div>
			{/if}
		</section>
	{/if}

	<PackageTable
		packages={shouldFilter() ? filteredPackages : $focusedPackages}
		on:edit={({ detail: pbcPackage }) => presentEditPackageModal(pbcPackage)}
		on:print={({ detail: pbcPackage }) => printPackage(pbcPackage)}
		on:alert={({ detail: pbcPackage }) => presentAlertModal(pbcPackage)}
	/>
</main>

<style lang="scss">
	main {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: stretch;
		text-align: center;
	}

	h2 {
		text-align: center !important;
	}

	.non-bold {
		font-weight: normal;
	}

	#date-header {
		display: flex;
		flex-flow: row nowrap;
		align-items: baseline;
		justify-content: center;
		gap: 1rem;
	}

	#book-header {
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: center;
	}

	#filters {
		border-radius: 3px;
		max-width: 100vw;
		padding: 1rem;
		padding-bottom: 0px;
		border: solid 1px black;
		transition-duration: 0.3s;

		display: flex;
		flex-flow: column nowrap;
	}

	.book-title {
		font-style: italic;
		color: #333;
	}

	.book-author {
		color: #333;
	}

	.book-text {

	}

	input[type='date'] {
		flex-basis: 10rem;
	}

	input[type='date']:last-of-type {
		margin-left: 1rem;
	}

	.filter-icon {
		transition-duration: 0.3s;
		opacity: 0.5;
		cursor: pointer;
		margin-left: 1rem;

		&:hover {
			opacity: 0.9;
		}
	}

	.filter-icon.active {
		filter: invert(57%) sepia(89%) saturate(225%) hue-rotate(159deg) brightness(102%) contrast(93%);
		opacity: 1;
	}

	.all {
		text-decoration: underline;
	}

	.any {
		border-bottom: dotted 3px black;
	}

	label.disabled {
		opacity: 0.4;
	}

	[for^='any-'],
	[for^='all-'],
	[for^='only-'],
	[for^='remove-'] {
		border: 1px solid rgba(0, 0, 0, 0.3);
		border-radius: 3px;
		padding: 0.25rem;
	}

	input[type='text'] {
		width: auto;
		flex-basis: 100%;
	}

	.options {
		display: flex;
		flex-flow: row nowrap;
		justify-content: stretch;
		align-items: stretch;
		gap: 1rem;
	}

	.button-success {
		margin: 0px;
	}

	.keywords {
		display: flex;
		flex-flow: row wrap;
		justify-content: flex-start;
		padding: 1rem;
		border: 1px dashed rgba(0, 0, 0, 0.3);
		border-radius: 3px;
		margin-bottom: 1rem;
		gap: 1rem;

		max-height: 10rem;
		overflow-y: scroll;
	}

	.chip {
		background-color: #444;
		color: #eaeaea;
		padding: 0.5rem;
		padding-inline: 1.25rem;
		border-radius: 16px;
	}

	form {
		display: contents;
		margin-bottom: 0px;
	}

	.chip-close {
		margin: 0px;
		width: 1ch;
		padding: 0px;
		padding-inline: 15px;
		background: none;
		border: none;
		box-shadow: none;
		text-shadow: none;
		color: #eaeaea;
	}

	.light-text {
		font-weight: normal;
		opacity: 0.6;
	}

	.zine-item {
		margin: 0rem;
	}
</style>
