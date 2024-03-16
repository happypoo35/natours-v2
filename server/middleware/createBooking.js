const Booking = require("../models/booking.model");
const asyncWrapper = require("./asyncWrapper");

const createBookingCheckout = asyncWrapper(async (req, res, next) => {
  const { tour, user, price } = req.query;

  if (tour && user && price) {
    await Booking.create({ tour, user, price });
  }

  res.redirect(`${process.env.CLIENT_URL}`);
});

module.exports = createBookingCheckout;
