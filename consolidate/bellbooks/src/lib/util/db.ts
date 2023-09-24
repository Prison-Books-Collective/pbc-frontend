import { db, hibernateSequence } from '$data'
import { eq, like } from 'drizzle-orm'
import type { MySqlColumn, MySqlTable } from 'drizzle-orm/mysql-core'

export function fuzzyCompare(field: MySqlColumn, value: string, exact: boolean = false) {
  return exact ? eq(field, value) : like(field, `%${value}%`)
}

export async function createWithAutoID(table: MySqlTable, insertRow: any) {
  return db.transaction(async (tx) => {
    const sequence = await tx.select().from(hibernateSequence)
    const nextID = sequence[0].nextVal
    const insertRowWithID = { ...insertRow, id: nextID }
    await db.insert(table).values(insertRowWithID)
    await tx.update(hibernateSequence).set({ nextVal: nextID + 1 })
    return insertRowWithID
  })
}
