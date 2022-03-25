<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { focusedPackage } from '$stores/package';
	import { PackageService } from '$services/pbc/package.service';

	const dispatch = createEventDispatcher();

	export let packageId = null;
	let packageLoaded = !!packageId
		? focusedPackage.fetch(packageId)
		: Promise.resolve($focusedPackage);

	packageLoaded.then((pbcPackage) => {
		console.log({ pbcPackage });
		if (!pbcPackage.alert) {
			focusedPackage.createAlert('');
		}
	});

	const saveAlert = async (pbcPackage) => {
		try {
			const packageUpdate = await PackageService.updatePackage({
				...pbcPackage,
				existsInDatabase: undefined
			});
			dispatch('update', packageUpdate);
		} catch (error) {
			dispatch('error', error);
			console.error('failed to save rejection log for package', error);
		}
	};

	const removeAlert = async (pbcPackage) => {
		try {
			const packageUpdate = await PackageService.updatePackage({
				...pbcPackage,
				alert: null,
				existsInDatabase: undefined
			});
			dispatch('update', packageUpdate);
		} catch (error) {
			dispatch('error', error);
			console.error('failed to save rejection log for package', error);
		}
	};
</script>

{#await packageLoaded then}
	<section class="alert-container">
		<h1>Package Rejection Details</h1>
		{#if $focusedPackage.alert && $focusedPackage.alert.id}
			<p>This package was rejected. You can update the rejection notes below:</p>
		{:else}
			<p>Enter details about the rejection to log below:</p>
		{/if}
		<form on:submit|preventDefault={() => saveAlert($focusedPackage)}>
			<textarea
				name="package-rejection"
				placeholder="Reason the package was rejected"
				cols="30"
				rows="10"
				bind:value={$focusedPackage.alert.information}
			/>

			<div class="form-options">
				<button
					class="log-button"
					disabled={!$focusedPackage.alert ||
						!$focusedPackage.alert.information ||
						$focusedPackage.alert.information === ''}>Log Rejection for Package</button
				>
				{#if $focusedPackage.alert && $focusedPackage.alert.id}
					<button
						type="button"
						class="button-danger clear-button"
						on:click={() => removeAlert($focusedPackage)}>Clear</button
					>
				{/if}
			</div>
		</form>
	</section>
{/await}

<style lang="scss">
	.alert-container {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: stretch;
		text-align: center;
	}
	.form-options {
		display: flex;
		flex-flow: row nowrap;
	}
	.log-button {
		flex: 3;
	}
	.clear-button {
		flex: 1;
		margin-left: 1em;
	}

	textarea {
		padding: 0.5em;
		width: 95%;
		max-width: auto;
		font-size: 1rem;
		background: none;
		border: 1px solid rgba(0, 0, 0, 0.3);
		border-radius: 3px;
	}

	button {
		margin: 0px;
		width: 100%;
	}
</style>
