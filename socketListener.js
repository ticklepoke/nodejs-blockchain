const SocketActions = require('./utils/constants');

const Transaction = require('./models/Transaction');
const Blockchain = require('./models/Chain');

const socketListeners = (socket, chain) => {
    socket.on(SocketActions.ADD_TRANSACTION, (sender, receiver, amount) => {
        const transaction = new Transaction(sender, receiver, amount);
        chain.newTransaction(transaction);
        console.log(`Added transaction: ${JSON.stringify(transaction.getDetails(), null, '\t')}`);
    });

    socket.on(SocketActions.END_MINIG, (newChain) => {
        console.log("End Mining");
        process.env.BREAK = true;

        const blockChain = new Blockchain();

        blockChain.parseChain(newChain);
        if (blockChain.checkValidity() && blockChain.getLength() >= chain.getLength()) {
            chain.blocks = blockChain.blocks;
        }
    })
    return socket;
}

module.exports = socketListeners;