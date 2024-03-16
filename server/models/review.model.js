const mongoose = require("mongoose");
const Tour = require("./tour.model");

const ReviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    tour: {
      type: mongoose.Types.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Review must have an author"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ReviewSchema.index({ tour: 1, user: 1 }, { unique: true });

ReviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name email photo" }).populate({
    path: "tour",
    select: "name slug -guides",
  });
  next();
});

ReviewSchema.statics.calcAverageRating = async function (tourId) {
  const stats = await this.aggregate()
    .match({ tour: tourId })
    .group({
      _id: "$tour",
      nRatings: { $sum: 1 },
      avgRating: { $avg: "$rating" },
    })
    .addFields({
      avgRating: { $round: ["$avgRating", 1] },
    });

  if (stats.length) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRatings,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

ReviewSchema.post("save", function () {
  this.constructor.calcAverageRating(this.tour);
});

ReviewSchema.pre(/^findOneAnd/, async function () {
  this.review = await this.findOne().clone();
});

ReviewSchema.post(/^findOneAnd/, async function () {
  await this.review.constructor.calcAverageRating(this.review.tour._id);
});

module.exports = mongoose.model("Review", ReviewSchema);
