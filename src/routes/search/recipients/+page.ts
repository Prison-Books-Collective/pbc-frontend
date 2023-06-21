import { getQueryParam } from '$util/web'

export function load({ url }) {
  const [firstName, lastName] = [getQueryParam(url, 'first name'), getQueryParam(url, 'last name')]
  return {
    firstName,
    lastName,
  }
}
