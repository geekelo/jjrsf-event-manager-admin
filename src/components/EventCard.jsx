"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendarDays, faLocationDot, faEllipsisVertical, faEye } from "@fortawesome/free-solid-svg-icons"

const EventCard = ({ event, onManage, onViewDetails, getStatusBadgeClass, formatDate }) => {
  return (
    <div className="event-card">
      <div className="event-card-content">
        <div className="event-header">
          <h3 className="event-dates">{event.name}</h3>
          <span className={`event-status ${getStatusBadgeClass(event.status)}`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>

        <div className="event-dates">
          <FontAwesomeIcon icon={faCalendarDays} className="event-icon" />
          {event.start_date === event.end_date ? (
            <p>{formatDate(event.start_date)}</p>
          ) : (
            <p>
              {formatDate(event.start_date)} - {formatDate(event.end_date)}
            </p>
          )}
        </div>

        <p className="event-location">
          <FontAwesomeIcon icon={faLocationDot} className="event-icon" />
          {event.location}
        </p>
        <p className="event-description">{event.description}</p>
      </div>

      <div className="event-actions">
        <button className="manage-event-button" onClick={() => onManage(event.id)}>
          Manage
        </button>
        
      </div>
    </div>
  )
}

export default EventCard
