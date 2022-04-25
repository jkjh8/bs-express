const { Worker } = require('worker_threads')
const { client } = require('db/redis')
const logger = require('logger')

function getBarixInfo(workerData) {
  const worker = new Worker('./src/api/device/barix/barixWorker.js', {
    workerData
  })

  worker.on('message', async (comm) => {
    await client.set(
      `status:${workerData}`,
      JSON.stringify({ deviceType: 'Barix', ...comm }),
      { EX: 600 }
    )
    worker.terminate()
  })

  worker.on('error', (err) => {
    logger.error(`Barix ${workerData} Error: ${JSON.stringify(err)}`)
  })

  worker.on('exit', (code) => {
    if (!code === 1) {
      logger.warn(`Barix ${workerData} Exit code: ${code}`)
    }
  })
}

module.exports.getBarixInfo = getBarixInfo
