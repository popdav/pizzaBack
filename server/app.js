const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const logger = require('morgan');
const app = express()
const indexRouter = require('./routes/index');
const { connect } = require('./services/connect')
const port = 5005

const corsOptions = {
  origin: 'http://localhost',
  optionsSuccessStatus: 200 // For legacy browser support
}

connect('mongodb://localhost:27017/spartansServer')
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => console.log('MongoDB error:', err))

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', indexRouter);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})