const { Worker } = require('worker_threads')
const { client } = require('../db/redis')
const logger = require('../logger')
const Devices = require('../db/models/devices')
const workerPool = {}

function runQsysThread(workerData) {
  const worker = new Worker('./src/threads/qsysWorker.js', {
    workerData
  })
  workerPool[workerData] = worker

  worker.on('message', (comm) => {
    switch (comm.command) {
      case 'comm':
        dataToQrc(comm)
        break
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
  // setTimeout(() => {
  //   worker.postMessage({
  //     id: 'GetPa',
  //     method: 'Component.GetControls',
  //     params: {
  //       Name: 'PA'
  //     }
  //   })
  // }, 1000)
}

async function dataToQrc(comm) {
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
    runQsysThread(device.ipaddress)
  })
}

module.exports.loadDevices = loadDevices
module.exports.qsysRefresh = async function (device) {
  // workerPool[device.ipaddress].postMessage({
  //   id: 'GetStatus',
  //   method: 'StatusGet',
  //   params: 0
  // })
  workerPool[device.ipaddress].postMessage({
    id: 'GetPa',
    method: 'Component.GetControls',
    params: {
      Name: 'PA'
    }
  })
}
