import { error, json } from '@sveltejs/kit'
import { getRecipient } from '.'
import { getNumberParam } from '$util/db'

export async function GET({ url }) {
  const id = getNumberParam(url, 'id')
  if (!id) throw error(400, 'must specify a recipient `id` query parameter')

  const result = await getRecipient(id)
  if (result) return json(result)
  throw error(404, `recipient with ID ${id} does not exist`)
}

import type { Recipient } from '$data/types'
import { db, hibernateSequence, recipient } from '$data'
import type { MySqlTable, MySqlTableWithColumns } from 'drizzle-orm/mysql-core'

export async function POST({ request }) {
  const result = await db.select().from(hibernateSequence)
  console.log({ result })
  const insertRecipient = await request.json()
  if (!isValidRecipient(insertRecipient, true)) {
    const errors = getValidationErrors(insertRecipient, true)
    throw error(400, `Cannot create recipient with invalid data. Errors: ${errors.join(', ')}`)
  }

  const insertedRecipient = await createWithAutoID(recipient, insertRecipient)
  return json(insertedRecipient)
}

async function createWithAutoID<Typez>(table: MySqlTable, insertRow: Typez) {
  return db.transaction(async (tx) => {
    const sequence = await tx.select().from(hibernateSequence)
    const nextID = sequence[0].nextVal
    const insertRowWithID = { ...insertRow, id: nextID }
    await db.insert(table).values(insertRowWithID)
    await tx.update(hibernateSequence).set({ nextVal: nextID + 1 })
    return insertRowWithID
  })
}

function getValidationErrors(recipient: Partial<Recipient>, isCreate = false) {
  const validationErrors: string[] = []

  if (!isCreate && !recipient.id) validationErrors.push('missing: id')
  if (!recipient.firstName) validationErrors.push('missing: firstName')
  if (!recipient.lastName) validationErrors.push('missing: lastName')

  return validationErrors
}

function isValidRecipient(recipient: Partial<Recipient>, isCreate = false): boolean {
  if (!isCreate && !recipient.id) return false
  if (!recipient.firstName) return false
  if (!recipient.lastName) return false

  // todo (cocowmn): are we still doing the "require assignedID OR location" validation?
  return true
}
