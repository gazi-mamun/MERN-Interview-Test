const express = require(`express`);
const cookieParser = require("cookie-parser"); // eslint-disable-line import/no-extraneous-dependencies

const helmet = require(`helmet`); // eslint-disable-line import/no-extraneous-dependencies
const rateLimit = require(`express-rate-limit`); // eslint-disable-line import/no-extraneous-dependencies
const morgan = require(`morgan`);
const mongoSanitize = require(`express-mongo-sanitize`); // eslint-disable-line import/no-extraneous-dependencies
const xss = require(`xss-clean`); // eslint-disable-line import/no-extraneous-dependencies
const cookieSession = require("cookie-session"); // eslint-disable-line import/no-extraneous-dependencies
const cors = require("cors"); // eslint-disable-line import/no-extraneous-dependencies

const AppError = require(`./utils/appError`);
const globalErrorHandler = require(`./controllers/errorController`);

const app = express();

////////////////
// middlewares
////////////////

app.use(
  cors({ origin: "https://mern-interview-test-frontend-bo46.onrender.com/" })
);

// Set security HTTP headers
app.use(helmet());

// body parser, reading data from body into req.body
app.use(express.json());

// cookie parser, reading cookie from req.body
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Development logging
if (process.env.NODE_ENV === `development`) {
  app.use(morgan(`dev`));
}

// limit requests from same API
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: `Too many requests from this IP, Please try again in an hour!`,
});
app.use(`/api`, limiter);

////////////////////////////
// importing routes
////////////////////////////
const drawingRoute = require("./routes/drawingRoutes");
const shapeRoute = require("./routes/shapeRoutes");

//////////////// x
// routes
////////////////
app.use("/api/drawings", drawingRoute);
app.use("/api/shapes", shapeRoute);

app.all(`*`, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
