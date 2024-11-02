import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DrawingCanvas from "../components/DrawingCanvas";
import { fetchSingleDrawing } from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Whiteboard() {
  const { id } = useParams();
  const [drawing, setDrawing] = useState(null);

  useEffect(() => {
    async function getDrawing() {
      const data = await fetchSingleDrawing(id);
      setDrawing(data);
    }
    getDrawing();
  }, [id]);

  return (
    <div>
      {drawing ? <DrawingCanvas drawing={drawing} /> : <LoadingSpinner />}
    </div>
  );
}
