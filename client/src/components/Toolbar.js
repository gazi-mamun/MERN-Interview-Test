import React from "react";
import "../styles/toolbar.css";
import { RxCursorArrow } from "react-icons/rx";
import { IoBrushOutline } from "react-icons/io5";
import { IoRemoveOutline } from "react-icons/io5";
import { RiRectangleLine } from "react-icons/ri";
import { FaRegCircle } from "react-icons/fa";
import { MdOutlineTextFields } from "react-icons/md";
import { LuEraser } from "react-icons/lu";
import { BiUndo } from "react-icons/bi";
import { BiRedo } from "react-icons/bi";

import { useNavigate } from "react-router-dom";
import {
  createShape,
  deleteShape,
  updateDrawing,
  updateShape,
} from "../utils/api";

export default function Toolbar({
  pan,
  zoom,
  drawing,
  shapes,
  fontSize,
  setFontSize,
  eraserWidth,
  setEraserWidth,
  fillEnabled,
  setFillEnabled,
  fillColor,
  setFillColor,
  strokeEnabled,
  setStrokeEnabled,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  drawingMode,
  changeDrawingMode,
  setShapes,
  undo,
  redo,
}) {
  const navigate = useNavigate();

  const handleSave = () => {
    // Step 1: Create new shapes (those without `_id`)
    shapes.forEach((shape) => {
      if (!shape._id && !shape.drawing) {
        console.log("Creating shape:", shape);
        shape.drawing = drawing._id;
        createShape(shape); // Call function to create a new shape
      }
    });

    // Step 2: Update existing shapes (those with `_id` and modified properties)
    shapes.forEach((shape) => {
      const originalShape = drawing.shapes.find(
        (drawingShape) => drawingShape._id === shape._id
      );
      if (
        originalShape &&
        JSON.stringify(originalShape) !== JSON.stringify(shape)
      ) {
        console.log("Updating shape:", shape._id);
        updateShape(shape._id, shape); // Call function to update the shape
      }
    });

    // Step 3: Delete shapes that are in drawing.shapes but not in shapes
    drawing.shapes.forEach((drawingShape) => {
      const isShapePresent = shapes.some(
        (shape) => shape._id === drawingShape._id
      );
      if (!isShapePresent) {
        console.log("Deleting shape:", drawingShape._id);
        deleteShape(drawingShape._id); // Call function to delete the shape
      }
    });

    if (drawing.pan !== pan || drawing.zoom !== zoom) {
      updateDrawing(drawing._id, { pan, zoom });
    }
  };

  return (
    <div className="toolbar-container">
      {/* main tools */}
      <ul className="main-tools">
        <li
          className="single-tool"
          onClick={() => changeDrawingMode("select")}
          style={{ color: drawingMode === "select" && "red" }}
        >
          <RxCursorArrow size={20} />
        </li>
        <li
          className="single-tool"
          onClick={() => changeDrawingMode("brush")}
          style={{ color: drawingMode === "brush" && "red" }}
        >
          <IoBrushOutline size={20} />
        </li>
        <li
          className="single-tool"
          onClick={() => changeDrawingMode("line")}
          style={{ color: drawingMode === "line" && "red" }}
        >
          <IoRemoveOutline size={20} />
        </li>
        <li
          className="single-tool"
          onClick={() => changeDrawingMode("rectangle")}
          style={{ color: drawingMode === "rectangle" && "red" }}
        >
          <RiRectangleLine size={20} />
        </li>
        <li
          className="single-tool"
          onClick={() => changeDrawingMode("circle")}
          style={{ color: drawingMode === "circle" && "red" }}
        >
          <FaRegCircle size={20} />
        </li>
        <li
          className="single-tool"
          onClick={() => changeDrawingMode("text")}
          style={{ color: drawingMode === "text" && "red" }}
        >
          <MdOutlineTextFields size={20} />
        </li>
        <li
          className="single-tool"
          onClick={() => changeDrawingMode("eraser")}
          style={{ color: drawingMode === "eraser" && "red" }}
        >
          <LuEraser size={20} />
        </li>
      </ul>

      {/* properties */}
      <div className="properties">
        {/* check for font size */}
        {drawingMode === "text" && (
          <div>
            <label>Font Size:</label>
            <input
              type="number"
              min={8}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
            />
          </div>
        )}
        {/* check for eraser */}
        {drawingMode === "eraser" && (
          <div>
            <label>Eraser Size:</label>
            <input
              type="number"
              value={eraserWidth}
              onChange={(e) => setEraserWidth(Number(e.target.value))}
              min={5}
              title="Eraser Width"
            />
          </div>
        )}

        {/* check for color and stroke */}
        {(drawingMode === "line" ||
          drawingMode === "brush" ||
          drawingMode == "rectangle" ||
          drawingMode === "circle") && (
          <>
            {/* fill color */}
            <div>
              <label>
                Fill:
                <input
                  className="select-input"
                  type="checkbox"
                  checked={fillEnabled}
                  onChange={() => setFillEnabled(!fillEnabled)}
                />
              </label>
              <input
                type="color"
                className="color-input"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                title="Fill Color"
              />
            </div>

            {/* stroke color */}
            <div>
              <label>
                Stroke:
                <input
                  className="select-input"
                  type="checkbox"
                  checked={strokeEnabled}
                  onChange={() => setStrokeEnabled(!strokeEnabled)}
                />
              </label>
              <input
                className="color-input"
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                title="Stroke Color"
              />
            </div>
            {/* check for stroke width */}
            <div>
              <label>Stroke Width:</label>
              <input
                type="number"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                title="Stroke Width"
                min={5}
              />
            </div>
          </>
        )}
      </div>

      {/* actions */}
      <ul className="main-tools">
        <li className="single-tool" onClick={undo}>
          <BiUndo size={20} />
        </li>
        <li className="single-tool" onClick={redo}>
          <BiRedo size={20} />
        </li>
      </ul>

      <button
        type="button"
        className="clearing-btn"
        onClick={() => setShapes([])}
      >
        Clear All
      </button>
      <button
        type="button"
        className="clearing-btn save-btn"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
}
