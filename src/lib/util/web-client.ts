import { CONTENT_TYPE_JSON, METHOD_GET, HTTP_GET, HTTP_POST, HTTP_PUT, HTTP_DELETE } from './web'
import type { QueryParamMap } from './web'
import { ErrorStrategy } from '$util/error'

export const ERROR_STRATEGY: ErrorStrategy = import.meta.env.ERROR_STRATEGY

export type HTTPMethod = typeof HTTP_GET | typeof HTTP_POST | typeof HTTP_PUT | typeof HTTP_DELETE
export type HTTPStatus = number | string // ex: 200, 201, 200s, 400s

export interface HTTPError {
  httpStatus: HTTPStatus
  httpMethod: HTTPMethod
  httpEndpoint: string

  error?: Error
  message?: string
}

export interface HTTPResponse<ResponseType> {
  httpStatus?: HTTPStatus
  data?: ResponseType
  error?: Error
}

export interface Endpoint {
  method: HTTPMethod
  uri: (params?: any) => string
}
export interface EndpointMap {
  [name: string]: Endpoint
}

export interface HTTPFetchOptions<RequestType, ResponseType> {
  params?: QueryParamMap
  body?: RequestType

  acceptedStatuses?: HTTPStatus[]
  defaultData?: ResponseType | null
  additionalStatusHandlers?: {
    matchStatuses: HTTPStatus[]
    handler: (
      endpoint: Endpoint,
      response: Response,
      options: Omit<HTTPFetchOptions<RequestType, ResponseType>, 'additionalStatusHandlers'>,
    ) => HTTPResponse<ResponseType>
  }[]
}

export abstract class WebClient<T extends EndpointMap> {
  protected name = 'Web Client'
  protected endpoints: T

  constructor(name: string, endpoints: T) {
    this.name = name
    this.endpoints = endpoints
  }

  private logID = ({
    httpMethod,
    httpEndpoint,
  }: {
    httpMethod: HTTPMethod
    httpEndpoint: string
  }) => `[ ${this.name} ]( ${httpMethod} )( ${httpEndpoint} )`

  protected throwError({
    httpStatus,
    httpMethod,
    httpEndpoint,

    error,
    message,
  }: HTTPError) {
    const throwError = new Error(
      `${this.logID({ httpMethod, httpEndpoint })} Failed with status <${httpStatus}>. `,
    )
    if (message) throwError.message += message
    if (error) throwError.cause = error

    throw throwError
  }

  protected logError({
    httpStatus,
    httpMethod,
    httpEndpoint,

    error,
    message,
  }: HTTPError) {
    console.error(`${this.logID({ httpMethod, httpEndpoint })} Failed with status <${httpStatus}>`)
    if (error && message)
      console.error(`${this.logID({ httpMethod, httpEndpoint })}`, message, error)
    else {
      if (message) console.error(`${this.logID({ httpMethod, httpEndpoint })}`, message)
      if (error) console.error(`${this.logID({ httpMethod, httpEndpoint })}`, error)
    }
  }

  private static isHTTPStatusMatch(matchStatuses: HTTPStatus[], httpStatus: HTTPStatus) {
    for (const matchStatus of matchStatuses) {
      if (httpStatus.toString() == matchStatus.toString()) return true
      if (matchStatus.toString().endsWith('s')) {
        const matchRange = matchStatus.toString()[0]
        const codeRange = httpStatus.toString()[0]
        if (matchRange == codeRange) return true
      }
    }
    return false
  }

