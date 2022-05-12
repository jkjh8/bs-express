const Log = require('db/models/eventlog')
const clc = require('cli-color')
const moment = require('moment')

moment.locale('ko')
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
    msg.priority = levels[msg.level]
    const logMessage = new Log(msg)
    await logMessage.save()
    cliLog(msg)
  } catch (err) {
    throw err
  }
}

function cliLog(logs) {
  switch (logs.level) {
    case 2:
    case 5:
      console.error(
        clc.red(
          `${logs.priority.toUpperCase()} ${moment().format(
            'YYYY-MM-DD hh:mm:ss a'
          )} ${logs.message}`
        )
      )
      break
    case 1:
    case 4:
      console.log(
        clc.yellow(
          `${logs.priority.toUpperCase()} ${moment().format(
            'YYYY-MM-DD hh:mm:ss a'
          )} ${logs.message}`
        )
      )
      break
    default:
      console.log(
        clc.green(
          `${logs.priority.toUpperCase()} ${moment().format(
            'YYYY-MM-DD hh:mm:ss a'
          )} ${logs.message}`
        )
      )
      break
  }
}

module.exports.loggerArr = async (level, user, msg) => {
  const logMessage = new Log({
    priority: levels[level],
    level: level,
    user: user && user.email ? user.email : '',
    message: msg
  })
  await logMessage.save()
  cliLog(logMessage)
}