const Tour = require("../models/tour.model");
const asyncWrapper = require("../middleware/asyncWrapper");
const handlers = require("./.handlers");
const ApiError = require("../errors/apiError");

exports.getAllTours = handlers.getAll(Tour);
exports.getTour = handlers.getOne(Tour, { path: "reviews" });
exports.createTour = handlers.createOne(Tour);
exports.updateTour = handlers.updateOne(Tour);
exports.deleteTour = handlers.deleteOne(Tour);

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "3";
  req.query.sort = "-ratingsAverage,price";
  // req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getTourStats = asyncWrapper(async (req, res) => {
  const { groupBy, sortBy } = req.query;
  const queryObj = {};

  if (groupBy) {
    queryObj.groupBy = `$${req.query.groupBy}`;
  }

  if (sortBy) {
    queryObj.sortBy = sortBy.split(",").join(" ");
  } else {
    queryObj.sortBy = "-num";
  }

  const stats = await Tour.aggregate()
    // .match({ ratingsAverage: { $gte: 4.5 } })
    .group({
      _id: { $toUpper: queryObj.groupBy },
      num: { $sum: 1 },
      numRatings: { $sum: "$ratingsQuantity" },
      avgRating: { $avg: "$ratingsAverage" },
      avgPrice: { $avg: "$price" },
      minPrice: { $min: "$price" },
      maxPrice: { $max: "$price" },
    })
    .sort(queryObj.sortBy);

  res.status(200).json(stats);
});

exports.getMonthlyPlan = asyncWrapper(async (req, res) => {
  const year = +req.params.year;

  const plan = await Tour.aggregate()
    .unwind("$startDates")
    .match({
      startDates: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      },
    })
    .group({
      _id: { $month: "$startDates" },
      numOfTours: { $sum: 1 },
      tours: { $push: "$name" },
    })
    .addFields({ month: "$_id" })
    .project({ _id: 0 })
    .sort("-numOfTours");

  res.status(200).json({ nbHits: plan.length, data: plan });
});

exports.getToursWithin = asyncWrapper(async (req, res) => {
  const { units } = req.query;
  const { distance, latlng } = req.params;
  const [lat, lng] = latlng.split(",");

  if (!distance) {
    throw new ApiError("Please provide search radius", 400);
  }

  const radius = units === "mi" ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    throw new ApiError(
      "Please provide latitude and longitude in the format lat,log",
      400
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res
    .status(200)
    .json({ status: "success", nbHits: tours.length, data: tours });
});

exports.getDistances = asyncWrapper(async (req, res) => {
  const { units } = req.query;
  const [lat, lng] = req.params.latlng.split(",");

  const multiplier = units === "mi" ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    throw new ApiError(
      "Please provide latitude and longitude in the format lat,log",
      400
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: [+lng, +lat] },
        distanceField: "distance",
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: { $round: ["$distance", 2] },
        name: 1,
      },
    },
  ]);

  res.status(200).json({ status: "success", data: distances });
});
