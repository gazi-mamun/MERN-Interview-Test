const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DrawingSchema = new Schema(
  {
    name: { type: String, required: true },
    zoom: { type: Number, default: 1 },
    pan: { x: { type: Number, default: 0 }, y: { type: Number, default: 0 } },
    shapes: [{ type: Schema.Types.ObjectId, ref: "Shape" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Drawing", DrawingSchema);
