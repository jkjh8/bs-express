const { createClient } = require('redis')
const client = createClient({
  url: 'redis://redis-server:6379',
  password: process.env.DB_PASS,
  legacyMode: true
})

async function connectRedis() {
  client.on('error', (err) => console.log('Redis Client Error', err))
  await client.connect()
  console.log('redis connected')
}

connectRedis()

module.exports = client
