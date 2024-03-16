const crypto = require("crypto");
const User = require("../models/user.model");
const ApiError = require("../errors/apiError");
const asyncWrapper = require("../middleware/asyncWrapper");
const Email = require("../utils/sendEmail");
const filterObj = require("../utils/filterObj");

exports.getUser = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: "bookings",
      options: { sort: { createdAt: -1 } },
    })
    .populate({
      path: "reviews",
      populate: {
        path: "tour",
        select: "name slug imageCover -guides",
        model: "Tour",
      },
    });
  res.status(200).json({ status: "success", data: user });
});

exports.signup = asyncWrapper(async (req, res) => {
  const filteredBody = filterObj(
    req.body,
    "name",
    "email",
    "photo",
    "password",
    "passwordConfirm"
  );
  const user = await User.create(filteredBody);

  const url = `${req.protocol}://${
    req.get("referer") || req.get("host")
  }/account`;
  new Email(user, url).sendWelcome();

  user.createSendToken(user, 201, req, res);
});

exports.login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError("Please provide email and password", 400);
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError("Invalid username or password", 401);
  }

  const isPasswordCorrect = await user.comparePassword(password, user.password);
  if (!isPasswordCorrect) {
    throw new ApiError("Invalid username or password", 401);
  }

  user.createSendToken(user, 200, req, res);
});

exports.forgotPassword = asyncWrapper(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw new ApiError("There is no user with this email address", 400);
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // const resetURL = `${req.protocol}://${req.get(
  //   "host"
  // )}/api/v1/users/reset-password/${resetToken}`;
  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  try {
    new Email(user, resetURL).sendPasswordReset();
    res.status(200).json({
      status: "success",
      message: `Token sent to ${user.email}`,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    throw new ApiError(
      "There was an error sending the email. Please try again later",
      500
    );
  }
});

exports.resetPassword = asyncWrapper(async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError("Token is invalid or has expired", 400);
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  user.createSendToken(user, 200, req, res);
});

exports.updateUser = asyncWrapper(async (req, res) => {
  const { password, passwordConfirm } = req.body;
  if (password || passwordConfirm) {
    throw new ApiError(
      "This route is not for password updates. Please use /update-password",
      400
    );
  }

  const filteredBody = filterObj(req.body, "name", "email", "photo");

  const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ status: "success", data: user });
});

exports.updatePassword = asyncWrapper(async (req, res) => {
  const { password, newPassword, newPasswordConfirm } = req.body;
  const user = await User.findById(req.user._id).select("+password");

  const isPasswordCorrect = await user.comparePassword(password, user.password);
  if (!isPasswordCorrect) {
    throw new ApiError("Invalid password", 401);
  }

  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  await user.save();

  user.createSendToken(user, 200, req, res);
});

exports.deleteUser = asyncWrapper(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({ status: "success" });
});

exports.logout = (req, res) => {
  const isSecure = req.secure || req.headers["x-forwarded-proto"] === "https";

  res.cookie("accessToken", "", {
    maxAge: 0,
    httpOnly: true,
    secure: isSecure,
    sameSite: isSecure ? "none" : "lax",
  });
  // res.cookie("auth_session", "", {
  //   maxAge: 0,
  //   httpOnly: true,
  //   secure: isSecure,
  //   sameSite: isSecure ? "none" : "lax",
  // });

  res.status(204).json({ status: "success" });
};
