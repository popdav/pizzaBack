const mongoose = require('mongoose');
const { insertAdmin, insertIngredient} = require('./index')

const connect  = async (url) => {
    try {
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        await insertAdmin();
        await insertIngredient();
    } catch (err) {
        // await mongoose.close();
        console.log('Error at dbConnect ::', err)
        throw err;
    }
}

module.exports.connect = connect;