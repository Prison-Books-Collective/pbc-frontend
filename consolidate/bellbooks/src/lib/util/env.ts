export function envInt(variableName: string, variableValue: string) {
  try {
    if (!variableValue) throw new Error('no value was provided')
    variableValue = variableValue.trim().replaceAll('_', '')
    if (variableValue === '') throw new Error('no value was provided')
    const value = parseInt(variableValue)

    if (Number.isNaN(value)) throw new Error(`parsed value is not a number (NaN)`)
    if (variableValue.length !== value.toString().length)
      throw new Error(`parsed length is not equal to the original length`)
    return value
  } catch (error) {
    throw new Error(
      `.env error: could not parse "${variableName}=${variableValue}" as an integer. details: ${error}`,
    )
  }
}

export function envBool(variableName: string, variableValue: string) {
  if (!variableValue)
    throw new Error(
      `Error: could not parse environment variable "${variableName}": no value was provided`,
    )
  const value = (variableValue ?? '').toLowerCase().trim()
  if (value === '')
    throw new Error(
      `Error: could not parse environment variable "${variableName}": no value was provided`,
    )

  if (value === 'true' || value === 't' || value === '1') return true
  if (value === 'false' || value === 'f' || value === '0') return false
  throw new Error(
    `Error: could not parse environment variable "${variableName}=${variableValue}" as a boolean`,
  )
}
