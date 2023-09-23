/**
 *
 * generated file
 *
 **/

import { BASE_PBC_URI } from '$util/app-config'

// type declarations -----------------------------------------------------------
export enum State {
  NC,
  AL,
  TN,
  WV,
  KY,
  MD,
  VA,
  DE,
}

export enum SpecialRequestStatus {
  OPEN,
  COMPLETED,
  CANCELLED,
}

export enum SpecialRequestCategory {
  VOCATIONAL,
  EDUCATIONAL,
  CAREER_GROWTH,
  FOREIGN_LANGUAGE,
  LEGAL,
  SPIRITUAL_RELIGIOUS,
  OTHER,
}

export interface Facility {
  id: number
  name: string
  additionalInfo: string
  street: string
  city: string
  state: State
  zip: string
}

export interface Recipient {
  id: number
  firstName: string
  middleName: string
  lastName: string
  assignedId: string
  facility: Facility
  shipments: Shipment[]
  specialRequests: SpecialRequest[]
}

export interface PackageContent {
  id: number
  title: string
}

export interface Book extends PackageContent {
  ISBN10: string
  ISBN13: string
  authors: string
}

export interface Zine extends PackageContent {
  code: string
}

export interface Note {
  id: number
  content: string
  date: Date
}

export interface Shipment {
  id: number
  date: Date
  facility: Facility
  recipient: Recipient
  notes: Note[]
  content: PackageContent[]
}

export interface SpecialRequest {
  id: number
  volunteerName: string
  request: string
  specialRequestDate: Date
  letterMailedDate: Date
  category: SpecialRequestCategory
  status: SpecialRequestStatus
  recipient: Recipient
}

// endpoint fetch methods ------------------------------------------------------

// Facility
export async function createFacility(request: Facility): Promise<Facility | null> {
  const url = `${BASE_PBC_URI}/addFacility`
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: `${JSON.stringify(request)}`,
    })
    if (response.ok) return (await response.json()) as Facility

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return null
  }
}

export async function getFacilities(): Promise<Facility[]> {
  const url = `${BASE_PBC_URI}/getAllFacilities`
  try {
    const response = await fetch(url, { method: 'GET' })
    if (response.ok) return (await response.json()) as Facility[]

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return []
  }
}

export async function getFacilityById(query: { id: number }): Promise<Facility | null> {
  const url = getURL({ baseURL: BASE_PBC_URI, path: 'getFacility', query })
  try {
    const response = await fetch(url, { method: 'GET' })
    if (response.ok) return (await response.json()) as Facility

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return null
  }
}

export async function getFacilitiesByNameAndState(query: {
  name: string
  state: State
}): Promise<Facility[]> {
  const url = getURL({ baseURL: BASE_PBC_URI, path: 'getFacilityByName', query })
  try {
    const response = await fetch(url, { method: 'GET' })
    if (response.ok) return (await response.json()) as Facility[]

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return []
  }
}

export async function deleteFacility(query: { id: number }): Promise<void | null> {
  const url = getURL({ baseURL: BASE_PBC_URI, path: 'deleteFacility', query })
  try {
    const response = await fetch(url, { method: 'DELETE' })
    if (response.ok) return (await response.json()) as void

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return
  }
}

export async function updateFacility(request: Facility): Promise<Facility | null> {
  const url = `${BASE_PBC_URI}/updateFacility`
  try {
    const response = await fetch(url, {
      method: 'PUT',
      body: `${JSON.stringify(request)}`,
    })
    if (response.ok) return (await response.json()) as Facility

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return null
  }
}

// Note
export async function createNote(request: Note): Promise<Note | null> {
  const url = `${BASE_PBC_URI}/addNote`
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: `${JSON.stringify(request)}`,
    })
    if (response.ok) return (await response.json()) as Note

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return null
  }
}

// PackageContent
export async function getPackageContentById(query: { id: number }): Promise<PackageContent | null> {
  const url = getURL({ baseURL: BASE_PBC_URI, path: 'getContent', query })
  try {
    const response = await fetch(url, { method: 'GET' })
    if (response.ok) return (await response.json()) as PackageContent

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return null
  }
}

export async function getPackageContentByIsbn(query: {
  isbn: string
}): Promise<PackageContent | null> {
  const url = getURL({ baseURL: BASE_PBC_URI, path: 'getBookByISBN', query })
  try {
    const response = await fetch(url, { method: 'GET' })
    if (response.ok) return (await response.json()) as PackageContent

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return null
  }
}

