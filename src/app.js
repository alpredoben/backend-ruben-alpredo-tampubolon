const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const routerHealthCheck = require('./routes/health_route');
const { translator } = require('./lang');
const { APP } = require('./configs/environments');
const apiRoute = require('./routes');
const {
  corsMiddleware,
  compressionMiddleware,
  loggerMiddleware,
  headerLangMiddleware,
  xssFilterMiddleware,
} = require('./middlewares/framework_middleware');

const {
  errorHandlerMiddleware,
  errorNotFoundHandlerMiddleware,
  removeFaviconHandlerMiddleware,
} = require('./middlewares/error_middleware');

const app = express();

app.use(translator.init);

// parse json request body
app.use(express.json({ limit: APP.LIMIT_JSON }));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Setup header lang default or custom middleware
app.use(headerLangMiddleware);
app.set('trust proxy', 1);

app.use(helmet());

app.use(corsMiddleware());
app.use(compressionMiddleware());
app.use(xssFilterMiddleware);
app.use(morgan('combined'));

app.use('/public', express.static('public'));

// Routing
app.use(routerHealthCheck);

app.use(apiRoute);

app.use(loggerMiddleware);
app.use(errorNotFoundHandlerMiddleware);
app.use(errorHandlerMiddleware);
app.use(removeFaviconHandlerMiddleware);

module.exports = app;
