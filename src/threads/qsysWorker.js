const { workerData, parentPort } = require('worker_threads')
const logger = require('../logger')
const Qrc = require('./qsysqrc')
// const { client } = require('../db/redis')
const commands = []
let commandInterval
let core
let lock = false

if (workerData) {
  core = new Qrc(workerData)
  core.on('connect', (msg) => {
    logger.info(msg)
    parentPort.postMessage({ command: 'connect' })
  })
  core.on('error', (msg) => {
    logger.error(msg)
    parentPort.postMessage({ connamd: 'error' })
  })
  core.on('close', (msg) => {
    logger.warn(msg)
    parentPort.postMessage({ command: 'close' })
  })
  parentPort.on('message', (comm) => {
    commands.push(comm)
    if (!commandInterval) {
      console.log('start interval')
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
  console.log('interval command')
  if (commands.length) {
    try {
      if (!lock) {
        lock = true
        const r = await core.send(commands.shift())
        parentPort.postMessage({ command: 'comm', ipaddress: workerData, ...r })
        lock = false
      }
    } catch (err) {
      lock = false
      console.log('command error', err)
      clearInterval(commandInterval)
      logger.error(`Q-Sys ${workerData} Error: ${JSON.stringify(err)}`)
    }
  } else {
    lock = false
    clearInterval(commandInterval)
    commandInterval = null
  }
}
