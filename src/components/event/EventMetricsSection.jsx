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
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchEventQuickRegistrations } from "../../redux/quickRegistrationsSlice"

const EventMetricsSection = ({ metrics, eventId }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { quickRegistrations, loading, error } = useSelector(
    (state) => state.quickRegistrations
  )

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
            <div className="metric-value">{metrics.totalAttendedOnline}</div>
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
            <div className="metric-value">{metrics.totalAttendedOffline}</div>
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
            <div className="metric-value">{metrics.totalAttendedBoth}</div>
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
            <div className="metric-value">{metrics.totalDidNotAttend}</div>
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

        {/* New Quick Registrations Card with dummy data */}
        <div className="metric-card">
          <div className="metric-icon quick-reg">
            <FontAwesomeIcon icon={faUserPlus} />
          </div>
          <div className="metric-content">
            <h3>Quick Registrations</h3>
            <p className="metric-description">
              Users who registered with minimal information
            </p>
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
