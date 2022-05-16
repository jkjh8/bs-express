const { Worker } = require('worker_threads')
const { client } = require('db/redis')
const { loggerArr } = require('api/logger')

function getBarixInfo(workerData) {
  const worker = new Worker('./src/api/device/barix/barixWorker.js', {
    workerData
  })

  worker.on('message', async (comm) => {
    if (comm.command === 'comm') {
      await client.set(
        `status:${workerData}`,
        JSON.stringify({ deviceType: 'Barix', ...comm.data }),
        { EX: 600 }
      )
      await client.HSET('status', workerData, true)
    } else {
      await client.HSET('status', workerData, false)
      loggerArr(5, 'Server', comm.data)
    }
    worker.terminate()
  })

  worker.on('error', async (err) => {
    await client.HSET('status', workerData, false)
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
