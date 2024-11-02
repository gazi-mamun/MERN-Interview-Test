// const APIFeatures = require('../utils/apiFeatures');
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const Drawing = require("../models/drawingModel");
const shapeModel = require("../models/shapeModel");

exports.createDrawing = catchAsync(async (req, res, next) => {
  const createdDrawing = await Drawing.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      createdDrawing,
    },
  });
});

exports.updateDrawing = catchAsync(async (req, res, next) => {
  const updatedDrawing = await Drawing.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: { updatedDrawing },
  });
});

exports.getAllDrawings = catchAsync(async (req, res, next) => {
  const drawings = await Drawing.find();

  res.status(200).json({
    status: "success",
    data: {
      drawings,
    },
  });
});

exports.getDrawing = catchAsync(async (req, res, next) => {
  const drawing = await Drawing.findById(req.params.id).populate("shapes");

  if (!drawing) {
    return next(
      new AppError(`Can't find any drawing with id ${req.params.id}`, 404)
    );
  }

  // Find all shapes linked to this drawing's ID
  const shapes = await shapeModel.find({ drawing: req.params.id });

  drawing.shapes = shapes;

  res.status(200).json({
    status: "success",
    data: {
      drawing,
    },
  });
});

exports.deleteDrawing = catchAsync(async (req, res, next) => {
  const deletedDrawing = await Drawing.findByIdAndDelete(req.params.id);

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
