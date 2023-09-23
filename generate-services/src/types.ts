export interface TypeDefinition {
  type: 'interface' | 'enum' | 'primitive'
  null?: any
}

export interface PrimitiveDefinition extends TypeDefinition {
  type: 'primitive'
}

export interface InterfaceDefinition extends TypeDefinition {
  type: 'interface'
  extends?: string

  schema: any
  values: never
}

export interface EnumDefinition extends TypeDefinition {
  type: 'enum'

  values: string[]
  schema: never
}

export type Endpoint = {
  name?: string

  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'

  query?: {
    [queryParameter: string]: string
  }

  request?: string
  response: string | 'void'
}

export type TypeMap = {
  [typeName: string]: TypeDefinition | { [typeName: string]: TypeDefinition }

  primitives: {
    [typeName: string]: PrimitiveDefinition
  }
}

export type EndpointMap = {
  [domain: string]: Endpoint[]
}
