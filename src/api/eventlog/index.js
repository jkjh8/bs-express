const Log = require('db/models/eventlog')
const logger = require('logger')

module.exports.info = async (msg) => {
  try {
    const event = new Log({
      priority: 'info',
      message: msg.message
    })
    if (msg.source) {
      event.source = msg.source
    }
    if (msg.id) {
      event.id = msg.id
    }
    if (msg.zones && msg.zones.length) {
      event.zones = msg.zones
    }
    await event.save()
    logger.info(`${event}`)
  } catch (err) {
    logger.error(`이벤트로그 기록 오류 ${err}`)
  }
}

module.exports.warn = async (msg) => {
  try {
    const event = new Log({
      priority: 'warning',
      message: msg.message
    })
    if (msg.source) {
      event.source = msg.source
    }
    if (msg.id) {
      event.id = msg.id
    }
    if (msg.zones && msg.zones.length) {
      event.zones = msg.zones
    }
    await event.save()
    logger.warn(`${event}`)
  } catch (err) {
    logger.error(`이벤트로그 기록 오류 ${err}`)
  }
}

module.exports.error = async (msg) => {
  try {
    const event = new Log({
      priority: 'error',
      message: msg.message
    })
    if (msg.source) {
      event.source = msg.source
    }
    if (msg.id) {
      event.id = msg.id
    }
    if (msg.zones && msg.zones.length) {
      event.zones = msg.zones
    }
    await event.save()
    logger.error(`${event}`)
  } catch (err) {
    logger.error(`이벤트로그 기록 오류 ${err}`)
  }
}
