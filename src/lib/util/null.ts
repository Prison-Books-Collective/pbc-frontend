type Nullish = null | undefined
export type Nullable<T> = T | Nullish

export function isDefined<T>(value: Nullable<T>): value is T {
  return value !== null && value !== undefined
}

export function isNullish(value: unknown): value is Nullish {
  return value === null || value === undefined
}
