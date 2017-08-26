var Web3 = require('web3')
var Rx = require('rx')
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

var abi = [
  {
    'constant': true,
    'inputs': [
      {
        'name': '',
        'type': 'uint256'
      }
    ],
    'name': 'queues',
    'outputs': [
      {
        'name': 'mDesc',
        'type': 'bytes32'
      },
      {
        'name': 'mTitle',
        'type': 'bytes32'
      },
      {
        'name': 'mOwnerAddress',
        'type': 'address'
      },
      {
        'name': 'mQueueAddress',
        'type': 'address'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'getQueuesLength',
    'outputs': [
      {
        'name': '',
        'type': 'uint256'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'title',
        'type': 'bytes32'
      },
      {
        'name': 'desc',
        'type': 'bytes32'
      },
      {
        'name': 'freeToEnter',
        'type': 'bool'
      },
      {
        'name': 'data',
        'type': 'bytes32'
      }
    ],
    'name': 'createQueue',
    'outputs': [
      {
        'name': '',
        'type': 'address'
      }
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }
]
var address = '0xD9b4a782890ebDA8791C7195035795c18119B27B'
var contract = web3.eth.contract(abi).at(address)

var getPeopleInQueue = function (start, end, callback) {
  var queue = Rx.Observable.fromNodeCallback(contract.queues)
  var getQueuesLength = Rx.Observable.fromNodeCallback(contract.getQueuesLength)

  var observables = []
  var output = []

  getQueuesLength()
    .flatMap((res) => {
      // check for errors
      var elementsCount = res.c[0]
      if (start >= elementsCount || start + end >= elementsCount) {
        return Rx.Observable.throw(new Error('Out of bounds request'))
      }
      for (var i = start; i <= start + end; i++) {
        observables.push(queue(i))
      }
      return Rx.Observable.concat(observables)
    })
    .subscribe(
    result => {
      output.push({
        descrition: web3.toUtf8(result[0]).replace(/'/g, ''),
        title: web3.toUtf8(result[1]).replace(/'/g, ''),
        ownerAdr: result[2],
        queueAdr: result[3]

      })
    },
    err => {
      console.log(err)
      callback(err)
    },
    () => {
      console.log('finished')
      callback(output)
    }
    )
}

var createQueue = function (title, desc, freeToEnter, data, callback) {
  contract.createQueue(title, desc, freeToEnter, data, {from: '0x00ce9F958957f1f8A0059f36004f8aF9E4814006'}, callback)
}

///// TEST
// getPeopleInQueue(0, 2, function (result) {
//   console.log(result)
// })
// createQueue('red1', 'desc1 red', true, 'neki data', function (err, address) {
//   console.log(err)
//   console.log(address)
// })

exports.getPeopleInQueue = Rx.Observable.fromNodeCallback(getPeopleInQueue)
exports.createQueue = Rx.Observable.fromNodeCallback(createQueue)
