import express from 'express'
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

// router.get('/', (req, res) => {
//   res.send('first page')
// })

export default router
