const { Worker } = require('worker_threads')
const { client } = require('db/redis')
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
    await client.HSET('status', workerData, true)
  })
  worker.on('error', async (err) => {
    workerPool[workerData] = null
    await client.HSET('status', workerData, false)
    loggerArr(5, 'Server', `Q-Sys ${workerData} Error ${err}`)
  })
  worker.on('exit', async (code) => {
    workerPool[workerData] = null
    await client.HSET('status', workerData, false)
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
      client.HSET(
        'pa',
        comm.ipaddress,
        JSON.stringify({ deviceType: 'Q-Sys', ...comm.result })
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

module.exports.qsysSetTx = async (zone) => {
  const { core, children, channels } = zone
  // console.log(core, children, children.length, channels)
  return new Promise(async (resolve, reject) => {
    // if (!workerPool[core.ipaddress]) {
    //   reject('Core Not Connected')
    // }
    let channel = channels
    let deviceChannel = 32
    if (core.model === '110f') {
      deviceChannel = 4
    }

    if (channels > deviceChannel) {
      channel = deviceChannel
    }

    for (let i = 0; i < channel; i++) {
      // console.log(children[i])
      if (typeof children[i] === 'string') {
        const target = await Devices.findOne({ _id: children[i] })
        console.log(i, target)
        this.sendMsgToQSys(core, {
          id: `TX${i + 1}`,
          method: 'Component.Set',
          params: {
            Name: `TX${i + 1}`,
            Controls: [
              { Name: 'host', Value: target.ipaddress },
              { Name: 'port', Value: target.port },
              { Name: 'enable', Value: true }
            ]
          }
        })
      }

      if (children[i] === null) {
        console.log(i, null)
        this.sendMsgToQSys(core, {
          id: `TX${i + 1}`,
          method: 'Component.Set',
          params: {
            Name: `TX${i + 1}`,
            Controls: [{ Name: 'enable', Value: false }]
          }
        })
      }
    }
    resolve()
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
