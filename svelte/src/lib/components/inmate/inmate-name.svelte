<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { focusedInmate } from '$lib/stores/inmate';
	import { isInmateNoID } from '$lib/services/pbc-service/inmate.service';
	import Modal from '$lib/components/modal.svelte';
	import EditInmate from '$lib/components/inmate/edit.svelte';
	import editIcon from '$lib/assets/icons/edit.png';

	const dispatch = createEventDispatcher();

	let isModalVisible = false;

	const refresh = (inmate) => {
		focusedInmate.set(inmate);
	};
	const presentModal = () => (isModalVisible = true);
	const closeModal = () => (isModalVisible = false);

	const onUpdate = (event) => {
		refresh(event.detail);
		closeModal();
		dispatch('update', event.detail);
	};
	const onError = (event) => dispatch('error', event.detail);
</script>

<Modal bind:visible={isModalVisible}>
	<EditInmate id={$focusedInmate.id} on:update={(e) => onUpdate(e)} on:error={(e) => onError(e)} />
</Modal>

<div id="inmate-name">
	<h1 aria-label="Inmate's first and last name, and inmate ID if available">
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
			class="icon"
			width="20"
			height="20"
			alt="edit icon; click to edit inmate information"
			on:click={presentModal}
		/>
	</h1>
</div>

<style lang="scss">
	#inmate-name {
		display: flex;
		flex-flow: row wrap;
		align-self: center;

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

	.icon {
		&:hover {
			opacity: 1;
			cursor: pointer;
		}
	}
</style>
