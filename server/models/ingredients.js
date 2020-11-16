const mongoose = require('mongoose');

module.exports.Ingredient = mongoose.model(
    'Ingredient',
    new mongoose.Schema({
        name: String,
        price: Number,
        time: Number
    }),
);
