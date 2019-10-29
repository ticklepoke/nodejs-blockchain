const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const axios = require('axios');
const socketio = require('socket.io')
const client = require('socket.io-client');

const BlockChain = require('./models/Chain');
const SocketActions = require('./utils/constants');

const socketListeners = require('./socketListener');

const app = express();
app.use(bodyParser.json())
const httpServer = http.Server(app);
const io = socketio(httpServer);

const blockChain = new BlockChain(null, io);

const { PORT } = process.env;

app.post('/nodes', (req, res) => {
    const { host, port } = req.body;
    const { callback } = req.query;
    const node = `http://${host}:${port}`;
    const socketNode = socketListeners(client(node), blockChain);
    blockChain.addNode(socketNode, blockChain);

    if (callback === 'true') {
        console.log(`Added node ${node}`);
        res.json({ status: "Added node" }).end()
    } else {
        axios.post(`${node}/nodes?callback=true`, {
            host: req.hostname,
            port: PORT
        });
        console.log(`Added node ${node}`);
        res.json({ status: "Added node" }).end()
    }
})

app.post('/transaction', (req, res) => {
    const { sender, receiver, amount } = req.body;
    io.emit(SocketActions.ADD_TRANSACTION, sender, receiver, amount);
    res.json({ message: "Transaction success" }).end();
})

app.get('/chain', (req, res) => {
    res.json(blockChain.toArray()).end();
})

io.on('connection', (socket) => {
    console.log(`Socket connected, ID: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`Socket disconnected, ID: ${socket.id}`)
    })
})

blockChain.addNode(socketListeners(client(`http://localhost:${PORT}`), blockChain));
httpServer.listen(PORT, () => {
    console.log(`Express server running on ${PORT}`)
})