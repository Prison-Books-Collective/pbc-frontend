import { eq } from 'drizzle-orm'
import { db, recipient } from '$data'

export async function getRecipientByAssignedId(id: string) {
  return await db.select().from(recipient).where(eq(recipient.assignedId, id))
}
