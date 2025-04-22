"use client";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faKey,
  faTimes,
  faPlus,
  faTrash,
  faEye,
  faEyeSlash,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import PasscodeModal from "../components/PasscodeModal";
import "../stylesheets/passcodeManagement.css";
import {
  fetchFrontDesks,
  createFrontDesk,
  updateFrontDesk,
  deleteFrontDesk,
} from "../redux/frontDeskSlice";
import { useDispatch, useSelector } from "react-redux";

const PasscodeManagement = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", passcode: "" });
  const [formErrors, setFormErrors] = useState({ name: "", passcode: "" });
  const [editingId, setEditingId] = useState(null);
  const [showPasscode, setShowPasscode] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const { items: passcodes, loading } = useSelector((state) => state.frontDesk);

  useEffect(() => {
    if (eventId) {
      dispatch(fetchFrontDesks(eventId)).then((res) => {});
    }
  }, [dispatch, eventId]);

  useEffect(() => {}, [passcodes]);

  const handleBack = () => navigate(`/events/${eventId}`);

  const togglePasscodeVisibility = (id) => {
    setShowPasscode((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const showAddModal = () => {
    setShowModal(true);
    setEditingId(null);
    setFormData({ name: "", passcode: "" });
    setFormErrors({ name: "", passcode: "" });
  };

  const showEditModal = (passcode) => {
    setShowModal(true);
    setEditingId(passcode.id);
    setFormData({ name: passcode.name, passcode: passcode.passcode });
    setFormErrors({ name: "", passcode: "" });
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: "", passcode: "" });
    setFormErrors({ name: "", passcode: "" });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const validateForm = () => {
    const errors = {};
  
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
  
    if (formData.passcode.trim()) {
      if (!/^\d+$/.test(formData.passcode)) {
        errors.passcode = "Passcode must be numeric";
      }
    }
  
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      name: formData.name.trim(),
      pin: formData.passcode.trim(),
      event_id: eventId,
    };

    try {
      if (editingId) {
        const res = await dispatch(
          updateFrontDesk({
            id: editingId,
            event_id: eventId,
            updates: payload,
          })
        ).unwrap();

        toast.success("Passcode updated successfully!");
      } else {
        const res = await dispatch(createFrontDesk(payload)).unwrap();

        toast.success("New passcode added successfully!");
      }
      closeModal();
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  const handleDelete = async (id) => {
    if (!id || !eventId) {
      toast.error("Missing passcode ID or event ID.");
      return;
    }

    try {
      const res = await dispatch(
        deleteFrontDesk({ id, event_id: eventId })
      ).unwrap();
      toast.success("Passcode deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete passcode.");
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  const maskPasscode = (passcode) => {
    if (!passcode || typeof passcode !== "string" || "number") return "••••";
    const visibleDigits = 4; // You can adjust this number to show more or fewer digits
    const masked = "•".repeat(Math.max(0, passcode.length - visibleDigits));
    return masked + passcode.slice(-visibleDigits);
  };

  const filteredPasscodes =
    passcodes?.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
  console.log(filteredPasscodes);

  return (
    <div className="passcode-management-page">
      <div className="passcode-management-container">
        <div className="passcode-header">
          <button className="back-button" onClick={handleBack}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className="header-content">
            <h1>
              <FontAwesomeIcon icon={faKey} /> Frontdesk Passcodes
            </h1>
            <p className="header-subtitle">
              Manage access codes for frontdesk staff at the event.
            </p>
          </div>
        </div>

        <div className="passcode-actions-bar">
          <div className="search-input-container">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search passcodes..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="clear-search-button"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>

          <button className="add-passcode-button" onClick={showAddModal}>
            <FontAwesomeIcon icon={faPlus} /> Add New Passcode
          </button>
        </div>

        <div className="passcode-list-container">
          {loading ? (
            <div className="loading-container">
              <div className="spinner" />
              Loading passcodes...
            </div>
          ) : filteredPasscodes.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="passcode-table-container">
                <table className="passcode-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Passcode</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPasscodes.map((passcode) => (
                      <tr key={passcode.id}>
                        <td>{passcode.name}</td>
                        <td>
                          <div className="passcode-value-container">
                            <span className="passcode-value">
                              {showPasscode[passcode.id]
                                ? passcode.passcode
                                : maskPasscode(passcode.passcode)}
                            </span>
                            <button
                              onClick={() =>
                                togglePasscodeVisibility(passcode.id)
                              }
                              aria-label={
                                showPasscode[passcode.id]
                                  ? "Hide passcode"
                                  : "Show passcode"
                              }
                            >
                              <FontAwesomeIcon
                                icon={
                                  showPasscode[passcode.id] ? faEye : faEyeSlash
                                }
                              />
                            </button>
                          </div>
                        </td>

                        <td>{formatDate(passcode.created_at)}</td>
                        <td>
                          <div className="passcode-actions">
                            <button
                              className="edit-passcode-button"
                              onClick={() => showEditModal(passcode)}
                            >
                              Edit
                            </button>
                            <button
                              className="delete-passcode-button"
                              onClick={() => handleDelete(passcode.id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="no-passcodes-message">
              {searchTerm
                ? "No passcodes match your search."
                : "No passcodes created yet."}
            </div>
          )}
        </div>
      </div>

      <PasscodeModal
        showModal={showModal}
        closeModal={closeModal}
        formData={formData}
        formErrors={formErrors}
        handleFormChange={handleFormChange}
        handleSubmitForm={handleSubmitForm}
        editingId={editingId}
      />
    </div>
  );
};

export default PasscodeManagement;
