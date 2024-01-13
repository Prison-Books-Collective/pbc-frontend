import * as ts from 'typescript'
import * as fs from 'fs/promises'
import { join } from 'path'

import apidocs from './openapi/openapi.json'

type EndpointData = {
  meta: {
    methodName: string
    controller: string
  }

  method: 'get' | 'post' | 'put' | 'delete'
  path: string

  query?: { [index: string | number | symbol]: string }
  pathVariables?: { [index: string | number | symbol]: string }
  body?: {
    required: boolean
    type: string
  }
  response?: string
}

const apiBaseURL = apidocs.servers[0].url
const interfaceNames = Object.keys(apidocs.components.schemas)

const outputDirectory = join('dist', 'api')
const outputModelsFile = 'models.ts'
const outputEndpointsFile = 'endpoints.ts'
const outputIndexFile = 'index.ts'

const inputFilePath = 'src/openapi/openapi.ts'
const program = ts.createProgram([inputFilePath], {})

const source = program.getSourceFile(inputFilePath)
let outputBuffer = ''

async function writeBufferToFile(file: string) {
  try {
    await fs.mkdir(outputDirectory, { recursive: true })
  } catch (_) {
    /* Directory already exists */
  }
  await fs.writeFile(join(outputDirectory, file), outputBuffer)
  outputBuffer = ''
}

function convertValue(type: string): string {
  if (type === 'integer') return 'number'
  return type
}

function parseSchema(value: any): string {
  // { type: "type or array or undefined", $ref: "undefined or points to schema", items: "present when type=array, presumably has type or ref" }
  if (value.oneOf)
    return value.oneOf.map(({ $ref }: { $ref: string }) => parse$Ref($ref)).join(' | ')
  if (value.enum && value.type === 'string')
    return value.enum.map((value: string) => `'${value}'`).join(' | ')
  if (value.items && value.type !== 'array') return parseSchema(value.items)
  if (value.type === 'array') {
    if (value.items.type) return convertValue(value.items.type) + '[]'
    return parseSchema(value.items).replaceAll(/(\w+)/g, '$1[]')
  }

  return convertValue(value.type) ?? parse$Ref(value.$ref)
}

function parse$Ref(value: string): string {
  return value?.replace('#/components/schemas/', '')
}

function bufferModels() {
  outputBuffer = 'export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }\n'

  const componentsInterface = source!.statements.find(
    (statement) =>
      ts.isInterfaceDeclaration(statement) &&
      statement.name &&
      statement.name.text === 'components',
  ) as ts.InterfaceDeclaration | undefined
  if (componentsInterface) {
    const schemasProperty = componentsInterface.members.find(
      (statement) =>
        ts.isPropertySignature(statement) && statement.name?.getText(source) === 'schemas',
    ) as ts.PropertySignature | undefined
    if (schemasProperty) {
      schemasProperty.forEachChild((node) => {
        if (ts.isTypeLiteralNode(node)) {
          node.forEachChild((node) => {
            const components = node.getText(source).split(':')
            const name = components.shift()
            const declaration = components
              .join(':')
              .trim()
              .replace(/components\["schemas"\]\["(\w+)"\]/gi, '$1')
              .replaceAll(/ {2,}/g, '  ')
              .replaceAll(/^  \}/gm, '}')
            const type = `export type ${name} = ${declaration}`.replaceAll(';', '')
            outputBuffer += `\n${type}\n`
          })
        }
      })
    }
  }
}

