import React from "react";
import { useModal } from "../context/ModalContext";
import "../styles/modal.css";
import { RiCloseLine } from "react-icons/ri";

const Modal = () => {
  const { isOpen, closeModal, content } = useModal();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <RiCloseLine size={32} className="close-button" onClick={closeModal} />
        {content}
      </div>
    </div>
  );
};

export default Modal;
