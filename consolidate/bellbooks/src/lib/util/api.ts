export function getSearchParam(url: URL, param: string) {
  const value = url.searchParams.get(param)
  if (value === 'null') return undefined
  return value
}

export function getStringParam(url: URL, param: string): string | undefined {
  const value = getSearchParam(url, param)
  return value ? String(value) : undefined
}

export function getNumberParam(url: URL, param: string): number | undefined {
  const value = getSearchParam(url, param)
  return value ? Number(value) : undefined
}
