import { error, json } from '@sveltejs/kit'
import { createRecipient, deleteRecipient, getRecipient, updateRecipient } from '.'
import { getNumberParam } from '$util/api'
import { isRecipientValid, getRecipientValidationErrors, type Recipient } from '$data/types'

export async function GET({ url }) {
  const id = getNumberParam(url, 'id')
  if (!id) throw error(400, 'must specify a recipient `id` query parameter')

  const result = await getRecipient(id)
  if (result) return json(result)
  throw error(404, `recipient with ID ${id} does not exist`)
}

export async function POST({ request }) {
  const details: Omit<Recipient, 'id'> = await request.json()
  if (!isRecipientValid(details)) {
    const errors = getRecipientValidationErrors(details)
    throw error(400, `Cannot create recipient with invalid data. Errors: ${errors.join(', ')}`)
  }

  const newRecipient = await createRecipient(details)

  if (newRecipient) return json(newRecipient)
  throw error(500, 'failed to save recipient details to database')
}

export async function PUT({ request }) {
  const details: Partial<Recipient> = await request.json()
  if (!details.id || details.id < 0)
    throw error(400, 'request body must contain a valid recipient `id` field')

  const existingRecipient = await getRecipient(details.id)
  if (!existingRecipient) throw error(404, `recipient with ID ${id} does not exist`)

  const updatedRecipient = await updateRecipient(details.id, existingRecipient, details)
  if (updatedRecipient) return json(updatedRecipient)

  throw error(500, `failed to save recipient update to database`)
}

export async function DELETE({ url }) {
  const id = getNumberParam(url, 'id')
  if (!id) throw error(400, 'must specify a recipient `id` query parameter')

  const existingRecipient = await getRecipient(id)
  if (!existingRecipient) throw error(404, `recipient with ID ${id} does not exist`)

  await deleteRecipient(id)
  return new Response()
}
