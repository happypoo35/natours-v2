const multer = require("multer");
const sharp = require("sharp");
const cloudinary = require("cloudinary").v2;
const ApiError = require("../errors/apiError");
const asyncWrapper = require("../middleware/asyncWrapper");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// ---- SAVES IMAGE TO THE FOLDER
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/img/users");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
//   },
// });

// ---- SAVES IMAGE TO THE MEMORY BUFFER
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new ApiError("Must be an image file", 400, [
        { key: "photo", msg: "Must be an image file" },
      ]),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadPhoto = upload.single("photo");
// upload.array('images', 5)
exports.uploadTourImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

exports.resizePhoto = asyncWrapper(async (req, res, next) => {
  if (!req.file) return next();

  const newImg = await sharp(req.file.buffer)
    .resize(100, 100)
    .toFormat("jpg")
    .jpeg({ quality: 90 })
    .toBuffer();

  await cloudinary.uploader.upload(
    `data:image/jpg;base64,${newImg.toString("base64")}`,
    { public_id: `users/user-${req.user._id}` },
    (error, result) => {
      req.body.photo = result.secure_url;
    }
  );

  next();
});

exports.resizeImageCover = asyncWrapper(async (req, res, next) => {
  if (!req.files || !req.files.imageCover) return next();

  const newImg = await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpg")
    .jpeg({ quality: 90 })
    .toBuffer();

  await cloudinary.uploader.upload(
    `data:image/jpg;base64,${newImg.toString("base64")}`,
    { public_id: `tours/tour-${req.params.id}-cover` },
    (error, result) => {
      req.body.imageCover = result.secure_url;
    }
  );

  next();
});

exports.resizeTourImages = asyncWrapper(async (req, res, next) => {
  if (!req.files || !req.files.images) return next();
  req.body.images = [...req.body.prevImages];

  await Promise.all(
    req.files.images.map(async (file) => {
      const imgId = req.body[file.originalname];

      const newImg = await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpg")
        .jpeg({ quality: 90 })
        .toBuffer();

      await cloudinary.uploader.upload(
        `data:image/jpg;base64,${newImg.toString("base64")}`,
        { public_id: `tours/tour-${req.params.id}-${+imgId + 1}` },
        (error, result) => {
          req.body.images[+imgId] = result.secure_url;
        }
      );

      // const fileName = `tour-${req.params.id}-${+imgId + 1}`;

      // await sharp(file.buffer)
      //   .resize(2000, 1333)
      //   .toFormat("jpg")
      //   .jpeg({ quality: 90 })
      //   .toFile(`public/img/tours/${fileName}.jpg`);
    })
  );

  next();
});
