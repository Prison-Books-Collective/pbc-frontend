const inFile = Bun.file('./src/db/schema.ts')
const inFileContent = await inFile.text()

const outFile = Bun.file('./src/db/types.ts')
const outFileContent =
  `// type definitions generated from $db/schema.ts` +
  inFileContent
    .replaceAll(/^import .+$\n/gm, '')
    .replaceAll(
      /^\t(\w+): (\w+)\("(\w+)".+\}\)\.notNull\(\),/gm,
      '  $1: $2 // name("$3"), required',
    )
    .replaceAll(/^\t(\w+): (\w+)\("(\w+)".+\}\),/gm, '  $1: $2 // name("$3"), optional')
    .replaceAll(
      /^\t(\w+): (\w+)\("(\w+)".+\}\)\.references\(\(\) => (\w+)\.(\w+)\),/gm,
      '  $1: $2 // name("$3"), foreign key on $4:$5',
    )
    .replaceAll(
      /^\t(\w+): (\w+)\("(\w+)".+\.references\(\(\) => (\w+)\.(\w+)\),/gm,
      '  $1: $2 // name("$3"), foreign key on $4:$5',
    )
    .replaceAll(/export const (\w+) = mysqlTable\("(\w+)", \{/gm, 'export interface $1 {')
    .replaceAll(/\},\n\(table\) => \{(\n.+$)+/gm, '}')
    .replaceAll(/\}\);/gm, '}')
    .replaceAll(/bigint/gm, 'number')
    .replaceAll(/varchar/gm, 'string')
    .replaceAll(/: date/gm, ': string')
    .replaceAll(/^\s+\/\/ you can use .+$\n/gim, '')
    .replaceAll(/(\w+): (\w+) (\/\/ .+optional)/gim, '$1?: $2 $3')
    .replaceAll(/export interface (\w+)/gm, (match) => {
      const components = match.split(' ')
      const className = components.at(-1)
      components[components.length - 1] = `${className![0].toUpperCase()}${className?.slice(1)}`
      return components.join(' ')
    })
    .replaceAll(
      /export interface (\w+) \{(\n.+)+\n\}/gim, // matches the entire interface declaration
      (match: string) => {
        const className = match.replace(/^export interface (\w+) \{/m, '$1').split('\n')[0]
        const matchedLines = match.match(
          /^\s+(\w+)(?::|\?:) (\w+) \/\/.+(required|optional|foreign key on \w+:\w+)$/gim,
        )
        const parsedLines = matchedLines!.map((line) => {
          const matches = line.match(
            /^\s+(\w+)(?::|\?:) (\w+) \/\/.+(required|optional|foreign key on \w+:\w+)$/im,
          )
          return {
            field: matches![1],
            type: matches![2],
            required: matches![3] !== 'optional',
          }
        })

        const requiredParsedLines = parsedLines.filter((x) => x.required)
        if (requiredParsedLines.length === 0) return match

        const validationParams = requiredParsedLines.map((x) => x.field).join(', ')
        const validationLines = requiredParsedLines.map(({ field, type }) => {
          if (field === 'id') return `if(isIdRequired && (!id || id < 0)) return false`
          if (type === 'string') return `if(!${field} || ${field}.trim() === '') return false`
          if (type === 'number') return `if(!${field}) return false`
          return ''
        })
        const validationErrorLines = requiredParsedLines.map(({ field, type }) => {
          if (field === 'id')
            return `if(isIdRequired) {
    if(!id) errors.push('missing: ${field}')
    if(!!id && id < 0) errors.push('invalid: ${field}: cannot be less than zero')
  }`
          if (type === 'string')
            return `if(!${field} || ${field}.trim() === '') errors.push('missing: ${field}')`
          if (type === 'number') return `if(!${field}) errors.push('missing: ${field}')`
          return ''
        })
        const validationErrorsSignature = `export function get${className}ValidationErrors({${validationParams}}: Partial<${className}>${
          validationParams.includes('id') ? ', isIdRequired = false' : ''
        }): string[]`
        const validationSignature = `export function is${className}Valid({${validationParams}}: Partial<${className}>${
          validationParams.includes('id') ? ', isIdRequired = false' : ''
        }): boolean`
        const validationMethod = `${validationSignature} {${
          validationLines.length > 0 ? '\n  ' + validationLines.join('\n  ') : ''
        }
  return true
}`

        const validationErrorsMethod = `${validationErrorsSignature} {${
          validationErrorLines.length > 0
            ? '\n  const errors: string[] = []\n  ' + validationErrorLines.join('\n  ')
            : ''
        }
  return ${validationErrorLines.length === 0 ? '[]' : 'errors'}
}`
        return `${match}

${validationMethod}

${validationErrorsMethod}
`
      },
    )

const writeFile = (message: string = 'added database type definitions in src/db/types.ts') => {
  Bun.write(outFile, outFileContent)
  console.log(message)
}

try {
  const currentOutput = await outFile.text()
  if (currentOutput != outFileContent) {
    writeFile(`database schema has been updated, updated type definitions in src/db`)
  }
} catch (_) {
  writeFile()
}
