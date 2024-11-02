const express = require("express");
const router = express.Router();
const shapeController = require("../controllers/shapeController");

router.get("/:drawingId", shapeController.getShapesByDrawingId);
router.post("/", shapeController.createShape);
router.patch("/:id", shapeController.updateShape);
router.delete("/:id", shapeController.deleteShape);

module.exports = router;
