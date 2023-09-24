import { error, json } from '@sveltejs/kit'
import { eq, like, or, and, not, type SQLWrapper } from 'drizzle-orm'
import { db, recipient } from '$data'
import type { MySqlColumn } from 'drizzle-orm/mysql-core'

export async function GET({ url }) {
  const query = String(url.searchParams.get('q'))
  if (!query) throw error(400, 'must specify a search `q` query parameter')

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

  const results = await db
    .select()
    .from(recipient)
    .where(and(...searchFilters))

  if (results.length === 0)
    throw error(404, `Could not find any recipients matching the criteria "${query}"`)

  return json(results)
}

function fuzzyCompare(field: MySqlColumn, value: string, exact: boolean = false) {
  return exact ? eq(field, value) : like(field, `%${value}%`)
}
