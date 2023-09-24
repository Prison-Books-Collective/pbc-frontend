import { error, json } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import { db, recipient } from '$data'

export async function GET({ url }) {
  const id = String(url.searchParams.get('id'))
  if (!id) throw error(400, 'must specify a recipient `id` query parameter')

  const result = await db.select().from(recipient).where(eq(recipient.assignedId, id))

  if (result.length === 0) throw error(404, `recipient with assigned ID "${id}" does not exist`)

  return json(result[0])
}
