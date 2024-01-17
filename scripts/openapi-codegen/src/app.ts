import { program } from 'commander'

import type { DownloadOptions } from './lib/download'
import type { ConvertOptions } from './lib/convert'
import type { CodegenOptions } from './lib/codegen'

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
  .option('-d, --dryrun', '[Test] Attempt download but do not save to disk', false)
  .action(async (options: DownloadOptions) => {
    const { downloadOpenAPISpec } = await import('./lib/download')
    await downloadOpenAPISpec(options)
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
  .option('-d, --dryrun', '[Test] Attempt conversion but do not save to disk', false)
  .action(async (options: ConvertOptions) => {
    const { convert } = await import('./lib/convert')
    await convert(options)
  })

program
  .command('codegen')
  .description('Generate frontend http fetch methods for interfacing with Bellbooks backend')
  .option('-o, --output <path>', '', 'dist/api')
  .option('-s, --schema <path>', '', 'src/openapi/openapi.json')
  .option('-t, --types <path>', '', 'src/openapi/openapi.ts')
  .option('-d, --dryrun', '[Test] Attempt codegen but do not save to disk', false)
  .action(async (options: CodegenOptions) => {
    const { codegen } = await import('./lib/codegen')
    await codegen(options)
  })

program.parse()
