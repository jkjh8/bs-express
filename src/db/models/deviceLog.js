const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const devicelogSchema = new mongoose.Schema({
  timestamp: { type: Date },
  level: { type: String },
  message: { type: String },
  meta: { type: String }
})
devicelogSchema.index({ '$**': 'text' })
devicelogSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('DeviceLog', devicelogSchema)
