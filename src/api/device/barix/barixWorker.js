const { workerData, parentPort } = require('worker_threads')
const cheerio = require('cheerio')
const axios = require('axios')


async function defaultFn () {
  if (workerData) {
    try {
      const r = await getHtml(workerData)
      parentPort.postMessage(r)
    } catch (err) {
      parentPort.postMessage({
        command: 'error',
        data: `Barix ${ipaddress} Error: ${JSON.stringify(err)}`
      })
    }
  }
}

async function getHtml(ipaddress) {
  return new Promise(async (resolve, reject) => {
    try {
      setTimeout(() => {
        reject('Timeout')
      }, 5000)
      const html = await axios.get(`http://${ipaddress}/status`)
      let status = {}
      const $ = cheerio.load(html.data)
      $('dd').each((i, element) => {
        status[$(element).find('span:nth-of-type(2)').attr('class')] = $(element)
          .find('span:nth-of-type(2)')
          .text()
          .trim()
      })
      resolve({ command: 'comm', data: status })
    } catch (err) {
      reject(err)
    }
  })
}

if (workerData) {
  defaultFn()
}