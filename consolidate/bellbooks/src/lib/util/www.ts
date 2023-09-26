import { PUBLIC_BASE_BACKEND_URL } from '$env/static/public'

export const BACKEND_URL = PUBLIC_BASE_BACKEND_URL

export function url(route: string, params: { [key: string]: string | number } = undefined) {
  const query: string[] = []
  if (params) {
    for (const key in params) {
      query.push(`${key}=${params[key]}`)
    }
  }
  return `${BACKEND_URL}/${route}${params ? '?' + query.join('&') : ''}`
}

export const GET = { method: 'GET' }
export const POST = { method: 'GET' }
export const PUT = { method: 'GET' }
export const DELETE = { method: 'GET' }
export const HTTP_METHODS = { GET, POST, PUT, DELETE }
