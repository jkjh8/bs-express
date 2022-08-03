import Log from '@/db/models/eventlog'
import clc from 'cli-color'
import moment from 'moment'

moment.locale('ko')
const levels = {
  0: 'info',
  1: 'warn',
  2: 'error',
  3: 'admin_info',
  4: 'admin_warn',
  5: 'admin_error'
}

export const logger = async (msg) => {
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

export const loggerArr = async (level, user, msg) => {
  let ID = user ?? ''
  if (typeof user === 'object') {
    ID = user.email
  }
  const logMessage = new Log({
    priority: levels[level],
    level: level,
    id: ID,
    message: msg
  })
  await logMessage.save()
  cliLog(logMessage)
}
