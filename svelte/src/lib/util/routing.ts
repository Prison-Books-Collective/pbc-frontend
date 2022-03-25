import { goto } from '$app/navigation';
import { InmateService } from '$services/pbc/inmate.service';
import { focusedInmate } from '$stores/inmate';
import { ERROR_MESSAGE_SERVER_COMMUNICATION } from '$util/error';
import { delay } from '$util/time';
import type { Package } from '$models/pbc/package';
import { isEmpty } from '$util/strings';

export enum VALID_HOMEPAGE_SEARCH {
	ID = 'id',
	NAME = 'name'
}

export enum INMATE_SEARCH_MODE {
	CREATE = 'create',
	DISAMBIGUATION = 'disambiguation'
}

export const ROUTE_PACKAGES_FOR_INMATE = (inmateID) => `/packages/${inmateID}`;
export const ROUTE_INMATE_CREATE_NAMED = ({ firstName, lastName }) =>
	`/create/inmate?firstName=${firstName}&lastName=${lastName}`;
export const ROUTE_INMATE_CREATE_ID = (inmateID) => `/create/inmate?id=${inmateID}`;
export const ROUTE_INMATE_SEARCH = ({ firstName, lastName }) =>
	`/search/inmates?firstName=${firstName}&lastName=${lastName}`;
export const ROUTE_INVOICE = (packageID) => `/invoice/${packageID}`
export const ROUTE_PRINT_INVOICE = (packageID) => `/invoice/${packageID}?print=true`

export const gotoSearchForInmate = async (
	searchBy: VALID_HOMEPAGE_SEARCH,
	{ id, firstName, lastName }
) => {
	if (searchBy === VALID_HOMEPAGE_SEARCH.ID) {
		return searchForInmateByID(id);
	} else if (searchBy === VALID_HOMEPAGE_SEARCH.NAME) {
		return searchForInmatesByName({ firstName, lastName });
	}
};

const searchForInmateByID = async (id) => {
	if (id === null) return;
	try {
		const foundInmate = await InmateService.getInmate(id);
		if (foundInmate) {
			focusedInmate.set(foundInmate);
			return goto(ROUTE_PACKAGES_FOR_INMATE(id));
		}

		const shouldCreateNewInmate = confirm(
			`Failed to find any inmates with ID#${id}. To create a new inmate, click OK`
		);
		if (shouldCreateNewInmate) return goto(ROUTE_INMATE_CREATE_ID(id));
	} catch (error) {
		alert(ERROR_MESSAGE_SERVER_COMMUNICATION);
		console.error(error);
	}
};

const searchForInmatesByName = async ({ firstName, lastName }) => {
	if (isEmpty(firstName) && isEmpty(lastName)) return;

	try {
		const foundInmates = await InmateService.getAllInmatesByName({
			firstName,
			lastName
		});
		if (foundInmates && foundInmates.length > 0)
			return goto(ROUTE_INMATE_SEARCH({ firstName, lastName }));

		const shouldCreateNewInmate = confirm(
			`Failed to find any inmates matching name "${[firstName, lastName].filter(x => !isEmpty(x)).join(' ')}". To create a new inmate, click OK`
		);
		if (shouldCreateNewInmate) {
			return goto(ROUTE_INMATE_CREATE_NAMED({ firstName, lastName }));
		}
	} catch (error) {
		alert(ERROR_MESSAGE_SERVER_COMMUNICATION);
		console.error(error);
	}
};

export const printPackage = async (pbcPackage: Package) => {
	const printWindow = window.open(
		ROUTE_PRINT_INVOICE(pbcPackage.id), 
		'title', 
		'attributes'
	);
	
	printWindow.focus();
	await delay(3500);
	printWindow.document.close();
	printWindow.close();
};
