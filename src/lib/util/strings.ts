export const isEmpty = (input: string | null | undefined) => {
  return !input || input.toString().trim() === ''
}
