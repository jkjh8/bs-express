const mongoose = require('mongoose')

module.exports = mongoose.model(
  'Devices',
  new mongoose.Schema(
    {
      index: Number,
      name: String,
      ipaddress: String,
      port: { type: Number, default: 4444 },
      deviceType: String,
      mode: String,
      channels: Number,
      channel: Number,
      parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Devices' },
      children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Devices' }]
    },
    { timestamps: true }
  )
)