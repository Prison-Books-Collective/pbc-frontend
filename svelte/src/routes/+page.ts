import { getQueryParam } from '$util/web'
import { HomepageSearch } from '$util/routing'

export function load({ url }) {
    const mode = getQueryParam(url, 'search mode', 'search', 'mode') || HomepageSearch.ID

    console.log('this thing ran')
    return { props: { mode } }
}