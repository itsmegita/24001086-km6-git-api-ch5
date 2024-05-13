const router = require("express").Router();
const User = require("../controllers/userController.js");
const autentikasi = require("../middlewares/authenticate.js");
const checkRole = require("../middlewares/checkRole");

router.post(
  "/create-admin",
  autentikasi,
  checkRole("Superadmin"),
  User.createAdmin
);
router.get("/", autentikasi, checkRole("Superadmin"), User.findUsers);
router.get("/:id", autentikasi, checkRole("Superadmin"), User.findUserById);
router.patch(
  "/edit/:id",
  autentikasi,
  checkRole("Superadmin"),
  User.updateUser
);
router.delete(
  "/delete/:id",
  autentikasi,
  checkRole("Superadmin"),
  User.deleteUser
);

module.exports = router;
