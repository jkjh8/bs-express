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
    // if (msg.source) {
    //   logs.source = msg.source
    // }
    // if (msg.id) {
    //   logs.id = msg.id
    // }
    // if (msg.zones && msg.zones.length) {
    //   logs.zones = msg.zones
    // }
    // const rt = new Log(logs)
    // await rt.save()

    // 콘솔에 표시
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
