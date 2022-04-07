const mongoose = require('mongoose')
const logger = require('config/logger')

mongoose
  .connect(
    `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@mongodb:27017/bs`,
    { useNewUrlParser: true }
  )
  .then(() => {
    logger.info('Mongodb Connected')
  })
  .catch((e) => {
    logger.error('Mongodb Connect Error ', e)
  })

module.exports = mongoose.connection
