const jwt = require("jsonwebtoken");
const { User, Auth } = require("../models");
const apiError = require("../utils/apiError");

module.exports = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
      return next(new apiError("Token not found!", 401));
    }

    const token = bearerToken.split("Bearer ")[1];

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id, {
      include: ["Auth"],
    });

    req.user = user;
    next();
  } catch (err) {
    if (err.message === "jwt expired") {
      next(new apiError("Token expired", 400));
    }
    next(new apiError(err.message, 500));
  }
};
