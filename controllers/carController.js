const { Car, User } = require("../models");
const imagekit = require("../lib/imagekit");
const apiError = require("../utils/apiError");
const { Op } = require("sequelize");

const createCar = async (req, res, next) => {
  const { model, type, price } = req.body;
  const files = req.files;
  let images = [];
  try {
    if (files) {
      await Promise.all(
        files.map(async (file) => {
          const split = file.originalname.split(".");
          const extension = split[split.length - 1];

          const uploadedImage = await imagekit.upload({
            file: file.buffer,
            fileName: `IMG-${Date.now()}.${extension}`,
          });
          images.push(uploadedImage.url);
        })
      );
    }

    const imageUrl = images.join(", ");

    const newCar = await Car.create({
      model,
      type,
      price,
      createdBy: req.user.name,
      lastUpdatedBy: req.user.name,
      imageUrl: imageUrl,
    });

    if (!newCar) {
      return next(new apiError("Failed to create new car data", 500));
    }

    res.status(200).json({
      status: "Success",
      data: {
        newCar,
      },
    });
  } catch (err) {
    next(new apiError(err.message, 400));
  }
};

const findCars = async (req, res, next) => {
  try {
    const { model, type } = req.query;
    let filterCondition = {};

    if (model) {
      filterCondition.model = {
        [Op.iLike]: `%${model}%`,
      };
    }

    if (type) {
      filterCondition.type = {
        [Op.iLike]: `%${type}%`,
      };
    }

    const cars = await Car.findAll({
      where: filterCondition,
      order: [["id", "ASC"]],
    });

    res.status(200).json({
      status: "Success",
      data: {
        cars,
      },
    });
  } catch (err) {
    next(new apiError(err.message, 400));
  }
};

const findCarById = async (req, res, next) => {
  try {
    const car = await Car.findByPk(req.params.id);

    if (!car)
      return next(
        new apiError(`Cannot find car with id : ${req.params.id}`, 400)
      );

    res.status(200).json({
      status: "Success",
      data: {
        car,
      },
    });
  } catch (err) {
    next(new apiError(err.message, 400));
  }
};

const updateCar = async (req, res, next) => {
  try {
    const checkCar = await Car.findByPk(req.params.id);

    if (!checkCar)
      return next(
        new apiError(`Cannot find car with id : ${req.params.id}`, 400)
      );

    const { model, type, price } = req.body;
    const files = req.files;
    let images = [];

    if (files) {
      await Promise.all(
        files.map(async (file) => {
          const split = file.originalname.split(".");
          const extension = split[split.length - 1];

          const uploadedImage = await imagekit.upload({
            file: file.buffer,
            fileName: `IMG-${Date.now()}.${extension}`,
          });
          images.push(uploadedImage.url);
        })
      );
    }

    const imageUrl = images.join(", ");

    await Car.update(
      {
        type,
        price,
        model,
        imageUrl,
        lastUpdatedBy: req.user.name,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    const updatedCar = await Car.findByPk(req.params.id);

    res.status(200).json({
      status: "Success",
      message: "Car data updated",
      data: updatedCar,
    });
  } catch (err) {
    next(new apiError(err.message, 400));
  }
};

const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!car)
      return next(
        new apiError(`Cannot find car with id: ${req.params.id}`, 400)
      );

    const deletedBy = await User.findByPk(req.user.id);

    await Car.update(
      {
        deletedBy: deletedBy.name,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    await Car.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      status: "Success",
      message: "Car data deleted successfully",
    });
  } catch (err) {
    next(new apiError(err.message, 400));
  }
};

module.exports = {
  createCar,
  findCars,
  findCarById,
  updateCar,
  deleteCar,
};
