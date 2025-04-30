import '../stylesheets/delete.css';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, eventName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Delete Event</h2>
        <p>
          Are you sure you want to delete <strong>{eventName}</strong>? This action cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="cancel-delete-button" onClick={onClose}>Cancel</button>
          <button className="delete-confirm-button" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
