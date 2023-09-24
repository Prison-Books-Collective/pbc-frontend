import { json } from '@sveltejs/kit'
import { db, facility } from '$data'

export async function GET() {
  const result = await db.select().from(facility)
  return json(result)
}
