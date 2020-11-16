const { dq } = require('./queue');
const cron = require('node-cron');

class MQ {
    constructor(durableQueue) {
        this.consumer = null;
        this.consumerIo = require('socket.io')();
        this.producerIo = require('socket.io')();
        this.durableQueue = durableQueue;
        this.task = cron.schedule('*/5 * * * * *', () =>  {
            this._pushTask();
          }, {
            scheduled: false
          });
    }

    async load() {
        await this.durableQueue.loadQueue();
        // console.log(JSON.stringify(this.durableQueue.queue));
    }

    async start() {
        this.producerIo.listen(5001);
        this.consumerIo.listen(5000);
        this.consumerIo.on('connection', consumer => { 
            console.log('Consumer connected');
            this._initializeConsumer(consumer);
            this.task.start();
        });

        this.producerIo.on('connection', async producer => {
            const query = producer.handshake.query;
            const result = await this[query.type](JSON.parse(query.data));
            producer.emit(`${query.type}`, (result));
        });
    }

    async produce(data) {
        const res = await this.durableQueue.push(data);
        return res;
    }

    async query(data) {
        return await this.durableQueue.find(data);
    }

    _pushTask() {
        console.log('Task triggered');
        const task = this.durableQueue.getNextTask();
        if (task === null) return;
        this.consumer.emit('process', task);
    }

    async _acknowledgeTask(id) {
        await this.durableQueue.acknowledgeTask(id);
        console.log('Task is ackwed', id);
    }

    async _finalizeTask(id) {
        await this.durableQueue.finalizeTask(id);
        console.log('Task is processed', id);
    }

    _initializeConsumer(consumer) {
        this.consumer = consumer;
        this.consumer.on('ack', task => { 
            this._acknowledgeTask(task.id);
        });
        this.consumer.on('processed', (task) => { 
            this._finalizeTask(task.id);
        });
    }

    async fillDB() {
        return this.durableQueue.fillDB();
    }
}

module.exports.mq = new MQ(dq);