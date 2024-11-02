// const APIFeatures = require('../utils/apiFeatures');
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const Shape = require("../models/shapeModel");

exports.createShape = catchAsync(async (req, res, next) => {
  const createdShape = await Shape.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      createdShape,
    },
  });
});

exports.updateShape = catchAsync(async (req, res, next) => {
  const updatedShape = await Shape.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json({
    status: "success",
    data: { updatedShape },
  });
});

exports.getShapesByDrawingId = catchAsync(async (req, res, next) => {
  const shapes = await Shape.find({ drawing: req.params.drawingId });

  res.status(200).json({
    status: "success",
    data: {
      shapes,
    },
  });
});

exports.deleteShape = catchAsync(async (req, res, next) => {
  await Shape.findByIdAndDelete(req.params.id);

  if (!deletedDrawing) {
    return next(
      new AppError(`Can't find any drawing with id ${req.params.id}`, 404)
    );
  }
  res.status(204).json({
    status: "success",
    data: {},
  });
});
