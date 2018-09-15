'use strict';

var web3 = new Web3(new Web3.providers.WebsocketProvider("wss://rinkeby.infura.io/ws")); 

var abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "hash",
				"type": "uint256"
			}
		],
		"name": "create",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
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
		"name": "articles",
		"outputs": [
			{
				"components": [
					{
						"name": "score",
						"type": "uint8"
					}
				],
				"name": "metadata",
				"type": "tuple"
			},
			{
				"name": "exists",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

var address = "0x9a9f619c9ed10831f68493181e4152e9abcec34c";

var contract = new web3.eth.Contract(abi, address);

var address = window.location.href;
var hash = sha256(address);
console.log(address);
console.log(hash);

var ret = contract.methods.articles("0x" + hash.toString()).call(function(err,ret){
    console.log(ret.exists);
    chrome.runtime.sendMessage(ret.exists, function(response) {
        console.log("Done " + response);
    });
});

