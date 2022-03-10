<script lang="ts" context="module">
	export function load({ params }) {
		const { inmateId } = params;
		return { props: { inmateId } };
	}
</script>

<script lang="ts">
	import Modal from '$lib/components/modal.svelte';
	import EditInmate from '$lib/components/inmate/edit.svelte';
	import PackageOverview from '$lib/components/package/overview.svelte';
	import EditPackage from '$lib/components/package/edit.svelte';
	import AddZine from '$lib/components/package/zine/add.svelte';
	import PackageAlert from '$lib/components/package/alert.svelte';

	import { focusedInmate, focusedInmatePackages } from '$lib/stores/inmate';
	import { newPackage } from '$lib/stores/package';

	import { isInmateNoID } from '$lib/services/pbc-service/inmate.service';
	import type { Package } from '$lib/services/pbc-service/models/package';

	import editIcon from '$lib/assets/icons/edit.png';
	import printIcon from '$lib/assets/icons/print.png';

	export let inmateId: string;

	enum VALID_MODAL {
		EDIT_INMATE = 'edit_inmate',

		OVERVIEW_PACKAGE = 'overview_package',
		EDIT_PACKAGE = 'edit_package',

		ADD_ZINE = 'add_zine',

		VIEW_ALERT = 'view_alert'
	}

	let isModalVisible = false;
	let activeModal: VALID_MODAL;

	focusedInmate.fetch(inmateId);

	const presentModal = (modal: VALID_MODAL) => {
		activeModal = modal;
		isModalVisible = true;
	};
	const closeModal = () => {
		isModalVisible = false;
	};
	const refresh = (inmate) => {
		inmateId = inmate.id;
		focusedInmate.fetch(inmateId);
		closeModal();
	};

	const presentAlertModal = (pbcPackage: Package) => {
		newPackage.load(pbcPackage);
		presentModal(VALID_MODAL.VIEW_ALERT);
	};
	const presentCreatePackageModal = () => {
		presentModal(VALID_MODAL.OVERVIEW_PACKAGE);
	};
	const presentEditPackageModal = (pbcPackage: Package) => {
		newPackage.load(pbcPackage);
		presentModal(VALID_MODAL.EDIT_PACKAGE);
	};
</script>

{#if $focusedInmate.id}
	<main>
		<Modal bind:visible={isModalVisible}>
			{#if activeModal == VALID_MODAL.EDIT_INMATE}
				<EditInmate
					id={inmateId}
					on:update={(e) => refresh(e.detail)}
					on:error={(e) => console.error(e.detail)}
				/>
			{:else if activeModal == VALID_MODAL.OVERVIEW_PACKAGE}
				<PackageOverview on:add-zines={() => presentModal(VALID_MODAL.ADD_ZINE)} />
			{:else if activeModal == VALID_MODAL.EDIT_PACKAGE}
				<EditPackage
					on:update={() => refresh($focusedInmate)}
					on:error={(e) => console.error(e.detail)}
					on:add-items={() => presentCreatePackageModal()}
					on:reject={() => presentAlertModal($newPackage)}
				/>
			{:else if activeModal == VALID_MODAL.ADD_ZINE}
				<AddZine
					on:add-zines={() => presentCreatePackageModal()}
					on:cancel={() => presentCreatePackageModal()}
				/>
			{:else if activeModal == VALID_MODAL.VIEW_ALERT}
				<PackageAlert
					on:update={(_) => refresh($focusedInmate)}
					on:error={(e) => console.error(e.detail)}
				/>
			{/if}
		</Modal>

		<div id="inmate-name">
			<h1 id="" aria-label="Inmate's first and last name, and inmate ID if available">
				{#if isInmateNoID($focusedInmate)}
					{$focusedInmate.firstName}
					{$focusedInmate.middleInitial
						? $focusedInmate.middleInitial + '. '
						: ''}{$focusedInmate.lastName}
					- <span>{$focusedInmate.location}</span>
				{:else}
					{$focusedInmate.firstName}
					{$focusedInmate.middleInitial
						? $focusedInmate.middleInitial + '. '
						: ''}{$focusedInmate.lastName}&ensp;
					<span>ID#{$focusedInmate.id}</span>
				{/if}

				<img
					src={editIcon}
					class="editIcon"
					width="20"
					height="20"
					alt="edit icon; click to edit inmate information"
					on:click={() => presentModal(VALID_MODAL.EDIT_INMATE)}
				/>
			</h1>
		</div>

		<button
			class="button-success"
			on:click={() => {
				newPackage.reset();
				presentCreatePackageModal();
			}}
		>
			Add a <strong><u>new package</u></strong> (books or zines)
		</button>

		{#await $focusedInmatePackages then packages}
			{#if packages.length === 0}
				<h2 class="no-packages-message">
					No packages have been created for {$focusedInmate.firstName}
					{$focusedInmate.lastName} yet
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
									<abbr
										class="alert"
										title={pbcPackage.alert.information}
										on:click={() => presentAlertModal(pbcPackage)}
									>
										!
									</abbr>
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
									on:click={() => presentEditPackageModal(pbcPackage)}
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
	</main>
{/if}

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
	.editIcon,
	.printIcon {
		cursor: pointer;
	}
</style>
