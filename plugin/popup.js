'use strict';

var uportconnect = window.uportconnect
var address;
var hash;
//get the address
chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
   function(tabs){
        address = tabs[0].url;
        hash = sha256(address);
   }
);

var qrcode = new QRCode(document.getElementById("qrcode"));
const uriHandler = (uri) => {
    qrcode.clear();
    qrcode.makeCode(uri);
};
const mnidAddress = '2ofvFxrcZ516h7C9Ag3qu62cfDLabAQAcFH';
const signingKey = 'a035e426dfbd739e2c7a933e965eda7a0464c579e823666759f3e7e86d84251e';

var uport = new uportconnect.Connect('Pravda', {
    uriHandler: uriHandler,
    clientId: mnidAddress,
    network: 'rinkeby',
    signer: uportconnect.SimpleSigner(signingKey)
});

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

const web3 = uport.getWeb3();
const myContractABI = web3.eth.contract(contractAbi);
const myContract = myContractABI.at(contractAddress);

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
uport.requestCredentials({requested: ['name'],  verified: ['digitalid']})
    .then((credentials) => {
        var decodedId = uportconnect.MNID.decode(credentials.address);
        var specificNetworkAddress = decodedId.address;
        var validatorAddress = credentials.verified[0].iss;

        alert(hash);
        myContract.flagAsFake("0x" + hash.toString(), validatorAddress.toString(), (error, txHash) => {
            if (error) {
                throw error;
            }
            waitForMined(txHash, { blockNumber: null }, // see next area
                function pendingCB () {
                    // Signal to the user you're still waiting
                    // for a block confirmation
                    //alert("Waiting for feedback");
                },
                function successCB (data) {
                    // Great Success!
                    alert("Likely you'll call some eventPublisherMethod(txHash, data)");
                });
        });
    });
/*
const mnidAddress = '2ofvFxrcZ516h7C9Ag3qu62cfDLabAQAcFH';
const appName = 'Pravda';

const uriHandler = (uri) => {
  new QRCode(document.getElementById("qrcode"), uri);
  alert(uri);
};

const uport = new uportconnect.Connect(appName, {
  uriHandler,
  clientId: mnidAddress,
  network: 'rinkeby',
});


// Request credentials
uport.requestCredentials({
  requested: ['name'],  verified: ['digitalid'],
  }).then((credentials) => {
  console.log(credentials);

  var decodedId = uportConnect.MNID.decode(credentials.address);
  var specificNetworkAddress = decodedId.address;

  myContract.create(13, (error, txHash) => {
    if (error) {
      throw error;
    }
    waitForMined(txHash, { blockNumber: null }, // see next area
    function pendingCB () {
    // Signal to the user you're still waiting
    // for a block confirmation
    alert("Waiting for feedback");
  },
    function successCB (data) {
      // Great Success!
      alert("Likely you'll call some eventPublisherMethod(txHash, data)");
    });
  });


});

*/
