<script lang="ts" context="module">
	import { formatDate } from '$util/time';
	import { getQueryParam } from '$util/web';
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
	import { focusedPackage, focusedPackages } from '$stores/package';
	import { printPackage } from '$util/routing';
	import { isEmpty } from '$util/strings';
	import { ValidCreatePackageModal } from '$models/create-package-modal';
	import { resolveInmate, type Package } from '$models/pbc/package';
	import type { Book } from '$models/pbc/book';

	import filterIcon from '$assets/icons/filter.png';
	import PackageTable from '$lib/components/package/package-table.svelte';
	import CreatePackageModal from '$components/package/create-package-modal.svelte';
	import FilterPackages from '$components/package/search/filter/filter-packages.svelte';

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
	let loading = true;

	let showFilters = false;
	let shouldFilter = false;
	let filteredPackages = [];

	$: {
		loadPackages(searchMode);
		[date, startDate, endDate, isbn, author, title];
	}

	const doneLoading = () => {
		loading = false;
	};

	const findBook = (searchMode) => (packages) => {
		if (packages && packages.length > 0) {
			let p = packages[0];
			if (searchMode === SearchMode.AUTHOR_AND_TITLE && p.noISBNBooks && p.noISBNBooks.length > 0) {
				const matchingBook = p.noISBNBooks.find(
					(book) =>
						book.authors
							.map((s) => s.toLowerCase())
							.join(',')
							.includes(author.toLowerCase()) &&
						book.title.toLowerCase().includes(title.toLowerCase())
				);
				if (matchingBook) {
					book = matchingBook;
					return;
				}
			}

			if (searchMode === SearchMode.AUTHOR_AND_TITLE) {
				const matchingBook = p.books.find(
					(book) =>
						book.authors
							.map((s) => s.toLowerCase())
							.join(',')
							.includes(author.toLowerCase()) &&
						book.title.toLowerCase().includes(title.toLowerCase())
				);
				if (matchingBook) {
					book = matchingBook;
					return;
				}
			}

			if (searchMode === SearchMode.ISBN) {
				const matchingBook = p.books.find((book) => book.isbn10 === isbn || book.isbn13 === isbn);
				if (matchingBook) {
					book = matchingBook;
					return;
				}
			}
		}
	};

	const loadPackages = (searchMode: SearchMode) => {
		switch (searchMode) {
			case SearchMode.DATE:
				focusedPackages.fetchForDate(date).then(doneLoading);
				loading = true;
				break;
			case SearchMode.DATE_RANGE:
				focusedPackages.fetchForDateRange(startDate, endDate).then(doneLoading);
				loading = true;
				break;
			case SearchMode.ISBN:
				if (!isEmpty(isbn)) {
					focusedPackages.fetchForISBN(isbn).then(findBook(searchMode)).then(doneLoading);
					loading = true;
				}
			case SearchMode.AUTHOR_AND_TITLE:
				if (!isEmpty(author) && !isEmpty(title)) {
					focusedPackages
						.fetchForAuthorAndTitle(author, title)
						.then(findBook(searchMode))
						.then(doneLoading);
					loading = true;
				}
		}
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

	<FilterPackages
		visible={showFilters}
		packages={$focusedPackages}
		on:update={({ detail }) => (filteredPackages = detail)}
		on:should-filter={({ detail }) => (shouldFilter = detail)}
	/>

	{#if loading}
		<h2>Loading</h2>
	{:else}
		<PackageTable
			packages={shouldFilter ? filteredPackages : $focusedPackages}
			on:edit={({ detail: pbcPackage }) => presentEditPackageModal(pbcPackage)}
			on:print={({ detail: pbcPackage }) => printPackage(pbcPackage)}
			on:alert={({ detail: pbcPackage }) => presentAlertModal(pbcPackage)}
		/>
	{/if}
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

	input[type='date'] {
		flex-basis: 10rem;
	}

	input[type='date']:last-of-type {
		margin-left: 1rem;
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

	.book-title {
		font-style: italic;
		color: #333;
	}

	.book-author {
		color: #333;
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
</style>
