const mongoose = require('mongoose');

module.exports.Task = mongoose.model(
    'Task',
    new mongoose.Schema({
        duration: Number,
        status: {
            type: String, 
            default: 'in_queue', 
            enum: ['in_queue', 'processing', 'processed']
        },
        price: Number,
        name: String,
        address: String,
        telephone: String,
        size: String,
        ingredient: String
        

    },
    {
        timestamps: true,
    }),
);
