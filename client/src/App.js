import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DrawingList from "./pages/DrawingList";
import Whiteboard from "./pages/Whiteboard";
import Modal from "./components/Modal";
import { ModalProvider } from "./context/ModalContext";
import NotFound from "./components/NotFound";

function App() {
  return (
    <ModalProvider>
      <Router>
        <Modal />
        <Routes>
          <Route path="/" element={<DrawingList />} />
          <Route path="/drawing/:id" element={<Whiteboard />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ModalProvider>
  );
}

export default App;
