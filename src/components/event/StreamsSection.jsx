import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm } from '@fortawesome/free-solid-svg-icons';

const StreamsSection = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const goToManageStream = () => {
    navigate(`/events/${eventId}/manage_stream`);
  };

  return (
    <section className="streams-section">
      <div className="section-header">
        <h2>
          <FontAwesomeIcon icon={faFilm} /> Stream Management
        </h2>
      </div>

      <div className="stream-management-intro">
        <p>
          Manage streaming platforms for this event. You can add multiple platforms
          like YouTube, Mixlr, and Zoom.
        </p>
        <button className="manage-streams-button" onClick={goToManageStream}>
          <FontAwesomeIcon icon={faFilm} /> Manage Streams
        </button>
      </div>
    </section>
  );
};

export default StreamsSection;
