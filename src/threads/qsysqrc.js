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

    // this.client.on('data', (data) => {
    //   try {
    //     this._data = Buffer.concat([
    //       this._data ?? [],
    //       data.includes(0) ? data.slice(0, data.indexOf(0)) : data
    //     ])
    //     if (data.includes(0)) {
    //       this._completed = true
    //       this.emit('data', JSON.parse(this._data))
    //     }
    //   } catch (err) {
    //     this.emit('error', err)
    //   }
    // })
  }
  connect() {
    try {
      this.client.connect({ port: 1710, host: this._ipaddress })
    } catch (err) {
      this.emit('error', err)
    }
  }

  send(msg) {
    // this._completed = false
    // this.noOp()
    return new Promise((resolve, reject) => {
      this._data = null
      if (this.connected) {
        // clearInterval(this._noOpinterval)
        try {
          this.client.on('data', (data) => {
            try {
              this._data = Buffer.concat([
                this._data ?? Buffer.alloc(0),
                data.includes(0) ? data.slice(0, data.indexOf(0)) : data
              ])
              if (data.includes(0)) {
                console.log(this._data)
                console.log(this._data.length)
                console.log(this._data[this._data.length - 1])
                const rt = JSON.parse(this._data)
                this._data = Buffer.alloc(0)
                if (rt.error) {
                  reject({ ipaddress: this._ipaddress, error: data.error })
                }
                resolve(rt)
              }
            } catch (err) {
              reject(err)
            }
          })
          // const _wait = setInterval(() => {
          //   if (this._completed) {
          //     this._completed = false
          //     clearInterval(_wait)
          //     const data = JSON.parse(this._data)
          //     if (data.error) {
          //       reject({ ipaddress: this._ipaddress, error: data.error })
          //     }
          //     resolve(data)
          //   }
          // })
          this.client.write(
            JSON.stringify({
              jsonrpc: '2.0',
              ...msg
            }) + '\0'
          )
        } catch (err) {
          reject(err)
        }
      } else {
        reject('core not connected')
      }
    })
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
