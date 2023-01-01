export function load({ params, url }) {
    const packageID  = params.packageID
    const print = url.searchParams.get('print') || false
    const date = url.searchParams.get('date') || false
    return { packageID, print, date  }
  }