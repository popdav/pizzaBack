const taskModel = require('./models/task').Task;

class DurableQueue {
    constructor() {
        this.queue = [];
        this.capacity = 15;
    }

    _checkCapacityConstraint() {
        return this.queue.length < this.capacity;
    }

    async push(task) {
        if (this._checkCapacityConstraint()) {
            try {
                const createdTask = await taskModel.create(task);
                
                this.queue.push(createdTask);
                return createdTask;
            } catch(err) {
                throw err;
            } 
        }
    }

    async finalizeTask(id) {
        try {
            return taskModel.updateOne({ _id: id }, { status: 'processed' })
        } catch(err) {
            throw err;
        }
    }

    async acknowledgeTask(id) {
        try {
            await taskModel.updateOne({ _id: id }, { status: 'processing' });
            this.queue.shift();
        } catch(err) {
            throw err;
        }
    }

    getNextTask() {
        try {
            if (this.queue.length === 0) return null;
            return this.queue[0]
        } catch(err) {
            throw err;
        }
    }

    async loadQueue() {
        this.queue = await taskModel.find({ status: "in_queue" });
        console.log(this.queue)
    }

    async find(query) {
        return taskModel.find(query);
    }
    async fillDB() {
        return taskModel.insertMany([{'duration': 2000}, 
                                    {'duration': 2000}, 
                                    { 'duration': 2000}, 
                                    { 'duration': 2000}]);
    }
    
}


module.exports.dq = new DurableQueue();