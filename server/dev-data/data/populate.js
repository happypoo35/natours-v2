require("dotenv").config();

const connectDB = require("../../db/connect");

const Tour = require("../../models/tour.model");
const Review = require("../../models/review.model");
const User = require("../../models/user.model");

const jsonTours = require("./tours.json");
const jsonReviews = require("./reviews.json");
const jsonUsers = require("./myUsers.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Tour.deleteMany();
    await Review.deleteMany();
    await User.deleteMany();
    await Tour.create(jsonTours);
    await Review.create(jsonReviews);
    await User.create(jsonUsers, { validateBeforeSave: false });
    console.log("DB Populated");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
