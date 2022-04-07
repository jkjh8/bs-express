const logger = require('config/logger')
const { createClient } = require('redis')

const client = createClient({
  url: 'redis://redis-server:6379',
  password: process.env.DB_PASS,
  legacyMode: true
})

async function connectRedis() {
  client.on('error', (err) => logger.error(`Redis Client Error, ${err}`))
  await client.connect()
  logger.info('Redis Client Connected')
}

connectRedis()

module.exports = client
