import { c as create_ssr_component, a as add_attribute, e as escape, i as is_promise, n as noop } from "../../chunks/index-491ed483.js";
import "./inmate/_mode_/_firstName_-_lastName_.svelte.js";
const METHOD_GET = { "method": "get" };
const METHOD_POST = { "method": "post" };
const METHOD_PUT = { "method": "put" };
const METHOD_DELETE = { "method": "delete" };
const CONTENT_TYPE_JSON = {
  "Content-Type": "application/json;charset=utf-8"
};
const BASE_PBC_URI = "http://localhost:8080";
class FacilityService {
  static async getAllFacilities() {
    if (this.cachedFacilities.length > 0) {
      return this.cachedFacilities;
    }
    const response = await fetch(this.URI_GET_FACILITIES, {
      ...METHOD_GET,
      headers: { ...CONTENT_TYPE_JSON }
    });
    if (response.status !== 200) {
      throw new Error(`unexpected response ${response.status} when retrieving list of facilities from ${this.URI_GET_FACILITIES}`);
    }
    this.cachedFacilities = await response.json();
    return this.cachedFacilities;
  }
}
FacilityService.URI_GET_FACILITIES = `${BASE_PBC_URI}/getAllFacilities`;
FacilityService.cachedFacilities = [];
class PackageService {
  static async createPackage(pbcPackage) {
    const response = await fetch(this.URI_CREATE_PACKAGE, {
      ...METHOD_POST,
      headers: { ...CONTENT_TYPE_JSON },
      body: JSON.stringify(pbcPackage)
    });
    if (response.status !== 200) {
      throw new Error(`unexpected response ${response.status} when creating package: ${JSON.stringify(pbcPackage)}`);
    }
    return await response.json();
  }
  static async createPackageForInmateNoID(pbcPackage) {
    const response = await fetch(this.URI_CREATE_PACKAGE__INMATE_NO_ID, {
      ...METHOD_POST,
      headers: { ...CONTENT_TYPE_JSON },
      body: JSON.stringify(pbcPackage)
    });
    if (response.status !== 200) {
      throw new Error(`unexpected response ${response.status} when creating package: ${JSON.stringify(pbcPackage)}`);
    }
    return await response.json();
  }
  static async deletePackage(packageId) {
    const response = await fetch(this.URI_DELETE_PACKAGE(packageId), { ...METHOD_DELETE });
    if (response.status !== 200) {
      throw new Error(`unexpected response ${response.status} when deleting package with ID ${packageId} from ${this.URI_DELETE_PACKAGE(packageId)}`);
    }
    return true;
  }
  static async updatePackage(pbcPackage) {
    const response = await fetch(this.URI_UPDATE_PACKAGE, {
      ...METHOD_PUT,
      headers: { ...CONTENT_TYPE_JSON },
      body: JSON.stringify(pbcPackage)
    });
    if (response.status !== 200) {
      throw new Error(`unexpected response ${response.status} when updating package at "${this.URI_UPDATE_PACKAGE}" with details: ${JSON.stringify(pbcPackage)}`);
    }
    return await response.json();
  }
  static async getPackagesForInmate(inmateId) {
    const response = await fetch(this.URI_GET_PACKAGES(inmateId), { ...METHOD_GET });
    if (response.status !== 200) {
      throw new Error(`unexpected response ${response.status} when retrieving packages for inmate with ID "${inmateId} at "${this.URI_GET_PACKAGES}""`);
    }
    return await response.json();
  }
  static async getPackagesForInmateNoID(databaseId) {
    const response = await fetch(this.URI_GET_PACKAGES__INMATE_NO_ID(databaseId), { ...METHOD_GET });
    if (response.status !== 200) {
      throw new Error(`unexpected response ${response.status} when retrieving packages for no-ID inmate with databaseID "${databaseId} at "${this.URI_GET_PACKAGES__INMATE_NO_ID}""`);
    }
    return await response.json();
  }
  static async getPackageCount(date) {
    const response = await fetch(this.URI_PACKAGE_COUNT(date), {
      ...METHOD_GET
    });
    return await response.json();
  }
}
PackageService.URI_GET_PACKAGES = (inmateId) => `${BASE_PBC_URI}/getPackagesForInmate?inmateId=${inmateId}`;
PackageService.URI_GET_PACKAGES__INMATE_NO_ID = (database_id) => `${BASE_PBC_URI}/getPackagesForInmateNoId?inmateId=${database_id}`;
PackageService.URI_CREATE_PACKAGE = `${BASE_PBC_URI}/addPackage`;
PackageService.URI_CREATE_PACKAGE__INMATE_NO_ID = `${BASE_PBC_URI}/addPackageForInmateNoId`;
PackageService.URI_UPDATE_PACKAGE = `${BASE_PBC_URI}/updatePackage`;
PackageService.URI_DELETE_PACKAGE = (packageId) => `${BASE_PBC_URI}/deletePackage?packageId=${packageId}`;
PackageService.URI_PACKAGE_COUNT = (date) => `${BASE_PBC_URI}/getPackageCountFromDate?date=${date}`;
const formatDate = (date) => {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  return `${year}-${month < 10 ? "0" : ""}${month}-${day < 10 ? "0" : ""}${day}`;
};
var home_svelte_svelte_type_style_lang = "";
const css = {
  code: "main.svelte-l9thdr.svelte-l9thdr{display:flex;padding:1rem;flex-flow:column nowrap;justify-content:center;align-items:center;max-width:100vw;word-wrap:break-word;min-height:calc(100vh - 7rem)}form.svelte-l9thdr.svelte-l9thdr{display:flex;flex-flow:column nowrap;justify-content:center;align-items:center}form.svelte-l9thdr input[type=text].svelte-l9thdr{background-color:transparent;border:none;font-size:1.5rem;text-align:center;max-width:100vw;width:calc(100vw - 5rem);margin-bottom:1rem}form.svelte-l9thdr select.svelte-l9thdr{appearance:none;-moz-appearance:none;border-radius:3px;box-shadow:2px 2px 10px rgba(0, 0, 0, 0.1);padding:0.5rem;background-color:transparent;border:none;font-size:1.5rem;text-align-last:center;-moz-text-align-last:center;-ms-text-align-last:center;margin-bottom:1rem}form.svelte-l9thdr select option.svelte-l9thdr{text-align:center}form.svelte-l9thdr button.svelte-l9thdr{display:flex;flex-flow:row nowrap;align-items:center;justify-content:space-between}form.svelte-l9thdr button.svelte-l9thdr:disabled{cursor:not-allowed}#toggleSearch.svelte-l9thdr.svelte-l9thdr{color:blue;text-decoration:underline;font-size:1rem}#packageCount.svelte-l9thdr.svelte-l9thdr{font-weight:700}",
  map: null
};
var VALID_SEARCHES;
(function(VALID_SEARCHES2) {
  VALID_SEARCHES2["ID"] = "id";
  VALID_SEARCHES2["NAME_AND_LOCATION"] = "name_and_location";
})(VALID_SEARCHES || (VALID_SEARCHES = {}));
const Home = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let searchText;
  let inmateSearch = {
    id: null,
    firstName: null,
    lastName: null,
    location: null
  };
  let searchBy = VALID_SEARCHES.ID;
  const today = formatDate(new Date());
  FacilityService.getAllFacilities();
  let getPackageCount = PackageService.getPackageCount(today);
  $$result.css.add(css);
  searchText = searchBy === VALID_SEARCHES.ID ? "Search by Name if no ID is available" : "Search by Inmate ID";
  return `${$$result.head += `${$$result.title = `<title>BellBooks</title>`, ""}`, ""}

<main class="${"svelte-l9thdr"}"><form class="${"svelte-l9thdr"}">${searchBy === VALID_SEARCHES.ID ? `<input id="${"inmateId"}" type="${"text"}" placeholder="${"Enter Inmate ID #, press Enter"}" name="${"inmateNumber"}" class="${"svelte-l9thdr"}"${add_attribute("value", inmateSearch.id, 0)}>` : `${searchBy === VALID_SEARCHES.NAME_AND_LOCATION ? `<input id="${"inmateFirstName"}" type="${"text"}" name="${"inmateFirstName"}" placeholder="${"First Name"}" class="${"svelte-l9thdr"}"${add_attribute("value", inmateSearch.firstName, 0)}>

      <input id="${"inmateLastName"}" type="${"text"}" name="${"inmateLastName"}" placeholder="${"Last Name"}" class="${"svelte-l9thdr"}"${add_attribute("value", inmateSearch.lastName, 0)}>

      ${``}

      <button type="${"submit"}" ${"disabled"} class="${"svelte-l9thdr"}">Search
      </button>` : ``}`}</form>

  <p id="${"toggleSearch"}" class="${"svelte-l9thdr"}">${escape(searchText)}</p>

  ${function(__value) {
    if (is_promise(__value)) {
      __value.then(null, noop);
      return ``;
    }
    return function(packageCount) {
      return `
  <p>You have completed <span id="${"packageCount"}" class="${"svelte-l9thdr"}">${escape(packageCount)}</span> packages on <date>${escape(today)}</date></p>
  `;
    }(__value);
  }(getPackageCount)}
</main>`;
});
export { VALID_SEARCHES, Home as default };
