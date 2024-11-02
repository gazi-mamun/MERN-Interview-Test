import React, { useEffect, useRef, useState } from "react";
import "../styles/drawingCanvas.css";
import Toolbar from "./Toolbar";

export default function DrawingCanvas({ drawing }) {
  // canvas
  const canvasContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 300 });
  const [context, setContext] = useState(null);

  //   drawing
  const [drawingMode, setDrawingMode] = useState("brush");
  const [isDrawing, setIsDrawing] = useState(false);
  //   shapes
  const [shapes, setShapes] = useState(drawing.shapes);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);
  //   undo redo
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  //   about text
  const [tempText, setTempText] = useState("");
  const [textInputVisible, setTextInputVisible] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [textInputPosition, setTextInputPosition] = useState({ x: 0, y: 0 });
  const [fontSize, setFontSize] = useState(20);
  //   about property
  const [fillColor, setFillColor] = useState("#000000");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [opacity, setOpacity] = useState(1);
  const [borderRadius, setBorderRadius] = useState(0);
  const [fillEnabled, setFillEnabled] = useState(true);
  const [strokeEnabled, setStrokeEnabled] = useState(true);

  // zooming and panning
  const [zoom, setZoom] = useState(drawing.zoom);
  const [pan, setPan] = useState(drawing.pan);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // eraser
  const [eraserWidth, setEraserWidth] = useState(5);

  //   useEffects
  useEffect(() => {
    setCanvasSize({
      width: canvasContainerRef.current?.offsetWidth,
      height: canvasContainerRef.current?.offsetHeight,
    });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setContext(ctx);
  }, []);

  // Re-draw on zoom or pan change
  useEffect(() => {
    if (context) {
      drawAllShapes();
    }
  }, [context, shapes, zoom, pan]);

  // for property change
  useEffect(() => {
    if (selectedShapeIndex !== null) {
      const updatedShapes = [...shapes];
      const shape = updatedShapes[selectedShapeIndex];
      shape.fillColor = fillEnabled ? fillColor : "transparent";
      shape.strokeColor = strokeEnabled ? strokeColor : "transparent";
      shape.strokeWidth = strokeEnabled ? strokeWidth : 0;
      shape.opacity = opacity;
      shape.borderRadius = borderRadius;
      setShapes(updatedShapes);
    }
  }, [
    fillColor,
    strokeColor,
    strokeWidth,
    opacity,
    borderRadius,
    fillEnabled,
    strokeEnabled,
  ]);

  const saveStateForUndo = () => {
    // Only push a new state if it’s different from the most recent one in the undo stack
    const lastState = undoStack[undoStack.length - 1];
    if (JSON.stringify(lastState) !== JSON.stringify(shapes)) {
      setUndoStack([...undoStack, JSON.parse(JSON.stringify(shapes))]);
      setRedoStack([]); // Clear redo stack on new state save
    }
  };

  // get correct co ordinates
  const getTransformedCoordinates = (x, y) => {
    return {
      x: (x - pan.x) / zoom,
      y: (y - pan.y) / zoom,
    };
  };

  //   start draw
  const startDrawing = (e) => {
    let { offsetX, offsetY } = e.nativeEvent;
    let ordinates = getTransformedCoordinates(offsetX, offsetY);
    offsetX = ordinates.x;
    offsetY = ordinates.y;

    setIsDrawing(true);

    if (drawingMode !== "select") saveStateForUndo();

    if (drawingMode === "brush") {
      const newShape = {
        type: "brush",
        points: [{ x: offsetX, y: offsetY }],
        strokeColor,
        strokeWidth,
      };
      setShapes([...shapes, newShape]);
    } else if (drawingMode === "text") {
      setTextInputPosition({ x: e.clientX - 2, y: e.clientY - 15 });

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();

      // Calculate accurate click position within canvas and adjust for zoom/pan
      const adjustedX = (e.clientX - rect.left - pan.x) / zoom;
      const adjustedY = (e.clientY - rect.top - pan.y) / zoom;

      setTextPosition({ x: adjustedX, y: adjustedY });
      setTextInputVisible(true);
      setIsDrawing(false); // Disable drawing for text input
    } else if (drawingMode === "eraser") {
      eraseWithBrush(offsetX, offsetY);
    } else if (drawingMode === "select") {
      selectShapeAtPosition(offsetX, offsetY);
    } else if (drawingMode !== "select") {
      const newShape = {
        type: drawingMode,
        startX: offsetX,
        startY: offsetY,
        endX: offsetX,
        endY: offsetY,
        fillColor: fillEnabled ? fillColor : "transparent",
        strokeColor: strokeEnabled ? strokeColor : "transparent",
        strokeWidth: strokeEnabled ? strokeWidth : 0,
        borderRadius,
        opacity,
      };
      setShapes([...shapes, newShape]);
    }
  };

  // Adjust `continueDrawing` to support drawing modes and erasing
  const continueDrawing = (e) => {
    if (!isDrawing) return;
    let { offsetX, offsetY } = e.nativeEvent;
    let ordinates = getTransformedCoordinates(offsetX, offsetY);
    offsetX = ordinates.x;
    offsetY = ordinates.y;
    if (drawingMode === "eraser") {
      eraseWithBrush(offsetX, offsetY);
    } else {
      const updatedShapes = [...shapes];
      const currentShape = updatedShapes[updatedShapes.length - 1];

      if (drawingMode === "brush") {
        currentShape.points.push({ x: offsetX, y: offsetY });
      } else if (drawingMode === "line") {
        currentShape.endX = offsetX;
        currentShape.endY = offsetY;
      } else {
        currentShape.endX = offsetX;
        currentShape.endY = offsetY;
      }
      setShapes(updatedShapes);
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      saveStateForUndo(); // Save the shape just completed
    }
    setIsDrawing(false);
  };

  const eraseWithBrush = (x, y) => {
    const eraserSize = eraserWidth;
    const newShapes = shapes
      .map((shape) => {
        if (shape.type === "brush") {
          // Handle partial erasing for brush shapes
          const newSegments = [];
          let currentSegment = [];

          // Iterate over each point in the brush shape's path
          for (let i = 0; i < shape.points.length; i++) {
            const point = shape.points[i];
            const distance = Math.hypot(point.x - x, point.y - y);

            if (distance > eraserSize) {
              // If point is outside the eraser, add it to the current segment
              currentSegment.push(point);
            } else {
              // If point is within the eraser, split the segment
              if (currentSegment.length > 0) {
                newSegments.push([...currentSegment]);
                currentSegment = [];
              }
            }
          }

          // Add any remaining points as a segment
          if (currentSegment.length > 0) {
            newSegments.push([...currentSegment]);
          }

          // Convert segments back to brush shapes
          return newSegments.map((segment) => ({
            ...shape,
            points: segment,
          }));
        } else if (
          shape.type === "rectangle" ||
          shape.type === "circle" ||
          shape.type === "line"
        ) {
          // For other shapes, use the standard erase region approach
          shape.eraseRegions = shape.eraseRegions || [];
          shape.eraseRegions.push({ x, y, size: eraserSize });
          return shape;
        }

        return shape;
      })
      .flat() // Flatten segments into a single shapes array
      .filter(
        (shape) =>
          (shape.points && shape.points.length > 1) || shape.type !== "brush"
      ); // Filter out empty brush shapes

    setShapes(newShapes);
  };

  const selectShapeAtPosition = (x, y) => {
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i];
      if (
        shape.type === "rectangle" &&
        x >= shape.startX &&
        x <= shape.endX &&
        y >= shape.startY &&
        y <= shape.endY
      ) {
        setSelectedShapeIndex(i);
        return;
      } else if (shape.type === "circle") {
        const radius = Math.sqrt(
          Math.pow(shape.endX - shape.startX, 2) +
            Math.pow(shape.endY - shape.startY, 2)
        );
        const dist = Math.hypot(x - shape.startX, y - shape.startY);
        if (dist <= radius) {
          setSelectedShapeIndex(i);
          return;
        }
      }
    }
    setSelectedShapeIndex(null);
  };

  const handleTextSubmit = () => {
    if (!tempText) return;

    // Use text position directly for canvas placement, factoring in zoom and pan
    const finalX = textPosition.x;
    const finalY = textPosition.y;

    const newShape = {
      type: "text",
      x: finalX,
      y: finalY,
      text: tempText,
      baseFontSize: fontSize / zoom,
      fillColor,
    };

    setShapes([...shapes, newShape]);
    setTempText("");
    setTextInputVisible(false);
  };

  const undo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack.pop();
      setRedoStack([...redoStack, shapes]);
      setShapes(previousState);
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack.pop();
      setUndoStack([...undoStack, shapes]);
      setShapes(nextState);
    }
  };

  const drawAllShapes = () => {
    const canvas = canvasRef.current;
    const ctx = context;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    shapes.forEach((shape) => {
      ctx.globalAlpha = shape.opacity || 1;
      ctx.lineWidth = shape.strokeWidth || 2;
      ctx.strokeStyle = shape.strokeColor || "#000";
      ctx.fillStyle = shape.fillColor || "transparent";

      if (shape.type === "text") {
        ctx.font = `${shape.baseFontSize}px Arial`;
        ctx.fillStyle = shape.fillColor || "#000";
        ctx.fillText(shape.text, shape.x, shape.y);
      }

      if (shape.type === "brush") {
        ctx.beginPath();
        ctx.moveTo(shape.points[0].x, shape.points[0].y);
        shape.points.forEach((point) => ctx.lineTo(point.x, point.y));
        ctx.stroke();
      } else if (shape.type === "rectangle") {
        if (shape.borderRadius) {
          ctx.beginPath();
          ctx.roundRect(
            shape.startX,
            shape.startY,
            shape.endX - shape.startX,
            shape.endY - shape.startY,
            shape.borderRadius
          );
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.fillRect(
            shape.startX,
            shape.startY,
            shape.endX - shape.startX,
            shape.endY - shape.startY
          );
          ctx.strokeRect(
            shape.startX,
            shape.startY,
            shape.endX - shape.startX,
            shape.endY - shape.startY
          );
        }
      } else if (shape.type === "circle") {
        const radius = Math.sqrt(
          Math.pow(shape.endX - shape.startX, 2) +
            Math.pow(shape.endY - shape.startY, 2)
        );
        ctx.beginPath();
        ctx.arc(shape.startX, shape.startY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (shape.type === "line") {
        ctx.beginPath();
        ctx.moveTo(shape.startX, shape.startY);
        ctx.lineTo(shape.endX, shape.endY);
        ctx.stroke();
      }

      if (shape.eraseRegions) {
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        shape.eraseRegions.forEach((region) => {
          ctx.beginPath();
          ctx.arc(region.x, region.y, region.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    });

    ctx.restore(); // Reset transformations
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const scaleFactor = 1.1;
    const newZoom = e.deltaY < 0 ? zoom * scaleFactor : zoom / scaleFactor;
    setZoom(newZoom);
  };

  const handlePanStart = (e) => {
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePanMove = (e) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y,
    });
  };

  const handlePanEnd = () => {
    setIsPanning(false);
  };

  const changeDrawingMode = (mode) => {
    if (mode !== "text") setTextInputVisible(false);
    setDrawingMode(mode);
  };

  return (
    <div className="drawing-canvas">
      {/* toolbar */}
      <Toolbar
        pan={pan}
        zoom={zoom}
        drawing={drawing}
        shapes={shapes}
        fontSize={fontSize}
        setFontSize={setFontSize}
        eraserWidth={eraserWidth}
        setEraserWidth={setEraserWidth}
        fillEnabled={fillEnabled}
        setFillEnabled={setFillEnabled}
        fillColor={fillColor}
        setFillColor={setFillColor}
        strokeEnabled={strokeEnabled}
        setStrokeEnabled={setStrokeEnabled}
        strokeColor={strokeColor}
        setStrokeColor={setStrokeColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        drawingMode={drawingMode}
        changeDrawingMode={changeDrawingMode}
        setShapes={setShapes}
        undo={undo}
        redo={redo}
      />
      {/* canvas */}
      <div className="canvas-container" ref={canvasContainerRef}>
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onMouseDown={drawingMode === "select" ? handlePanStart : startDrawing}
          onMouseMove={
            drawingMode === "select" ? handlePanMove : continueDrawing
          }
          onMouseUp={drawingMode === "select" ? handlePanEnd : stopDrawing}
          onMouseLeave={drawingMode === "select" ? handlePanEnd : stopDrawing}
          onWheel={handleWheel}
        />

        {textInputVisible && (
          <div
            className="text-input-overlay"
            style={{ left: textInputPosition.x, top: textInputPosition.y }}
          >
            <input
              style={{ fontSize: fontSize }}
              type="text"
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
              onBlur={handleTextSubmit}
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  );
}
