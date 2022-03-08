<script lang="ts" context="module">
	export function load({ params }) {
		const { inmateId } = params;
		return { props: { inmateId } };
	}
</script>

<script lang="ts">
	import Modal from '$lib/components/modal.svelte';
	import EditInmate from '$lib/components/inmate/edit.svelte';

	import { InmateService } from '$lib/services/pbc-service';
	import { PackageService } from '$lib/services/pbc-service/package.service';
	import type { Inmate, InmateNoID } from '$lib/services/pbc-service';

	import editIcon from '$lib/assets/icons/edit.png';
	import printIcon from '$lib/assets/icons/print.png';

	enum MODAL_VALUES {
		EDIT_INMATE = 'edit_inmate'
	}

	let isModalVisible = false;
	let modalContent = null;
	let modalProps = {};

	export let inmateId: string;
	export let getInmate: Promise<Inmate | InmateNoID> = new Promise(() => {});
	let showModal: MODAL_VALUES;

	const findInmate = async () => {
		const inmateWithID = await InmateService.getInmate(inmateId);
		if (inmateWithID) {
			getInmate = Promise.resolve(inmateWithID);
			return;
		}

		const inmateWithoutID = await InmateService.getInmateNoIdByDatabaseID(inmateId);
		if (inmateWithoutID) {
			getInmate = Promise.resolve(inmateWithoutID);
			return;
		}
	};

	findInmate();

	const isInmateWithID = (inmate: Partial<InmateNoID>) => {
		return !!!inmate.location;
	};

	$: getPackages = getInmate.then((inmate) => {
		if (isInmateWithID(inmate)) {
			return PackageService.getPackagesForInmate(inmate.id);
		} else {
			return PackageService.getPackagesForInmateNoID(inmate.id);
		}
	});

	const closeModal = () => {
		isModalVisible = false;
	};
	const refresh = (inmate) => {
		inmateId = inmate.id;
		findInmate();
	};
	const presentEditInmateModal = () => {
		showModal = MODAL_VALUES.EDIT_INMATE;
		isModalVisible = true;
	};
</script>

<main>
	<Modal bind:visible={isModalVisible}>
		{#if showModal == MODAL_VALUES.EDIT_INMATE}
			<EditInmate
				id={inmateId}
				on:update={(e) => {
					refresh(e.detail);
					closeModal();
				}}
				on:error={(e) => console.error(e.detail)}
			/>
		{/if}
		<!-- Modal content will be programatically added here by modifying `isModalVisible` and `modalContent` -->
		<!-- <svelte:component this={modalContent} {...modalProps}></svelte:component> -->
	</Modal>

	{#await getInmate then inmate}
		<div id="inmate-name">
			<h1 id="" aria-label="Inmate's first and last name, and inmate ID if available">
				{#if isInmateWithID(inmate)}
					{inmate.firstName}
					{inmate.middleInitial ? inmate.middleInitial + '. ' : ''}{inmate.lastName}&ensp;
					<span>ID#{inmate.id}</span>
				{:else}
					{inmate.firstName}
					{inmate.middleInitial ? inmate.middleInitial + '. ' : ''}{inmate.lastName}
					- <span>{inmate.location}</span>
				{/if}

				<img
					src={editIcon}
					class="editIcon"
					width="20"
					height="20"
					alt="edit icon; click to edit inmate information"
					on:click={presentEditInmateModal}
				/>
			</h1>
		</div>

		<button id="new-package">
			Add a <strong><u>new package</u></strong> (books or zines)
		</button>

		{#await getPackages then packages}
			{#if packages.length === 0}
				<h2 class="no-packages-message">
					No packages have been created for {inmate.firstName}
					{inmate.lastName} yet
				</h2>
			{:else}
				<table id="packageTable">
					<tr>
						<th>!</th>
						<th>Package</th>
						<th>Edit</th>
						<th>Print</th>
					</tr>

					{#each packages as pbcPackage, index}
						<tr class:darkRow={!(index % 2)}>
							<td class="spacer-col">
								{#if pbcPackage.alert}
									<abbr class="alert" title={pbcPackage.alert.information}>!</abbr>
								{/if}
							</td>
							<td class="package-col">
								<h2>
									{#if pbcPackage.facility}
										<em class="facility-name">{pbcPackage.facility.facility_name}</em>,
									{/if}
									<date>
										{pbcPackage.date}:
									</date>
								</h2>
								<ul>
									{#each pbcPackage.books as book}
										<li>
											<em>{book.title}</em> &mdash; {book.authors.join(',')}
										</li>
									{/each}
									{#each pbcPackage.noISBNBooks as book}
										<li>
											<em>{book.title}</em> &mdash; {book.authors.join(',')}
										</li>
									{/each}
									{#each pbcPackage.zines as zine}
										<li>
											<strong>{zine.threeLetterCode}</strong> &mdash; {zine.title}
										</li>
									{/each}
								</ul>
							</td>
							<td class="edit-col">
								<img
									src={editIcon}
									alt="edit icon; click to edit this package"
									class="editIcon"
									width="20"
									height="20"
								/>
							</td>
							<td class="print-col">
								<img
									src={printIcon}
									alt="print icon; click to print this package"
									class="printIcon"
									width="20"
									height="20"
								/>
							</td>
						</tr>
					{/each}
				</table>
			{/if}
		{/await}
	{/await}
</main>

<style lang="scss">
	main {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: center;
	}

	#inmate-name {
		display: flex;
		flex-flow: row wrap;

		justify-content: space-between;
		align-items: center;

		h1 {
			font-size: 2rem;
			text-align: center;
			margin-bottom: 0;
		}

		span {
			color: darkslategray;
			font-weight: 700;
			font-size: 1.75rem;
		}
	}

	h2 {
		font-size: 1rem;
		margin-bottom: 0;
		margin-top: 0;
	}

	#new-package {
		background: darkseagreen;
	}

	.alert {
		cursor: pointer;
		text-decoration: underline;
		color: blue;
		width: 10px;
		text-align: center;
	}

	.no-packages-message {
		margin-top: 3em;
	}

	.facility-name {
		font-weight: normal;
	}

	.darkRow {
		background-color: gainsboro;
	}
	.spacer-col {
		padding: 10px 13px;
	}
	.package-col {
		padding-top: 10px;
		padding-bottom: 10px;
		padding-right: 15px;
		padding-left: 20px;
		text-align: left;
	}
	.edit-col {
		text-align: center;
		width: 40px;
	}
	.print-col {
		text-align: center;
		width: 40px;
	}
</style>
