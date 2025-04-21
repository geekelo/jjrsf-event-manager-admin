import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteFrontDesk } from "../../redux/frontDeskSlice";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import '../../stylesheets/delete.css'

const DeleteButton = ({ id }) => {
  const dispatch = useDispatch();
  const { eventId } = useParams();
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    try {
      await dispatch(deleteFrontDesk({ id, event_id: eventId }));
      toast.success("Front desk deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete front desk.");
    } finally {
      setShowModal(false);
    }
  };

  return (
    <>
      <button onClick={() => setShowModal(true)} className="delete-button">
        Delete
      </button>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this front desk?</p>
            <div className="modal-actions">
              <button
                onClick={() => setShowModal(false)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="delete-confirm-button"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    
    </>
  );
};

export default DeleteButton;
