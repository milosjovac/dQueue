var Web3 = require('web3')
var Rx = require('rx')
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

var abi = [{ 'constant': true, 'inputs': [{ 'name': 'index', 'type': 'uint256' }], 'name': 'getClientAtIndex', 'outputs': [{ 'name': '', 'type': 'address' }, { 'name': '', 'type': 'uint256' }, { 'name': '', 'type': 'bytes32' }], 'payable': false, 'stateMutability': 'view', 'type': 'function' }, { 'constant': false, 'inputs': [], 'name': 'popClient', 'outputs': [{ 'name': '', 'type': 'address' }, { 'name': '', 'type': 'uint256' }, { 'name': '', 'type': 'bytes32' }], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'clientAddress', 'type': 'address' }, { 'name': 'userData', 'type': 'bytes32' }], 'name': 'pushClient', 'outputs': [], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'function' }, { 'constant': true, 'inputs': [], 'name': 'getNumberOfClients', 'outputs': [{ 'name': '', 'type': 'uint256' }], 'payable': false, 'stateMutability': 'view', 'type': 'function' }, { 'inputs': [{ 'name': 'tit', 'type': 'bytes32' }, { 'name': 'desc', 'type': 'bytes32' }, { 'name': 'isFreeToEnter', 'type': 'bool' }, { 'name': 'dat', 'type': 'bytes32' }, { 'name': 'cr', 'type': 'address' }], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'constructor' }, { 'anonymous': false, 'inputs': [{ 'indexed': false, 'name': 'cliendAddress', 'type': 'address' }, { 'indexed': false, 'name': 'data', 'type': 'bytes32' }], 'name': 'ClientAdded', 'type': 'event' }, { 'anonymous': false, 'inputs': [{ 'indexed': false, 'name': 'clientAddress', 'type': 'address' }], 'name': 'ClientRemoved', 'type': 'event' }]
var address = '0x1bc138dd4220c4e88500efbca2e43b1c7bc00b0c'

var contract = web3.eth.contract(abi).at(address)

var pushClient = function (clientAddress, userData, callback) {
  contract.pushClient(clientAddress, userData, function (result) {
    console.log('Push client %s', result)
  })
}

var popClient = function () {
  contract.popClient(function (address, uint, bytes32) {
    console.log('Pop client %s %s %s', address, uint, bytes32)
  })
}

var getNumberOfClients = function () {
  contract.getNumberOfClients(function (num) {
    console.log('Pop client %s', num)
  })
}

var getClientAtIndex = function (index) {
  contract.getClientAtIndex(index, function (address, uint, bytes32) {
    console.log('Pop client %s %s %s', address, uint, bytes32)
  })
}

// Ne radi!!!
pushClient(web3.utils.randomHex(40), 'user data')
