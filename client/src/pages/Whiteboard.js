import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DrawingCanvas from "../components/DrawingCanvas";
import { fetchSingleDrawing } from "../utils/api";

export default function Whiteboard() {
  const { id } = useParams();
  const [drawing, setDrawing] = useState(null);

  useEffect(() => {
    async function getDrawing() {
      const data = await fetchSingleDrawing(id);
      console.log({ data });
      setDrawing(data);
    }
    getDrawing();
  }, [id]);

  return (
    <div>
      {/* <DrawingCanvas drawing={drawing} /> */}
      {drawing ? <DrawingCanvas drawing={drawing} /> : <p>Loading...</p>}
    </div>
  );
}
