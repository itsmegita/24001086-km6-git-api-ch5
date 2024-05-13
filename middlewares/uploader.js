const multer = require("multer");
const apiError = require("../utils/apiError");

const multerFiltering = (req, file, cb) => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new apiError("Only accepts .jpg, .jpeg, and .png image formats", 400));
  }
};

const upload = multer({
  fileFilter: multerFiltering,
});

module.exports = upload;
