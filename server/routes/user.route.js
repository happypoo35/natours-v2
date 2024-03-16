const express = require("express");
const ctrl = require("../controllers/user.controller");
const setFilterBy = require("../middleware/setFilterBy");
const { protect, restrictTo } = require("../middleware/auth");
const { uploadPhoto, resizePhoto } = require("../utils/uploadPhoto");
const reviewRouter = require("./reviews.route");
const bookingRouter = require("./booking.route");
const setModel = require("../middleware/setModelName");

const router = express.Router({ mergeParams: true });

router.use(protect, restrictTo("admin"));

router.use("/:userId/reviews", setModel("Review"), reviewRouter);
router.use("/:userId/bookings", setModel("Booking"), bookingRouter);

router.route("/").get(setFilterBy, ctrl.getAllUsers);
router
  .route("/:id")
  .get(ctrl.getUser)
  .patch(uploadPhoto, resizePhoto, ctrl.updateUser)
  .delete(ctrl.deleteUser);

module.exports = router;
