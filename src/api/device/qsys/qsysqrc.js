const net = require('net')
const EventEmitter = require('events')

module.exports = class Qrc extends EventEmitter {
  constructor(ipaddress) {
    super()
    this.client = net.Socket()
    this._ipaddress = ipaddress
    this.connected = false
    this._data = Buffer.alloc(0)
    this._noOpinterval = null
    this._completed = false

    this.client.on('connect', () => {
      this.connected = true
      this.noOp()
      this.emit('connect', `Q-Sys ${this._ipaddress} connected`)
    })

    this.client.on('close', () => {
      this.connected = false
      this.emit('close', `Q-Sys ${this._ipaddress} disconnected`)
    })

    this.client.on('error', (err) => {
      this.connected = false
      this.emit(
        'error',
        `Q-Sys ${this._ipoaddress} socket error ${JSON.stringify(err)}`
      )
    })

    this.client.on('data', (data) => {
      clearInterval(this._noOpinterval)
      try {
        if (this._completed) {
          this._completed = false
          this._data = Buffer.alloc(0)
        }
        this._data = Buffer.concat([
          this._data ?? [],
          data.includes(0) ? data.slice(0, data.indexOf(0)) : data
        ])
        if (data.includes(0)) {
          this._completed = true
          this.emit('data', JSON.parse(this._data))
        }
        this.noOp()
      } catch (err) {
        this.noOp()
        this.emit('error', `Q-Sys ${this._ipaddress} Error: ${err}`)
      }
    })
  }

  connect() {
    try {
      this.client.connect({ port: 1710, host: this._ipaddress })
    } catch (err) {
      this.noOp()
      this.emit('error', `Q-Sys ${this._ipaddress} Error: ${err}`)
    }
  }

  send(msg) {
    if (this.connected) {
      try {
        this.client.write(
          JSON.stringify({
            jsonrpc: '2.0',
            ...msg
          }) + '\0'
        )
      } catch (err) {
        this.emit('error', err)
      }
    }
  }

  noOp() {
    this._noOpinterval = setInterval(() => {
      this.client.write(
        JSON.stringify({
          jsonrpc: '2.0',
          method: 'NoOp',
          params: {}
        }) + '\0'
      )
    }, 50000)
  }
}
