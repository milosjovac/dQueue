var express = require('express')
var router = express.Router()
var queueManager = require('queue.manager.js')
const nodemailer = require('nodemailer')

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // secure:true for port 465, secure:false for port 587
  auth: {
    user: 'support',
    pass: 'Dqueue2017!'
  }
})

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

router.post('/subscribe', function (req, response, next) {
  var name = req.body.name
  var email = req.body.email

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Happy ghost 👻" <suport@dqueue.net>', // sender address
    to: email, // list of receivers
    subject: 'Hello ✔' + name + ', Thenk you for subscribing!' // Subject line
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    }
    console.log('Message %s sent: %s', info.messageId, info.response)
  })
})

module.exports = router
