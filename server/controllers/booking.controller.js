const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Tour = require("../models/tour.model");
const Booking = require("../models/booking.model");
const handlers = require("./.handlers");

const asyncWrapper = require("../middleware/asyncWrapper");
const User = require("../models/user.model");

// exports.getUserBookings = asyncWrapper(async (req, res) => {
//   const bookings = await Booking.find({ user: req.user.id }).sort({
//     createdAt: -1,
//   });

//   // const tourIds = bookings.map((el) => el.tour.id);
//   // const tours = await Tour.find({ _id: { $in: tourIds } });

//   res.status(200).json({ status: "success", data: bookings });
// });

// exports.setFilterByTour = (req, res, next) => {
//   if (req.params.tourId) {
//     req.query.tour = req.params.tourId;
//   }
//   next();
// };

exports.getCheckoutSession = asyncWrapper(async (req, res) => {
  const tour = await Tour.findById(req.params.tourId);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [tour.imageCover],
        amount: tour.price * 100,
        currency: "usd",
        quantity: 1,
      },
    ],
    // success_url: `${process.env.SERVER_URL}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    success_url: `${process.env.CLIENT_URL}/checkout?status=success`,
    cancel_url: `${process.env.CLIENT_URL}/tours/${tour.slug}`,
  });

  res.status(200).json(session);
});

const createBookingCheckout = async (session) => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.amount_total / 100;

  await Booking.create({ tour, user, price });
};

exports.webhookCheckout = (req, res) => {
  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    createBookingCheckout(event.data.object);
  }

  res.status(200).json({ received: true });
};

exports.getAllBookings = handlers.getAll(Booking);
exports.createBooking = handlers.createOne(Booking);
exports.getBooking = handlers.getOne(Booking);
exports.updateBooking = handlers.updateOne(Booking);
exports.deleteBooking = handlers.deleteOne(Booking);
