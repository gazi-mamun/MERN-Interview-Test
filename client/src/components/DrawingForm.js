import React, { useState } from "react";
import { useModal } from "../context/ModalContext";
import { createDrawing } from "../utils/api";
import { useNavigate } from "react-router-dom";

const DrawingForm = () => {
  const navigate = useNavigate();

  const { closeModal } = useModal();
  const [newDrawingTitle, setNewDrawingTitle] = useState("");

  const createNewDrawing = async (e) => {
    e.preventDefault();

    try {
      const newDrawing = await createDrawing({ name: newDrawingTitle });
      if (newDrawing) {
        navigate(`/drawing/${newDrawing?._id}`);
      }
      setNewDrawingTitle(""); // Reset input field
      closeModal(); // Close modal after submission
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={createNewDrawing} className="create-form">
      <input
        type="text"
        id="new-drawing-title"
        name="title"
        placeholder="Enter name for new drawing"
        value={newDrawingTitle}
        onChange={(e) => setNewDrawingTitle(e.target.value)}
      />
      <button type="submit">Create Drawing</button>
    </form>
  );
};

export default DrawingForm;
