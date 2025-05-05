"use client"

import { useState } from "react"
import { useParams } from "react-router-dom" // Add this import
import { useDispatch, useSelector } from "react-redux"
import { sendDirectEmail } from "../redux/notificationsSlice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUser,
  faEnvelope,
  faPhone,
  faCommentDots,
  faMapMarkerAlt,
  faVenus,
  faMars,
  faUsers,
  faGlobe,
  faCheck,
  faLock,
  faStickyNote,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons"
import NotesModal from "./NotesModal"
import DirectEmailModal from "./notifications/DirectEmailModal"

const AttendeeCard = ({ attendee, eventId }) => {
  const { eventId: urlEventId } = useParams() // Extract from URL
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)

  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.notifications)

  // Get the actual event ID from props or URL
  const actualEventId = eventId || urlEventId

  // Handle missing properties gracefully
  const {
    id = "",
    title = "",
    name = "Unknown",
    email = "",
    whatsapp = "",
    phone = "",
    address = "", // Add support for single address field
    street = "",
    state = "",
    country = "",
    gender = "",
    isMember = false,
    member = false, // Add this to handle both property names
    preferred_attendance = "", // Add this to handle snake_case property
    preferredAttendance = "", // Keep this for backward compatibility
    attendedOnline = false,
    attended_online = false, // Add this to handle snake_case property
    attendedOffline = false,
    attended_offline = false, // Add this to handle snake_case property
    otp = "",
  } = attendee || {}

  // Use the appropriate property based on what's available
  const actualMemberStatus = isMember || member || false
  const actualPreferredAttendance = preferredAttendance || preferred_attendance || ""
  const actualAttendedOnline = attendedOnline || attended_online || false
  const actualAttendedOffline = attendedOffline || attended_offline || false

  // Format the address based on available fields
  const formattedAddress =
    address ||
    (street || state || country ? `${street ? `${street}, ` : ""}${state ? `${state}, ` : ""}${country || ""}` : "N/A")

  const handleSendEmail = (emailData) => {
    // Ensure event_id is always included and correctly set
    const completePayload = {
      ...emailData,
      event_id: actualEventId, // Use the extracted event ID
    }
    
    console.log("Sending email with payload:", completePayload) // Debug log
    
    dispatch(sendDirectEmail(completePayload))
      .unwrap()
      .then(() => {
        setShowEmailModal(false)
      })
      .catch((error) => {
        console.error("Failed to send email:", error)
      })
  }

  return (
    <div className="attendee-card">
      <div className="attendee-card-header">
        <h3 className="attendee-name">
          <FontAwesomeIcon icon={faUser} className="icon-primary" />
          {title ? `${title} ` : ""}
          {name}
        </h3>
      </div>

      <div className="attendee-card-content">
        {/* Address Section */}
        <div className="attendee-info-group">
          <div className="info-label">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            <span>Address</span>
          </div>
          <div className="info-value">{formattedAddress}</div>
        </div>

        {/* Contact Details Section */}
        <div className="attendee-info-group">
          <div className="info-label">
            <FontAwesomeIcon icon={faEnvelope} />
            <span>Email</span>
          </div>
          <div className="info-value">{email || "N/A"}</div>
        </div>

        <div className="attendee-info-group">
          <div className="info-label">
            <FontAwesomeIcon icon={faCommentDots} />
            <span>WhatsApp</span>
          </div>
          <div className="info-value">{whatsapp || "N/A"}</div>
        </div>

        <div className="attendee-info-group">
          <div className="info-label">
            <FontAwesomeIcon icon={faPhone} />
            <span>Phone</span>
          </div>
          <div className="info-value">{phone || "N/A"}</div>
        </div>
        {/* Family Info Section */}
<div className="attendee-family-info">
  <h4>Family Info</h4>
  <div className="family-status">
    <FontAwesomeIcon icon={faUsers} />
    <span>Family:</span>
    <span className={`tag-value ${attendee.family ? "positive" : "negative"}`}>
      {attendee.family ? "Yes" : "No"}
    </span>
  </div>

  {attendee.family_members && attendee.family_members.length > 0 && (
    <div className="family-members-list">
      <h5>Family Members:</h5>
      <ul>
        {attendee.family_members.map((member, index) => (
          <li key={index}>
            <FontAwesomeIcon icon={faUser} className="member-icon" />
            {member}
          </li>
        ))}
      </ul>
    </div>
  )}
</div>


        {/* Personal Details Section */}
        <div className="attendee-tags">
          <div className="attendee-tag">
            <FontAwesomeIcon
              icon={gender?.toLowerCase() === "m" || gender?.toLowerCase() === "male" ? faMars : faVenus}
            />
            <span>Gender:</span>
            <span className="tag-value">{gender || "N/A"}</span>
          </div>

          <div className="attendee-tag">
            <FontAwesomeIcon icon={faUsers} />
            <span>Member:</span>
            <span className={`tag-value ${actualMemberStatus ? "positive" : "negative"}`}>
              {actualMemberStatus ? "Yes" : "No"}
            </span>
          </div>

          <div className="attendee-tag">
            <FontAwesomeIcon icon={faGlobe} />
            <span>Preferred:</span>
            <span className="tag-value">{actualPreferredAttendance || "N/A"}</span>
          </div>
        </div>

        {/* Attendance Status Section */}
        <div className="attendance-status">
          <h4>Attendance Status</h4>
          <div className="attendance-badges">
            <div className={`attendance-badge ${actualAttendedOnline ? "attended" : "not-attended"}`}>
              {actualAttendedOnline ? (
                <>
                  <FontAwesomeIcon icon={faCheck} />
                  <span>Online</span>
                </>
              ) : (
                <span>Online</span>
              )}
            </div>
            <div className={`attendance-badge ${actualAttendedOffline ? "attended" : "not-attended"}`}>
              {actualAttendedOffline ? (
                <>
                  <FontAwesomeIcon icon={faCheck} />
                  <span>Offline</span>
                </>
              ) : (
                <span>Offline</span>
              )}
            </div>
          </div>
        </div>

        {/* OTP Section */}
        <div className="otp-section">
          <div className="otp-label">
            <FontAwesomeIcon icon={faLock} />
            <span>OTP</span>
          </div>
          <div className="otp-value">{otp || "N/A"}</div>
        </div>

        {/* Action Buttons */}
        <div className="attendee-actions">
          <button className="notes-button" onClick={() => setShowNotesModal(true)}>
            <FontAwesomeIcon icon={faStickyNote} />
            <span>Notes</span>
          </button>

          <button className="email-button" onClick={() => setShowEmailModal(true)}>
            <FontAwesomeIcon icon={faPaperPlane} />
            <span>Send Email</span>
          </button>
        </div>
      </div>

      {/* Notes Modal */}
      {showNotesModal && (
        <NotesModal attendee={attendee} isOpen={showNotesModal} onClose={() => setShowNotesModal(false)} />
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <DirectEmailModal
          eventId={eventId}
          attendeeId={id}
          attendeeName={name}
          onClose={() => setShowEmailModal(false)}
          onSendEmail={handleSendEmail}
          isLoading={loading}
        />
      )}
    </div>
  )
}

export default AttendeeCard
