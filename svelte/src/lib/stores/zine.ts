import { writable } from 'svelte/store';
import { ZineService } from '$services/pbc/zine.service';

const createZineStore = () => {
	const { subscribe, set } = writable([]);

	const fetch = async () => {
		try {
			const zines = await ZineService.getZines();
			set(zines);
			return zines;
		} catch (error) {
			console.error(`failed to sync $zines via remote`, error);
		}
	};

	const create = async ({ threeLetterCode, title }) => {
		try {
			const createdZine = await ZineService.createZine({
				id: null,
				threeLetterCode,
				title,
				inUse: true
			});
			fetch();
			return createdZine;
		} catch (error) {
			console.error(
				`failed to create new zine for $zines via remote using data: ${JSON.stringify({
					threeLetterCode,
					title
				})}`, error
			);
		}
	};

	return {
		subscribe,
		set,

		fetch,
		create
	};
};

export const zines = createZineStore();
zines.fetch();
