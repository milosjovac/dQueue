var Rx = require('rxjs/Rx')
var Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

var abi = [{ "constant": true, "inputs": [], "name": "getQueuesAddresses", "outputs": [{ "name": "", "type": "address[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "mapQueues", "outputs": [{ "name": "mDesc", "type": "bytes32" }, { "name": "mTitle", "type": "bytes32" }, { "name": "mOwnerAddress", "type": "address" }, { "name": "mQueueAddress", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "queueAddress", "type": "address" }], "name": "kill", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "title", "type": "bytes32" }, { "name": "desc", "type": "bytes32" }, { "name": "freeToEnter", "type": "bool" }, { "name": "data", "type": "bytes32" }], "name": "createQueue", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }]
var address = '0xcD26d77ec5023846462131ED0fBf949dDe506aAC'
var contract = web3.eth.contract(abi).at(address)

var createQueue = function (title, desc, freeToEnter, data, callback) {
  contract.createQueue(title, desc, freeToEnter, data, { from: '0x00ce9F958957f1f8A0059f36004f8aF9E4814006' }, callback)
}

var getAllQueues = function (callback) {
  contract.getQueuesAddresses(callback)
}

var kill = function (address, callback) {
  contract.kill(address, { from: '0x00ce9F958957f1f8A0059f36004f8aF9E4814006' }, callback)
}

var mapQueues = function (address, callback) {
  contract.mapQueues(address, callback)
}

var getAllQueuesO = Rx.Observable.bindNodeCallback(getAllQueues)
var mapQueuesO = Rx.Observable.bindNodeCallback(mapQueues)

var getAllValidQueues = function () {
  return getAllQueuesO()
    .flatMap((adresses) => {
      
      var observables = []
      adresses.forEach(function (address) {
        observables.push(mapQueuesO(address))
      })
      // if (observables.length === 1) {
      //   return mapQueuesO(adresses[0])
      // } else if (observables.length === 0) {
      //   return Rx.Observable.empty()
      // }
      return Rx.Observable.zip(...observables)
    })
    .map((queues) => {
      var output = []
      queues.forEach(function (queue) {
        if (parseInt(queue[3]) > 0) {
          // // it is valid
          // output.push(queue)
          output.push({
            descrition: web3.toUtf8(queue[0]).replace(/'/g, ''),
            title: web3.toUtf8(queue[1]).replace(/'/g, ''),
            ownerAdr: queue[2],
            queueAdr: queue[3]

          })
        }
      })
      return Rx.Observable.of(output)
    })
}

exports.getAllValidQueues = getAllValidQueues
exports.createQueue = Rx.Observable.bindNodeCallback(createQueue)
exports.kill = Rx.Observable.bindNodeCallback(kill)
