import { or, and, not, type SQLWrapper } from 'drizzle-orm'
import { db, recipient } from '$data'
import { fuzzyCompare } from '$util/db'
import type { Recipient } from '$data/types'

export async function searchRecipient(query: string): Promise<Recipient[]> {
  const querySegments = query
    .trim()
    .replace(/\s{2,}/g, ' ')
    .split(' ')
  const searchFilters: SQLWrapper[] = []

  querySegments.forEach((querySegment) => {
    const isNegated = querySegment.startsWith('-')
    if (isNegated) querySegment = querySegment.slice(1)

    const isExact =
      (querySegment.startsWith('"') || querySegment.startsWith("'")) &&
      (querySegment.endsWith('"') || querySegment.endsWith("'"))
    if (isExact) querySegment = querySegment.slice(1, -1)

    const filterSegments: SQLWrapper[] = []
    if (Number.isInteger(parseInt(querySegment))) {
      filterSegments.push(fuzzyCompare(recipient.id, querySegment, isExact))
      filterSegments.push(fuzzyCompare(recipient.assignedId, querySegment, isExact))
    } else {
      filterSegments.push(fuzzyCompare(recipient.firstName, querySegment, isExact))
      // filterSegments.push( compare(recipient.middleName, querySegment, isExact )) // null values cause an issue with fuzzy comparisons
      filterSegments.push(fuzzyCompare(recipient.lastName, querySegment, isExact))
    }

    const filter = or(...filterSegments)
    searchFilters.push(isNegated ? not(filter) : filter)
  })

  return await db
    .select()
    .from(recipient)
    .where(and(...searchFilters))
}
