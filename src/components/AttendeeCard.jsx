"use client"

import { useState } from "react"
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
} from "@fortawesome/free-solid-svg-icons"
import NotesModal from "./NotesModal"

const AttendeeCard = ({ attendee }) => {
  const [showNotesModal, setShowNotesModal] = useState(false)

  // Handle missing properties gracefully
  const {
    title = "",
    name = "Unknown",
    email = "",
    whatsapp = "",
    phone = "",
    street = "",
    state = "",
    country = "",
    gender = "",
    isMember = false,
    preferredAttendance = "",
    attendedOnline = false,
    attendedOffline = false,
    otp = "",
  } = attendee || {}

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
          <div className="info-value">
            {street ? `${street}, ` : ""}
            {state ? `${state}, ` : ""}
            {country || "N/A"}
          </div>
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

        {/* Personal Details Section */}
        <div className="attendee-tags">
          <div className="attendee-tag">
            <FontAwesomeIcon icon={gender === "Male" ? faMars : faVenus} />
            <span>Gender:</span>
            <span className="tag-value">{gender || "N/A"}</span>
          </div>

          <div className="attendee-tag">
            <FontAwesomeIcon icon={faUsers} />
            <span>Member:</span>
            <span className={`tag-value ${isMember ? "positive" : "negative"}`}>{isMember ? "Yes" : "No"}</span>
          </div>

          <div className="attendee-tag">
            <FontAwesomeIcon icon={faGlobe} />
            <span>Preferred:</span>
            <span className="tag-value">{preferredAttendance || "N/A"}</span>
          </div>
        </div>

        {/* Attendance Status Section */}
        <div className="attendance-status">
          <h4>Attendance Status</h4>
          <div className="attendance-badges">
            <div className={`attendance-badge ${attendedOnline ? "attended" : "not-attended"}`}>
              {attendedOnline ? (
                <>
                  <FontAwesomeIcon icon={faCheck} />
                  <span>Online</span>
                </>
              ) : (
                <span>Online</span>
              )}
            </div>
            <div className={`attendance-badge ${attendedOffline ? "attended" : "not-attended"}`}>
              {attendedOffline ? (
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

        {/* Notes Button */}
        <div className="attendee-notes-section">
          <button className="notes-button" onClick={() => setShowNotesModal(true)}>
            <FontAwesomeIcon icon={faStickyNote} />
            <span>Notes</span>
          </button>
        </div>
      </div>

      {/* Notes Modal inside the card */}
      {showNotesModal && (
        <NotesModal attendee={attendee} isOpen={showNotesModal} onClose={() => setShowNotesModal(false)} />
      )}
    </div>
  )
}

export default AttendeeCard
