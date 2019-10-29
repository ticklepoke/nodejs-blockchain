class Transaction {
    constructor(sender, receiver, amount) {
        this.sender = sender;
        this.receiver = receiver;
        this.amount = amount;
        this.timeStamp = Date.now()
    }
}

module.exports = Transaction;