function bufferEndpoints() {
  outputBuffer = `import type {\n`
  interfaceNames.forEach((name) => (outputBuffer += `  ${name},\n`))
  outputBuffer += `} from './models'\n\n`
  outputBuffer += `type Fetch = (input: URL | RequestInfo, init?: RequestInit) => Promise<Response>\n\n`

  outputBuffer += `export const BASE_URL = '${apiBaseURL}'\n\n`

  outputBuffer += `function resolveURL(url: URL, { query, path }: { query?: {[index: string]: any}, path?: {[index: string]: any}}): string {\n`
  outputBuffer += `  let resolvedURL = url.toString()\n`
  outputBuffer += `  \n`
  outputBuffer += `  if (path) {\n`
  outputBuffer += `    for (const [key, value] of Object.entries(path)) {\n`
  outputBuffer += `      const variablePattern = new RegExp(\`{\s*\${key}\s*}\`, 'g')\n`
  outputBuffer += `      resolvedURL = resolvedURL.replace(variablePattern, value)\n`
  outputBuffer += `    }\n`
  outputBuffer += `  }\n`
  outputBuffer += `\n`
  outputBuffer += `  if (query) {\n`
  outputBuffer += `    const searchParams = new URLSearchParams(query)\n`
  outputBuffer += `    const queryString = searchParams.toString()\n`
  outputBuffer += `\n`
  outputBuffer += `    if (queryString) {\n`
  outputBuffer += `      resolvedURL += resolvedURL.includes('?') ? \`&\${queryString}\` : \`?\${queryString}\`\n`
  outputBuffer += `    }\n`
  outputBuffer += `  }\n`
  outputBuffer += `\n`
  outputBuffer += `  return resolvedURL\n`
  outputBuffer += `}\n\n`

  const endpoints = getEndpoints()
  const endpointMethods = endpoints.map(createEndpointMethod)
  endpointMethods.forEach((method) => (outputBuffer += method + '\n\n'))
}

function getEndpoints(): EndpointData[] {
  const endpoints = []
  for (const path in apidocs.paths) {
    // @ts-expect-error typescript for whatever reason does not recognize path as a valid key of apidocs.paths
    const allOperations = apidocs.paths[path]
    for (const httpMethod in allOperations) {
      const details = allOperations[httpMethod]
      const query = (details.parameters?.filter((parameter: any) => parameter.in === 'query') ??
        []) as any[]
      const pathVariables = (details.parameters?.filter(
        (parameter: any) => parameter.in === 'path',
      ) ?? []) as any[]
      const hasBody = !!details.requestBody

      const endpoint = {
        meta: {
          methodName: details.operationId,
          controller: details.tags[0],
        },
        method: httpMethod,
        path,
      } as any

      if (query.length > 0) {
        endpoint.query = {}
        query.forEach((parameter) => {
          endpoint.query[`${parameter.name}${parameter.required ? '' : '?'}`] = parseSchema(
            parameter.schema,
          )
        })
      }

      if (pathVariables.length > 0) {
        endpoint.pathVariables = {}
        pathVariables.forEach((parameter) => {
          endpoint.pathVariables[`${parameter.name}${parameter.required ? '' : '?'}`] = parseSchema(
            parameter.schema,
          )
        })
      }

      if (hasBody) {
        endpoint.body = {
          type: parseSchema(details.requestBody.content['application/json'].schema),
          required: details.requestBody.required,
        }
      }

      if (details.responses['200'].content) {
        endpoint.response = parseSchema(details.responses['200'].content['*/*'].schema)
      }

      endpoints.push(endpoint)
    }
  }
  return endpoints
}

const tsStringify = (
  obj: { [index: string | number | symbol]: any },
  addWhitespace = false,
  indentCount = 2,
): string => {
  const transform = JSON.stringify(
    obj,
    null,
    addWhitespace ? ''.padStart(indentCount, ' ') : undefined,
  )
    .replaceAll('"', '')
    .replaceAll(':', ': ')
    .replaceAll(',', ', ')
    .replace(/^}$/m, '}'.padStart(indentCount - 1, ' '))
  if (!addWhitespace) return transform.replace(/^{/m, '{ ').replace(/}$/m, ' }')
  return transform
}

