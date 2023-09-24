import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'

import { DB_DATABASE, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD } from '$env/static/private'

const connection = await mysql.createConnection({
  host: DB_HOST,
  port: parseInt(DB_PORT),
  database: DB_DATABASE,
  user: DB_USER,
  password: DB_PASSWORD,
})

export * from '$db/schema'
export const db = drizzle(connection)
