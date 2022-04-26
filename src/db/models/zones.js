const mongoose = require('mongoose')

module.exports = mongoose.model(
  'Zones',
  new mongoose.Schema(
    {
      index: Number,
      name: String,
      channels: Number,
      core: { type: mongoose.Schema.Types.ObjectId, ref: 'Devices' },
      children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Devices' }]
    },
    { timestamps: true }
  )
)
