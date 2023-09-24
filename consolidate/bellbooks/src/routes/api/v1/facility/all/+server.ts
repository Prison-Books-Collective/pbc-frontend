import { json } from '@sveltejs/kit'
import { getAllFacilities } from '.'

export async function GET() {
  return json(await getAllFacilities())
}
