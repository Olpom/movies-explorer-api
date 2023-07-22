require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const limiter = require('./middlewares/rateLimiter');
const corsHandler = require('./middlewares/corsHandler');
const { requestLogger, errorLogger, logger } = require('./middlewares/logger');
const router = require('./routes');
const errorHandler = require('./utils/errorHandler');

const app = express();

const { PORT, MONGO_URL } = require('./utils/config');

// подключение к MongoDB

console.log('Before connecting to MongoDB');

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => logger.info('Database is connected'))
  .catch((err) => logger.error('Error connecting to the database', err));

console.log('After connecting to MongoDB');

mongoose.set({ runValidators: true });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// настраиваем заголовки
app.use(helmet());

app.use(limiter);

// Логирование запросов
app.use(requestLogger);

app.use(corsHandler);

// используем корневой рутер
app.use('/', router);

// Обработка ошибок Joi validation
app.use(errors());

// Логирование ошибок
app.use(errorLogger);

// подключаем централизованный обработчик ошибок
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`App listening on port ${PORT}`);
});
