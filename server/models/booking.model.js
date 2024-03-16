const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Booking must belong to a tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Booking must belong to a user"],
    },
    price: {
      type: Number,
      required: [true, "Booking must have a price"],
    },
    paid: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

BookingSchema.index({ tour: 1, user: 1 }, { unique: true });

BookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: "tour",
    select: "name imageCover slug duration startDates -guides",
  }).populate({ path: "user", select: "email" });
  next();
});

module.exports = mongoose.model("Booking", BookingSchema);
