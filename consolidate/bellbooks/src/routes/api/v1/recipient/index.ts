import { eq } from 'drizzle-orm'
import { db, recipient } from '$data'
import type { Recipient } from '$data/types'

export async function getRecipient(id: number): Promise<Recipient | null> {
  const results = await db.select().from(recipient).where(eq(recipient.id, id))
  if (results.length === 0) return undefined
  return results[0]
}
