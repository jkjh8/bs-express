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
  })
  core.on('error', (msg) => {
    logger.error(msg)
  })
  core.on('close', (msg) => {
    logger.warn(msg)
  })
  core.on('data', (data) => {
    parentPort.postMessage({
      command: 'comm',
      data: { ipaddress: workerData, ...data }
    })
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
      logger.error(`Q-Sys ${workerData} Error: ${JSON.stringify(err)}`)
    }
  } else {
    lock = false
    clearInterval(commandInterval)
    commandInterval = null
  }
}
