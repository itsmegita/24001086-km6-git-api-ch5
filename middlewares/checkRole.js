const apiError = require("../utils/apiError");

const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      roles = Array.isArray(roles) ? roles : [roles];

      let allowedRoles;
      if (!roles.includes(req.user.role)) {
        if (roles.length > 1) {
          allowedRoles = roles.join(" atau ");
        } else {
          allowedRoles = roles.join(" ");
        }
        next(
          new apiError(
            `You are not authorized. Required role: ${allowedRoles}`,
            401
          )
        );
      }
      next();
    } catch (err) {
      next(new apiError(err.message, 500));
    }
  };
};

module.exports = checkRole;
