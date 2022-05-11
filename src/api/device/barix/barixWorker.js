const { workerData, parentPort } = require('worker_threads')
const cheerio = require('cheerio')
const axios = require('axios')

async function getHtml(ipaddress) {
  const html = await axios.get(`http://${ipaddress}/status`, { timeout: 5000 })
  let status = {}
  const $ = cheerio.load(html.data)
  $('dd').each((i, element) => {
    status[$(element).find('span:nth-of-type(2)').attr('class')] = $(element)
      .find('span:nth-of-type(2)')
      .text()
      .trim()
  })
  parentPort.postMessage({ command: 'comm', data: status })
}

if (workerData) {
  getHtml(workerData)
}