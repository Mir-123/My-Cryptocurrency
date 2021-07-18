const SHA256 = require('crypto-js/sha256');

class Transaction
{
    constructor(fromAddress, toAddress, amount)
    {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block 
{
    constructor(timestamp,transactions, previousHash = '') 
    {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() 
    {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty)
    {
        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0"))
        {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined : "+ this.hash);
    }
}

class Blockchain
{
    constructor()
    {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock()
    {
        return new Block("01/01/2017","Genesis block","0");
    }

    getLatestBlock()
    {
        return this.chain[this.chain.length-1];
    }

    minePendingTransactions(miningRewardAddress)
    {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("BLOCK IS SUCCESSFULLY MINED ! ");
        this.chain.push(block);
        this.pendingTransactions = 
        [
            new Transaction(null , miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction)
    {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address)
    {
        let balance = 0;
        for(const block of this.chain)
        {
            for(const trans of block.transactions)
            {
                if(trans.fromAddress === address)
                {
                    balance -= trans.amount;
                }
                if(trans.toAddress === address)
                {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }
}

let savjeeCoin = new Blockchain();

// in reality , address1 and address2 will be public key of someone wallet
savjeeCoin.createTransaction(new Transaction('address1' , 'address2' , 100));
savjeeCoin.createTransaction(new Transaction('address2' , 'address1' , 200));

console.log('\n Starting the miner ... ');

//this method wants to know where it should send the mining rewards to
savjeeCoin.minePendingTransactions('xaviers-address');
console.log('\nBalance of xavier is ',savjeeCoin.getBalanceOfAddress('xaviers-address'));

console.log('\n Starting the miner again... ');
savjeeCoin.minePendingTransactions('xaviers-address');
console.log('\nBalance of xavier is ',savjeeCoin.getBalanceOfAddress('xaviers-address'));

