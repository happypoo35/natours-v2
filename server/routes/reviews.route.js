const express = require("express");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });
const ctrl = require("../controllers/reviews.controller");
const setFilterBy = require("../middleware/setFilterBy");

router
  .route("/")
  .get(setFilterBy, ctrl.getAllReviews)
  .post(protect, restrictTo("user"), ctrl.setTourUserIDs, ctrl.createReview);

router.use(protect);

router
  .route("/:id")
  .get(ctrl.getReview)
  .patch(restrictTo("user", "admin"), ctrl.updateReview)
  .delete(restrictTo("user", "admin"), ctrl.deleteReview);

module.exports = router;
