"use client"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faChartLine,
  faUsers,
  faUserCheck,
  faUserClock,
  faEye,
  faArrowRight,
  faUserPlus,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchEventQuickRegistrations } from "../../redux/quickRegistrationsSlice"
import DirectEmailModal from "../notifications/DirectEmailModal"
import { sendDirectEmail } from "../../redux/notificationsSlice"

const EventMetricsSection = ({ metrics, eventId }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [showEmailModal, setShowEmailModal] = useState(false)
  const [selectedAttendeeType, setSelectedAttendeeType] = useState(null)
  const [selectedAttendeeTitle, setSelectedAttendeeTitle] = useState("")

  const { quickRegistrations, loading, error } = useSelector((state) => state.quickRegistrations)
  const { loading: emailLoading } = useSelector((state) => state.notifications)

  useEffect(() => {
    if (eventId) {
      dispatch(fetchEventQuickRegistrations(eventId))
    }
  }, [eventId, dispatch])

  const navigateToAttendees = (type) => {
    navigate(`/events/${eventId}/attendees/${type}`)
  }

  const navigateToQuickRegistrations = () => {
    navigate(`/events/${eventId}/quick-registrations`)
  }

  const handleOpenEmailModal = (type, title) => {
    setSelectedAttendeeType(type)
    setSelectedAttendeeTitle(title)
    setShowEmailModal(true)
  }

  const handleSendEmail = (emailData) => {
    // Add the attendee type to the email data
    const enhancedEmailData = {
      ...emailData,
      attendeeType: selectedAttendeeType,
    }

    dispatch(sendDirectEmail(enhancedEmailData))
      .unwrap()
      .then(() => {
        setShowEmailModal(false)
      })
  }

  return (
    <section className="metrics-section">
      <div className="section-header">
        <h2>
          <FontAwesomeIcon icon={faChartLine} /> Metrics & Analytics
        </h2>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="metric-content">
            <h3>Total Registered</h3>
            <p className="metric-description">Total number of users who registered for this event</p>
            <div className="metric-value">{metrics.totalRegistered}</div>
          </div>
          <div className="metric-actions">
            <button
              className="metrics-view-button"
              onClick={() => navigateToAttendees("registered")}
              aria-label="View registered attendees"
            >
              <span className="view-text">
                <FontAwesomeIcon icon={faEye} /> View Attendee List
              </span>
              <span className="view-arrow">
                <FontAwesomeIcon icon={faArrowRight} />
              </span>
            </button>
            <button
              className="metrics-email-button"
              onClick={() => handleOpenEmailModal("registered", "All Registered Attendees")}
              aria-label="Send email to registered attendees"
            >
              <span className="email-text">
                <FontAwesomeIcon icon={faPaperPlane} /> Send Email
              </span>
            </button>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon online">
            <FontAwesomeIcon icon={faUserCheck} />
          </div>
          <div className="metric-content">
            <h3>Total Attended Online</h3>
            <p className="metric-description">Attendees who participated remotely via stream</p>
            <div className="metric-value">{metrics.totalAttendedOnline}</div>
          </div>
          <div className="metric-actions">
            <button
              className="metrics-view-button"
              onClick={() => navigateToAttendees("online")}
              aria-label="View online attendees"
            >
              <span className="view-text">
                <FontAwesomeIcon icon={faEye} /> View Attendee List
              </span>
              <span className="view-arrow">
                <FontAwesomeIcon icon={faArrowRight} />
              </span>
            </button>
            <button
              className="metrics-email-button"
              onClick={() => handleOpenEmailModal("online", "Online Attendees")}
              aria-label="Send email to online attendees"
            >
              <span className="email-text">
                <FontAwesomeIcon icon={faPaperPlane} /> Send Email
              </span>
            </button>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon offline">
            <FontAwesomeIcon icon={faUserCheck} />
          </div>
          <div className="metric-content">
            <h3>Total Attended Onsite</h3>
            <p className="metric-description">Attendees who participated at the physical venue</p>
            <div className="metric-value">{metrics.totalAttendedOffline}</div>
          </div>
          <div className="metric-actions">
            <button
              className="metrics-view-button"
              onClick={() => navigateToAttendees("offline")}
              aria-label="View onsite attendees"
            >
              <span className="view-text">
                <FontAwesomeIcon icon={faEye} /> View Attendee List
              </span>
              <span className="view-arrow">
                <FontAwesomeIcon icon={faArrowRight} />
              </span>
            </button>
            <button
              className="metrics-email-button"
              onClick={() => handleOpenEmailModal("offline", "Onsite Attendees")}
              aria-label="Send email to onsite attendees"
            >
              <span className="email-text">
                <FontAwesomeIcon icon={faPaperPlane} /> Send Email
              </span>
            </button>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon both">
            <FontAwesomeIcon icon={faUserCheck} />
          </div>
          <div className="metric-content">
            <h3>Total Attended Both</h3>
            <p className="metric-description">Attendees who participated both online and onsite</p>
            <div className="metric-value">{metrics.totalAttendedBoth}</div>
          </div>
          <div className="metric-actions">
            <button
              className="metrics-view-button"
              onClick={() => navigateToAttendees("both")}
              aria-label="View hybrid attendees"
            >
              <span className="view-text">
                <FontAwesomeIcon icon={faEye} /> View Attendee List
              </span>
              <span className="view-arrow">
                <FontAwesomeIcon icon={faArrowRight} />
              </span>
            </button>
            <button
              className="metrics-email-button"
              onClick={() => handleOpenEmailModal("both", "Hybrid Attendees")}
              aria-label="Send email to hybrid attendees"
            >
              <span className="email-text">
                <FontAwesomeIcon icon={faPaperPlane} /> Send Email
              </span>
            </button>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon absent">
            <FontAwesomeIcon icon={faUserClock} />
          </div>
          <div className="metric-content">
            <h3>Total Did Not Attend</h3>
            <p className="metric-description">Registered users who did not attend the event</p>
            <div className="metric-value">{metrics.totalDidNotAttend}</div>
          </div>
          <div className="metric-actions">
            <button
              className="metrics-view-button"
              onClick={() => navigateToAttendees("absent")}
              aria-label="View absent registrants"
            >
              <span className="view-text">
                <FontAwesomeIcon icon={faEye} /> View Attendee List
              </span>
              <span className="view-arrow">
                <FontAwesomeIcon icon={faArrowRight} />
              </span>
            </button>
            <button
              className="metrics-email-button"
              onClick={() => handleOpenEmailModal("absent", "Absent Registrants")}
              aria-label="Send email to absent registrants"
            >
              <span className="email-text">
                <FontAwesomeIcon icon={faPaperPlane} /> Send Email
              </span>
            </button>
          </div>
        </div>

        {/* Quick Registrations Card */}
        <div className="metric-card">
          <div className="metric-icon quick-reg">
            <FontAwesomeIcon icon={faUserPlus} />
          </div>
          <div className="metric-content">
            <h3>Quick Registrations</h3>
            <p className="metric-description">Users who registered with minimal information</p>
            <div className="metric-value">
              {loading ? "Loading..." : error ? "Error" : quickRegistrations?.length || 0}
            </div>
          </div>
          <div className="metric-actions">
            <button
              className="metrics-view-button"
              onClick={navigateToQuickRegistrations}
              aria-label="View quick registrations"
            >
              <span className="view-text">
                <FontAwesomeIcon icon={faEye} /> View Registrations
              </span>
              <span className="view-arrow">
                <FontAwesomeIcon icon={faArrowRight} />
              </span>
            </button>
            <button
              className="metrics-email-button"
              onClick={() => handleOpenEmailModal("quick", "Quick Registrants")}
              aria-label="Send email to quick registrants"
            >
              <span className="email-text">
                <FontAwesomeIcon icon={faPaperPlane} /> Send Email
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <DirectEmailModal
          eventId={eventId}
          attendeeId={selectedAttendeeType}
          attendeeName={selectedAttendeeTitle}
          onClose={() => setShowEmailModal(false)}
          onSendEmail={handleSendEmail}
          isLoading={emailLoading}
        />
      )}
    </section>
  )
}

export default EventMetricsSection
