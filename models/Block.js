const crypto = require('crypto');
const Transaction = require('./Transaction');

class Block {
    constructor(index, previousBlockHash, previousProof, transactions) {
        this.index = index;
        this.proof = previousProof;
        this.previousBlockHash = previousBlockHash;
        this.transactions = transactions;
        this.timeStamp = Date.now();
    }

    hashValue() {
        const { index, proof, transactions, timeStamp } = this;
        const blockString = `${index}-${proof}-${JSON.stringify(transactions)}-${timeStamp}`;
        const hashFunction = crypto.createHash('sha256');
        hashFunction.update(blockString);
        return hashFunction.digest('hex');
    }

    setProof(proof) {
        this.proof = proof;
    }

    getProof() {
        return this.proof;
    }

    getIndex() {
        return this.index;
    }

    getPreviousBlockHash() {
        return this.previousBlockHash;
    }
}

module.exports = Block;