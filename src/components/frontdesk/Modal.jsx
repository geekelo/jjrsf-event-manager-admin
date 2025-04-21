import React from "react";
import "../../stylesheets/modal.css"; 

const Modal = ({ showModal, closeModal, children }) => {
  if (!showModal) return null; 

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={closeModal} className="close-button">
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
