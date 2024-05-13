const { User, Auth } = require("../models");
const apiError = require("../utils/apiError");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

const createAdmin = async (req, res, next) => {
  try {
    const { name, age, address, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      next(new apiError("Name, email, and password is required", 400));
    }

    const checkUser = await Auth.findOne({
      where: {
        email,
      },
    });

    if (checkUser) {
      next(new apiError("Email already exists", 400));
    }

    if (password.length < 8) {
      next(new apiError("Password requires a minimum of 8 characters", 400));
    }

    if (password !== confirmPassword) {
      next(new apiError("password didn't match", 400));
    }

    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const newUser = await User.create({
      name,
      address,
      role: "Admin",
      age,
    });

    await Auth.create({
      email,
      password,
      userId: newUser.id,
    });

    res.status(200).json({
      status: "Success",
      data: {
        ...newUser,
        email,
        password: hashedPassword,
      },
    });
  } catch (err) {
    next(new apiError(err.message, 500));
  }
};

const findUsers = async (req, res, next) => {
  const role = req.query.role;
  const validRoles = ["Superadmin", "Admin", "Member"];
  try {
    const filterCondition = {};
    if (role) {
      if (!validRoles.includes(role)) {
        next(new ApiError(`role '${role}' tidak valid`, 400));
      }
      filterCondition.role = role;
    }

    const users = await User.findAll({
      include: ["Auth"],
    });

    res.status(200).json({
      status: "Success",
      data: {
        users,
      },
    });
  } catch (err) {
    next(new apiError(err.message, 400));
  }
};

const findUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: ["Auth"],
    });

    if (!user) {
      next(new apiError(`User with id : ${req.params.id} doesn't exist`));
    }

    res.status(200).json({
      status: "Success",
      data: {
        user,
      },
    });
  } catch (err) {
    next(new apiError(err.message, 400));
  }
};

const updateUser = async (req, res, next) => {
  const { name, age, address, email, password, confirmPassword } = req.body;
  let userId;

  try {
    if (req.params.id) {
      userId = req.params.id;
      const user = User.findByPk(req.userId);
      if (!user) {
        next(
          new apiError(`User with id : ${req.params.id} doesn't exist`, 400)
        );
      }
    } else {
      userId = req.user.id;
    }

    let hashedPassword;
    if (password) {
      if (password.length < 8) {
        next(new apiError("Password must be at least 8 characters", 400));
      }

      if (password !== confirmPassword) {
        next(new apiError("password didn't match", 400));
      }

      const saltRounds = 10;
      hashedPassword = bcrypt.hashSync(password, saltRounds);
    }

    await User.update(
      {
        name,
        age,
        address,
      },
      {
        where: {
          id: userId,
        },
      }
    );

    await Auth.update(
      {
        email,
        password: hashedPassword,
      },
      {
        where: {
          userId: userId,
        },
      }
    );

    const updatedData = await User.findByPk(userId, {
      include: ["Auth"],
    });

    res.status(200).json({
      status: "Success",
      message: "User updated successfully",
      data: updatedData,
    });
  } catch (err) {
    next(new apiError(err.message, 400));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!user) {
      next(new apiError(`User with id : ${req.params.id} doesn't exist`, 404));
    }

    await User.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      status: "Success",
      message: "User deleted successfully",
    });
  } catch (err) {
    next(new apiError(err.message, 400));
  }
};

module.exports = {
  createAdmin,
  findUsers,
  findUserById,
  updateUser,
  deleteUser,
};
