const mongoose = require("mongoose");
const slugify = require("slugify");

const TourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tour must have a name"],
      minlength: [5, "Tour name can not be less than 5 characters"],
      maxlength: [40, "Tour name can not be greater than 40 characters"],
      trim: true,
      unique: true,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "Tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "Tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "Tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty should be either: easy, medium or difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating can not be less than 1"],
      max: [5, "Rating can not be greater than 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // Only works with newly created document
          // doesn't work with update
          return val <= this.price;
        },
        message:
          "Discount price({VALUE}) can not be greater or equal than price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "Tour must have a description"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      // default: "default.svg",
      default:
        "https://res.cloudinary.com/dmqqshihc/image/upload/tours/default.svg",
      // required: [true, "Tour must have a cover image"],
    },
    images: [
      {
        type: String,
        // default: "default.svg",
        default:
          "https://res.cloudinary.com/dmqqshihc/image/upload/tours/default.svg",
      },
    ],
    startDates: [Date],
    secret: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

TourSchema.index({ price: 1, ratingsAverage: -1 });
TourSchema.index({ slug: 1 });
TourSchema.index({ startLocation: "2dsphere" });

// TourSchema.virtual("durationWeeks").get(function () {
//   return +(this.duration / 7).toFixed(2);
// });

TourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

TourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

TourSchema.pre(/^find/, function (next) {
  this.find({ secret: { $ne: true } });
  next();
});

TourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-createdAt -updatedAt -passwordChangedAt",
  });
  next();
});

// TourSchema.pre("aggregate", function (next) {
//   this.pipeline().unshift({ $match: { secret: { $ne: true } } });
//   next();
// });

module.exports = mongoose.model("Tour", TourSchema);
