const { Worker } = require('worker_threads')
const redis = require('db/redis')
const { loggerArr } = require('api/logger')

function getBarixInfo(workerData) {
  const worker = new Worker('./src/api/device/barix/barixWorker.js', {
    workerData
  })

  worker.on('message', async (comm) => {
    if (comm.command === 'comm') {
      await redis.set(
        `status:${workerData}`,
        JSON.stringify({ deviceType: 'Barix', ...comm.data }),
        { EX: 600 }
      )
      await redis.HSET('status', workerData, true)
    } else {
      await redis.HSET('status', workerData, false)
      loggerArr(5, 'Server', comm.data)
    }
    worker.terminate()
  })

  worker.on('error', async (err) => {
    await redis.HSET('status', workerData, false)
    loggerArr(5, 'Server', `Barix ${workerData} Error ${err}`)
    worker.terminate()
  })

  worker.on('exit', (code) => {
    if (!code === 1) {
      loggerArr(4, 'Server', `Barix ${workerData} Exit ${code}`)
    }
  })
}

module.exports.getBarixInfo = getBarixInfo
