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
          // this.emit('data', JSON.parse(this._data))
          this.parser(JSON.parse(this._data))
        }
        this.noOp()
      } catch (err) {
        this.noOp()
        this.emit('error', `Q-Sys ${this._ipaddress} Error: ${err}`)
      }
    })
  }

  parser (data) {
    if (data && data.id) {
      switch(data.id) {
        case 'GetPa':
          const arr = data.result.Controls
          const active = []
          const gain = []
          const mute = []
          for (let i=0; i<arr.length; i++ ) {
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].Name.match(/zone.\d+.gain/)) {
                const channel = arr[i].Name.replace(/[^0-9]/g, '')
                gain[channel - 1] = arr[i].Value
              } else if (arr[i].Name.match(/zone.\d+.mute/)) {
                const channel = arr[i].Name.replace(/[^0-9]/g, '')
                mute[channel - 1] = arr[i].Value
              } else if (arr[i].Name.match(/zone.\d+.active/)) {
                const channel = arr[i].Name.replace(/[^0-9]/g, '')
                active[channel - 1] = arr[i].Value
              }
            }
          }
          this.emit('data', { id: 'GetPa', result: {gain, mute, active}})
          break
        default:
          this.emit('data', data)
      }
    }
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
