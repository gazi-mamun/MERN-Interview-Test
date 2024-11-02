import React from "react";
import "../styles/card.css";
import { FiPlus } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { deleteDrawing } from "../utils/api";

import { useNavigate } from "react-router-dom";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default function Card({ name, id, type = "card" }) {
  const navigate = useNavigate();

  const firstLetter = name.charAt(0).toUpperCase();
  const randomColor = getRandomColor();

  const handleDrawingDelete = async (e) => {
    e.stopPropagation();
    try {
      const status = await deleteDrawing(id);
      if (status === true) {
        navigate(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCardClick = () => {
    if (type === "card") navigate(`drawing/${id}`);
  };

  return (
    <div className="card" onClick={handleCardClick}>
      <div
        style={{ backgroundColor: type == "card" ? randomColor : "#000" }}
        className="letter"
      >
        {type === "card" ? firstLetter : <FiPlus />}
        {/* delete button */}
        {type === "card" && (
          <div
            className="delete-drawing-btn"
            onClick={(e) => handleDrawingDelete(e)}
          >
            <MdDeleteOutline />
          </div>
        )}
      </div>
      <div className="title">{name}</div>
    </div>
  );
}
