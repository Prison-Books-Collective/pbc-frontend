import { CONTENT_TYPE_JSON, METHOD_GET, METHOD_POST } from '$lib/util/web';
import { BASE_PBC_URI } from './index';
import type { Facility } from './models/facility';

export class FacilityService {
	public static readonly URI_GET_FACILITIES = `${BASE_PBC_URI}/getAllFacilities`;
	public static readonly URI_CREATE_FACILITY = `${BASE_PBC_URI}/addFacility`;

	private static cachedFacilities: Facility[] = [];

	public static async getAllFacilities(): Promise<Facility[]> {
		if (this.cachedFacilities.length > 0) {
			return this.cachedFacilities;
		}

		const response = await fetch(this.URI_GET_FACILITIES, {
			...METHOD_GET,
			headers: { ...CONTENT_TYPE_JSON }
		});

		if (response.status !== 200) {
			throw new Error(
				`unexpected response ${response.status} when retrieving list of facilities from ${this.URI_GET_FACILITIES}`
			);
		}

		this.cachedFacilities = (await response.json()) as Facility[];
		return this.cachedFacilities;
	}

	public static async createFacility(facility: Facility): Promise<Facility> {
		const response = await fetch(this.URI_CREATE_FACILITY, {
			...METHOD_POST,
			headers: { ...CONTENT_TYPE_JSON },
			body: JSON.stringify(facility)
		});

		if (response.status !== 200) {
			throw new Error(
				`unexpected response ${response.status} when creating facility "[${facility.state}] ${facility.facility_name} - ${facility.facility_type}" at "${this.URI_CREATE_FACILITY}"`
			);
		}
		this.cachedFacilities = [];
		return (await response.json()) as Facility;
	}

	public static async resolveFacilityByName(facilityName: string): Promise<Facility> {
		if (!facilityName || facilityName === '') return null;
		const allFacilities = await this.getAllFacilities();
		return allFacilities.find((facility) => facility.facility_name === facilityName);
	}
}
