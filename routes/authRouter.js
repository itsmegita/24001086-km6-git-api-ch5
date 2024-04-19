const router = require("express").Router();

const Auth = require("../controllers/authController");
const authentication = require("../middlewares/authenticate");

router.post("/register", Auth.register);
router.post("/login", Auth.login);
router.get("/checktoken", authentication, Auth.checkToken);

module.exports = router;
