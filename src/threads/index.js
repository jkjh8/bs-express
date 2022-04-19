const { Worker } = require('worker_threads')
const { client } = require('db/redis')
const Devices = require('db/models/devices')
const workerPool = {}

function runQsysThread(workerData) {
  console.log(workerData)
  const worker = new Worker('./src/threads/qsysWorker.js', {
    workerData
  })
  workerPool[workerData] = worker

  worker.on('message', (msg) => {
    if (msg.id === 'GetPa') {
      client.set(`pa:${workerData}`, JSON.stringify(msg.data.result.Controls), {
        EX: 10,
        NX: true
      })
    }
  })
  worker.on('error', (err) => {
    workerPool[workerData] = null
    console.error(err)
  })
  worker.on('exit', (code) => {
    workerPool[workerData] = null
    console.log('exit', workerData, code)
  })
  setTimeout(() => {
    worker.postMessage({
      command: 'send',
      data: {
        id: 'GetPa',
        method: 'Component.GetControls',
        params: {
          Name: 'PA'
        }
      }
    })
  }, 1000)
}

async function loadDevices() {
  const devices = await Devices.find({})
  devices.forEach((device) => {
    runQsysThread(device.ipaddress)
  })
}

module.exports.loadDevices = loadDevices
