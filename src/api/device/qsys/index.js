const { Worker } = require('worker_threads')
const redis = require('db/redis')
const { loggerArr } = require('api/logger')
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
        loggerArr(3, 'Server', comm.data)
        break
      case 'close':
        loggerArr(4, 'Server', comm.data)
        workerPool[workerData] = null
        break
    }
    await redis.HSET('status', workerData, true)
  })
  worker.on('error', async (err) => {
    workerPool[workerData] = null
    await redis.HSET('status', workerData, false)
    loggerArr(5, 'Server', `Q-Sys ${workerData} Error ${err}`)
  })
  worker.on('exit', async (code) => {
    workerPool[workerData] = null
    await redis.HSET('status', workerData, false)
    loggerArr(4, 'Server', `Q-Sys ${workerData} Exit ${code}`)
  })
}

async function dataToQrc(comm) {
  // if (comm.error) {
  //   return logger({
  //     level: 5,
  //     message: `Q-Sys ${comm.ipaddress} Error: ${JSON.stringify(comm.error)}`
  //   })
  // }
  switch (comm.id) {
    case 'GetPa':
      redis.HSET(
        'pa',
        comm.ipaddress,
        JSON.stringify({ deviceType: 'Q-Sys', ...comm.result })
      )
      break
    case 'GetStatus':
      redis.set(
        `status:${comm.ipaddress}`,
        JSON.stringify({ deviceType: 'Q-Sys', ...comm.result }),
        {
          EX: 600
        }
      )
      break
    default:
      if (comm.error) {
        loggerArr(
          5,
          'Server',
          `Q-Sys ${comm.ipaddress} Error: ${comm.error.code}, ${comm.error.message}`
        )
      }
      console.log('default to Qrc ', comm)
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

module.exports.qsysSetTx = async (zone) => {
  const { core, children, channels } = zone
  return new Promise(async (resolve, reject) => {
    // if (!workerPool[core.ipaddress]) {
    //   reject('Core Not Connected')
    // }
    const returnIpaddress = []
    let deviceChannel = 32
    if (core.model === '110f') {
      deviceChannel = 4
    }

    console.log('device channel ', deviceChannel, children)

    for (let i = 0; i < channels; i++) {
      if (typeof children[i] === 'string') {
        const target = await Devices.findOne({ _id: children[i] })
        returnIpaddress.push(
          `${i}: ${children[i].name} ${children[i].ipaddress}`
        )
        if (target.mode !== 'Local' && i < deviceChannel) {
          this.sendMsgToQSys(core, {
            id: `MS-TX-${i + 1}`,
            method: 'Component.Set',
            params: {
              Name: `MS-TX-${i + 1}`,
              Controls: [
                { Name: 'host', Value: target.ipaddress },
                { Name: 'port', Value: target.port },
                { Name: 'enable', Value: true }
              ]
            }
          })
        }
      }

      if (children[i] !== null && typeof children[i] === 'object') {
        if (children[i].mode && children[i].mode === 'Local') {
          returnIpaddress.push(`${i}: ${children[i].name}`)
        } else {
          returnIpaddress.push(
            `${i}: ${children[i].name} ${children[i].ipaddress}`
          )
        }
      }

      if (children[i] === null) {
        returnIpaddress.push(`${i}: None`)
        if (i < deviceChannel) {
          this.sendMsgToQSys(core, {
            id: `MS-TX-${i + 1}`,
            method: 'Component.Set',
            params: {
              Name: `MS-TX-${i + 1}`,
              Controls: [{ Name: 'enable', Value: false }]
            }
          })
        }
      }
    }
    resolve(returnIpaddress)
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
