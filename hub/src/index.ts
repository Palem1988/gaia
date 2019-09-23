#!/usr/bin/env node
import path from 'path'
import { makeHttpServer } from './server/http'
import { getConfig, validateConfigSchema } from './server/config'
import { logger } from './server/utils'
// import * as greenlockExpress from 'greenlock-express'

/*
greenlockExpress.create({
  email: 'john.doe@example.com',
  agreeTos: true,
  configDir: '~/.config/acme/', // Writable directory where certs will be saved
  communityMember: false,
  telemetry: false,
  securityUpdates: true,
  debug: true,
  app: require("./app.js")
}).listen(80, 443);
*/

const appRootDir = path.dirname(path.resolve(__dirname))
const schemaFilePath = path.join(appRootDir, 'config-schema.json')

const conf = getConfig()
validateConfigSchema(schemaFilePath, conf)

const { app, driver } = makeHttpServer(conf)

app.listen(conf.port,
           () => logger.warn(`Listening on port ${conf.port} in ${app.settings.env} mode`))

driver.ensureInitialized().catch(error => {
  logger.error(`Failed to initialize driver ${error})`)
  process.exit()
})
