"use client"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faChartLine,
  faUsers,
  faUserCheck,
  faUserClock,
  faEye,
  faArrowRight,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchEventQuickRegistrations } from "../../redux/quickRegistrationsSlice"

const EventMetricsSection = ({ metrics, eventId }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Get quick registrations from Redux store
  const { quickRegistrations, loading, error } = useSelector((state) => state.quickRegistrations)

  // Get attendees from Redux store
  const { attendees } = useSelector((state) => state.attendees)

  // Combined metrics state
  const [combinedMetrics, setCombinedMetrics] = useState({
    totalRegistered: 0,
    totalAttendedOnline: 0,
    totalAttendedOffline: 0,
    totalAttendedBoth: 0,
    totalDidNotAttend: 0,
  })

  // Fetch quick registrations when component mounts
  useEffect(() => {
    if (eventId) {
      dispatch(fetchEventQuickRegistrations(eventId))
    }
  }, [eventId, dispatch])

  // Calculate combined metrics whenever attendees or quickRegistrations change
  useEffect(() => {
    // Start with the metrics from attendees
    const combined = { ...metrics }

    // Add metrics from quick registrations
    if (quickRegistrations && quickRegistrations.length > 0) {
      // Count quick registrations by attendance type
      let onlineOnly = 0
      let offlineOnly = 0
      let both = 0
      let didNotAttend = 0

      quickRegistrations.forEach((reg) => {
        // Check for both snake_case and camelCase properties
        const attendedOnline = reg.attended_online || reg.attendedOnline
        const attendedOffline = reg.attended_offline || reg.attendedOffline

        if (attendedOnline && attendedOffline) {
          both++
        } else if (attendedOnline) {
          onlineOnly++
        } else if (attendedOffline) {
          offlineOnly++
        } else {
          didNotAttend++
        }
      })

      // Add to the combined metrics
      combined.totalRegistered += quickRegistrations.length
      combined.totalAttendedOnline += onlineOnly
      combined.totalAttendedOffline += offlineOnly
      combined.totalAttendedBoth += both
      combined.totalDidNotAttend += didNotAttend
    }

    setCombinedMetrics(combined)
  }, [metrics, quickRegistrations])

  const navigateToAttendees = (type) => {
    navigate(`/events/${eventId}/attendees/${type}`)
  }

  const navigateToQuickRegistrations = () => {
    navigate(`/events/${eventId}/quick-registrations`)
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
            <div className="metric-value">{combinedMetrics.totalRegistered}</div>
          </div>
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
        </div>

        <div className="metric-card">
          <div className="metric-icon online">
            <FontAwesomeIcon icon={faUserCheck} />
          </div>
          <div className="metric-content">
            <h3>Total Attended Online</h3>
            <p className="metric-description">Attendees who participated remotely via stream</p>
            <div className="metric-value">{combinedMetrics.totalAttendedOnline}</div>
          </div>
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
        </div>

        <div className="metric-card">
          <div className="metric-icon offline">
            <FontAwesomeIcon icon={faUserCheck} />
          </div>
          <div className="metric-content">
            <h3>Total Attended Onsite</h3>
            <p className="metric-description">Attendees who participated at the physical venue</p>
            <div className="metric-value">{combinedMetrics.totalAttendedOffline}</div>
          </div>
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
        </div>

        <div className="metric-card">
          <div className="metric-icon both">
            <FontAwesomeIcon icon={faUserCheck} />
          </div>
          <div className="metric-content">
            <h3>Total Attended Both</h3>
            <p className="metric-description">Attendees who participated both online and onsite</p>
            <div className="metric-value">{combinedMetrics.totalAttendedBoth}</div>
          </div>
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
        </div>

        <div className="metric-card">
          <div className="metric-icon absent">
            <FontAwesomeIcon icon={faUserClock} />
          </div>
          <div className="metric-content">
            <h3>Total Did Not Attend</h3>
            <p className="metric-description">Registered users who did not attend the event</p>
            <div className="metric-value">{combinedMetrics.totalDidNotAttend}</div>
          </div>
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
        </div>
      </div>
    </section>
  )
}

export default EventMetricsSection
