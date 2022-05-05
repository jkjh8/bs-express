const mongoose = require('mongoose')
const { searchArrToStr, makeSearchField } = require('api/search')
const mongoosePaginate = require('mongoose-paginate-v2')

const eventlogSchema = new mongoose.Schema(
  {
    source: String,
    level: Number,
    priority: String,
    id: String,
    zones: Array,
    message: String,
    search: String
  },
  {
    timestamps: true
  }
)
eventlogSchema.plugin(mongoosePaginate)

makeSearchField(eventlogSchema, 'search', (docs) => {
  const arr = []
  const { id = '', source = '', zones = [], message = '' } = docs
  arr.push(id)
  arr.push(source)
  arr.push(zones.join(','))
  arr.push(message)
  return searchArrToStr(arr)
})

const Eventlog = mongoose.model('Eventlog', eventlogSchema)

module.exports = Eventlog
