const mongoose = require('mongoose');

module.exports.Member = mongoose.model(
    'Member',
    new mongoose.Schema({
        member: String,
        code: String
    }),
);
