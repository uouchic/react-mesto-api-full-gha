const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');
const userRouters = require('./routes/users');
const cardRouters = require('./routes/cards');

const { auth } = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const {
  createUser,
  login,
} = require('./controllers/users');

const NotFoundError = require('./errors/not-found-error');

const { PORT = 3000 } = process.env;

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Мы подключились к базе данных');
  });

const app = express();

app.use(cors({ origin: 'http://v-che.nomoredomains.work' }));

app.use(bodyParser.json());

app.use(requestLogger);

app.get('/api/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post(
  '/api/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);

app.post(
  '/api/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().min(2).pattern(/(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.([a-z]{2,6})))(:\d{2,5})?((\/.+)+)?\/?#?/),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);

app.use(auth);

app.use('/api', userRouters);
app.use('/api', cardRouters);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
