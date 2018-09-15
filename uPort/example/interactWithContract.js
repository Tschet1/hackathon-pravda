/*jslint es6 */

const uportConnect = require('uport-connect');
const qrcode = require('qrcode-terminal');

const mnidAddress = '2ofvFxrcZ516h7C9Ag3qu62cfDLabAQAcFH';
const signingKey = 'a035e426dfbd739e2c7a933e965eda7a0464c579e823666759f3e7e86d84251e';
const appName = 'Pravda';
const contractAbi = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "hash",
        "type": "uint256"
      },
      {
        "name": "validatorAddr",
        "type": "string"
      }
    ],
    "name": "flagAsFake",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "flaggedArticles",
    "outputs": [
      {
        "name": "exists",
        "type": "bool"
      },
      {
        "name": "reporter",
        "type": "address"
      },
      {
        "name": "validator",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];
const contractAddress = '0x63a00a3a61906db8ff28b6e8672bebbd59f770b7';

const uriHandler = (uri) => {
  qrcode.generate(uri, {small: true})
  console.log(uri)
};

const uport = new uportConnect.Connect(appName, {
  uriHandler,
  clientId: mnidAddress,
  network: 'rinkeby',
  signer: uportConnect.SimpleSigner(signingKey)
});

const web3 = uport.getWeb3();
const myContractABI = web3.eth.contract(contractAbi);
const myContract = myContractABI.at(contractAddress);

// Request credentials
uport.requestCredentials({
  requested: ['name'],  verified: ['digitalid'],
  }).then((credentials) => {
  console.log(credentials);

  var decodedId = uportConnect.MNID.decode(credentials.address);
  var specificNetworkAddress = decodedId.address;

  var validatorAddress = credentials.verified[0].iss;
  var validatorId = uportConnect.MNID.decode(validatorAddress);
  console.log(validatorId);

  myContract.flagAsFake(1234, validatorAddress.toString(), (error, txHash) => {
    if (error) {
      console.log(err);
      throw error;
    }
    waitForMined(txHash, { blockNumber: null }, // see next area
    function pendingCB () {
    // Signal to the user you're still waiting
    // for a block confirmation
    console.log("Waiting for feedback");
  },
    function successCB (data) {
      // Great Success!
      console.log("Likely you'll call some eventPublisherMethod(txHash, data)");
    });
  });


});

// Callback handler for whether it was mined or not
const waitForMined = (txHash, response, pendingCB, successCB) => {
  if (response.blockNumber) {
    successCB()
  } else {
    pendingCB()
    pollingLoop(txHash, response, pendingCB, successCB)
  }
}

// Recursive polling to do continuous checks for when the transaction was mined
const pollingLoop = (txHash, response, pendingCB, successCB) => {
  setTimeout(function () {
    web3.eth.getTransaction(txHash, (error, response) => {
      if (error) { throw error }
      if (response === null) {
        response = { blockNumber: null }
      } // Some ETH nodes do not return pending tx
      waitForMined(txHash, response, pendingCB, successCB)
    })
  }, 1000) // check again in one sec.
}


