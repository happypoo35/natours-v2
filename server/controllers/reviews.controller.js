const Review = require("../models/review.model");
const handlers = require("./.handlers");

// exports.setFilterByTour = (req, res, next) => {
//   if (req.params.tourId) {
//     req.query.tour = req.params.tourId;
//   }
//   next();
// };

exports.setTourUserIDs = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

// exports.calcAverageRating = async (req, res, next) => {
//   const stats = await Review.aggregate()
//     .match({ tour: req.body.tour })
//     .group({
//       _id: "$tour",
//       nRatings: { $sum: 1 },
//       avgRating: { $avg: "$rating" },
//     });

//   // await Tour.findByIdAndUpdate(tourId, {
//   //   ratingsQuantity: stats[0].nRatings,
//   //   ratingsAverage: stats[0].avgRating,
//   // });
// };

exports.getAllReviews = handlers.getAll(Review);
exports.getReview = handlers.getOne(Review);
exports.createReview = handlers.createOne(Review);
exports.updateReview = handlers.updateOne(Review);
exports.deleteReview = handlers.deleteOne(Review);
