import { db, facility } from '$data'
import { and, eq, like, type SQLWrapper } from 'drizzle-orm'
import { fuzzyCompare } from '$util/db.js'
import type { Facility } from '$data/types'

export async function filterFacilities({ name, state, city, zip }: Partial<Facility>) {
  const filters: SQLWrapper[] = []

  if (city) filters.push(fuzzyCompare(facility.city, city))
  if (state) filters.push(eq(facility.state, state))
  if (name) filters.push(fuzzyCompare(facility.name, name))
  if (zip) filters.push(like(facility.zip, `${zip}%`))

  return filters.length === 0
    ? await db.select().from(facility)
    : await db
        .select()
        .from(facility)
        .where(and(...filters))
}
