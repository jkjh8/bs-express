const { logger } = require('api/logger')
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
  client.on('error', (err) =>
    logger({ level: 5, message: `Redis Client Error, ${JSON.stringify(err)}` })
  )
  sessionClient.on('error', (err) =>
    logger({
      level: 5,
      message: `Redis Session Client Error, ${JSON.stringify(err)}`
    })
  )
  await client.connect()
  await sessionClient.connect()
  logger({ level: 3, message: 'Redis Clients Connected' })
}

connectRedis()

module.exports = { client, sessionClient }
