"use client"

import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faEdit,
  faLink,
  faCopy,
  faSave,
  faTimes,
  faCalendarAlt,
  faMapMarkerAlt,
  faFlag,
  faLaptop,
  faBuilding,
  faInfoCircle,
  faListAlt,
} from "@fortawesome/free-solid-svg-icons"

const EventDetailsSection = ({ event, eventUrl, copyEventUrl, isEditMode, toggleEditMode, updateEventData }) => {
  const [editFormData, setEditFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    location: "",
    status: "",
    isOnsite: false,
    isOffline: false,
    description: "",
  })

  // Update form data when event changes
  useEffect(() => {
    if (event) {
      setEditFormData({
        name: event.name || "",
        startDate: event.startDate || "",
        endDate: event.endDate || "",
        registrationDeadline: event.registrationDeadline || "",
        location: event.location || "",
        status: event.status || "upcoming",
        isOnsite: event.isOnsite || false,
        isOffline: event.isOffline || false,
        description: event.description || "",
      })
    }
  }, [event])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditFormData({
      ...editFormData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateEventData(editFormData)
  }

  if (!event) return null

  return (
    <section className="event-details-section">
      <div className="section-header">
        <h2>
          <FontAwesomeIcon icon={faInfoCircle} /> Event Details
        </h2>
        {!isEditMode && (
          <button className="edit-button" onClick={toggleEditMode} aria-label="Edit event details">
            <FontAwesomeIcon icon={faEdit} /> Edit Details
          </button>
        )}
      </div>

      {isEditMode ? (
        <form className="event-edit-form" onSubmit={handleSubmit}>
          <div className="edit-grid">
            <div className="form-group">
              <label htmlFor="name">
                <FontAwesomeIcon icon={faListAlt} className="field-icon" /> Event Name
              </label>
              <input type="text" id="name" name="name" value={editFormData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="startDate">
                <FontAwesomeIcon icon={faCalendarAlt} className="field-icon" /> Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={editFormData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">
                <FontAwesomeIcon icon={faCalendarAlt} className="field-icon" /> End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={editFormData.endDate}
                onChange={handleChange}
                min={editFormData.startDate}
              />
            </div>

            <div className="form-group">
              <label htmlFor="registrationDeadline">
                <FontAwesomeIcon icon={faCalendarAlt} className="field-icon" /> Registration Deadline
              </label>
              <input
                type="date"
                id="registrationDeadline"
                name="registrationDeadline"
                value={editFormData.registrationDeadline}
                onChange={handleChange}
                max={editFormData.startDate}
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="field-icon" /> Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={editFormData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">
                <FontAwesomeIcon icon={faFlag} className="field-icon" /> Status
              </label>
              <select id="status" name="status" value={editFormData.status} onChange={handleChange}>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group event-type-group">
              <label className="event-type-label">
                <FontAwesomeIcon icon={faLaptop} className="field-icon" /> Event Type
              </label>
              <div className="event-type-checkboxes">
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="isOnsite"
                    name="isOnsite"
                    checked={editFormData.isOnsite}
                    onChange={handleChange}
                  />
                  <label htmlFor="isOnsite" className="checkbox-label">
                    <FontAwesomeIcon icon={faBuilding} className="checkbox-icon" /> Onsite
                  </label>
                </div>
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="isOffline"
                    name="isOffline"
                    checked={editFormData.isOffline}
                    onChange={handleChange}
                  />
                  <label htmlFor="isOffline" className="checkbox-label">
                    <FontAwesomeIcon icon={faLaptop} className="checkbox-icon" /> Online
                  </label>
                </div>
              </div>
              <small className="event-type-hint">
                <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: "5px" }} />
                Select both for a hybrid event.
              </small>
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">
                <FontAwesomeIcon icon={faInfoCircle} className="field-icon" /> Description
              </label>
              <textarea
                id="description"
                name="description"
                value={editFormData.description}
                onChange={handleChange}
                rows="4"
              ></textarea>
            </div>

            <div className="form-group full-width">
              <label>
                <FontAwesomeIcon icon={faLink} className="field-icon" /> Event URL
              </label>
              <div className="url-container">
                <span className="event-url">{eventUrl}</span>
                <button type="button" className="copy-button" onClick={copyEventUrl}>
                  <FontAwesomeIcon icon={faCopy} />
                </button>
              </div>
              <small>This URL will be used to share the event with attendees.</small>
            </div>
          </div>

          <div className="edit-actions">
            <button type="button" className="cancel-button" onClick={toggleEditMode}>
              <FontAwesomeIcon icon={faTimes} /> Cancel
            </button>
            <button type="submit" className="primary-button">
              <FontAwesomeIcon icon={faSave} /> Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="event-details-grid">
          <div className="detail-item">
            <div className="detail-label">
              <FontAwesomeIcon icon={faListAlt} className="field-icon" /> Event Name
            </div>
            <div className="detail-value">{event.name}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">
              <FontAwesomeIcon icon={faCalendarAlt} className="field-icon" /> Start Date
            </div>
            <div className="detail-value">{event.startDate}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">
              <FontAwesomeIcon icon={faCalendarAlt} className="field-icon" /> End Date
            </div>
            <div className="detail-value">{event.endDate || "Not specified"}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">
              <FontAwesomeIcon icon={faCalendarAlt} className="field-icon" /> Registration Deadline
            </div>
            <div className="detail-value">{event.registrationDeadline || "Not specified"}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="field-icon" /> Location
            </div>
            <div className="detail-value">{event.location}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">
              <FontAwesomeIcon icon={faFlag} className="field-icon" /> Status
            </div>
            <div className="detail-value">
              <span className={`status-badge ${event.status}`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-label">
              <FontAwesomeIcon icon={faLaptop} className="field-icon" /> Event Type
            </div>
            <div className="detail-value">
              {event.isOnsite && event.isOffline ? (
                <span>
                  <FontAwesomeIcon icon={faBuilding} className="checkbox-icon" /> Onsite &
                  <FontAwesomeIcon icon={faLaptop} className="checkbox-icon" style={{ marginLeft: "10px" }} /> Online
                  (Hybrid)
                </span>
              ) : event.isOnsite ? (
                <span>
                  <FontAwesomeIcon icon={faBuilding} className="checkbox-icon" /> Onsite
                </span>
              ) : event.isOffline ? (
                <span>
                  <FontAwesomeIcon icon={faLaptop} className="checkbox-icon" /> Online
                </span>
              ) : (
                "Not specified"
              )}
            </div>
          </div>

          <div className="detail-item full-width">
            <div className="detail-label">
              <FontAwesomeIcon icon={faInfoCircle} className="field-icon" /> Description
            </div>
            <div className="detail-value description">{event.description}</div>
          </div>

          <div className="detail-item full-width">
            <div className="detail-label">
              <FontAwesomeIcon icon={faLink} className="field-icon" /> Event URL
            </div>
            <div className="url-container">
              <span className="event-url">{eventUrl}</span>
              <button className="copy-button" onClick={copyEventUrl}>
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default EventDetailsSection
