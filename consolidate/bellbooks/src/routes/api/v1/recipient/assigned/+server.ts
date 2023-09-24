import { error, json } from '@sveltejs/kit'
import { getStringParam } from '$util/api'
import { getRecipientByAssignedId } from '.'

export async function GET({ url }) {
  const id = getStringParam(url, 'id')
  if (!id) throw error(400, 'must specify a recipient `id` query parameter')

  const result = await getRecipientByAssignedId(id)

  if (result) return json(result)
  throw error(404, `recipient with assigned ID "${id}" does not exist`)
}
