import { goto } from '$app/navigation'
import type { Inmate } from '$models/pbc/inmate'
import type { Package } from '$models/pbc/package'
import type { Recipient } from '$models/pbc/recipient'
import type { Shipment } from '$models/pbc/shipment'
import { InmateService } from '$services/pbc/inmate.service'
import { RecipientService } from '$services/pbc/recipient.service'
import { focusedInmate } from '$stores/inmate'
import { ERROR_MESSAGE_SERVER_COMMUNICATION } from '$util/error'
import { isEmpty } from '$util/strings'
import { delay } from '$util/time'
import { uriQueryJoin } from '$util/web'

export enum HomepageSearch {
  ID = 'id',
  NAME = 'name'
}

export enum PackageSearchMode {
  DATE = 'by-date',
  DATE_RANGE = 'by-date-range',
  ISBN = 'by-isbn',
  AUTHOR_AND_TITLE = 'by-author-and-title'
}

export enum CreatePackageModalState {
  NONE,

  VIEW_PACKAGE = 'view_package',
  EDIT_PACKAGE = 'edit_package',

  ADD_BOOK = 'add_book_to_package',
  ADD_ZINE = 'add_zine_to_package',
  DETAIL_BOOK = 'view_create_edit_book',

  VIEW_ALERT = 'view_alert',
  PRINT_PACKAGE = 'print_package'
}

export const ROUTE_HOME = (searchMode: HomepageSearch) => `/${uriQueryJoin({ search: searchMode })}`
export const ROUTE_PACKAGES_FOR_INMATE = (recipientId) => `/packages/${recipientId}`
export const ROUTE_INMATE_CREATE_NAMED = ({ firstName, lastName }) =>
  `/create/inmate${uriQueryJoin({ firstName, lastName })}`
export const ROUTE_INMATE_CREATE_ID = (inmateID) =>
  `/create/inmate${uriQueryJoin({ id: inmateID })}`
export const ROUTE_INMATE_SEARCH = ({ firstName, lastName }) =>
  `/search/inmates${uriQueryJoin({ firstName, lastName })}`
export const ROUTE_INVOICE = (packageID) => `/invoice/${packageID}`
export const ROUTE_PRINT_INVOICE = (packageID) => `/invoice/${packageID}?print=true`
export const ROUTE_PACKAGE_SEARCH = ({ searchMode, params }) =>
  `/search/packages/${uriQueryJoin({ searchMode, ...params })}`

export const gotoHomeSearch = async (searchMode: HomepageSearch) => goto(ROUTE_HOME(searchMode))
export const gotoInmateSearch = async (searchBy: HomepageSearch, { id, firstName, lastName }) => {
  if (searchBy === HomepageSearch.ID) {
    return gotoInmateSearchByID(id)
  } else if (searchBy === HomepageSearch.NAME) {
    return gotoInmateSearchByName({ firstName, lastName })
  }
}
const gotoInmateSearchByID = async (id) => {
  if (id === null) return
  
  try {
    const foundRecipient = await RecipientService.getRecipientByAssignedId(id)
    if (foundRecipient) {
      focusedInmate.set(foundRecipient)
      return goto(ROUTE_PACKAGES_FOR_INMATE(id))
    } else {
      const shouldCreateNewInmate = confirm(
        `Failed to find any inmates with ID#${id}. To create a new inmate, click OK`
      )
      if (shouldCreateNewInmate) return goto(ROUTE_INMATE_CREATE_ID(id))
    }
  } catch(error) {
    alert(ERROR_MESSAGE_SERVER_COMMUNICATION)
    console.error(error)
  }
}

const gotoInmateSearchByName = async ({ firstName, lastName }) => {
  if (isEmpty(firstName) && isEmpty(lastName)) return

  try {
    const foundInmates = await InmateService.getAllInmatesByName({
      firstName,
      lastName
    })
    if (foundInmates && foundInmates.length > 0)
      return goto(ROUTE_INMATE_SEARCH({ firstName, lastName }))

    const shouldCreateNewInmate = confirm(
      `Failed to find any inmates matching name "${[firstName, lastName]
        .filter((x) => !isEmpty(x))
        .join(' ')}". To create a new inmate, click OK`
    )
    if (shouldCreateNewInmate) {
      return goto(ROUTE_INMATE_CREATE_NAMED({ firstName, lastName }))
    }
  } catch (error) {
    alert(ERROR_MESSAGE_SERVER_COMMUNICATION)
    console.error(error)
  }
}

export const gotoPackagesForInmate = async (inmate: Recipient) =>
  goto(ROUTE_PACKAGES_FOR_INMATE(inmate.id))

export const gotoPackageSearch = async ({ date, startDate, endDate, isbn, author, title }) => {
  if (date) {
    gotoSearchByDate(date)
  } else if (startDate && endDate) {
    gotoSearchByDateRange(startDate, endDate)
  } else if (isbn) {
    gotoSearchByISBN(isbn)
  } else if (author && title) {
    gotoSearchByAuthorAndTitle(author, title)
  }
}
export const gotoSearchByDate = (date: string) =>
  goto(ROUTE_PACKAGE_SEARCH({ searchMode: PackageSearchMode.DATE, params: { date } }))
export const gotoSearchByDateRange = (startDate: string, endDate: string) =>
  goto(
    ROUTE_PACKAGE_SEARCH({
      searchMode: PackageSearchMode.DATE_RANGE,
      params: { startDate, endDate }
    })
  )
export const gotoSearchByISBN = (isbn: string) =>
  goto(ROUTE_PACKAGE_SEARCH({ searchMode: PackageSearchMode.ISBN, params: { isbn } }))
export const gotoSearchByAuthorAndTitle = (author: string, title: string) =>
  goto(
    ROUTE_PACKAGE_SEARCH({
      searchMode: PackageSearchMode.AUTHOR_AND_TITLE,
      params: { author, title }
    })
  )

export const printPackage = async (pbcPackage: Shipment) => {
  const printWindow = window.open(ROUTE_PRINT_INVOICE(pbcPackage.id), 'title', 'attributes')
  printWindow.focus()
  await delay(3500)
  printWindow.document.close()
  printWindow.close()
}
