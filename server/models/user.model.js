const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name!"],
      minlength: [3, "Can not be less than 3 characters"],
      maxlength: [100, "Can not be greater than 50 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      validate: [validator.isEmail, "Please provide a valid email"],
      lowercase: true,
      unique: true,
    },
    photo: {
      type: String,
      // default: "default.svg",
      default:
        "https://res.cloudinary.com/dmqqshihc/image/upload/users/default.svg",
    },
    role: {
      type: String,
      enum: ["user", "guide", "lead-guide", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Can not be less than 6 characters"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm a password"],
      minlength: [6, "Can not be less than 6 characters"],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Passwords are not the same",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.virtual("bookings", {
  ref: "Booking",
  foreignField: "user",
  localField: "_id",
});

UserSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "user",
  localField: "_id",
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

UserSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

UserSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_ACCESS, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

UserSchema.methods.refreshJWT = function (user, req, res) {
  const accessToken = user.createJWT();

  const isSecure = req.secure || req.headers["x-forwarded-proto"] === "https";

  const cookieOptions = {
    maxAge: process.env.JWT_LIFETIME,
    secure: isSecure,
    httpOnly: true,
    sameSite: isSecure ? "none" : "lax",
    // domain: "localhost",
    // path: "/",
  };

  res.cookie("accessToken", accessToken, cookieOptions);

  // res.cookie("auth_session", "", {
  //   ...cookieOptions,
  //   httpOnly: false,
  // });
};

UserSchema.methods.createSendToken = function (user, statusCode, req, res) {
  user.refreshJWT(user, req, res);
  user.password = undefined;

  res.status(statusCode).json({ status: "success", data: user });
};

UserSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  const isMatch = await bcrypt.compare(candidatePassword, userPassword);
  return isMatch;
};

UserSchema.methods.changedPassword = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = +this.passwordChangedAt.getTime() / 1000;
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
