var Rx = require('rxjs/Rx')
// import { Observable } from 'rxjs/Rx'
var Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

var abi = [{ 'constant': true, 'inputs': [{ 'name': '', 'type': 'uint256' }], 'name': 'queues', 'outputs': [{ 'name': 'mDesc', 'type': 'bytes32' }, { 'name': 'mTitle', 'type': 'bytes32' }, { 'name': 'mOwnerAddress', 'type': 'address' }, { 'name': 'mQueueAddress', 'type': 'address' }], 'payable': false, 'stateMutability': 'view', 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'title', 'type': 'bytes32' }, { 'name': 'desc', 'type': 'bytes32' }, { 'name': 'freeToEnter', 'type': 'bool' }, { 'name': 'data', 'type': 'string' }], 'name': 'createQueue', 'outputs': [{ 'name': '', 'type': 'address' }], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'function' }, { 'constant': true, 'inputs': [], 'name': 'getQueuesLength', 'outputs': [{ 'name': '', 'type': 'uint256' }], 'payable': false, 'stateMutability': 'view', 'type': 'function' }]
var address = '0xC7103021DB050215Cde0f24a4Ff176D9918B1b9A'
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
      return Rx.Observable.zip(observables)
    })
    .flatMap((queues) => {
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
      return Rx.Observable.return(output)
    })
}

exports.getAllValidQueues = getAllValidQueues
exports.createQueue = Rx.Observable.bindNodeCallback(createQueue)
exports.kill = Rx.Observable.bindNodeCallback(kill)
