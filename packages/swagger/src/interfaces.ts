//https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md

export type OpenApiJSONType = {
  openapi: string
  info: InfoType
  servers?: ServerType[]
  paths: PathType
  components?: ComponentType
  security?: SecurityRequirementType[]
  tags?: TagType[]
  externalDocs?: ExternalDocsType
}

export type InfoType = {
  title: string
  description?: string
  termsOfService?: string
  contact?: ContactType
  license?: LicenseType
  version: string
}

type ContactType = {
  name?: string
  url?: string
  email?: string
}

type LicenseType = {
  name: string
  url?: string
}

type ServerType = {
  url: string
  description?: string
  variables?: { [key: string]: ServerVariableType }
}

type ServerVariableType = { enum?: string[]; default: string; description?: string }

type ComponentType = {
  schemas?: { [key: string]: SchemaType | ReferenceType }
  responses?: { [key: string]: ResponseType | ReferenceType }
  parameters?: { [key: string]: ParameterType | ReferenceType }
  examples?: { [key: string]: ExampleType | ReferenceType }
  requestBodies?: { [key: string]: RequestBodyType | ReferenceType }
  headers?: { [key: string]: HeaderType | ReferenceType }
  securitySchemes?: { [key: string]: SecuritySchemeType | ReferenceType }
  links?: { [key: string]: LinkType | ReferenceType }
  callbacks?: { [key: string]: CallbackType | ReferenceType }
}

export type PathType = {
  [path: string]: PathItemType
}

type PathItemType = {
  $ref?: string
  summary?: string
  description?: string
  get?: OperationType
  put?: OperationType
  post?: OperationType
  delete?: OperationType
  options?: OperationType
  head?: OperationType
  patch?: OperationType
  trace?: OperationType
  servers?: ServerType[]
  parameters?: (ParameterType | ReferenceType)[]
}

export type OperationType = {
  tags?: string[]
  summary?: string
  description?: string
  externalsDocs?: ExternalDocsType
  operationId?: string
  parameters?: (ParameterType | ReferenceType)[]
  requestBody?: RequestBodyType | ReferenceType
  responses: ResponsesType
  callbacks?: { [key: string]: CallbackType | ReferenceType }
  deprecated?: boolean
  security?: SecurityRequirementType[]
  servers?: ServerType[]
}

type ExternalDocsType = {
  description?: string
  url: string
}

type ParameterType = {
  name: string
  in: 'query' | 'header' | 'path' | 'cookie'
  description?: string
  required?: boolean
  deprecated?: boolean
  allowEmptyValue?: boolean
  style?: 'matrix' | 'label' | 'form' | 'simple' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject'
  explode?: boolean
  allowReserved?: boolean
  schema?: SchemaType | ReferenceType
  example?: any
  examples?: { [key: string]: ExampleType | ReferenceType }
  content?: { [key: string]: MediaTypeType }
}

type RequestBodyType = {
  description?: string
  content: { [key: string]: MediaTypeType }
  required?: boolean
}

type MediaTypeType = {
  schema?: SchemaType | ReferenceType
  example?: any
  examples?: { [key: string]: ExampleType | ReferenceType }
  encoding?: { [key: string]: EncodingType }
}

type EncodingType = {
  contentType?: string
  headers?: { [key: string]: HeaderType | ReferenceType }
  style?: string
  explode?: boolean
  allowReserved?: boolean
}

type ResponsesType = { [code: string]: ResponseType | ReferenceType }

type ResponseType = {
  description: string
  headers?: { [key: string]: HeaderType | ReferenceType }
  content?: { [key: string]: MediaTypeType }
  links?: { [key: string]: LinkType | ReferenceType }
}

type CallbackType = {
  [expression: string]: PathItemType
}

type ExampleType = {
  summary?: string
  description?: string
  value?: any
  externalValue?: string
}

type LinkType = {
  operationRef?: string
  operationId?: string
  parameters?: { [param: string]: any }
  requestBody?: any
  description?: string
  server?: ServerType
}

type HeaderType = {
  description?: string
  required?: boolean
  deprecated?: boolean
  allowEmptyValue?: boolean
  style?: 'matrix' | 'label' | 'form' | 'simple' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject'
  explode?: boolean
  allowReserved?: boolean
  schema?: SchemaType | ReferenceType
  example?: any
  examples?: { [key: string]: ExampleType | ReferenceType }
  content?: { [key: string]: MediaTypeType }
}

type TagType = {
  name: string
  description?: string
  externalDocs?: ExternalDocsType
}

type ReferenceType = {
  [ref: '$ref' | string]: string
}

type SchemaType = {
  title?: string
  multipleOf?: any
  maximum?: any
  exclusiveMaximum?: any
  minimum?: any
  exclusiveMinimum?: any
  maxLength?: any
  minLength?: any
  pattern?: string
  maxItems?: any
  minItems?: any
  uniqueItems?: any
  maxProperties?: any
  minProperties?: any
  required?: string[]
  enum?: any

  type?: string
  allOf?: SchemaType[]
  oneOf?: SchemaType
  anyOf?: SchemaType[]
  not?: { [key: string]: SchemaType }
  items?: { [key: string]: SchemaType }
  properties?: { [key: string]: SchemaType }
  additionalProperties?: boolean | SchemaType
  description?: string
  format?: 'int32' | 'int64' | 'float' | 'double' | 'byte' | 'binary' | 'date' | 'date-time' | 'password'
  default?: any

  nullable?: boolean
  discriminator?: DiscriminatorType
  readOnly?: boolean
  writeOnly?: boolean
  xml?: XMLType
  externalDocs?: ExternalDocsType
  example?: any
  deprecated?: boolean
}

type DiscriminatorType = {
  propertyName: string
  mapping?: { [map: string]: string }
}

type XMLType = {
  name?: string
  namespace?: string
  prefix?: string
  attribute?: boolean
  wrapped?: boolean
}

type SecuritySchemeType = {
  type: string
  description?: string
  name: string
  in: string
  scheme: string
  bearerFormat?: string
  flows: OAuthFlowsType
  openIdConnectUrl: string
}

type OAuthFlowsType = {
  implicit?: OAuthFlowType
  password?: OAuthFlowType
  clientCredentials?: OAuthFlowType
  authorizationCode?: OAuthFlowType
}

type OAuthFlowType = {
  authorizationUrl: string
  tokenUrl: string
  refreshUrl?: string
  scopes: { [scope: string]: string }
}

type SecurityRequirementType = {
  [name: string]: string[]
}
