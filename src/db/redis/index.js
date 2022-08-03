import { loggerArr } from '@/api/logger'
import { createClient } from 'redis'

const client = createClient({
  url: 'redis://redis-server:6379',
  password: process.env.DB_PASS
})

async function connectRedis() {
  client.on('error', (err) =>
    loggerArr(5, 'Server', `Redis Client Error, ${JSON.stringify(err)}`)
  )
  await client.connect()
  try {
    loggerArr(3, 'Server', 'Redis Clients Connected')
  } catch (error) {
    console.log(error)
  }
}

connectRedis()

export default client
