const { Worker } = require('worker_threads')
const { client } = require('db/redis')
const logger = require('logger')

function getBarixInfo(workerData) {
  const worker = new Worker('./src/api/device/barix/barixWorker.js', {
    workerData
  })

  worker.on('message', (comm) => {
    console.log(comm)
  })

  worker.on('error', (err) => {
    logger.error(`Barix ${workerData} Error: ${JSON.stringify(err)}`)
  })

  worker.on('exit', (code) => {
    console.log(code)
    logger.warn(`Barix ${workerData} Exit code: ${code}`)
  })
}

module.exports.getBarixInfo = getBarixInfo
