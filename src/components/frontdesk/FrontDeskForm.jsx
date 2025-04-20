import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createFrontDesk, updateFrontDesk } from "../../redux/frontDeskSlice";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Edit, CheckCircle } from "lucide-react"; // Lucide icons for edit and submit
import "react-toastify/dist/ReactToastify.css";
import Modal from "./Modal";
import "../../stylesheets/front.css";

const FrontDeskForm = ({ editData }) => {
  const dispatch = useDispatch();
  const { eventId } = useParams();

  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [showModal, setShowModal] = useState(false); // Modal starts as hidden

  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setPin(editData.pin || "");
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventId) {
      toast.error("No event ID found.");
      return;
    }

    try {
      if (editData?.id) {
        // Update logic
        await dispatch(
          updateFrontDesk({
            id: editData.id,
            event_id: eventId,
            updates: { name, pin },
          })
        );
        toast.success("Front desk updated successfully!");
      } else {
        // Create logic
        const res = await dispatch(
          createFrontDesk({ name, pin, event_id: eventId })
        );
        if (res.error) {
          toast.error("Failed to create front desk.");
        } else {
          toast.success("Front desk created successfully!");
          setName("");
          setPin("");
        }
      }

      // Close modal after successful submission
      setShowModal(false); // This closes the modal
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div>
      {/* Button to open the modal */}
      <button onClick={() => setShowModal(true)} className="open-modal-button">
        <Edit size={16} /> Create Front Desk
      </button>

      {/* Modal to display the form */}
      <Modal showModal={showModal} closeModal={() => setShowModal(false)}>
        <form onSubmit={handleSubmit} className="front-desk-form">
          <h2 className="form-title">{editData ? "Edit" : "Create"} Front Desk</h2>
          <div className="input-group">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Desk Name"
              required
              className="input-field"
            />
          </div>
          <div className="input-group">
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN"
              required
              className="input-field"
            />
          </div>
          <div className="submit-group">
            <button type="submit" className="submit-button">
              {editData ? <CheckCircle size={16} /> : "Create"}{" "}
              {editData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

     
    </div>
  );
};

export default FrontDeskForm;
