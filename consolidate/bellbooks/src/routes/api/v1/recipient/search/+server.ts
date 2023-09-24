import { error, json } from '@sveltejs/kit'
import { searchRecipient } from '.'

export async function GET({ url }) {
  const query = String(url.searchParams.get('q'))
  if (!query) throw error(400, 'must specify a search `q` query parameter')

  const recipients = await searchRecipient(query)

  if (recipients.length === 0)
    throw error(404, `Could not find any recipients matching the criteria "${query}"`)

  return json(recipients)
}
