var express = require('express')
var router = express.Router()
var queueManager = require('../modules/queue.manager.js')

router.get('/getAllValidQueues', function (req, response, next) {
  queueManager.getAllValidQueues().subscribe(
    res => {
      response.status(200).json({
        message: 'Success',
        result: res
      })
    },
    err => {
      response.status(500).json({
        message: 'Error',
        result: err
      })
    },
    () => console.log('completed')
  )
})

router.post('/createQueue', function (req, response, next) {
  var title = req.body.title
  var desc = req.body.desc
  var freeToEnter = req.body.freeToEnter
  var data = req.body.data

  queueManager.createQueue(title, desc, freeToEnter, data).subscribe(
    res => {
      response.status(200).json({
        message: 'Success',
        result: res
      })
    },
    err => {
      response.status(500).json({
        message: 'Error',
        result: err
      })
    },
    () => console.log('completed')
  )
})

router.delete('/kill', function (req, response, next) {
  var address = req.body.address

  queueManager.kill(address).subscribe(
    res => {
      response.status(200).json({
        message: 'Success',
        result: res
      })
    },
    err => {
      response.status(500).json({
        message: 'Error',
        result: err
      })
    },
    () => console.log('completed')
  )
})

module.exports = router
