import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Fetching all drawings
export const fetchAllDrawings = async () => {
  try {
    const response = await api.get("/drawings");
    return response.data.data.drawings;
  } catch (error) {
    console.log(error);
  }
};

// Creating a new drawing
export const createDrawing = async (drawingData) => {
  try {
    const response = await api.post("/drawings", drawingData);
    return response.data.data.createdDrawing;
  } catch (error) {
    console.log(error);
  }
};

// Deleting a drawing
export const deleteDrawing = async (id) => {
  try {
    const response = await api.delete(`/drawings/${id}`);
    return response.status === 204 && true;
  } catch (error) {
    console.log(error);
  }
};

// Updating a drawing by ID
export const updateDrawing = async (id, drawingdata) => {
  try {
    const response = await api.patch(`/drawings/${id}`, drawingdata);
    return response.data.data.updatedDrawing;
  } catch (error) {
    console.log(error);
  }
};

// Fetching a single drawing by ID
export const fetchSingleDrawing = async (drawingId) => {
  try {
    const response = await api.get(`/drawings/${drawingId}`);
    return response.data.data.drawing;
  } catch (error) {
    console.log(error);
  }
};

// Fetching shapes by drawing ID
export const fetchShapesByDrawingId = async (drawingId) => {
  try {
    const response = await api.get(`/shapes/${drawingId}`);
    return response.data.data.shapes;
  } catch (error) {
    console.log(error);
  }
};

// creating shape
export const createShape = async (shapeData) => {
  try {
    const response = await api.post("/shapes", shapeData);
    return response.data.data.createdShape;
  } catch (error) {
    console.log(error);
  }
};

// Updating a shape by ID
export const updateShape = async (id, shapeData) => {
  try {
    const response = await api.patch(`/shapes/${id}`, shapeData);
    return response.data.data.updatedShape;
  } catch (error) {
    console.log(error);
  }
};

// Deleting a shape by ID
export const deleteShape = async (id) => {
  try {
    const response = await api.delete(`/shapes/${id}`);
    return response.status === 204 && true;
  } catch (error) {
    console.log(error);
  }
};