  private async httpMutate<RequestType, ResponseType>(
    endpoint: Endpoint,
    {
      acceptedStatuses = ['200s'],
      params,
      defaultData,
      body,
      additionalStatusHandlers,
    }: HTTPFetchOptions<RequestType, ResponseType>,
  ) {
    const uri = endpoint.uri(params)

    try {
      const response = await fetch(uri, {
        method: endpoint.method,
        headers: { ...CONTENT_TYPE_JSON },
        body: body ? JSON.stringify(body) : undefined,
      })

      if (WebClient.isHTTPStatusMatch(acceptedStatuses, response.status)) {
        const data: ResponseType = await response.json()
        return { httpStatus: response.status, data }
      }

      if (additionalStatusHandlers && additionalStatusHandlers.length > 0) {
        for (const { matchStatuses, handler } of additionalStatusHandlers) {
          if (WebClient.isHTTPStatusMatch(matchStatuses, response.status)) {
            handler(endpoint, response, { acceptedStatuses, params, defaultData })
          }
        }
      }

      return {
        httpStatus: response.status,
        data: defaultData ?? undefined,
      }
    } catch (error) {
      return {
        error: error as Error,
        data: defaultData ?? undefined,
      }
    }
  }

  private async httpGet<ResponseType>(
    endpoint: Endpoint,
    {
      acceptedStatuses = ['200s'],
      params,
      defaultData,
      additionalStatusHandlers,
    }: Omit<HTTPFetchOptions<never, ResponseType>, 'body'>,
  ): Promise<HTTPResponse<ResponseType>> {
    const uri = endpoint.uri(params)
    if (endpoint.method !== HTTP_GET)
      return {
        error: new Error(
          `${this.logID({
            httpEndpoint: uri,
            httpMethod: HTTP_GET,
          })} This is not a "${HTTP_GET}" endpoint`,
        ),
        data: defaultData ?? undefined,
      }

    try {
      const response = await fetch(uri, { ...METHOD_GET })

      if (WebClient.isHTTPStatusMatch(acceptedStatuses, response.status)) {
        const data: ResponseType = await response.json()
        return { httpStatus: response.status, data }
      }

      if (additionalStatusHandlers && additionalStatusHandlers.length > 0) {
        for (const { matchStatuses, handler } of additionalStatusHandlers) {
          if (WebClient.isHTTPStatusMatch(matchStatuses, response.status)) {
            return handler(endpoint, response, { acceptedStatuses, params, defaultData })
          }
        }
      }

      return {
        httpStatus: response.status,
        data: defaultData ?? undefined,
      }
    } catch (error) {
      return {
        error: error as Error,
        data: defaultData ?? undefined,
      }
    }
  }

  protected async fetch<RequestType, ResponseType>(
    endpoint: Endpoint,
    options: HTTPFetchOptions<RequestType, ResponseType>,
  ): Promise<ResponseType | null> {
    if (!options.acceptedStatuses) {
      options.acceptedStatuses = ['200s']
    }
    if (!options.defaultData) {
      options.defaultData = null
    }

    const response =
      endpoint.method === HTTP_GET
        ? await this.httpGet<ResponseType>(endpoint, options)
        : await this.httpMutate<RequestType, ResponseType>(endpoint, options)

    if (response.error) {
      switch (ERROR_STRATEGY) {
        case ErrorStrategy.SILENT:
          break
        case ErrorStrategy.LOG:
          this.logError({
            httpMethod: endpoint.method,
            httpStatus: response.httpStatus ?? 0,
            httpEndpoint: endpoint.uri(options.params),
            error: response.error,
          })
          break
        case ErrorStrategy.THROW:
          this.throwError({
            httpMethod: endpoint.method,
            httpStatus: response.httpStatus ?? 0,
            httpEndpoint: endpoint.uri(options.params),
            error: response.error,
          })
      }
      return response.data ?? options.defaultData
    }

    return response.data ?? options.defaultData
  }

  protected async alwaysFetch<RequestType, ResponseType>(
    endpoint: Endpoint,
    defaultData: ResponseType,
    options: HTTPFetchOptions<RequestType, ResponseType>,
  ): Promise<ResponseType> {
    const data = await this.fetch(endpoint, { ...options, defaultData })
    if (data) return data
    return defaultData
  }
}
