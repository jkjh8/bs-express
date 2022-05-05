const { workerData, parentPort } = require('worker_threads')
const cheerio = require('cheerio')
const axios = require('axios')

if (workerData) {
  getHtml(workerData)
}

async function getHtml(ipaddress) {
  try {
    const html = await axios.get(`http://${ipaddress}/status`)
    let status = {}
    const $ = cheerio.load(html.data)
    $('dd').each((i, element) => {
      status[$(element).find('span:nth-of-type(2)').attr('class')] = $(element)
        .find('span:nth-of-type(2)')
        .text()
        .trim()
    })
    parentPort.postMessage({ command: 'comm', data: status })
  } catch (err) {
    parentPort.postMessage({
      command: 'error',
      data: `Barix ${ipaddress} Error: ${err}`
    })
  }
}
