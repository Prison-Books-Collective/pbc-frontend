#! /usr/bin/env node

import { program } from 'commander'
import openapiTS, { type OpenAPI3 } from 'openapi-typescript'
import { join } from 'path'

import { download, downloadAndSave, type DownloadOptions } from './lib/download'
import { convertAndSave, type ConvertOptions } from './lib/convert'
import { codegen, codegenAndSave, type CodegenOptions } from './lib/codegen'
import { saveFile } from './lib/util'

program
  .name('bellbooks-openapi-codegen')
  .description('CLI to generate frontend fetch methods to interface with BellBooks backend')
  .version('0.0.1')

program
  .command('download')
  .description('Download the latest openapi.json from a running instance of the Bellbooks API')
  .option(
    '-l, --local',
    '(default) Use a local instance of the Bellbooks API at http://localhost:8080/api/docs',
  )
  .option('-r, --remote', 'Use the standard GCP hosted instance of the Bellbooks API')
  .option('-u, --url <url>', 'Designate a custom URL for the instance of the Bellbooks API')
  .option(
    '-o, --output <path>',
    'Select a custom output location for the downloaded openapi.json file',
    'src/openapi/openapi.json',
  )
  .option('-d, --dryrun', '[Test] Log download to standard output without saving to disk', false)
  .action(async (options: DownloadOptions) => {
    await downloadAndSave(options)
  })

program
  .command('convert')
  .description(
    'Use `openapi-typescript` library to generate types from a downloaded openapi.json spec',
  )
  .option(
    '-i, --input <path>',
    'Designate the source openapi.json file',
    'src/openapi/openapi.json',
  )
  .option(
    '-o, --output <path>',
    'Designate the output location for the generated types',
    'src/openapi/openapi.ts',
  )
  .option('-d, --dryrun', '[Test] Log conversion to standard output without saving to disk', false)
  .action(async (options: ConvertOptions) => {
    await convertAndSave(options)
  })

program
  .command('codegen')
  .description('Generate frontend http fetch methods for interfacing with Bellbooks backend')
  .option('-o, --output <path>', 'Destination path to save the generated code', 'dist/api')
  .option(
    '-s, --schema <path>',
    'Location on disk where the openAPI schema (.json) file is saved',
    'src/openapi/openapi.json',
  )
  .option(
    '-t, --types <path>',
    'Location on disk where the openAPI typescript types (.ts) file is saved',
    'src/openapi/openapi.ts',
  )
  .option('-d, --dryrun', '[Test] Log codegen to standard output without saving to disk', false)
  .action(async (options: CodegenOptions) => {
    await codegenAndSave(options)
  })

type DownloadAndGenerateOptions = Partial<{
  url: string
  output: string
  dryrun: boolean
}>

program
  .command('download-and-generate')
  .description(
    'Run through all of the commands: Download, Convert, and Codegen, and output the generated code to a specified directory',
  )
  .option(
    '-u, --url <url>',
    'URL pointing to a live instance of the Bellbooks API',
    'http://localhost:8080/api/docs',
  )
  .option(
    '-o, --output <path>',
    'Designate the output directory for the generated code',
    'dist/api',
  )
  .option('-d, --dryrun', '[Test] Log to standard output without saving to disk', false)
  .action(async ({ url, output, dryrun }: DownloadAndGenerateOptions) => {
    if (!output) output = 'dist/api'

    console.log(`Generating client API methods for OpenAPI specification at "${url}"...`)

    let schema: OpenAPI3 | undefined
    try {
      schema = await download({ url })
      if (!schema) throw Error()
      console.log(`  ✅ Successfully downloaded OpenAPI Schema from "${url}"`)
    } catch (_) {
      // error is logged in download function
      return
    }

    let openAPITypescript: string
    try {
      openAPITypescript = await openapiTS(schema)
      console.log(`  ✅ Successfully converted schema to typescript definitions`)
    } catch (error) {
      console.error(`Using schema: ${JSON.stringify(schema, null, 2)}`)
      console.error(`  ❌ Failed to convert openAPI schema json from downloaded schema`, error)
      return
    }

    let code: { models: string; endpoints: string; index: string }
    try {
      code = codegen(schema, openAPITypescript)
      console.log(`  ✅ Successfully generated model definitions and API methods`)
    } catch (_) {
      // Error is logged in codegen function
      return
    }

    if (dryrun) {
      console.log('// models.ts\n')
      console.log(code.models, '\n')

      console.log('// endpoints.ts\n')
      console.log(code.endpoints, '\n')

      console.log('\n\n// index.ts\n')
      console.log(code.index, '\n')

      console.log(`✅ Successfully generated output for OpenAPI Schema from "${url}"`)
      return
    }

    saveFile(join(output, 'models.ts'), code.models)
    saveFile(join(output, 'endpoints.ts'), code.endpoints)
    saveFile(join(output, 'index.ts'), code.index)

    console.log(
      `✅ Successfully generated output for OpenAPI Schema from "${url}" and saved to "${output}"`,
    )
  })

program.parse()
