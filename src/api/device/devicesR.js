const { loggerArr: log } = require('api/logger')
const redis = require('db/redis')

module.exports.getDeviceStatus = async (req, res) => {
  try {
    return res.status(200).json(await redis.HGETALL('status'))
  } catch (err) {
    log(5, req.user, `디바이스상태오류: ${err}`)
    return res.status(500).json(err)
  }
}

module.exports.getPaStatus = async (req, res) => {
  try {
    return res.json(await redis.HGETALL('pa'))
  } catch (err) {
    log(5, req.user, `PA상태오류: ${err}`)
    return res.status(500).json(err)
  }
}

module.exports.getStatusDetail = async (req, res) => {
  try {
    return res
      .status(200)
      .json(JSON.parse(await redis.get(`status:${req.query.ipaddress}`)))
  } catch (err) {
    log(5, req.user, `디바이스 상세정보 오류: ${err}`)
    return res.status(500).json(err)
  }
}
