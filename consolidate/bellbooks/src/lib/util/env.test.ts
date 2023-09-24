import { describe, test, expect } from 'vitest'
import { envBool, envInt } from './env'

describe('envInt(): Parse Integer .env Values', () => {
  const variableName = 'Test Integer'

  test('returns an integer when provided an integer string', () => {
    const expectedResult = Math.floor(Math.random() * 1200)
    const input = expectedResult.toString()
    const result = envInt(variableName, input)

    expect(result).toEqual(expectedResult)
  })

  test('returns correct integer value when provided an string with leading/trailing whitespace', () => {
    const expectedResult = Math.floor(Math.random() * 1200)
    const input = `\n${expectedResult} \t`
    const result = envInt(variableName, input)

    expect(result).toEqual(expectedResult)
  })

  test('returns correct integer value when provided an string containing underscores', () => {
    const input = '4_000_000_000'
    const expectedResult = 4000000000
    const result = envInt(variableName, input)

    expect(result).toEqual(expectedResult)
  })

  test('throws an error when provided nothing', () => {
    const invalidInputs = [null, undefined, '', '  ']
    invalidInputs.forEach((input) => {
      const testCallback = () => envInt(variableName, input)
      expect(testCallback, `Using "${input}"`).toThrow(variableName)
      expect(testCallback, `Using "${input}"`).toThrow('no value was provided')
    })
  })

  test('throws an error when provided a non-parseable string', () => {
    const input = 'sandwich'
    const testCallback = () => envInt(variableName, input)

    expect(testCallback).toThrow(variableName)
    expect(testCallback).toThrow('NaN')
  })

  test('throws an error when provided a floating point value', () => {
    const input = (0.1 + Math.floor(Math.random() * 1200)).toString()
    const testCallback = () => envInt(variableName, input)

    expect(testCallback).toThrow(variableName)
    expect(testCallback).toThrow('length')
  })

  test('throws an error when provided a value with leading 0', () => {
    const input = '0' + Math.floor(Math.random() * 1200).toString()
    const testCallback = () => envInt(variableName, input)

    expect(testCallback).toThrow(variableName)
    expect(testCallback).toThrow('length')
  })
})

describe('envBool(): Parse Boolean .env Values', () => {
  const variableName = 'Test Boolean'

  test('correctly parses true, case insensitive', () => {
    const truthyInputs = ['t', 'T', '1', 'TRUE', 'true', 'tRuE']
    truthyInputs.forEach((input) => {
      expect(envBool(variableName, input), `Using "${input}"`).toBeTruthy()
    })
  })

  test('correctly parses false, case insensitive', () => {
    const falsyInputs = ['f', 'F', '0', 'FALSE', 'false', 'fAlSe']
    falsyInputs.forEach((input) => {
      expect(envBool(variableName, input), `Using "${input}"`).toBeFalsy()
    })
  })

  test('correctly parses values with extra leading/trailing whitespace', () => {})

  test('throws an error when provided nothing', () => {
    const invalidInputs = [null, undefined, '', '  ']
    invalidInputs.forEach((input) => {
      const testCallback = () => envBool(variableName, input)
      expect(testCallback, `Using "${input}"`).toThrow(variableName)
      expect(testCallback, `Using "${input}"`).toThrow('no value was provided')
    })
  })

  test('fails to parse values that are not true or false', () => {
    const invalidInputs = ['11', 'help', 'yes', 'null']
    invalidInputs.forEach((input) => {
      const testCallback = () => envBool(variableName, input)
      expect(testCallback, `Using "${input}"`).toThrow('parse')
    })
  })
})
