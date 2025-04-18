"use client"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowLeft,
  faKey,
  faTimes,
  faPlus,
  faTrash,
  faEye,
  faEyeSlash,
  faSearch,
} from "@fortawesome/free-solid-svg-icons"
import { toast } from "react-toastify"
import PasscodeModal from "../components/PasscodeModal"
import "../stylesheets/passcodeManagement.css"

const PasscodeManagement = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()

  const [passcodes, setPasscodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ name: "", passcode: "" })
  const [formErrors, setFormErrors] = useState({ name: "", passcode: "" })
  const [editingId, setEditingId] = useState(null)
  const [showPasscode, setShowPasscode] = useState({})
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchPasscodes = async () => {
      try {
        // This would be replaced with an actual API call
        setTimeout(() => {
          const dummyPasscodes = [
            { id: 1, name: "Front Desk Staff 1", passcode: "123456", createdAt: "2025-04-10T14:30:00Z" },
            { id: 2, name: "Security Team", passcode: "654321", createdAt: "2025-04-11T09:15:00Z" },
            { id: 3, name: "Event Manager", passcode: "987654", createdAt: "2025-04-12T16:45:00Z" },
            { id: 4, name: "VIP Check-in", passcode: "555555", createdAt: "2025-04-13T11:20:00Z" },
            { id: 5, name: "Backup Staff", passcode: "111222", createdAt: "2025-04-14T13:10:00Z" },
          ]

          setPasscodes(dummyPasscodes)
          setLoading(false)
        }, 800)
      } catch (error) {
        toast.error("Failed to load passcodes", error)
        setLoading(false)
      }
    }

    fetchPasscodes()
  }, [eventId])

  const handleBack = () => {
    navigate(`/events/${eventId}`)
  }

  // Toggle passcode visibility
  const togglePasscodeVisibility = (id) => {
    setShowPasscode((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Show add modal
  const showAddModal = () => {
    setShowModal(true)
    setEditingId(null)
    setFormData({ name: "", passcode: "" })
    setFormErrors({ name: "", passcode: "" })
  }

  // Show edit modal
  const showEditModal = (passcode) => {
    setShowModal(true)
    setEditingId(passcode.id)
    setFormData({ name: passcode.name, passcode: passcode.passcode })
    setFormErrors({ name: "", passcode: "" })
  }

  // Close modal
  const closeModal = () => {
    setShowModal(false)
    setFormData({ name: "", passcode: "" })
    setFormErrors({ name: "", passcode: "" })
  }

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  // Validate form
  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) {
      errors.name = "Name is required"
    }
    if (!formData.passcode.trim()) {
      errors.passcode = "Passcode is required"
    } else if (!/^\d+$/.test(formData.passcode)) {
      errors.passcode = "Passcode must contain only numbers"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Submit form
  const handleSubmitForm = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (editingId) {
      // Update existing passcode
      setPasscodes((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...formData, updatedAt: new Date().toISOString() } : p)),
      )
      toast.success("Passcode updated successfully!")
    } else {
      // Add new passcode
      const newId = passcodes.length > 0 ? Math.max(...passcodes.map((p) => p.id)) + 1 : 1
      setPasscodes((prev) => [
        ...prev,
        {
          id: newId,
          ...formData,
          createdAt: new Date().toISOString(),
        },
      ])
      toast.success("New passcode added successfully!")
    }

    // Reset form and close modal
    closeModal()
  }

  // Delete passcode
  const deletePasscode = (id) => {
    setPasscodes((prev) => prev.filter((p) => p.id !== id))
    toast.success("Passcode deleted successfully!")
  }

  // Mask passcode
  const maskPasscode = (passcode) => {
    if (!passcode) return ""
    const visibleDigits = 4
    const maskedPortion = "•".repeat(Math.max(0, passcode.length - visibleDigits))
    const visiblePortion = passcode.slice(-visibleDigits)
    return maskedPortion + visiblePortion
  }

  // Filter passcodes based on search term
  const filteredPasscodes = passcodes.filter((passcode) =>
    passcode.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="passcode-management-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading passcodes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="passcode-management-page">
      <div className="passcode-management-container">
        <div className="passcode-header">
          <button className="back-button" onClick={handleBack} aria-label="Back to event">
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>

          <div className="header-content">
            <h1>
              <FontAwesomeIcon icon={faKey} /> Frontdesk Passcodes
            </h1>
            <p className="header-subtitle">Manage access codes for frontdesk staff at the event.</p>
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
              <button className="clear-search-button" onClick={() => setSearchTerm("")} aria-label="Clear search">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>

          <button className="add-passcode-button" onClick={showAddModal}>
            <FontAwesomeIcon icon={faPlus} /> Add New Passcode
          </button>
        </div>

        <div className="passcode-list-container">
          {filteredPasscodes.length > 0 ? (
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
                              {showPasscode[passcode.id] ? passcode.passcode : maskPasscode(passcode.passcode)}
                            </span>
                            <button
                              className="toggle-visibility-button"
                              onClick={() => togglePasscodeVisibility(passcode.id)}
                              aria-label={showPasscode[passcode.id] ? "Hide passcode" : "Show passcode"}
                            >
                              <FontAwesomeIcon icon={showPasscode[passcode.id] ? faEyeSlash : faEye} />
                            </button>
                          </div>
                        </td>
                        <td>{formatDate(passcode.createdAt)}</td>
                        <td>
                          <div className="passcode-actions">
                            <button className="edit-passcode-button" onClick={() => showEditModal(passcode)}>
                              Edit
                            </button>
                            <button className="delete-passcode-button" onClick={() => deletePasscode(passcode.id)}>
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="mobile-passcode-cards">
                {filteredPasscodes.map((passcode) => (
                  <div className="passcode-card" key={passcode.id}>
                    <div className="card-item">
                      <div className="card-label">Name:</div>
                      <div className="card-value">{passcode.name}</div>
                    </div>
                    
                    <div className="card-item">
                      <div className="card-label">Passcode:</div>
                      <div className="card-value passcode-display">
                        <span>
                          {showPasscode[passcode.id] ? passcode.passcode : maskPasscode(passcode.passcode)}
                        </span>
                        <button
                          className="mobile-toggle-button"
                          onClick={() => togglePasscodeVisibility(passcode.id)}
                        >
                          <FontAwesomeIcon
                            icon={showPasscode[passcode.id] ? faEyeSlash : faEye}
                            className="toggle-icon"
                          />
                        </button>
                      </div>
                    </div>
                    
                    <div className="card-item">
                      <div className="card-label">Created:</div>
                      <div className="card-value">{formatDate(passcode.createdAt)}</div>
                    </div>
                    
                    <div className="card-item">
                      <div className="card-label">Actions:</div>
                      <div className="card-value card-actions">
                        <button
                          className="mobile-edit-button"
                          onClick={() => showEditModal(passcode)}
                          aria-label="Edit passcode"
                        >
                          Edit
                        </button>
                        <button
                          className="mobile-delete-button"
                          onClick={() => deletePasscode(passcode.id)}
                          aria-label="Delete passcode"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-passcodes-message">
              {searchTerm ? "No passcodes match your search." : "No passcodes have been created yet."}
            </div>
          )}
        </div>
      </div>

      {/* Use the PasscodeModal component instead of inline JSX */}
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
  )
}

export default PasscodeManagement
