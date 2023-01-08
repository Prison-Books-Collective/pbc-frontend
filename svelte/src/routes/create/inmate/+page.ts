export function load({ url }) {
    const id = url.searchParams.get('id') || null
    return { id, isInmateNoID: !id }
  }
