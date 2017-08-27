var Web3 = require('web3')
var Rx = require('rx')
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
var crypto = require('crypto')

var abi = [{ 'constant': true, 'inputs': [{ 'name': 'index', 'type': 'uint256' }], 'name': 'getClientAtIndex', 'outputs': [{ 'name': '', 'type': 'address' }, { 'name': '', 'type': 'uint256' }, { 'name': '', 'type': 'bytes32' }], 'payable': false, 'stateMutability': 'view', 'type': 'function' }, { 'constant': false, 'inputs': [], 'name': 'kill', 'outputs': [], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'function' }, { 'constant': false, 'inputs': [], 'name': 'popClient', 'outputs': [{ 'name': '', 'type': 'address' }, { 'name': '', 'type': 'uint256' }, { 'name': '', 'type': 'bytes32' }], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'clientAddress', 'type': 'address' }, { 'name': 'userData', 'type': 'bytes32' }], 'name': 'pushClient', 'outputs': [], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'function' }, { 'constant': true, 'inputs': [], 'name': 'getNumberOfClients', 'outputs': [{ 'name': '', 'type': 'uint256' }], 'payable': false, 'stateMutability': 'view', 'type': 'function' }, { 'inputs': [{ 'name': 'tit', 'type': 'bytes32' }, { 'name': 'desc', 'type': 'bytes32' }, { 'name': 'isFreeToEnter', 'type': 'bool' }, { 'name': 'dat', 'type': 'bytes32' }, { 'name': 'creatorAddress', 'type': 'address' }], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'constructor' }, { 'anonymous': false, 'inputs': [{ 'indexed': false, 'name': 'cliendAddress', 'type': 'address' }, { 'indexed': false, 'name': 'data', 'type': 'bytes32' }], 'name': 'ClientAdded', 'type': 'event' }, { 'anonymous': false, 'inputs': [{ 'indexed': false, 'name': 'clientAddress', 'type': 'address' }, { 'indexed': false, 'name': 'timestamp', 'type': 'uint256' }, { 'indexed': false, 'name': 'data', 'type': 'bytes32' }], 'name': 'ClientRemoved', 'type': 'event' }, { 'anonymous': false, 'inputs': [{ 'indexed': false, 'name': 'queueAddress', 'type': 'address' }], 'name': 'QueueKilled', 'type': 'event' }]
var address = '0xd04967986E36b7310D10Cda443847a31660521A7'

var contract = web3.eth.contract(abi).at(address)

