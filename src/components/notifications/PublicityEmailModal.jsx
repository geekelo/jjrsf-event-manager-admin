"use client"

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes, faPaperPlane, faSpinner } from "@fortawesome/free-solid-svg-icons"
import "../../stylesheets/notifications.css"

const PublicityEmailModal = ({ onClose, onSendEmail, isLoading, totalAttendees }) => {
  const [formData, setFormData] = useState({
    subject: "",
    body: "",
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
      subject: formData.subject,
      body: formData.body,
    })
  }

  return (
    <div className="modal-overlay">
      <div className="email-modal">
        <div className="email-modal-header">
          <h2>Send Email to All Attendees</h2>
          <button className="close-button" onClick={onClose} disabled={isLoading}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="email-form">
          <div className="email-modal-body">
            <div className="email-recipients-info">
              <p>
                This email will be sent to <strong>{totalAttendees}</strong> unique attendees.
              </p>
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
                className="email-input"
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
                className="email-textarea"
              ></textarea>
            </div>
          </div>

          <div className="email-modal-footer">
            <button type="button" className="cancel-button" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="send-email-button" disabled={isLoading}>
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

export default PublicityEmailModal
