import { snakeCase } from 'lodash'
import { isEmpty } from './strings'

export enum ErrorStrategy {
  SILENT = 'SILENT',
  LOG = 'LOG',
  THROW = 'THROW',
}

export const ERROR_STRATEGY: ErrorStrategy = import.meta.env.VITE_ERROR_STRATEGY
export const BASE_PBC_URI = import.meta.env.VITE_BASE_PBC_URI

export const FEATURES: { [featureName: string]: boolean } = {
  SEARCH_SHIPMENTS_BY_DATE: import.meta.env.VITE_FEATURE_SEARCH_SHIPMENTS_BY_DATE === 'true',
  SEARCH_SHIPMENTS_BY_CONTENT: import.meta.env.VITE_FEATURE_SEARCH_SHIPMENTS_BY_CONTENT === 'true',
  DISPLAY_DAILY_SHIPMENTS: import.meta.env.VITE_FEATURE_DISPLAY_DAILY_SHIPMENTS === 'true',
  ADD_SPECIAL_REQUESTS: import.meta.env.VITE_FEATURE_ADD_SPECIAL_REQUESTS === 'true',
}

export const isFeatureEnabled = (featureName: string): boolean => {
  if (isEmpty(featureName)) return false
  const normalizedName = snakeCase(featureName.trim()).toUpperCase() ?? ''
  return FEATURES[normalizedName]
}
