const { connect } = require('./src/connect');
const { mq } = require('./src/mq');

connect('mongodb://localhost:27017/spartansMQ')
.then(() => console.log('Connected'))
.then(async () => {
    // await mq.fillDB();
    await mq.load();
    await mq.start();
    console.log('Server listening')
});