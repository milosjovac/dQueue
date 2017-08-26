var Web3 = require('web3')
var Rx = require('rx')
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

var abi = [{ 'constant': true, 'inputs': [], 'name': 'getQueuesAddresses', 'outputs': [{ 'name': '', 'type': 'address[]' }], 'payable': false, 'stateMutability': 'view', 'type': 'function' }, { 'constant': true, 'inputs': [{ 'name': '', 'type': 'address' }], 'name': 'mapQueues', 'outputs': [{ 'name': 'mDesc', 'type': 'bytes32' }, { 'name': 'mTitle', 'type': 'bytes32' }, { 'name': 'mOwnerAddress', 'type': 'address' }, { 'name': 'mQueueAddress', 'type': 'address' }], 'payable': false, 'stateMutability': 'view', 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'queueAddress', 'type': 'address' }], 'name': 'kill', 'outputs': [], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'title', 'type': 'bytes32' }, { 'name': 'desc', 'type': 'bytes32' }, { 'name': 'freeToEnter', 'type': 'bool' }, { 'name': 'data', 'type': 'bytes32' }], 'name': 'createQueue', 'outputs': [{ 'name': '', 'type': 'address' }], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'function' }]
var address = '0xe9b2429dC3Ae57592585E2D5c2685CC43173EA4a'
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

var getAllQueuesO = Rx.Observable.fromNodeCallback(getAllQueues)
var mapQueuesO = Rx.Observable.fromNodeCallback(mapQueues)

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
          // it is valid
          output.push(queue)
        }
      })
      return Rx.Observable.return(output)
    })
}

exports.getAllValidQueues = getAllValidQueues
exports.createQueue = Rx.Observable.fromNodeCallback(createQueue)
exports.kill = Rx.Observable.fromNodeCallback(kill)
