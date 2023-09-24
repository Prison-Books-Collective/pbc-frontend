import { error, json } from '@sveltejs/kit'
import { db, recipient } from '$data'

export async function GET({ url }) {
  const result = await db.select().from(recipient)
  return json(result)
}