export async function getPackageContentsByTitle(query: {
  title: string
}): Promise<PackageContent[]> {
  const url = getURL({ baseURL: BASE_PBC_URI, path: 'getContentByTitle', query })
  try {
    const response = await fetch(url, { method: 'GET' })
    if (response.ok) return (await response.json()) as PackageContent[]

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return []
  }
}

export async function searchBooks(query: { title: string; author?: string }): Promise<Book[]> {
  const url = getURL({ baseURL: BASE_PBC_URI, path: 'searchBooks', query })
  try {
    const response = await fetch(url, { method: 'GET' })
    if (response.ok) return (await response.json()) as Book[]

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return []
  }
}

export async function getPackageContentsByTitleAndAuthor(query: {
  title: string
  author?: string
}): Promise<PackageContent[]> {
  const url = getURL({ baseURL: BASE_PBC_URI, path: 'content', query })
  try {
    const response = await fetch(url, { method: 'GET' })
    if (response.ok) return (await response.json()) as PackageContent[]

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return []
  }
}

export async function getBooksByTitleAndAuthor(query: {
  title: string
  author?: string
}): Promise<Book[]> {
  const url = getURL({ baseURL: BASE_PBC_URI, path: 'queryGoogle', query })
  try {
    const response = await fetch(url, { method: 'GET' })
    if (response.ok) return (await response.json()) as Book[]

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return []
  }
}

export async function getZineByCode(query: { code: string }): Promise<Zine | null> {
  const url = getURL({ baseURL: BASE_PBC_URI, path: 'getZineByCode', query })
  try {
    const response = await fetch(url, { method: 'GET' })
    if (response.ok) return (await response.json()) as Zine

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return null
  }
}

export async function getZines(): Promise<Zine[]> {
  const url = `${BASE_PBC_URI}/getAllZines`
  try {
    const response = await fetch(url, { method: 'GET' })
    if (response.ok) return (await response.json()) as Zine[]

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return []
  }
}

export async function getNoIsbnBooks(): Promise<Book[]> {
  const url = `${BASE_PBC_URI}/getNoIsbnBooks`
  try {
    const response = await fetch(url, { method: 'GET' })
    if (response.ok) return (await response.json()) as Book[]

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return []
  }
}

export async function getPackageContents(): Promise<PackageContent[]> {
  const url = `${BASE_PBC_URI}/getAllContent`
  try {
    const response = await fetch(url, { method: 'GET' })
    if (response.ok) return (await response.json()) as PackageContent[]

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return []
  }
}

export async function updatePackageContent(
  request: PackageContent,
): Promise<PackageContent | null> {
  const url = `${BASE_PBC_URI}/updateContent`
  try {
    const response = await fetch(url, {
      method: 'PUT',
      body: `${JSON.stringify(request)}`,
    })
    if (response.ok) return (await response.json()) as PackageContent

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return null
  }
}

export async function deleteContent(query: { id: number }): Promise<void | null> {
  const url = getURL({ baseURL: BASE_PBC_URI, path: 'deleteContent', query })
  try {
    const response = await fetch(url, { method: 'DELETE' })
    if (response.ok) return (await response.json()) as void

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return
  }
}

export async function createPackageContent(
  request: PackageContent,
): Promise<PackageContent | null> {
  const url = `${BASE_PBC_URI}/addContent`
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: `${JSON.stringify(request)}`,
    })
    if (response.ok) return (await response.json()) as PackageContent

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return null
  }
}

// Recipient
export async function createRecipient(request: Recipient): Promise<Recipient | null> {
  const url = `${BASE_PBC_URI}/addRecipient`
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: `${JSON.stringify(request)}`,
    })
    if (response.ok) return (await response.json()) as Recipient

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return null
  }
}

export async function updateRecipient(request: Recipient): Promise<Recipient | null> {
  const url = `${BASE_PBC_URI}/updateRecipient`
  try {
    const response = await fetch(url, {
      method: 'PUT',
      body: `${JSON.stringify(request)}`,
    })
    if (response.ok) return (await response.json()) as Recipient

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return null
  }
}

export async function getRecipientById(query: { id: number }): Promise<Recipient | null> {
  const url = getURL({ baseURL: BASE_PBC_URI, path: 'getRecipient', query })
  try {
    const response = await fetch(url, { method: 'GET' })
    if (response.ok) return (await response.json()) as Recipient

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return null
  }
}

export async function getRecipients(): Promise<Recipient[]> {
  const url = `${BASE_PBC_URI}/getAllRecipients`
  try {
    const response = await fetch(url, { method: 'GET' })
    if (response.ok) return (await response.json()) as Recipient[]

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return []
  }
}

