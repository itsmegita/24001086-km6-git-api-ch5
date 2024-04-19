const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Auth, User } = require("../models");
const apiError = require("../utils/apiError");

const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, age, address } = req.body;
    if (!name || !email || !password) {
      next(new apiError("name, email, and password is required", 400));
    }

    const user = await Auth.findOne({
      where: {
        email,
      },
    });

    if (user) {
      next(new apiError("email is registered", 409));
    }
    if (password.length < 8) {
      next(new apiError("Password must be at least 8 characters", 400));
    }
    if (password !== confirmPassword) {
      next(new apiError("Password didn't match", 400));
    }

    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const newUser = await User.create({
      name,
      address,
      role: "Member",
      age,
    });

    await Auth.create({
      email,
      password: hashedPassword,
      userId: newUser.id,
    });

    res.status(201).json({
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

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if ((!email, !password)) {
      next(new apiError("Email or Password need to be filled", 400));
    }
    const user = await Auth.findOne({
      where: {
        email,
      },
      include: ["User"],
    });

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(
        {
          id: user.userId,
          username: user.User.name,
          role: user.User.role,
          email: user.email,
        },
        process.env.JWT_SECRET
      );
    } else {
      next(new apiError("Email or Password isn't correct", 400));
    }
  } catch (err) {
    next(new apiError(err.message, 500));
  }
};

const checkToken = (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json({
      status: "Success",
      data: {
        id: user.id,
        name: user.name,
        age: user.age,
        address: user.address,
        role: user.role,
        email: req.payload.email,
      },
    });
  } catch (err) {
    next(new apiError(err.message));
  }
};

module.exports = {
  register,
  login,
  checkToken,
};
