const express = require("express");
const ctrl = require("../controllers/booking.controller");
const { protect, restrictTo } = require("../middleware/auth");
const setFilterBy = require("../middleware/setFilterBy");

const router = express.Router({ mergeParams: true });

router.use(protect);

// router.get("/", ctrl.getUserBookings);
router.post("/checkout-session/:tourId", ctrl.getCheckoutSession);

router.use(restrictTo("admin", "lead-guide"));

router
  .route("/")
  .get(setFilterBy, ctrl.getAllBookings)
  .post(ctrl.createBooking);
router
  .route("/:id")
  .get(ctrl.getBooking)
  .patch(ctrl.updateBooking)
  .delete(ctrl.deleteBooking);

module.exports = router;
