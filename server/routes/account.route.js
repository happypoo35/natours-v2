const express = require("express");

const { protect } = require("../middleware/auth");
const { uploadPhoto, resizePhoto } = require("../utils/uploadPhoto");
const ctrl = require("../controllers/auth.controller");

const router = express.Router();

router.post("/signup", ctrl.signup);
router.post("/login", ctrl.login);
router.post("/forgot-password", ctrl.forgotPassword);
router.patch("/reset-password/:token", ctrl.resetPassword);

// Protect all routes after this middleware
router.use(protect);

router.get("/", ctrl.getUser);
router.patch("/update-password", ctrl.updatePassword);
router.patch("/update-user", uploadPhoto, resizePhoto, ctrl.updateUser);
router.delete("/logout", ctrl.logout);
router.delete("/delete-user", ctrl.deleteUser);

module.exports = router;
