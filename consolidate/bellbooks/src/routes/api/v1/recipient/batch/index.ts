import { eq } from 'drizzle-orm'
import { db, recipient } from '$data'
import { createWithAutoID } from '$util/db'
import type { Recipient } from '$data/types'

export async function getRecipient(id: number): Promise<Recipient | null> {
  const results = await db.select().from(recipient).where(eq(recipient.id, id))
  if (results.length === 0) return undefined
  return results[0]
}

export async function createRecipient(details: Omit<Recipient, 'id'>): Promise<Recipient | null> {
  return createWithAutoID(recipient, details)
}

export async function updateRecipient(id: number, current: Recipient, updates: Partial<Recipient>) {
  delete updates.id
  await db
    .update(recipient)
    .set({ ...updates })
    .where(eq(recipient.id, id))
  return { ...current, ...updates, id }
}

export async function deleteRecipient(id: number) {
  await db.delete(recipient).where(eq(recipient.id, id))
}
