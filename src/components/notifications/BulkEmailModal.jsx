"use client"

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes, faPaperPlane, faSpinner } from "@fortawesome/free-solid-svg-icons"
import "../../stylesheets/modal.css"
import "../../stylesheets/notifications.css"

const BulkEmailModal = ({ eventId, onClose, onSendEmail, isLoading }) => {
  const [formData, setFormData] = useState({
    subject: "",
    body: "",
    mode: "all",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSendEmail({
      eventId,
      mode: formData.mode,
      subject: formData.subject,
      body: formData.body,
    })
  }

  return (
    <div className="modal-overlay">
      <div
        className="modal-container bulk-email-modal"
        style={{
          background: "white",
          borderRadius: "8px",
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
          width: "90%",
          maxWidth: "600px",
          margin: "0 auto",

        }}
      >
        <div className="modal-header">
          <h2>Send Bulk Email</h2>
          <button className="close-button" onClick={onClose} disabled={isLoading}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="mode">Recipient Group:</label>
              <select id="mode" name="mode" value={formData.mode} onChange={handleChange} required disabled={isLoading}>
                <option value="all">All Attendees</option>
                <option value="online">Online Attendees</option>
                <option value="offline">Offline Attendees</option>
                <option value="hybrid">Hybrid Attendees</option>
                <option value="not_attended">Not Attended</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject:</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="Enter email subject"
              />
            </div>

            <div className="form-group">
              <label htmlFor="body">Message:</label>
              <textarea
                id="body"
                name="body"
                value={formData.body}
                onChange={handleChange}
                required
                disabled={isLoading}
                rows="8"
                placeholder="Enter your message here..."
              ></textarea>
            </div>
          </div>

          <div className="modal-footers">
            <button type="button" className="cancel-button" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin /> Sending...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPaperPlane} /> Send Email
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BulkEmailModal
