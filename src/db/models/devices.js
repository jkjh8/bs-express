const mongoose = require('mongoose')

module.exports = mongoose.model(
  'Devices',
  new mongoose.Schema(
    {
      index: Number,
      name: String,
      ipaddress: { type: String, unique: true },
      port: { type: Number, default: 4444 },
      deviceType: String,
      mode: String,
      channels: Number,
      channel: Number,
      status: Boolean
    },
    { timestamps: true }
  )
)