export async function getRecipientByAssignedId(query: {
  assignedId: string
}): Promise<Recipient | null> {
  const url = getURL({ baseURL: BASE_PBC_URI, path: 'getRecipientByAssignedId', query })
  try {
    const response = await fetch(url, { method: 'GET' })
    if (response.ok) return (await response.json()) as Recipient

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return null
  }
}

export async function getRecipientLocationName(query: { id: string }): Promise<string> {
  const url = getURL({ baseURL: BASE_PBC_URI, path: 'getRecipientLocation', query })
  try {
    const response = await fetch(url, { method: 'GET' })
    if (response.ok) return (await response.json()) as string

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return ''
  }
}

export async function deleteRecipient(query: { id: number }): Promise<void | null> {
  const url = getURL({ baseURL: BASE_PBC_URI, path: 'deleteRecipient', query })
  try {
    const response = await fetch(url, { method: 'DELETE' })
    if (response.ok) return (await response.json()) as void

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return
  }
}

// Shipment
export async function createShipment(request: Shipment): Promise<Shipment | null> {
  const url = `${BASE_PBC_URI}/addShipment`
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: `${JSON.stringify(request)}`,
    })
    if (response.ok) return (await response.json()) as Shipment

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return null
  }
}

export async function updateShipment(request: Shipment): Promise<Shipment | null> {
  const url = `${BASE_PBC_URI}/updateShipment`
  try {
    const response = await fetch(url, {
      method: 'PUT',
      body: `${JSON.stringify(request)}`,
    })
    if (response.ok) return (await response.json()) as Shipment

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return null
  }
}

export async function getShipmentById(query: { id: number }): Promise<Shipment | null> {
  const url = getURL({ baseURL: BASE_PBC_URI, path: 'getShipment', query })
  try {
    const response = await fetch(url, { method: 'GET' })
    if (response.ok) return (await response.json()) as Shipment

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return null
  }
}

export async function getShipmentsByRecipientId(query: { id: number }): Promise<Shipment[]> {
  const url = getURL({ baseURL: BASE_PBC_URI, path: 'getAllShipmentsByRecipient', query })
  try {
    const response = await fetch(url, { method: 'GET' })
    if (response.ok) return (await response.json()) as Shipment[]

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return []
  }
}

export async function deleteShipment(query: { id: number }): Promise<void | null> {
  const url = getURL({ baseURL: BASE_PBC_URI, path: 'deleteShipment', query })
  try {
    const response = await fetch(url, { method: 'DELETE' })
    if (response.ok) return (await response.json()) as void

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return
  }
}

export async function deleteAllShipmentsByRecipientId(query: { id: number }): Promise<void | null> {
  const url = getURL({ baseURL: BASE_PBC_URI, path: 'deleteAllShipmentsByRecipientId', query })
  try {
    const response = await fetch(url, { method: 'DELETE' })
    if (response.ok) return (await response.json()) as void

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return
  }
}

export async function getShipmentsByDate(query: { date: string }): Promise<Shipment[]> {
  const url = getURL({ baseURL: BASE_PBC_URI, path: 'getShipmentsByDate', query })
  try {
    const response = await fetch(url, { method: 'GET' })
    if (response.ok) return (await response.json()) as Shipment[]

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return []
  }
}

export async function getShipmentCountBetweenDates(query: {
  date1: string
  date2: string
}): Promise<number> {
  const url = getURL({ baseURL: BASE_PBC_URI, path: 'getShipmentCountBetweenDates', query })
  try {
    const response = await fetch(url, { method: 'GET' })
    if (response.ok) return (await response.json()) as number

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return -1
  }
}

// SpecialRequest
export async function createSpecialRequest(
  request: SpecialRequest,
): Promise<SpecialRequest | null> {
  const url = `${BASE_PBC_URI}/addSpecialRequest`
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: `${JSON.stringify(request)}`,
    })
    if (response.ok) return (await response.json()) as SpecialRequest

    throw new Error(`received non-200 status (status ${response.status})`)
  } catch (error) {
    console.error(`HTTP Error "${url}": ${error}`)
    return null
  }
}

// helper methods --------------------------------------------------------------
function getURL({
  baseURL,
  path,
  query,
}: {
  baseURL: string
  path: string
  query?: { [key: string]: any }
}): string {
  if (!query) return `${baseURL}/${path}`

  const queryString =
    '?' +
    Object.keys(query)
      .map((paramKey) => `${paramKey}=${JSON.stringify(query[paramKey])}`)
      .join('&')
  return `${baseURL}/${path}${queryString}`
}
