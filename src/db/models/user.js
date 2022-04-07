const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String, bcrypt: true },
    admin: { type: Boolean, default: false },
    level: { type: Number, default: 0 },
    zones: { type: Array },
    numberOfLogin: { type: Number, default: 0 },
    loginAt: { type: Date, default: new Date() }
  },
  {
    timestamps: true
  }
)

userSchema.plugin(require('mongoose-bcrypt'), { rounds: 10 })
module.exports = mongoose.model('User', userSchema)
