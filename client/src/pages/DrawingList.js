// src/pages/DrawingList.js
import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import "../styles/drawingList.css";
import { useModal } from "../context/ModalContext";
import DrawingForm from "../components/DrawingForm";
import { fetchAllDrawings } from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function DrawingList() {
  const { openModal } = useModal();

  const [drawings, setDrawings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDrawings = async () => {
      try {
        const data = await fetchAllDrawings();
        setDrawings(data);
      } catch (error) {
        console.error("Error fetching drawings:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDrawings();
  }, []);

  const handleCreateClick = () => {
    openModal(<DrawingForm />);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={"drawing-page"}>
      <div className="drawing-list-container">
        <h1>Drawing List</h1>

        {/* list */}
        <div className={"drawing-list"}>
          {/* single drawing card */}
          {drawings?.map((drawing) => (
            <Card key={drawing?._id} name={drawing?.name} id={drawing._id} />
          ))}
          {/* add drawing button */}
          <div onClick={handleCreateClick}>
            <Card type="add-button" name={"Create A New Drawing"} />
          </div>
        </div>
      </div>
    </div>
  );
}
