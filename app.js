require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const { limiter } = require('./middlewares/rateLimiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorCatcher } = require('./middlewares/errorCatcher');
const routes = require('./routes/index');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(requestLogger);

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.use(limiter);
app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(errorCatcher);

app.listen(PORT);
