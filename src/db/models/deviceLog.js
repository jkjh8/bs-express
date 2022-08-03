import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const devicelogSchema = new mongoose.Schema({
  timestamp: { type: Date },
  level: { type: String },
  message: { type: String },
  meta: { type: String }
})
devicelogSchema.index({ '$**': 'text' })
devicelogSchema.plugin(mongoosePaginate)

export default mongoose.model('DeviceLog', devicelogSchema)
