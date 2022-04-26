const { Worker } = require('worker_threads')
const { client } = require('db/redis')
const Devices = require('db/models/devices')
const logger = require('logger')

const workerPool = {}

function runQsysThread(workerData) {
  const worker = new Worker('./src/api/device/qsys/qsysWorker.js', {
    workerData
  })
  workerPool[workerData] = worker

  worker.on('message', async (comm) => {
    switch (comm.command) {
      case 'comm':
        dataToQrc(comm.data)
        break
      case 'connect':
        logger.info(comm.data)
        break
      case 'error':
        logger.error(comm.data)
        break
      case 'close':
        logger.warn(comm.data)
        workerPool[workerData] = null
        break
    }
    await Devices.updateOne(
      { ipaddress: workerData },
      { $set: { status: true } }
    )
  })
  worker.on('error', async (err) => {
    workerPool[workerData] = null
    await Devices.updateOne(
      { ipaddress: workerData },
      { $set: { status: false } }
    )
    logger.error(`Q-Sys ${workerData} Error: ${JSON.stringify(err)}`)
  })
  worker.on('exit', async (code) => {
    workerPool[workerData] = null
    await Devices.updateOne(
      { ipaddress: workerData },
      { $set: { status: false } }
    )
    logger.warn(`Q-Sys ${workerData} Exit code: ${code}`)
  })
}

async function dataToQrc(comm) {
  if (comm.error) {
    return logger.error(
      `Q-Sys ${comm.ipaddress} Error: ${JSON.stringify(comm.error)}`
    )
  }
  switch (comm.id) {
    case 'GetPa':
      client.set(
        `pa:${comm.ipaddress}`,
        JSON.stringify({ deviceType: 'Q-Sys', ...comm.result.Controls }),
        {
          EX: 60
        }
      )
      break
    case 'GetStatus':
      client.set(
        `status:${comm.ipaddress}`,
        JSON.stringify({ deviceType: 'Q-Sys', ...comm.result }),
        {
          EX: 600
        }
      )
      break
  }
}

module.exports.sendMsgToQSys = (device, obj) => {
  if (!workerPool[device.ipaddress]) {
    runQsysThread(device.ipaddress)
  }
  workerPool[device.ipaddress].postMessage(obj)
}

module.exports.qsysGetStatus = (device) => {
  if (!workerPool[device.ipaddress]) {
    runQsysThread(device.ipaddress)
  }
  workerPool[device.ipaddress].postMessage({
    id: 'GetStatus',
    method: 'StatusGet',
    params: 0
  })
}

module.exports.qsysGetPa = (device) => {
  if (!workerPool[device.ipaddress]) {
    runQsysThread(device.ipaddress)
  }
  workerPool[device.ipaddress].postMessage({
    id: 'GetPa',
    method: 'Component.GetControls',
    params: {
      Name: 'PA'
    }
  })
}
