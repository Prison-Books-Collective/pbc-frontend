import { METHOD_GET, METHOD_POST, METHOD_PUT } from '$lib/util/web';
import { BASE_PBC_URI } from './index';
import type { Inmate, InmateNoID } from './models/inmate';
import type { Facility } from './models/facility';

export class InmateService {
	public static readonly URI_GET_INMATE = (inmateId: string) =>
		`${BASE_PBC_URI}/getInmate?id=${inmateId}`;
	public static readonly URI_GET_INMATE__NO_ID__BY_DATABASE_ID = (databaseId: string | number) =>
		`${BASE_PBC_URI}/getInmateNoIDByDatabaseID?id=${databaseId}`;
	public static readonly URI_GET_INMATE__NO_ID__BY_NAME = ({
		firstName,
		lastName
	}: {
		firstName: string;
		lastName: string;
	}) => `${BASE_PBC_URI}/getInmateNoID?firstName=${firstName}&lastName=${lastName}`;
	public static readonly URI_CREATE_INMATE = ({
		firstName,
		lastName,
		inmateId
	}: {
		firstName: string;
		lastName: string;
		inmateId: string;
	}) => `${BASE_PBC_URI}/addInmate?firstName=${firstName}&lastName=${lastName}&id=${inmateId}`;
	public static readonly URI_CREATE_INMATE__NO_ID = ({
		firstName,
		lastName,
		location
	}: {
		firstName: string;
		lastName: string;
		location: string;
	}) =>
		`${BASE_PBC_URI}/addInmateNoID?firstName=${firstName}&lastName=${lastName}&location=${location}`;
	public static readonly URI_UPDATE_INMATE = ({
		initialId,
		firstName,
		lastName,
		inmateId
	}: {
		initialId: string;
		firstName: string;
		lastName: string;
		inmateId: string;
	}) =>
		`${BASE_PBC_URI}/updateInmate?originalId=${initialId}&firstName=${firstName}&lastName=${lastName}&id=${inmateId}`;

	public static async getInmate(inmateId: string): Promise<Inmate | null> {
		const response = await fetch(this.URI_GET_INMATE(inmateId), { ...METHOD_GET });

		if (response.status === 204) return null;
		if (response.status !== 200) {
			throw new Error(
				`unexpected response ${
					response.status
				} when searching for inmate with ID "${inmateId}" at "${this.URI_GET_INMATE(inmateId)}"`
			);
		}

		return (await response.json()) as Inmate;
	}

	public static async getInmateNoIdByDatabaseID(databaseId: string | number): Promise<InmateNoID> {
		const response = await fetch(this.URI_GET_INMATE__NO_ID__BY_DATABASE_ID(databaseId), {
			...METHOD_GET
		});

		if (response.status !== 200) {
			throw new Error(
				`unexpected response ${
					response.status
				} when searching for no-ID inmate with database-ID "${databaseId}" at "${this.URI_GET_INMATE__NO_ID__BY_DATABASE_ID(
					databaseId
				)}"`
			);
		}

		return (await response.json()) as InmateNoID;
	}

	public static async getInmateNoIdByName({
		firstName,
		lastName
	}: {
		firstName: string;
		lastName: string;
	}): Promise<InmateNoID[]> {
		const response = await fetch(this.URI_GET_INMATE__NO_ID__BY_NAME({ firstName, lastName }), {
			...METHOD_GET
		});

		if (response.status !== 200) {
			throw new Error(
				`unexpected response ${
					response.status
				} when searching for no-ID inmate with name "${lastName}, ${firstName}" at "${this.URI_GET_INMATE__NO_ID__BY_NAME(
					{ firstName, lastName }
				)}"`
			);
		}

		return (await response.json()) as InmateNoID;
	}

	public static async createInmate({
		firstName,
		lastName,
		inmateId
	}: {
		firstName: string;
		lastName: string;
		inmateId: string;
	}): Promise<Inmate> {
		const response = await fetch(this.URI_CREATE_INMATE({ firstName, lastName, inmateId }), {
			...METHOD_POST
		});

		if (response.status !== 200) {
			throw new Error(
				`unexpected response ${response.status} when creating inmate at "${this.URI_CREATE_INMATE({
					firstName,
					lastName,
					inmateId
				})}" with details: ${JSON.stringify({ firstName, lastName, inmateId })}`
			);
		}

		return (await response.json()) as Inmate;
	}

	public static async createInmateNoID({
		firstName,
		lastName,
		location
	}: {
		firstName: string;
		lastName: string;
		location: Facility;
	}): Promise<Inmate> {
		const response = await fetch(
			this.URI_CREATE_INMATE__NO_ID({ firstName, lastName, location: location.facility_name }),
			{ ...METHOD_POST }
		);

		if (response.status !== 200) {
			throw new Error(
				`unexpected response ${
					response.status
				} when creating no-ID inmate at "${this.URI_CREATE_INMATE__NO_ID({
					firstName,
					lastName,
					location: location.facility_name
				})}" with details: ${JSON.stringify({ firstName, lastName, location })}`
			);
		}

		return (await response.json()) as InmateNoID;
	}

	public static async updateInmate({
		initialId,
		firstName,
		lastName,
		inmateId
	}: {
		initialId: string;
		firstName: string;
		lastName: string;
		inmateId: string;
	}): Promise<Inmate> {
		const response = await fetch(
			this.URI_UPDATE_INMATE({ initialId, firstName, lastName, inmateId }),
			{ ...METHOD_PUT }
		);

		if (response.status !== 200) {
			throw new Error(
				`unexpected response ${response.status} when updating inmate at "${this.URI_UPDATE_INMATE({
					initialId,
					firstName,
					lastName,
					inmateId
				})}" with details: ${JSON.stringify({ firstName, lastName, inmateId })}`
			);
		}

		return (await response.json()) as Inmate;
	}
}
