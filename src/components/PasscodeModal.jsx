import React, { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faTimes, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";

const PasscodeModal = ({
  showModal,
  closeModal,
  formData,
  formErrors,
  handleFormChange,
  handleSubmitForm,
  editingId
}) => {
  const modalRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal, closeModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await handleSubmitForm(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="passcode-modal" ref={modalRef}>
        <div className="modal-header">
          <h2>
            <FontAwesomeIcon icon={faKey} /> {editingId ? "Edit Passcode" : "Add New Passcode"}
          </h2>
          <button className="close-modal-button" onClick={closeModal} disabled={isSubmitting}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="modal-content">
          <form className="passcode-form" onSubmit={handleSubmit}>
            <div className={`form-group ${formErrors.name ? "has-error" : ""}`}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="e.g., Front Desk Staff 1"
                disabled={isSubmitting}
              />
              {formErrors.name && <div className="error-message">{formErrors.name}</div>}
            </div>

            <div className={`form-group ${formErrors.passcode ? "has-error" : ""}`}>
              <label htmlFor="passcode">Passcode</label>
              <input
                type="text"
                id="passcode"
                name="passcode"
                value={formData.passcode}
                onChange={handleFormChange}
                placeholder="Enter a numeric passcode"
                disabled={isSubmitting}
              />
              <p className="empty-pin">
                If left empty, a Passcode will be auto-generated for you.
              </p>
              {formErrors.passcode && <div className="error-message">{formErrors.passcode}</div>}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={closeModal}
                disabled={isSubmitting}
              >
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
              <button type="submit" className="save-button" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin /> Saving...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} /> {editingId ? "Update" : "Save"} Passcode
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasscodeModal;
