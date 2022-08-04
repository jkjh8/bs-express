import path from 'path'
import express from 'express'
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendfile(path.join(__dirname, '../public/spa/index.html'))
})

// router.get('/', (req, res) => {
//   res.send('first page')
// })

export default router
