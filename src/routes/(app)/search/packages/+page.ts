import { PackageSearchMode } from '$util/routing'
import { formatDate } from '$util/time'
import { getQueryParam } from '$util/web'

export function load({ url }) {
  const searchMode = url.searchParams.get('searchMode') as PackageSearchMode

  switch (searchMode) {
    case PackageSearchMode.DATE:
      return {
        searchMode,
        date: url.searchParams.get('date') || formatDate(new Date()),
      }
    case PackageSearchMode.DATE_RANGE:
      return {
        searchMode,
        startDate: getQueryParam(url, 'start date') || formatDate(new Date()),
        endDate: getQueryParam(url, 'end date') || formatDate(new Date()),
      }
    case PackageSearchMode.ISBN:
      return { props: { searchMode, isbn: url.searchParams.get('isbn') } }
    case PackageSearchMode.AUTHOR_AND_TITLE:
      return {
        searchMode,
        author: url.searchParams.get('author'),
        title: url.searchParams.get('title'),
      }
    default:
      return { searchMode }
  }
}
