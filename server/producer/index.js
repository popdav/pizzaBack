const addr = 'http://localhost';
const port = 5001;
const io = require('socket.io-client');

class Producer {
    constructor(addr='http://localhost', port=5001) {
        this.addr = addr;
        this.port = port;
    }

    async sendQuery(query, res) {
        const socket = io(`${this.addr}:${this.port}`, {query: query});
        socket.on(`${query.type}`, async data => {
            res.send(data);
            socket.close();
        })
        
    }
}

module.exports = Producer
