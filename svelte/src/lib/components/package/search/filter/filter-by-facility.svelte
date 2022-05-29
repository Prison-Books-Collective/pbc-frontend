<script lang="ts">
  import type { Package } from '$models/pbc/package'
  import { NO_FACILITY_PROVIDED, type Facility } from '$models/pbc/facility'
  import FacilitySelect from '$lib/components/facility/select-facility.svelte'

  const defaultFn = (packages: Package[]) => packages

  export let packages: Package[] = []
  export let fn = defaultFn

  let availableFacilities: Facility[] = []
  let selectedFacilities: Facility[] = []
  let didFacilitiesLoad = new Promise(() => {})

  const parsePackages = (packages) => {
    packages.forEach((p) => {
      const facility = p.facility
      if (!facility && !availableFacilities.includes(NO_FACILITY_PROVIDED)) {
        availableFacilities.push(NO_FACILITY_PROVIDED)
      }
      if (facility && !availableFacilities.find((f) => f.id === facility.id)) {
        availableFacilities.push(facility)
      }
      availableFacilities.sort((a, b) => (a.facility_name < b.facility_name ? -1 : 1))
      didFacilitiesLoad = Promise.resolve()
    })
  }

  $: parsePackages(packages)
  $: {
    if (!selectedFacilities || selectedFacilities.length === 0) {
      fn = defaultFn
    } else {
      fn = (packages: Package[]) =>
        packages.filter((p) => selectedFacilities.find((f) => f.id === p.facility?.id))
    }
  }
</script>

{#await didFacilitiesLoad then}
  <FacilitySelect
    multiple
    facilityList={availableFacilities}
    bind:multipleFacilities={selectedFacilities}
  />
{/await}
