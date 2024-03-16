const express = require("express");
const { protect, restrictTo } = require("../middleware/auth");
const ctrl = require("../controllers/tours.controller");
const reviewRouter = require("./reviews.route");
const bookingRouter = require("./booking.route");
const setModel = require("../middleware/setModelName");
const {
  uploadTourImages,
  resizeTourImages,
  resizeImageCover,
} = require("../utils/uploadPhoto");

const router = express.Router();

router.use("/:tourId/reviews", setModel("Review"), reviewRouter);
router.use("/:tourId/bookings", setModel("Booking"), bookingRouter);

router.route("/highest-rated").get(ctrl.aliasTopTours, ctrl.getAllTours);
router.route("/tour-stats").get(ctrl.getTourStats);
router
  .route("/monthly-plan/:year")
  .get(
    protect,
    restrictTo("admin", "lead-guide", "guide"),
    ctrl.getMonthlyPlan
  );
router.route("/within/:latlng/:distance").get(ctrl.getToursWithin);
router.route("/distances/:latlng").get(ctrl.getDistances);

router
  .route("/")
  .get(ctrl.getAllTours)
  .post(
    protect,
    restrictTo("admin", "lead-guide"),
    uploadTourImages,
    resizeImageCover,
    resizeTourImages,
    ctrl.createTour
  );
router
  .route("/:id")
  .get(ctrl.getTour)
  .patch(
    protect,
    restrictTo("admin", "lead-guide"),
    uploadTourImages,
    resizeImageCover,
    resizeTourImages,
    ctrl.updateTour
  )
  .delete(protect, restrictTo("admin", "lead-guide"), ctrl.deleteTour);

module.exports = router;
