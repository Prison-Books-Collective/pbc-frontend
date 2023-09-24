import { json, error } from '@sveltejs/kit'
import { getStringParam } from '$util/api'
import { filterFacilities } from '.'

export async function GET({ url }) {
  const name = getStringParam(url, 'name')
  const state = getStringParam(url, 'state')
  const city = getStringParam(url, 'city')
  const zip = getStringParam(url, 'zip')

  const logger: any = {}
  if (name) logger.name = name
  if (state) logger.state = state
  if (city) logger.city = city
  if (zip) logger.zip = zip

  const facilities = await filterFacilities({ name, state, city, zip })

  if (facilities.length === 0)
    throw error(
      404,
      `Could not find any facilities matching the search criteria: ${JSON.stringify(logger)}`,
    )

  return json(facilities)
}
