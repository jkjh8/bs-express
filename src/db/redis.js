const logger = require('config/logger')
const { createClient } = require('redis')

const sessionClient = createClient({
  url: 'redis://redis-server:6379',
  password: process.env.DB_PASS,
  legacyMode: true
})

const client = createClient({
  url: 'redis://redis-server:6379',
  password: process.env.DB_PASS
})

async function connectRedis() {
  client.on('error', (err) => logger.error(`Redis Client Error, ${err}`))
  sessionClient.on('error', (err) =>
    logger.error(`Redis Session Client Error, ${err}`)
  )
  await client.connect()
  await sessionClient.connect()
  logger.info('Redis Clients Connected')
}

connectRedis()

module.exports = { client, sessionClient }
