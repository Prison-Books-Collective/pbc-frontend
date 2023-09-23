import { capitalize, camelCase } from 'lodash'
import path from 'path'
import { mkdir } from 'node:fs/promises'
import backend from './backend.json'

import type { FileSink } from 'bun'
import type {
  TypeMap,
  EndpointMap,
  Endpoint,
  TypeDefinition,
  EnumDefinition,
  InterfaceDefinition,
} from './types'

const types = backend.types as any as TypeMap
const endpoints = backend.endpoints as any as EndpointMap
const DRY_RUN = readBool(Bun.env.DRY_RUN, true)
const ENABLE_LOGGING = readBool(Bun.env.ENABLE_LOGGING, true)
const OUTPUT_FILE = Bun.env.OUTPUT_FILE ?? 'pbc-client.ts'
const OUTPUT_DIRECTORY = Bun.env.OUTPUT_DIRECTORY ?? 'output'
const IMPORT_PATH = Bun.env.IMPORT_PATH ?? '$util/app-config'
const IMPORT_SYMBOL = Bun.env.IMPORT_SYMBOL ?? 'BASE_PBC_URI'

console.log(OUTPUT_DIRECTORY)
writeFile()

// -----------------------------------------------------------------------------

function log(logMessage: string) {
  if (ENABLE_LOGGING) console.log(logMessage)
}

async function onActiveRun(callback: () => Promise<any> | any) {
  if (!DRY_RUN) await callback()
}

function readBool(input: string | undefined, fallback: boolean): boolean {
  input = input?.toLowerCase()
  if (input === 'true') return true
  if (input === 'false') return false
  return fallback
}

// -----------------------------------------------------------------------------

async function writeFile() {
  await onActiveRun(async () => {
    try {
      await mkdir(OUTPUT_DIRECTORY)
    } catch (_) {
      /* directory already exists */
    }
  })

  const writeFile = DRY_RUN ? null : Bun.file(path.join(OUTPUT_DIRECTORY, OUTPUT_FILE))
  const writer = DRY_RUN ? null : writeFile!.writer()

  onActiveRun(() => Bun.write(writeFile!, ''))

  writeHeader(writer!)
  writeImports(writer!)
  writeTypes(writer!)
  writeMethods(writer!)
  writeHelpers(writer!)

  onActiveRun(() => writer!.flush())
}

function writeHeader(writer: FileSink) {
  const text = `/**
*
* generated file
*
**/

`
  log(text)
  onActiveRun(() => writer!.write(text))
}

function writeImports(writer: FileSink) {
  const text = `import { ${IMPORT_SYMBOL} } from '${IMPORT_PATH}'\n\n`

  log(text)
  onActiveRun(() => writer!.write(text))
}

function writeTypes(writer: FileSink) {
  const text = `// type declarations -----------------------------------------------------------
${Object.keys(types)
  .filter((type) => type !== 'primitives')
  .map((type) => generateTypeDeclaration(type, types[type] as any))
  .join('\n')}
`

  log(text)
  onActiveRun(() => writer!.write(text))
}

function writeMethods(writer: FileSink) {
  const text = '// endpoint fetch methods ------------------------------------------------------\n'
  log(text)
  onActiveRun(() => writer!.write(text))

  for (const domain in endpoints) {
    const text = `\n// ${domain}
${endpoints[domain].map(generateEndpointMethod).join('\n')}
`
    log(text)
    onActiveRun(() => writer!.write(text))
  }
}

function writeHelpers(writer: FileSink) {
  const text = `\n// helper methods --------------------------------------------------------------
function getURL({ baseURL, path, query }: { baseURL: string, path: string, query?: { [key: string]: any } }): string {
  if(!query) return \`\${ baseURL }/\${ path }\`

  const queryString = '?' + Object.keys(query)
    .map(paramKey => \`\${ paramKey }=\${ JSON.stringify( query[ paramKey ] )}\`)
    .join('&')
  return \`\${ baseURL }/\${ path }\${ queryString }\`
} 
`
  log(text)
  onActiveRun(() => writer!.write(text))
}

// -----------------------------------------------------------------------------

function generateEndpointMethod(endpoint: Endpoint) {
  return `${generateEndpointMethodSignature(endpoint)} {
  ${generateEndpointMethodBody(endpoint)}
}
`
}

function generateEndpointMethodSignature(endpoint: Endpoint) {
  return `export async function ${generateEndpointMethodName(
    endpoint,
  )}(${generateEndpointMethodParams(endpoint)}): ${generateEndpointMethodReturnType(endpoint)}`
    .replace('( {', '({')
    .replace('} )', '})')
}

