'use strict';

var web3 = new Web3(new Web3.providers.WebsocketProvider("wss://rinkeby.infura.io/ws")); 

var abi = [
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

var address = "0x63a00a3a61906db8ff28b6e8672bebbd59f770b7";

chrome.runtime.sendMessage(0, function(response) {
    });

var contract = new web3.eth.Contract(abi, address);

var address = window.location.href;
var hash = sha256(address);
console.log(address);
console.log(hash);

var ret = contract.methods.flaggedArticles("0x" + hash.toString()).call(function(err,ret){
    if(err){
        console.log(err);
        return;
    }
    console.log("Is it fake news?: " + ret.exists);
    var req;
    if (ret.exists) {
        console.log("Reporter: " + ret.reporter);
        console.log("Validator: " + ret.validator);
        req = {
            reporter: ret.reporter,
            validator: ret.validator,
            exists: ret.exists
        }
    } else {
        req = {
            exists: ret.exists
        }
    }
    chrome.runtime.sendMessage(req, function(response) {
        console.log("Done " + response);
        if(ret.exists){
            document.getElementsByTagName('body')[0].setAttribute("style", "background-color: #F89090; color: darkred;");
        }
    });
});

