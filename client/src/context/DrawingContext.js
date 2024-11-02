import React, { createContext, useState, useContext } from "react";

const DrawingContext = createContext();

export const useDrawing = () => {
  return useContext(DrawingContext);
};

export const DrawingProvider = ({ children }) => {
  const [shapes, setShapes] = useState([]);
  const [drawingMode, setDrawingMode] = useState("brush");

  return (
    <DrawingContext.Provider
      value={{ shapes, setShapes, drawingMode, setDrawingMode }}
    >
      {children}
    </DrawingContext.Provider>
  );
};
