import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm} from '@fortawesome/free-solid-svg-icons';
import StreamAccordion from '../StreamAccordion';

const StreamsSection = ({ event }) => {
  const [showStreamAccordion, setShowStreamAccordion] = useState(false);
  
  const toggleStreamAccordion = () => {
    setShowStreamAccordion(!showStreamAccordion);
  };
  
  return (
    <section className="streams-section">
      <div className="section-header">
        <h2>
          <FontAwesomeIcon icon={faFilm} /> Stream Management
        </h2>
      </div>
      
      {!showStreamAccordion ? (
        <div className="stream-management-intro">
          <p>Manage streaming platforms for this event. You can add multiple platforms like YouTube, Mixlr, and Zoom.</p>
          <button 
            className="manage-streams-button"
            onClick={toggleStreamAccordion}
          >
            <FontAwesomeIcon icon={faFilm} /> Manage Streams
          </button>
        </div>
      ) : (
        <StreamAccordion event={event} />
      )}
    </section>
  );
};

export default StreamsSection;