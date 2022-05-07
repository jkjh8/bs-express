const mongoose = require('mongoose')
const { logger } = require('api/logger')

mongoose
  .connect(
    `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@mongodb:27017/bs`,
    { useNewUrlParser: true }
  )
  .then(() => {
    logger({ level: 3, message: 'Mongodb Connected' })
  })
  .catch((e) => {
    logger({ level: 5, message: `Mongodb Connect Error ${e}` })
  })

module.exports = mongoose.connection
