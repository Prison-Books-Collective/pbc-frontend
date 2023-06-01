import { goto } from '$app/navigation'

import { RecipientService } from '$services/pbc/recipient.service'
import { loading } from '$stores/loading'
import { ERROR_MESSAGE_SERVER_COMMUNICATION } from '$util/error'
import { isEmpty } from '$util/strings'
import { delay } from '$util/time'
import { uriQueryJoin } from '$util/web'
import { recipient } from '$lib/data/recipient.data'

import type { Recipient } from '$models/pbc/recipient'
import type { Shipment } from '$models/pbc/shipment'

export enum HomepageSearch {
  ID = 'id',
  NAME = 'name',
}

export enum PackageSearchMode {
  DATE = 'by-date',
  DATE_RANGE = 'by-date-range',
  ISBN = 'by-isbn',
  AUTHOR_AND_TITLE = 'by-author-and-title',
}

export enum CreatePackageModalState {
  NONE,

  VIEW_PACKAGE = 'view_package',
  EDIT_PACKAGE = 'edit_package',

  ADD_BOOK = 'add_book_to_package',
  ADD_ZINE = 'add_zine_to_package',
  DETAIL_BOOK = 'view_create_edit_book',

  VIEW_ALERT = 'view_alert',
  PRINT_PACKAGE = 'print_package',
}

export const ROUTE_HOME = (searchMode: HomepageSearch) => `/${uriQueryJoin({ search: searchMode })}`
export const ROUTE_PACKAGES_FOR_RECIPIENT = (recipientId) => `/packages/${recipientId}`
export const ROUTE_PACKAGES_FOR_RECIPIENT_ASSIGNED_ID = (recipientId) =>
  `/packages/${recipientId}${uriQueryJoin({ isAssignedId: true })}`
export const ROUTE_RECIPIENT_CREATE_NAMED = ({ firstName, lastName }) =>
  `/create/recipient${uriQueryJoin({ firstName, lastName })}`
export const ROUTE_RECIPIENT_CREATE_ID = (recipientID) =>
  `/create/recipient${uriQueryJoin({ id: recipientID })}`
export const ROUTE_RECIPIENT_SEARCH = ({ firstName, lastName }) =>
  `/search/recipients/${firstName}/${lastName}`
export const ROUTE_INVOICE = (packageID) => `/invoice/${packageID}`
export const ROUTE_PRINT_INVOICE = (packageID) => `/invoice/${packageID}?print=true`
export const ROUTE_PACKAGE_SEARCH = ({ searchMode, params }) =>
  `/search/packages/${uriQueryJoin({ searchMode, ...params })}`

export const gotoHomeSearch = async (searchMode: HomepageSearch) => goto(ROUTE_HOME(searchMode))
export const gotoRecipientSearch = async (
  searchBy: HomepageSearch,
  { id, firstName, lastName },
) => {
  if (searchBy === HomepageSearch.ID) {
    return gotoRecipientSearchByID(id)
  } else if (searchBy === HomepageSearch.NAME) {
    return gotoRecipientSearchByName({ firstName, lastName })
  }
}
const gotoRecipientSearchByID = async (id: string) => {
  if (isEmpty(id)) return

  try {
    const foundRecipient = await recipient.fetch({ id })
    if (foundRecipient) {
      return gotoPackagesForRecipient(foundRecipient)
    } else {
      const shouldCreateNewRecipient = confirm(
        `Failed to find any recipients with ID#${id}. To create a new recipient, click OK`,
      )
      if (shouldCreateNewRecipient) return goto(ROUTE_RECIPIENT_CREATE_ID(id))
    }
  } catch (error) {
    alert(ERROR_MESSAGE_SERVER_COMMUNICATION)
    console.error(error)
    loading.end()
  }
}

const gotoRecipientSearchByName = async ({ firstName, lastName }) => {
  if (isEmpty(firstName) && isEmpty(lastName)) return
  loading.start()
  try {
    const foundRecipients = await RecipientService.getRecipientsByName({
      firstName,
      lastName,
    })
    loading.end()
    if (foundRecipients && foundRecipients.length > 0) {
      if (firstName == null) {
        firstName = '-'
      }
      if (lastName == null) {
        lastName = '-'
      }
      return goto(ROUTE_RECIPIENT_SEARCH({ firstName, lastName }))
    }

    const shouldCreateNewRecipient = confirm(
      `Failed to find any recipients matching name "${[firstName, lastName]
        .filter((x) => !isEmpty(x))
        .join(' ')}". To create a new recipient, click OK`,
    )
    if (shouldCreateNewRecipient) {
      return goto(ROUTE_RECIPIENT_CREATE_NAMED({ firstName, lastName }))
    }
  } catch (error) {
    alert(ERROR_MESSAGE_SERVER_COMMUNICATION)
    console.error(error)
    loading.end()
  }
}

export const gotoPackagesForRecipient = async (recipient: Recipient) => {
  const route = recipient.assignedId
    ? ROUTE_PACKAGES_FOR_RECIPIENT_ASSIGNED_ID(recipient.assignedId)
    : ROUTE_PACKAGES_FOR_RECIPIENT(recipient.id)
  goto(route)
}

export const gotoPackageSearch = async ({ date, startDate, endDate, isbn, author, title }) => {
  if (date) {
    console.log('single')
    gotoSearchByDate(date)
  } else if (startDate && endDate) {
    console.log('start and end')
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
      params: { startDate, endDate },
    }),
  )
export const gotoSearchByISBN = (isbn: string) =>
  goto(ROUTE_PACKAGE_SEARCH({ searchMode: PackageSearchMode.ISBN, params: { isbn } }))
export const gotoSearchByAuthorAndTitle = (author: string, title: string) =>
  goto(
    ROUTE_PACKAGE_SEARCH({
      searchMode: PackageSearchMode.AUTHOR_AND_TITLE,
      params: { author, title },
    }),
  )

export const printPackage = async (pbcPackage: Shipment) => {
  const printWindow = window.open(ROUTE_PRINT_INVOICE(pbcPackage.id), 'title', 'attributes')
  printWindow.focus()
  await delay(3500)
  printWindow.document.close()
  printWindow.close()
}
