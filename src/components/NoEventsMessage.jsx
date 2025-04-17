import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faCalendarPlus } from '@fortawesome/free-solid-svg-icons';

const NoEventsMessage = ({ onCreateEvent }) => {
  return (
    <div className="no-events-message">
      <FontAwesomeIcon icon={faCalendarDays} size="2x" style={{ marginBottom: '16px', opacity: 0.5 }} />
      <p>No events found. Try adjusting your search criteria or create a new event.</p>
      <button 
        className="create-event-button-alt" 
        onClick={onCreateEvent}
      >
        <FontAwesomeIcon icon={faCalendarPlus} className="button-icon" />
        Create Event
      </button>
    </div>
  );
};

export default NoEventsMessage;