function generateEndpointMethodName(endpoint: Endpoint) {
  const { name, response, path } = endpoint
  if (name) return camelCase(name)
  if (response === 'void') return path

  const { method, query, request } = endpoint
  const responseName = response.replace(/\[\]$/m, 's').replace(/ys$/im, 'ies')
  const prefix = `${convertHTTPMethodName(method)}${responseName}`
  if (!query && (!request || request === '')) return prefix

  let identifiers: string[] = []
  if (query)
    identifiers = [
      ...identifiers,
      ...Object.keys(query).map((identifier) => capitalizeIdentifier(identifier)),
    ]
  if (request && request.length > 0) identifiers = [...identifiers, capitalizeIdentifier(request)]

  if (identifiers.length === 1 && identifiers[0] === responseName) return prefix
  return `${prefix}By${identifiers.join('And')}`
}

function generateEndpointMethodBody(endpoint: Endpoint) {
  return `const url = ${generateEmbeddedURL(endpoint)}
  try {
    const response = await fetch${generatedEmbeddedFetchOptions(endpoint)}
    if( response.ok ) return await response.json() as ${endpoint.response}

    throw new Error( \`received non-200 status (status \${ response.status })\` )
  } catch(error) {
    console.error( \`HTTP Error "\${ url }": \${ error }\` )
    return ${generateReturnValue(endpoint)}
  }`
}

function generateEmbeddedURL({ query, path }: Endpoint) {
  return !!query
    ? `getURL({ baseURL: ${IMPORT_SYMBOL}, path: '${path}', query })`
    : `\`\${ ${IMPORT_SYMBOL} }/${path}\``
}

function generatedEmbeddedFetchOptions({ method, request }: Endpoint) {
  if (!request) return `( url, { method: '${method}' })`
  return `(
        url, {
          method: '${method}',
          body: \`\${ JSON.stringify( request ) }\`,
        })`
}

function generateReturnValue({ response }: Endpoint) {
  if (response === 'void') return ''
  if (response.endsWith('[]')) return '[]'
  if (response in types.primitives) return types.primitives[response].null
  return 'null'
}

function generateEndpointMethodParams(endpoint: Endpoint) {
  const [query, request] = [
    generateMethodQueryParams(endpoint),
    generateRequestBodyParams(endpoint),
  ]
  if (query === '' && request === '') return ''
  return ` ${[query, request].filter((signature) => signature !== '').join(', ')} `
}

function generateEndpointMethodReturnType(endpoint: Endpoint) {
  const isPrimitive = endpoint.response in types.primitives
  const isArray = !isPrimitive && endpoint.response.endsWith('[]')

  return isPrimitive || isArray
    ? `Promise<${endpoint.response}>`
    : `Promise<${endpoint.response} | null>`
}

// -----------------------------------------------------------------------------

function generateMethodQueryParams(endpoint: Endpoint) {
  if (!endpoint.query) return ''

  const keyValuePairStrings = Object.keys(endpoint.query).map((queryParam) => {
    const queryValue = endpoint.query![queryParam]
    if (queryValue.includes('Optional'))
      return `${queryParam}?: ${queryValue.split('Optional ')[1]}`
    return `${queryParam}: ${queryValue}`
  })

  return `query: { ${keyValuePairStrings.join(', ')} }`
}

function generateRequestBodyParams(endpoint: Endpoint) {
  if (!endpoint.request || endpoint.request.length === 0) return ''
  return `request: ${endpoint.request}`
}

function capitalizeIdentifier(identifier: string): string {
  if (identifier in types.primitives) return capitalize(identifier)
  return `${capitalize(identifier[0])}${identifier.slice(1)}`
}

function convertHTTPMethodName(method: 'GET' | 'POST' | 'PUT' | 'DELETE') {
  switch (method) {
    case 'GET':
      return 'get'
    case 'POST':
      return 'create'
    case 'PUT':
      return 'update'
    case 'DELETE':
      return 'delete'
  }
}

function generateTypeDeclaration(typeName: string, typeData: TypeDefinition): string {
  // if(typeData.type === 'enum') return `const ${typeName} = Object.freeze({${ typeData.values.map((entry: string) => `'${entry}': ${entry}`) }})`
  if (typeData.type === 'enum')
    return `export enum ${typeName} {\n  ${(typeData as EnumDefinition).values.join(',\n  ')}\n}\n`

  const interfaceData = typeData as InterfaceDefinition
  return `export interface ${typeName} ${
    !!interfaceData.extends ? `extends ${interfaceData.extends} ` : ''
  }{
  ${Object.keys(interfaceData.schema)
    .map((schemaEntry) => `${schemaEntry}: ${interfaceData.schema[schemaEntry]}`)
    .join('\n  ')}
}\n`
}
