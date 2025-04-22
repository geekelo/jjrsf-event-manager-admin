import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import StreamAccordion from '../components/platform/streamAccordian';

function ManageStream() {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const handleBack = () => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="manage-stream-page">
      <div className="stream-header">
        <button onClick={handleBack} className="back-button">
          <ArrowLeft size={20} />
        </button>
        <h2>Manage Streams for Event ID: {eventId}</h2>
      </div>
<StreamAccordion eventId={eventId} />
      {/* Add your stream management UI here */}
    </div>
  );
}

export default ManageStream;
