const { workerData, parentPort } = require('worker_threads')
const net = require('net')
const { clearInterval } = require('timers')

console.log('worker data', workerData)

let client = net.Socket()
const _ipaddress = workerData
let connected = false
let _data = null
let _noOpInterval = null

client.on('connect', () => {
  connected = true
  parentPort.postMessage({
    command: 'connect',
    ipaddress: _ipaddress
  })
})

client.on('close', () => {
  connected = false
  parentPort.postMessage({
    command: 'close',
    ipaddress: _ipaddress
  })
})

client.on('error', (err) => {
  connected = false
  parentPort.postMessage({
    command: 'error',
    ipaddress: _ipaddress,
    message: err
  })
})
client.on('data', (data) => {
  if (data.includes(0)) {
    if (_data) {
      _data = Buffer.concat([_data, data.slice(0, data.indexOf(0))])
    } else {
      _data = data.slice(0, data.indexOf(0))
    }
    parentPort.postMessage({
      command: 'data',
      ipaddress: _ipaddress,
      data: JSON.parse(_data)
    })
    _data = null
  } else {
    if (_data) {
      _data = Buffer.concat([_data, data])
    } else {
      _data = data
    }
  }
})

function connect() {
  client.connect({ port: 1710, host: _ipaddress })
}

function noOp() {
  if (_noOpInterval) {
    clearInterval(_noOpInterval)
  }
  _noOpInterval = setInterval(() => {
    client.write(
      JSON.stringify({
        jsonrpc: '2.0',
        method: 'NoOp',
        params: {}
      }) + '\0'
    )
  }, 50000)
}

function send(obj) {
  try {
    client.write(
      JSON.stringify({
        jsonrpc: '2.0',
        ...obj
      }) + '\0'
    )
  } catch (err) {
    console.error(err)
  }
}

parentPort.on('message', (msg) => {
  const { command } = msg
  switch (command) {
    case 'send':
      send(msg.data)
      break
  }
})

connect()
