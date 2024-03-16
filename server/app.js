const express = require("express");
const morgan = require("morgan");
const { engine } = require("express-handlebars");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
// const xss = require("xss-clean");
const cors = require("cors");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const compression = require("compression");

const ApiError = require("./errors/apiError");
const errorHandler = require("./middleware/errorHandler");
const setModel = require("./middleware/setModelName");
const userRouter = require("./routes/user.route");
const accountRouter = require("./routes/account.route");
const toursRouter = require("./routes/tours.route");
const reviewsRouter = require("./routes/reviews.route");
const bookingRouter = require("./routes/booking.route");
// const createBookingCheckout = require("./middleware/createBooking");
const { webhookCheckout } = require("./controllers/booking.controller");

const app = express();

// Security packages
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://192.168.50.139:3000",
      "https://natours-zeta.vercel.app",
    ],
    credentials: true,
  })
);

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 100,
  message: "Too many requests from this IP, please try again later",
});
app.use("/api", limiter);

app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

app.use(express.json({ limit: "10kb" }));

/**
 * Data sanitization agains NoSQL query injections
 * @example email: {"$gt": ""}
 */
app.use(mongoSanitize());

/**
 * Data sanitization agains XSS
 * @example html code in the req.body
 */
// app.use(xss());

/**
 * Preventing query params pollution
 * will remove duplicate params if not whitelisted
 * @example ?sort=price&sort=duration will throw 500 error
 */
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsAverage",
      "ratingsQuantity",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

app.use(compression());
app.use(cookieParser());
app.use(express.static("public"));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Handlebars
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

// app.get("/api/v1", createBookingCheckout, (req, res) => {
//   res.render("home", { title: "Home" });
// });

// Routes
app.use("/api/v1/users", setModel("User"), userRouter);
app.use("/api/v1/account", setModel("User"), accountRouter);
app.use("/api/v1/tours", setModel("Tour"), toursRouter);
app.use("/api/v1/reviews", setModel("Review"), reviewsRouter);
app.use("/api/v1/bookings", setModel("Booking"), bookingRouter);

app.use("*", (req) => {
  throw new ApiError(`Can not find ${req.originalUrl}`, 404);
});

app.use(errorHandler);

module.exports = app;
