import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm } from '@fortawesome/free-solid-svg-icons';
import { fetchPlatforms } from '../../redux/platformSlice';

const StreamsSection = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const dispatch = useDispatch();

  const { items: platforms, loading } = useSelector((state) => state.platform);

  useEffect(() => {
    if (eventId) {
      dispatch(fetchPlatforms(eventId));
    }
  }, [dispatch, eventId]);

  const goToManageStream = () => {
    navigate(`/events/${eventId}/manage_stream`);
  };

  
  const platformCount = platforms ? platforms.length : 0

  return (
    <section className="streams-section">
      <div className="section-header">
        <h2>
          <FontAwesomeIcon icon={faFilm} /> Stream Management  {loading ? "" : `(${platformCount})`}
        </h2>
      </div>

      <div className="stream-management-intro">
        <p>
          Manage streaming platforms for this event. You can add multiple platforms
          like YouTube, Mixlr, and Zoom.
        </p>

        {loading ? (
          <p>Loading stream platforms...</p>
        ) : (
          <p>
            {platforms.length > 0
              ? `You currently have ${platforms.length} platform${platforms.length > 1 ? 's' : ''} added.`
              : 'No streaming platforms added yet.'}
          </p>
        )}

        <button className="manage-streams-button" onClick={goToManageStream}>
          <FontAwesomeIcon icon={faFilm} /> Manage Streams
        </button>
      </div>
    </section>
  );
};

export default StreamsSection;
