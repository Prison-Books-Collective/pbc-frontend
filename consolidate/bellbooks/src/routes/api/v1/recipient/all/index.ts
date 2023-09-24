import { db, recipient } from '$data'
import type { Recipient } from '$data/types'

export async function getAllRecipients(): Promise<Recipient[]> {
  return await db.select().from(recipient)
}
