import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faUsers, 
  faUserCheck, 
  faUserClock,
  faEye,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

const EventMetricsSection = ({ metrics, eventId }) => {
  const navigate = useNavigate();
  
  const navigateToAttendees = (type) => {
    navigate(`/events/${eventId}/attendees/${type}`);
  };
  
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
            onClick={() => navigateToAttendees('registered')}
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
            onClick={() => navigateToAttendees('online')}
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
            <h3>Total Attended Offline</h3>
            <p className="metric-description">Attendees who participated at the physical venue</p>
            <div className="metric-value">{metrics.totalAttendedOffline}</div>
          </div>
          <button 
            className="metrics-view-button"
            onClick={() => navigateToAttendees('offline')}
            aria-label="View offline attendees"
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
            <p className="metric-description">Attendees who participated both online and offline</p>
            <div className="metric-value">{metrics.totalAttendedBoth}</div>
          </div>
          <button 
            className="metrics-view-button"
            onClick={() => navigateToAttendees('both')}
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
            onClick={() => navigateToAttendees('absent')}
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
      </div>
    </section>
  );
};

export default EventMetricsSection;