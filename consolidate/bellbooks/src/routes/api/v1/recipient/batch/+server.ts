import { error, json } from '@sveltejs/kit'
import { createRecipient, deleteRecipient, getRecipient, updateRecipient } from '.'
import { getNumberParam, getSearchParam } from '$util/api'
import { isRecipientValid, getRecipientValidationErrors, type Recipient } from '$data/types'
import { db, recipient } from '$data'
import { inArray } from 'drizzle-orm'

// accepts a comma-separated list string argument
function getIdListValidationErrors(idList: string): [number[], string[]] {
  const idSplit = idList.split(',')
  const ids = idSplit.map((id) => (id ?? '').trim()).filter((id) => !!id && id !== '')
  const filteredIds = idSplit.length - ids.length

  const invalidIds = ids
    .map((id) => [id, Number.isInteger(Number(id)), Number(id) > 0])
    .filter((details) => details.includes(false))
    .map(
      ([id, isInteger, isInRange]) =>
        `'${id}' is ${
          isInteger ? (isInRange ? 'a valid ID' : 'outside the valid ID range') : 'not an integer'
        }`,
    )

  if (filteredIds > 1) invalidIds.push(`${filteredIds} IDs were filtered out as empty strings`)
  if (filteredIds === 1) invalidIds.push(`1 ID was filtered out as an empty string`)

  if (invalidIds.length === 0 || (invalidIds.length === 1 && invalidIds[0].includes('filtered')))
    return [ids.map((id) => Number(id)), []]
  return [[], invalidIds]
}

export async function DELETE({ url }) {
  const idsParam = getSearchParam(url, 'ids')
  if (!idsParam) throw error(400, 'must provide a comma-separated list of `ids` query parameter')

  const [ids, validationErrors] = getIdListValidationErrors(idsParam)
  if (validationErrors.length > 0)
    throw error(400, `[ ${idsParam} ] contains one or more errors: ${validationErrors.join('; ')}`)

  const recipients = await db.select().from(recipient).where(inArray(recipient.id, ids))
  await db.delete(recipient).where(inArray(recipient.id, ids))

  return json(recipients)
}
