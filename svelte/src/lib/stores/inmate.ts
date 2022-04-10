import { writable } from 'svelte/store';
import { InmateService, isInmateNoID } from '$services/pbc/inmate.service';
import { PackageService } from '$services/pbc/package.service';
import type { Package } from '$models/pbc/package';
import type { InmateNoID } from '$models/pbc/inmate';

interface LocalStorageInmate extends InmateNoID {
	[additionalFields: string]: any;
}

const emptyInmate: LocalStorageInmate = {
	id: null,

	firstName: null,
	middleInitial: null,
	lastName: null,

	packages: null,
	location: null
};

const emptyPackages: Package[] = []

const createFocusedInmate = () => {
	const { subscribe, set } = writable(emptyInmate);

	const fetch = async (id) => {
		try {
			const foundInmate = await InmateService.getInmateUnknownIdStatus(id)
			set(foundInmate);
			return foundInmate;
		} catch (error) {
			console.error(error);
			console.error(`failed to set store $focusedInmate via remote using ID "${id}"`);
			reset();
			return emptyInmate;
		}
	};

	const reset = () => set({ ...emptyInmate });

	return {
		subscribe,
		set,
		reset,
		fetch
	};
};

const createFocusedPackages = (focusedInmate: ReturnType<typeof createFocusedInmate>) => {
	const { subscribe, set } = writable(emptyPackages);

	focusedInmate.subscribe(async $inmate => {
		const packages = await (isInmateNoID($inmate)
			? PackageService.getPackagesForInmateNoID($inmate.id)
			: PackageService.getPackagesForInmate($inmate.id));
		set(packages);
	});

	const fetchForInmate = (inmateID: string) => {
		focusedInmate.fetch(inmateID)
	}
	
	return {
		subscribe,
		set,

		fetchForInmate,
	};
}

export const focusedInmate = createFocusedInmate();
export const focusedPackages = createFocusedPackages(focusedInmate);
