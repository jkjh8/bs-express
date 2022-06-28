const { loggerArr } = require('api/logger')
const { createClient } = require('redis')

const client = createClient({
  url: 'redis://redis-server:6379',
  password: process.env.DB_PASS
})

async function connectRedis() {
  client.on('error', (err) =>
    loggerArr(5, 'Server', `Redis Client Error, ${JSON.stringify(err)}`)
  )
  await client.connect()
  loggerArr(3, 'Server', 'Redis Clients Connected')
}

connectRedis()

module.exports = client
