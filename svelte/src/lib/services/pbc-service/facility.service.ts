import { CONTENT_TYPE_JSON, METHOD_GET } from '$lib/util/web';
import { BASE_PBC_URI } from './index';
import type { Facility } from './models/facility';

export class FacilityService {
	public static readonly URI_GET_FACILITIES = `${BASE_PBC_URI}/getAllFacilities`;

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
}
