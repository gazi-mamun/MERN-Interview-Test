const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShapeSchema = new Schema({
  drawing: { type: Schema.Types.ObjectId, ref: "Drawing" },
  type: { type: String, required: true },
  startX: { type: Number },
  startY: { type: Number },
  endX: { type: Number },
  endY: { type: Number },
  eraseRegions: [{ x: Number, y: Number, size: Number }],
  points: [{ x: Number, y: Number }],
  text: { type: String },
  fillColor: { type: String, default: "#000000" },
  strokeColor: { type: String, default: "#000000" },
  strokeWidth: { type: Number, default: 2 },
  opacity: { type: Number, default: 1 },
  borderRadius: { type: Number, default: 0 },
  baseFontSize: { type: Number, default: 20 },
  x: { type: Number },
  y: { type: Number },
});

module.exports = mongoose.model("Shape", ShapeSchema);
