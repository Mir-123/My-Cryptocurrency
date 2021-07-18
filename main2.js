const {Blockchain,Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('4ec88082c3a0465684461c6219d40a86dfaa486ea0a1dfe2032f896787d158e1');
const myWalletAddress = myKey.getPublic('hex');

let savjeeCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
savjeeCoin.addTransaction(tx1);


console.log('\n Starting the miner ... ');
savjeeCoin.minePendingTransactions(myWalletAddress);
console.log('\nBalance of xavier is ',savjeeCoin.getBalanceOfAddress(myWalletAddress));

// lets___try__to__tamper__with__our__blockchain 

savjeeCoin.chain[1].transactions[0].amount = 1;
console.log('\nBalance of xavier is ',savjeeCoin.getBalanceOfAddress(myWalletAddress));


console.log('\n Is Chain Valid ? ', savjeeCoin.isChainValid());