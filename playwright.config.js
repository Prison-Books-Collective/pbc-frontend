/** @type {import('@playwright/test').PlaywrightTestConfig} */

const PORT = 3001
const config = {
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT}`,
    port: PORT,
  },
}

export default config
