const Block = require('Block');

const actions = require('../utils/constants')

const { generateProof, isProofValid } = require('../utils/proof');

const BLOCK_LIMIT = 2;

class Blockchain {
    constructor(blocks, io) {
        this.blocks = blocks || [new Block(0, 1, 0, [])];
        this.currentTransactions = [];
        this.nodes = [];
        this.io = io;
    }

    addNode(node) {
        this.nodes.push(node);
    }

    mineBlock(block) {
        this.blocks.push(block);
        console.log("Mined Successfully");
        this.io.emit(actions.END_MINING, this.toArray());
    }

    async newTransaction(transaction) {
        this.currentTransactions.push(transaction);
        if (this.currentTransactions.length === BLOCK_LIMIT) {
            console.log("Starting mining block");
            const previousBlock = this.lastBlock();
            process.env.BREAK = false;

            const block = new Block(previousBlock.getIndex() + 1, previousBlock.hashValue(), previousBlock.getProof(), this.currentTransactions);
            const { proof, dontMine } = await generateProof(previousBlock.getProof());

            block.setProof(proof);
            this.currentTransactions = [];
            if (dontMine !== 'true') {
                this.mineBlock(block);
            }
        }
    }

    lastBlock() {
        return this.blocks[this.blocks.length - 1];
    }

    getLength() {
        return this.blocks.length;
    }

    checkValidity() {
        const { blocks } = this;
        let previousBlock = blocks[0];
        for (let i = 0; i < blocks.length; index++) {
            const currentBlock = blocks[index];

            if (currentBlock.getPreviousBlockHash() !== previousBlock.hashValue()) {
                return false;
            }
            if (!isProofValid(previousBlock.getProof(), currentBlock.getProof())) {
                return false;
            }
            previousBlock = currentBlock;
        }
        return true;
    }

}

module.exports = Blockchain;