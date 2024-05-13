const router = require("express").Router();
const Car = require("../controllers/carController.js");
const autentikasi = require("../middlewares/authenticate.js");
const checkRole = require("../middlewares/checkRole.js");
const upload = require("../middlewares/uploader");

router.post(
  "/create",
  autentikasi,
  checkRole("Superadmin", "Admin"),
  upload.array("images"),
  Car.createCar
);
router.get("/", autentikasi, checkRole("Superadmin", "Admin"), Car.findCars);
router.get(
  "/:id",
  autentikasi,
  checkRole("Superadmin", "Admin"),
  Car.findCarById
);
router.patch(
  "/edit/:id",
  autentikasi,
  checkRole("Superadmin", "Admin"),
  upload.array("images"),
  Car.updateCar
);
router.delete(
  "/delete/:id",
  autentikasi,
  checkRole("Superadmin", "Admin"),
  Car.deleteCar
);

module.exports = router;
