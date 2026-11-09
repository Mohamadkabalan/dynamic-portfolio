/**
 * Runs the website against the local mock of Sanity (see mock-sanity.ts), so
 * the full site can be previewed with the sample content before a real Sanity
 * project exists.
 *
 *   npm run dev:mock        → development server
 *   npm run preview:mock    → production build + server (what Lighthouse tests)
 *
 * Options: --port=3000  --mock-port=3910  --mock-only (just the mock API)
 */
import {spawn} from 'node:child_process'

import {startMockSanity} from './mock-sanity'

const args = process.argv.slice(2)
const flag = (name: string) => args.includes(`--${name}`)
const option = (name: string, fallback: string) =>
  args.find((arg) => arg.startsWith(`--${name}=`))?.split('=')[1] ?? fallback

const port = option('port', '3000')
const mockPort = Number(option('mock-port', '3910'))
const siteUrl = `http://localhost:${port}`
const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET || 'local-mock-secret'

const env: NodeJS.ProcessEnv = {
  ...process.env,
  NEXT_PUBLIC_SANITY_PROJECT_ID: 'mock',
  NEXT_PUBLIC_SANITY_DATASET: 'production',
  NEXT_PUBLIC_SANITY_API_HOST: `http://localhost:${mockPort}`,
  NEXT_PUBLIC_SANITY_IMAGE_HOST: `http://localhost:${mockPort}`,
  NEXT_PUBLIC_SITE_URL: siteUrl,
  SANITY_REVALIDATE_SECRET: revalidateSecret,
  SANITY_API_READ_TOKEN: '',
}

function run(command: string): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn(command, {stdio: 'inherit', shell: true, env})
    child.on('exit', (code) => resolve(code ?? 0))
  })
}

async function main() {
  const mock = await startMockSanity({port: mockPort, siteUrl, revalidateSecret})

  if (flag('mock-only')) return // keep serving until the process is stopped

  let exitCode = 0
  if (flag('prod')) {
    exitCode = await run('npx next build')
    if (exitCode === 0) exitCode = await run(`npx next start --port ${port}`)
  } else {
    exitCode = await run(`npx next dev --port ${port}`)
  }

  await mock.close()
  process.exit(exitCode)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
