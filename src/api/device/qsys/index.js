const { Worker } = require('worker_threads')
const { client } = require('../../../db/redis')
const logger = require('../../../logger')
const Devices = require('../../../db/models/devices')
const Qrc = require('./qsysqrc')
const workerPool = {}

function runQsysThread(workerData) {
  const worker = new Worker('./src/api/device/qsys/qsysWorker.js', {
    workerData
  })
  workerPool[workerData] = worker

  worker.on('message', (comm) => {
    switch (comm.command) {
      case 'comm':
        dataToQrc(comm.data)
        break
    }
  })
  worker.on('error', (err) => {
    workerPool[workerData] = null
    logger.error(`Q-Sys ${workerData} Error: ${JSON.stringify(err)}`)
  })
  worker.on('exit', (code) => {
    workerPool[workerData] = null
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
      client.set(`pa:${comm.ipaddress}`, JSON.stringify(comm.result.Controls), {
        EX: 60
      })
      break
    case 'GetStatus':
      client.set(`status:${comm.ipaddress}`, JSON.stringify(comm.result), {
        EX: 600
      })
      break
  }
}

async function loadDevices() {
  const devices = await Devices.find({})
  devices.forEach((device) => {
    if (device.deviceType === 'Q-Sys') {
      runQsysThread(device.ipaddress)
    }
  })
}

module.exports.loadDevices = loadDevices
module.exports.qsysRefresh = async function (device) {
  workerPool[device.ipaddress].postMessage({
    id: 'GetStatus',
    method: 'StatusGet',
    params: 0
  })
  workerPool[device.ipaddress].postMessage({
    id: 'GetPa',
    method: 'Component.GetControls',
    params: {
      Name: 'PA'
    }
  })
}
