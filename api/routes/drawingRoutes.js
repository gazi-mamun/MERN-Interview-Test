const express = require("express");
const drawingController = require("../controllers/drawingController");

const router = express.Router();

router
  .route("/")
  .post(drawingController.createDrawing)
  .get(drawingController.getAllDrawings);

router
  .route("/:id")
  .patch(drawingController.updateDrawing)
  .get(drawingController.getDrawing)
  .delete(drawingController.deleteDrawing);

module.exports = router;
