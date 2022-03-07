<script lang="ts">
	import { ZineService } from '$lib/services/pbc-service/zine.service';
	import type { Zine } from '$lib/services/pbc-service/models/zine';
	import { ERROR_MESSAGE_SERVER_COMMUNICATION } from '$lib/util/error';

	let newZine: Zine = {
		id: null,
		threeLetterCode: null,
		title: null,
		inUse: null
	};

	let getZines = ZineService.getZines();

	const canAddZine = (zine) => {
		return (
			!!zine.threeLetterCode &&
			zine.threeLetterCode !== '' &&
			zine.threeLetterCode.length < 5 &&
			!!zine.title &&
			zine.title !== ''
		);
	};

	const createZine = async () => {
		try {
			const createdZine = await ZineService.createZine(newZine);
			newZine = {
				id: null,
				threeLetterCode: null,
				title: null,
				inUse: null
			};

			alert(`Successfully added new Zine "${createdZine.threeLetterCode} - ${createdZine.title}"`);
			getZines = ZineService.getZines();
		} catch (error) {
			alert(ERROR_MESSAGE_SERVER_COMMUNICATION);
			console.error(error);
		}
	};
</script>

<main>
	<section>
		<h1>Zines</h1>

		<h2>Add New Zine</h2>
		<form id="newZineForm" on:submit|preventDefault={createZine}>
			<label for="three-letter-code">
				Three Letter Code:
				<input
					type="text"
					name="three-letter-code"
					id="three-letter-code"
					bind:value={newZine.threeLetterCode}
				/>
			</label>

			<label for="title">
				Title:
				<input type="text" name="title" id="title" bind:value={newZine.title} />
			</label>

			<button disabled={!canAddZine(newZine)}>Add Zine</button>
		</form>

		<details>
			<summary> All Zines </summary>

			<div>
				{#await getZines then zines}
					<ul>
						{#each zines as zine}
							<li>
								<strong>{zine.threeLetterCode}</strong> -
								{zine.title}
							</li>
						{/each}
					</ul>
				{/await}
			</div>
		</details>
	</section>
</main>

<style lang="scss">
	h1 {
		font-size: 2rem;
		text-align: center;
	}

	h2,
	summary {
		font-weight: 600;
		font-size: 1.25rem;
		color: darkslategray;
		text-align: center;
	}

	main {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
	}

	section[role='Manage Zines'] {
		display: flex;
		flex-flow: column nowrap;
		max-width: calc(100vw - 2rem);
		width: 100%;
	}

	#newZineForm {
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: center;
		text-align: right;
		margin-bottom: 3em;

		label {
			width: 40ch;
		}

		input {
			width: 30ch;
		}
	}

	details,
	summary {
		outline: none;
	}
</style>
