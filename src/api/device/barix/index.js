const { Worker } = require('worker_threads')
const { client } = require('db/redis')
const { logger } = require('api/logger')

function getBarixInfo(workerData) {
  const worker = new Worker('./src/api/device/barix/barixWorker.js', {
    workerData
  })

  worker.on('message', async (comm) => {
    console.log(comm)
    if (comm.command === 'comm') {
      await client.set(
        `status:${workerData}`,
        JSON.stringify({ deviceType: 'Barix', ...comm.data }),
        { EX: 600 }
      )
      await client.HSET('status', workerData, true)
    } else {
      await client.HSET('status', workerData, false)
      logger({ level: 5, message: `${comm.data}` })
    }
    worker.terminate()
  })

  worker.on('error', async (err) => {
    await client.HSET('status', workerData, false)
    logger({
      level: 5,
      message: `Barix ${workerData} Error: ${JSON.stringify(err)}`
    })
  })

  worker.on('exit', (code) => {
    if (!code === 1) {
      logger({ level: 4, message: `Barix ${workerData} Exit code: ${code}` })
    }
  })
}

module.exports.getBarixInfo = getBarixInfo
