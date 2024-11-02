import React, { useEffect, useState } from "react";
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

import {
  createShape,
  deleteShape,
  updateDrawing,
  updateShape,
} from "../utils/api";
import { useModal } from "../context/ModalContext";

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
  const [saving, setSaving] = useState(false);

  const { openModal, closeModal } = useModal();

  useEffect(() => {
    if (saving === true) {
      openModal(<p>Saving...</p>);
    } else {
      closeModal();
    }
  }, [saving]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Step 1: Create new shapes (those without `_id`)
      for (const shape of shapes) {
        if (!shape._id && !shape.drawing) {
          console.log("Creating shape:", shape);
          shape.drawing = drawing._id;
          await createShape(shape); // Await the creation to complete
        }
      }

      // Step 2: Update existing shapes (those with `_id` and modified properties)
      for (const shape of shapes) {
        const originalShape = drawing.shapes.find(
          (drawingShape) => drawingShape._id === shape._id
        );

        if (originalShape) {
          const hasChanges =
            [
              "fillColor",
              "strokeColor",
              "strokeWidth",
              "opacity",
              "borderRadius",
            ].some((prop) => originalShape[prop] !== shape[prop]) ||
            originalShape.points?.toString() !== shape.points?.toString() ||
            JSON.stringify(originalShape.eraseRegions) !==
              JSON.stringify(shape.eraseRegions);

          if (hasChanges) {
            console.log("Updating shape:", shape._id);
            await updateShape(shape._id, shape); // Await the update to complete
          }
        }
      }

      // Step 3: Delete shapes that are in drawing.shapes but not in shapes
      for (const drawingShape of drawing.shapes) {
        const isShapePresent = shapes.some(
          (shape) => shape._id === drawingShape._id
        );
        if (!isShapePresent) {
          console.log("Deleting shape:", drawingShape._id);
          await deleteShape(drawingShape._id); // Await the deletion to complete
        }
      }

      // Step 4: Update the drawing pan and zoom if changed
      if (drawing.pan !== pan || drawing.zoom !== zoom) {
        await updateDrawing(drawing._id, { pan, zoom });
      }

      console.log("All changes saved successfully.");
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setSaving(false);
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
