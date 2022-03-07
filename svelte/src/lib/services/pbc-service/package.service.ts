import {
	CONTENT_TYPE_JSON,
	METHOD_GET,
	METHOD_POST,
	METHOD_DELETE,
	METHOD_PUT
} from '$lib/util/web';
import { BASE_PBC_URI } from './index';
import type { Package } from './models/package';

export class PackageService {
	public static readonly URI_GET_PACKAGES = (inmateId: string) =>
		`${BASE_PBC_URI}/getPackagesForInmate?inmateId=${inmateId}`;
	public static readonly URI_GET_PACKAGES__INMATE_NO_ID = (database_id: string | number) =>
		`${BASE_PBC_URI}/getPackagesForInmateNoId?inmateId=${database_id}`;
	public static readonly URI_CREATE_PACKAGE = `${BASE_PBC_URI}/addPackage`;
	public static readonly URI_CREATE_PACKAGE__INMATE_NO_ID = `${BASE_PBC_URI}/addPackageForInmateNoId`;
	public static readonly URI_UPDATE_PACKAGE = `${BASE_PBC_URI}/updatePackage`;
	public static readonly URI_DELETE_PACKAGE = (packageId: number) =>
		`${BASE_PBC_URI}/deletePackage?packageId=${packageId}`;
	public static readonly URI_PACKAGE_COUNT = (date: string) =>
		`${BASE_PBC_URI}/getPackageCountFromDate?date=${date}`; // date is a formatted string "yyyy-mm-dd"

	public static async createPackage(pbcPackage: Package): Promise<Package> {
		const response = await fetch(this.URI_CREATE_PACKAGE, {
			...METHOD_POST,
			headers: { ...CONTENT_TYPE_JSON },
			body: JSON.stringify(pbcPackage)
		});

		if (response.status !== 200) {
			throw new Error(
				`unexpected response ${response.status} when creating package: ${JSON.stringify(
					pbcPackage
				)}`
			);
		}

		return (await response.json()) as Package;
	}

	public static async createPackageForInmateNoID(pbcPackage: Package): Promise<Package> {
		const response = await fetch(this.URI_CREATE_PACKAGE__INMATE_NO_ID, {
			...METHOD_POST,
			headers: { ...CONTENT_TYPE_JSON },
			body: JSON.stringify(pbcPackage)
		});

		if (response.status !== 200) {
			throw new Error(
				`unexpected response ${response.status} when creating package: ${JSON.stringify(
					pbcPackage
				)}`
			);
		}

		return (await response.json()) as Package;
	}

	// returns true when successfully deleted; otherwise throws an error
	public static async deletePackage(packageId: number): Promise<boolean> {
		const response = await fetch(this.URI_DELETE_PACKAGE(packageId), { ...METHOD_DELETE });

		if (response.status !== 200) {
			throw new Error(
				`unexpected response ${
					response.status
				} when deleting package with ID ${packageId} from ${this.URI_DELETE_PACKAGE(packageId)}`
			);
		}

		return true;
	}

	public static async updatePackage(pbcPackage: Package): Promise<Package> {
		const response = await fetch(this.URI_UPDATE_PACKAGE, {
			...METHOD_PUT,
			headers: { ...CONTENT_TYPE_JSON },
			body: JSON.stringify(pbcPackage)
		});

		if (response.status !== 200) {
			throw new Error(
				`unexpected response ${response.status} when updating package at "${
					this.URI_UPDATE_PACKAGE
				}" with details: ${JSON.stringify(pbcPackage)}`
			);
		}

		return (await response.json()) as Package;
	}

	public static async getPackagesForInmate(inmateId: string): Promise<Package[]> {
		const response = await fetch(this.URI_GET_PACKAGES(inmateId), { ...METHOD_GET });

		if (response.status !== 200) {
			throw new Error(
				`unexpected response ${response.status} when retrieving packages for inmate with ID "${inmateId} at "${this.URI_GET_PACKAGES}""`
			);
		}

		return (await response.json()) as Package[];
	}

	public static async getPackagesForInmateNoID(databaseId: string): Promise<Package[]> {
		const response = await fetch(this.URI_GET_PACKAGES__INMATE_NO_ID(databaseId), {
			...METHOD_GET
		});

		if (response.status !== 200) {
			throw new Error(
				`unexpected response ${response.status} when retrieving packages for no-ID inmate with databaseID "${databaseId} at "${this.URI_GET_PACKAGES__INMATE_NO_ID}""`
			);
		}

		return (await response.json()) as Package[];
	}

	// date is a formatted string "yyyy-mm-dd"
	public static async getPackageCount(date: string): Promise<number> {
		const response = await fetch(this.URI_PACKAGE_COUNT(date), {
			...METHOD_GET
		});
		return (await response.json()) as number;
	}
}
