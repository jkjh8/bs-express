const { Worker } = require('worker_threads')
const { client } = require('db/redis')
const { logger } = require('api/logger')
const Devices = require('db/models/devices')
const Zones = require('db/models/zones')

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
        logger({ level: 3, message: `${comm.data}` })
        break
      case 'error':
        logger({ level: 5, message: `${comm.data}` })
        break
      case 'close':
        logger({ level: 4, message: `${comm.data}` })
        workerPool[workerData] = null
        break
    }
    await client.HSET('status', workerData, true)
  })
  worker.on('error', async (err) => {
    workerPool[workerData] = null
    await client.HSET('status', workerData, false)
    logger({
      level: 5,
      message: `Q-Sys ${workerData} Error: ${JSON.stringify(err)}`
    })
  })
  worker.on('exit', async (code) => {
    workerPool[workerData] = null
    await client.HSET('status', workerData, false)
    logger({ level: 4, message: `Q-Sys ${workerData} Exit code: ${code}` })
  })
}

async function dataToQrc(comm) {
  if (comm.error) {
    return logger({
      level: 5,
      message: `Q-Sys ${comm.ipaddress} Error: ${JSON.stringify(comm.error)}`
    })
  }
  switch (comm.id) {
    case 'GetPa':
      client.HSET('pa', comm.ipaddress, JSON.stringify({ deviceType: 'Q-Sys', ...comm.result }))
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

module.exports.qsysSetTx = async (zoneId) => {
  const zone = Zones.find({}).populate('core').populate({ path: 'children', options: { retainNullValues: true } })

  const { core, children } = zone

  
  if (!workerPool[core.ipaddress]) {
    runQsysThread(core.ipaddress)
  }

  for (let i = 0; i<children.length; i++) {
    console.log(children[i])
  }

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
