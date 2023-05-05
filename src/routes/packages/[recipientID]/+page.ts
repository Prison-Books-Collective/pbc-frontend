import { getQueryParam } from '$util/web'

export function load({ params, url }) {
  const { recipientId } = params
  const isAssignedId = getQueryParam(url, 'is assigned id') ?? false
  return { recipientId, isAssignedId }
}