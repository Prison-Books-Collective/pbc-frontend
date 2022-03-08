<script lang="ts">
	import { ZineService } from '$lib/services/pbc-service/zine.service';
	import { FacilityService } from '$lib/services/pbc-service/facility.service';
	import type { Zine } from '$lib/services/pbc-service/models/zine';
	import type { Facility } from '$lib/services/pbc-service/models/facility';
	import { FacilityType, State } from '$lib/services/pbc-service/models/facility';
	import { ERROR_MESSAGE_SERVER_COMMUNICATION } from '$lib/util/error';

	let newZine: Zine = {
		id: null,
		threeLetterCode: null,
		title: null,
		inUse: null
	};

	let newFacility: Facility = {
		id: null,
		facility_name: null,
		state: null,
		facility_type: null
	};

	let getZines = ZineService.getZines();
	let getFacilities = FacilityService.getAllFacilities();

	const canAddZine = (zine) => {
		return (
			!!zine.threeLetterCode &&
			zine.threeLetterCode !== '' &&
			zine.threeLetterCode.length < 5 &&
			!!zine.title &&
			zine.title !== ''
		);
	};

	const canAddFacility = (facility) => {
		return (
			!!facility.state &&
			!!facility.facility_name &&
			facility.facility_name !== '' &&
			!!facility.facility_type
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

	const createFacility = async () => {
		try {
			const createdFacility = await FacilityService.createFacility(newFacility);
			newFacility = {
				id: null,
				facility_name: null,
				facility_type: null,
				state: null
			};

			alert(
				`Successfully added new Facility "[${createdFacility.state}] ${createdFacility.facility_name} - ${createdFacility.facility_type}"`
			);
			getFacilities = FacilityService.getAllFacilities();
		} catch (error) {
			alert(ERROR_MESSAGE_SERVER_COMMUNICATION);
			console.error(error);
		}
	};
</script>

<main>
	<section>
		<h2>Zines</h2>

		<h3>Add New Zine</h3>
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
			<summary>All Zines</summary>

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

	<section>
		<h2>Facilities</h2>

		<h3>Add New Facility</h3>
		<form id="newFacilityForm" on:submit|preventDefault={createFacility}>
			<label for="facility-name">
				Facility Name:
				<input
					type="text"
					name="facility-name"
					id="facility-name"
					bind:value={newFacility.facility_name}
				/>
			</label>

			<select bind:value={newFacility.state}>
				<option disabled selected value={null}>State of Operation</option>
				{#each Object.values(State) as s}
					<option value={s}>{s}</option>
				{/each}
			</select>

			<select bind:value={newFacility.facility_type}>
				<option disabled selected value={null}>Facility Type</option>
				{#each Object.values(FacilityType) as f}
					<option value={f}>{f}</option>
				{/each}
			</select>

			<button disabled={!canAddFacility(newFacility)}>Add Facility</button>
		</form>

		<details>
			<summary> All Facilities </summary>

			<div>
				{#await getFacilities then facilities}
					<ul>
						{#each facilities as facility}
							<li>
								[{facility.state}] {facility.facility_name} &mdash; {facility.facility_type}
							</li>
						{/each}
					</ul>
				{/await}
			</div>
		</details>
	</section>
</main>

<style lang="scss">
	h2 {
		font-size: 2rem;
		text-align: center;
	}

	h3,
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

	section {
		display: flex;
		flex-flow: column nowrap;
		max-width: calc(100vw - 2rem);
		width: 100%;
	}

	form {
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

	select {
		width: 40ch;
	}

	details,
	summary {
		outline: none;
	}
</style>
