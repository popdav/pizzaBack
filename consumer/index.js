const config = require('./config.json');
const io = require('socket.io-client')
const socket = io(`${config.mq.adress}:${config.mq.port}`);

let busy = false;

function process(id, duration) {
    setTimeout(() => {
        socket.emit('processed', { id })
        busy = false;
    }, duration)
}

function acknowledge(id) {
    socket.emit('ack', { id });
}

socket.on('process', (task) => {
    console.log('New task', task);
    if (!busy) {
        busy = true;
        const { _id, duration } = task;
        acknowledge(_id);
        process(_id, duration);
    }
});