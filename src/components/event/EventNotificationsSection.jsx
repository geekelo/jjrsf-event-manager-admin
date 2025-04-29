"use client"

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell, faEnvelope, faSpinner } from "@fortawesome/free-solid-svg-icons"
import BulkEmailModal from "../notifications/BulkEmailModal"

const EventNotificationsSection = ({ eventId, onSendReminder, onSendBulkEmail, reminderLoading, bulkEmailLoading }) => {
  const [showBulkEmailModal, setShowBulkEmailModal] = useState(false)

  const handleSendReminder = () => {
    onSendReminder(eventId)
  }

  const handleSendBulkEmail = (emailData) => {
    onSendBulkEmail(emailData)
      .unwrap()
      .then(() => {
        setShowBulkEmailModal(false)
      })
      .catch(() => {
        // Error is handled in the parent component via toast
      })
  }

  return (
    <section className="event-notifications-section">
      <div className="section-header">
        <h2>
          <FontAwesomeIcon icon={faBell} /> Notifications
        </h2>
      </div>

      <div className="notification-actions">
        <div className="notification-action-description">
          <p>
            Send reminders to registered attendees about the upcoming event with event details and their registration
            information.
          </p>
        </div>
        <button className="primary-button remind-button" onClick={handleSendReminder} disabled={reminderLoading}>
          {reminderLoading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin /> Sending...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faBell} /> REMIND ATTENDEES
            </>
          )}
        </button>

        <div className="notification-action-description">
          <p>Send a custom email to specific groups of attendees based on their attendance mode.</p>
        </div>
        <button
          className="primary-button bulk-email-button"
          onClick={() => setShowBulkEmailModal(true)}
          disabled={bulkEmailLoading}
        >
          {bulkEmailLoading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin /> Sending...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faEnvelope} /> SEND BULK EMAIL
            </>
          )}
        </button>
      </div>

      {showBulkEmailModal && (
        <BulkEmailModal
          eventId={eventId}
          onClose={() => setShowBulkEmailModal(false)}
          onSendEmail={handleSendBulkEmail}
          isLoading={bulkEmailLoading}
        />
      )}
    </section>
  )
}

export default EventNotificationsSection
