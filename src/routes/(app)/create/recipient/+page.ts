import { getQueryParam } from '$util/web'

export function load({ url }) {
  const [id, firstName, lastName] = [
    getQueryParam(url, 'id'),
    getQueryParam(url, 'first name'),
    getQueryParam(url, 'last name'),
  ]
  return {
    id,
    isRecipientNoId: !id,
    firstName,
    lastName,
  }
}