function createFunctionSignature(endpoint: EndpointData): string[] {
  const hasQuery = 'query' in endpoint
  const hasVariables = 'pathVariables' in endpoint
  const hasBody = 'body' in endpoint

  const sum: number = [hasQuery, hasVariables, hasBody]
    .map((truthy) => (truthy ? 1 : 0) as number)
    .reduce((acc: number, next) => acc + next)

  let fnArguments: string[] = []

  if (sum === 1) {
    if (hasQuery)
      fnArguments.push(
        '  query: ' + tsStringify(endpoint.query!, Object.keys(endpoint.query!).length > 2, 4),
      )
    if (hasVariables)
      fnArguments.push(
        '  path: ' +
          tsStringify(endpoint.pathVariables!, Object.keys(endpoint.pathVariables!).length > 2, 4),
      )
    if (hasBody)
      fnArguments.push(`  body${endpoint.body!.required ? '' : '?'}: ` + endpoint.body!.type)
  } else if (sum > 1) {
    fnArguments.push(
      '  { ' +
        [hasQuery ? 'query' : null, hasVariables ? 'path' : null, hasBody ? 'body' : null]
          .filter((x) => !!x)
          .join(', ') +
        ' }: {',
    )

    if (hasQuery) {
      const typedef =
        Object.keys(endpoint.query!).length > 1
          ? tsStringify(endpoint.query!, true, 6).split('\n')
          : [tsStringify(endpoint.query!)]
      fnArguments.push('    query: ' + typedef.shift() + (typedef.length > 0 ? '' : ', '))
      if (typedef.length > 0)
        typedef.forEach((line, index) =>
          fnArguments.push(line + (index === typedef.length - 1 ? ', ' : '')),
        )
    }

    if (hasVariables) {
      const typedef =
        Object.keys(endpoint.pathVariables!).length > 1
          ? tsStringify(endpoint.pathVariables!, true, 6).split('\n')
          : [tsStringify(endpoint.pathVariables!)]
      fnArguments.push(
        '    path: ' + typedef.shift() + (typedef.length === 0 && hasBody ? ', ' : ''),
      )
      if (typedef.length > 0)
        typedef.forEach((line, index) =>
          fnArguments.push(line + (index === typedef.length - 1 && hasBody ? ', ' : '')),
        )
    }

    if (hasBody) {
      fnArguments.push(`    body${endpoint.body!.required ? '' : '?'}: ` + endpoint.body!.type)
    }

    fnArguments.push('  }')
  }

  return [
    `export async function ${endpoint.meta.methodName}(`,
    '  fetch: Fetch,',
    ...fnArguments,
    `): Promise<${endpoint?.response ? endpoint.response + ' | undefined' : 'void'}> {`,
  ]
}

function createEndpointMethod(endpoint: EndpointData) {
  const hasQuery = 'query' in endpoint
  const hasVariables = 'pathVariables' in endpoint
  const hasBody = 'body' in endpoint

  const functionSignature = createFunctionSignature(endpoint)
  const pathOptions =
    hasQuery && hasVariables
      ? `{ query, path }`
      : hasQuery
      ? `{ query }`
      : hasVariables
      ? `{ path }`
      : null

  const declareURL = !!pathOptions
    ? [
        `const url = resolveURL(`,
        `  new URL('${endpoint.path}', BASE_URL),`,
        `  ${pathOptions},`,
        `)`,
      ]
    : [`const url = new URL('${endpoint.path}', BASE_URL).toString()`]

  return [
    ...functionSignature,
    ...declareURL.map((text) => `  ${text}`),
    `  const options: RequestInit = {`,
    `    method: '${endpoint.method}',`,
    `    headers: { 'Content-Type': 'application/json' },`,
    endpoint.body && endpoint.body.required ? `    body: JSON.stringify(body),` : null,
    `  }`,
    ...(endpoint.body && !endpoint.body.required
      ? ['', `  if(body) options.body = JSON.stringify(body)`]
      : [null]),
    '',
    `  try {`,
    `    const response = await fetch(url, options)`,
    `    if (!response.ok)`,
    `      throw new Error(\`Request failed with status: \${ response.status }\`)`,
    endpoint.response ? `    return await response.json() as ${endpoint.response}` : `    return`,
    `  } catch(error) {`,
    ...(hasBody && endpoint.body!.required
      ? [
          `    console.error(\`received error while fetching url("\${ url }") with data(\${ JSON.stringify(body) })\`, error)`,
        ]
      : hasBody
      ? [
          `    if(body) console.error(\`received error while fetching url("\${ url }") with data(\${ JSON.stringify(body) })\`, error)`,
          `    else console.error(\`received error while fetching url: \${ url }\`, error)`,
        ]
      : [`    console.error(\`received error while fetching url: \${ url }\`, error)`]),
    `    return undefined`,
    `  }`,
    `}`,
  ]
    .filter((x) => x !== null)
    .join('\n')
}

function bufferIndex() {
  outputBuffer = `export * from './models'
export * from './endpoints'
`
}

if (source) {
  bufferModels()
  await writeBufferToFile(outputModelsFile)

  bufferEndpoints()
  await writeBufferToFile(outputEndpointsFile)

  bufferIndex()
  await writeBufferToFile(outputIndexFile)

  console.log(`Finished Processing`)
} else {
  console.error(`Error: Source file ${inputFilePath} not found.`)
}
