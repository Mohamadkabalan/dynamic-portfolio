/**
 * Configuration for the `sanity` command line tool (used for TypeGen).
 * It reads the same `.env.local` file as Next.js.
 */
import {loadEnvConfig} from '@next/env'
import {defineCliConfig} from 'sanity/cli'

loadEnvConfig(process.cwd())

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'not-configured'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineCliConfig({
  api: {projectId, dataset},
  typegen: {
    path: './{app,components,lib,sanity}/**/*.{ts,tsx}',
    schema: './sanity/extract.json',
    generates: './sanity/types.ts',
    overloadClientMethods: true,
  },
})
