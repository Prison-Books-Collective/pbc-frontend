import { json } from '@sveltejs/kit'
import { getAllRecipients } from '.'

export async function GET() {
  return json(await getAllRecipients())
}
