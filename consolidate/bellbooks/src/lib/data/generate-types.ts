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
    .replaceAll(/export interface (\w+)/gm, (current) => {
      const components = current.split(' ')
      const className = components.at(-1)
      components[components.length - 1] = `${className![0].toUpperCase()}${className?.slice(1)}`
      return components.join(' ')
    })

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
