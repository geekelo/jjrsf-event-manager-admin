import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const EventHeader = ({ event, handleBack }) => {
  return (
    <div className="manage-event-header">
      <button 
        className="back-button" 
        onClick={handleBack}
        aria-label="Back to events"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <h1>Event: {event.name}</h1>
    </div>
  );
};

export default EventHeader;