var pushClient = function (contract, clientAddress, userData, callback) {
  contract.pushClient(clientAddress, userData, { from: '0x00ce9F958957f1f8A0059f36004f8aF9E4814006' }, function (err, data) {
    if (!err) {
      console.log('Push client Tx ID: ' + JSON.stringify(data))
      // contract.ClientAdded({ clientAddress: hex }, { fromBlock: 0, toBlock: 'latest' }).get(function (err, data) {
      //   console.log('Error ' + JSON.stringify(err))
      //   var last = data.pop()
      //   console.log('Cient adderess: ' + last.args.cliendAddress)
      //   console.log('Cient adderess from ascii: ' + web3.fromAscii(last.args.cliendAddress))
      // })
      // Fix this
      web3.eth.getBlockNumber((error, latestBlock) => {
        if (error) {
          console.log(error)
        }
        contract.ClientAdded({}, { fromBlock: latestBlock, toBlock: 'latest' }).watch(function (err, data) {
          console.log('Error ' + JSON.stringify(err))
          console.log('Cient adderess: ' + data.args.cliendAddress)
          console.log('Cient adderess from ascii: ' + web3.fromAscii(data.args.cliendAddress))
          var d = {
            cliendAddress: data.args.cliendAddress,
            data: web3.toUtf8(data.args.data).replace(/'/g, '')
          }
          callback(err, d)
        })
      })
    } else {
      console.log('Error ' + JSON.stringify(err))
      callback(err, data)
    }
  })
}

var popClient = function (contract, callback) {
  contract.popClient({ from: '0x00ce9F958957f1f8A0059f36004f8aF9E4814006' }, function (err, data) {
    console.log('Pop client' + JSON.stringify(data))
    if (!err) {
      web3.eth.getBlockNumber((error, latestBlock) => {
        if (error) {
          console.log(error)
        }

        contract.ClientRemoved({}, { fromBlock: latestBlock, toBlock: 'latest' }).watch(function (err, data) {
          // console.log('Error ' + JSON.stringify(err))
          // console.log('Cient adderess: ' + data.args.cliendAddress)
          // console.log('Cient adderess from ascii: ' + web3.fromAscii(data.args.cliendAddress))
          var d = {
            clientAddress: data.args.clientAddress,
            timestamp: data.args.timestamp.toString(),
            data: web3.toUtf8(data.args.data).replace(/'/g, '')
          }
          callback(err, d)
        })
      })
      // Fix this
      // ClientRemoved(removedAddress, removedTimestamp, removedData)

      // contract.ClientRemoved({}, { fromBlock: 0, toBlock: 'latest' }).get(function (err, data) {
      //   console.log('Error ' + JSON.stringify(err))
      //   var last = data.pop()
      //   console.log('Cient adderess: ' + last.args.cliendAddress)
      //   console.log('Cient adderess from ascii: ' + web3.fromAscii(last.args.cliendAddress))
      // })
    } else {
      callback(err, data)
    }
  })
}

var getNumberOfClients = function (contract, callback) {
  contract.getNumberOfClients(function (err, res) {
    callback(err, res.c[0])
  })
}

var getClientAtIndex = function (contract, index, callback) {
  contract.getClientAtIndex(index, function (err, res) {
    var data = {
      address: res[0],
      date: res[1].toString(),
      data: web3.toUtf8(res[2]).replace(/'/g, '')
    }
    callback(err, data)
  })
}

var randomHex = function (callback) {
  crypto.randomBytes(20, function (err, buffer) {
    callback(err, '0x' + buffer.toString('hex'))
  })
}

var doPushClient = function (contract, callback) {
  randomHex(function (err, hex) {
    if (!err) {
      console.log('Push client ID: ' + hex)
      pushClient(contract, hex, 'user data 4', callback)
    } else {
      console.log('Error: ' + err)
      callback(err)
    }
  })
}

// TEST
// doPushClient(function (err, res) {
//   console.log('Error: ' + err)
//   console.log('Res: ' + res)
// })
// getClientAtIndex(0, function (err, res) {
//   console.log('Error: ' + err)
//   console.log('Res: ', res)
// })
// getNumberOfClients(function (err, res) {
//   console.log('Error: ' + err)
//   console.log('Res: ' + res)
// })
// popClient(function (err, res) {
//   console.log('Error: ' + err)
//   console.log('Res: ', res)
// })

var getAllClientsForContract(contractAddress) {
  var contractVar = web3.eth.contract(abi).at(contractAddress)
  return getNumberOfClientsO(contractVar).flatMap((num) => {
    var observables = []
    for (var i = 0; i < num; i++) {
      observables.push(getClientAtIndexO(contractVar, i))
    }
    return Rx.Observable.zip(observables)
  })
}

// Test
// var contractVar = web3.eth.contract(abi).at('0xd04967986E36b7310D10Cda443847a31660521A7')
// getNumberOfClientsO(contractVar).flatMap((num) => {
//   var observables = []
//   for (var i = 0; i < num; i++) {
//     observables.push(getClientAtIndexO(contractVar, i))
//   }
//   return Rx.Observable.zip(observables)
// }).subscribe(
//   res => {
//     console.log('Next: ', res)
//   },
//   err => {
//     console.log('Error: ', err)
//   },
//   () => console.log('completed')
//   )
var getClientAtIndexO = Rx.Observable.fromNodeCallback(getClientAtIndex)
var getNumberOfClientsO = Rx.Observable.fromNodeCallback(getNumberOfClients)
exports.doPushClient = Rx.Observable.fromNodeCallback(doPushClient)
exports.getClientAtIndex = getClientAtIndexO
exports.getNumberOfClients = getNumberOfClientsO
exports.popClient = Rx.Observable.fromNodeCallback(popClient)
exports.getAllClientsForContract = getAllClientsForContract