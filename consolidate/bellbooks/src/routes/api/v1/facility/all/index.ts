import { db, facility } from '$data'
import type { Facility } from '$db/types'

export async function getAllFacilities() {
  return (await db.select().from(facility)).sort((a: Facility, b: Facility) =>
    a.name < b.name ? -1 : 1,
  )
}
