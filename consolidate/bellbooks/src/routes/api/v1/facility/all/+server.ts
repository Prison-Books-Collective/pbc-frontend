import { json } from '@sveltejs/kit'
import { db, facility } from '$data'
import type { Facility } from '$db/types'

export async function GET() {
  const result = await db.select().from(facility)
  result.sort((a: Facility, b: Facility) => (a.name < b.name ? -1 : 1))
  return json(result)
}
