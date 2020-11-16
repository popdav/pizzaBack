const mongoose = require('mongoose');

const connect  = async (url) => {
    try {
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (err) {
        await mongoose.close();
        console.log('Error at dbConnect ::', err)
        throw err;
    }
}

module.exports.connect = connect;