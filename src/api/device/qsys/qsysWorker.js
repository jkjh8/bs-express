const { workerData, parentPort } = require('worker_threads')
const Qrc = require('./qsysqrc')
// const { client } = require('../db/redis')
const commands = []
let commandInterval
let core
let coreStatus
let lock = false

if (workerData) {
  core = new Qrc(workerData)
  core.on('connect', (msg) => {
    coreStatus = true
    parentPort.postMessage({ command: 'connect', data: msg })
  })
  core.on('close', (msg) => {
    coreStatus = false
    parentPort.postMessage({ command: 'close', data: msg })
  })
  core.on('data', (data) => {
    parentPort.postMessage({
      command: 'comm',
      data: { ipaddress: workerData, ...data }
    })
  })
  core.on('error', (err) => {
    coreStatus = false
    throw err
  })
  parentPort.on('message', (comm) => {
    commands.push(comm)
    if (!commandInterval) {
      queueProcess()
    }
  })
  core.connect()
}

async function queueProcess() {
  await commandSender()
  commandInterval = setInterval(async () => {
    await commandSender()
  }, 1000)
}

async function commandSender() {
  if (!coreStatus) return
  if (commands.length) {
    try {
      if (!lock) {
        lock = true
        core.send(commands.shift())
        parentPort.postMessage({
          command: 'result',
          ipaddress: workerData,
          result: 'OK'
        })
        lock = false
      }
    } catch (err) {
      lock = false
      clearInterval(commandInterval)
      parentPort.postMessage({
        comm: 'error',
        data: `Q-Sys ${workerData} Error: ${JSON.stringify(err)}`
      })
    }
  } else {
    lock = false
    clearInterval(commandInterval)
    commandInterval = null
  }
}
