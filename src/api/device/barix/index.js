const { Worker } = require('worker_threads')
const { client } = require('db/redis')
const Devices = require('db/models/devices')
const logger = require('logger')

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
      await Devices.updateOne(
        { ipaddress: workerData },
        { $set: { status: true } }
      )
    } else {
      await Devices.updateOne(
        { ipaddress: workerData },
        { $set: { status: false } }
      )
      logger.error(comm.data)
    }
    worker.terminate()
  })

  worker.on('error', async (err) => {
    await Devices.updateOne(
      { ipaddress: workerData },
      { $set: { status: false } }
    )
    logger.error(`Barix ${workerData} Error: ${JSON.stringify(err)}`)
  })

  worker.on('exit', (code) => {
    if (!code === 1) {
      logger.warn(`Barix ${workerData} Exit code: ${code}`)
    }
  })
}

module.exports.getBarixInfo = getBarixInfo
