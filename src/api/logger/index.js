const Log = require('db/models/eventlog')
const clc = require('cli-color')
const moment = require('moment')

const levels = {
  0: 'info',
  1: 'warn',
  2: 'error',
  3: 'admin_info',
  4: 'admin_warn',
  5: 'admin_error'
}

module.exports.logger = async (msg) => {
  try {
    let log
    if (msg && msg.level) {
      log = new Log({
        level: msg.level,
        priority: levels[msg.level],
        message: msg.message
      })
    } else if (typeof msg === 'string') {
      log = new Log({
        level: 3,
        priority: levels[3],
        message: msg
      })
    }
    if (msg.source) {
      log.source = msg.source
    }
    if (msg.id) {
      log.id = msg.id
    }
    if (msg.zones && msg.zones.length) {
      log.zones = msg.zones
    }
    await log.save()

    // 콘솔에 표시
    const date = new Date()
    if (log.level !== 2 && log.level !== 5) {
      console.log(
        clc.green(
          `${log.priority.toUpperCase()} ${moment().format(
            'YYYY-MM-DD hh:mm:ss a'
          )} ${log.message}`
        )
      )
    } else {
      console.log(
        clc.red(
          `${log.priority.toUpperCase()} ${moment().format(
            'YYYY-MM-DD hh:mm:ss a'
          )} ${log.message}`
        )
      )
    }
  } catch (err) {
    throw err
  }
}
