import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../stylesheets/manageEvent.css';

// Import components
import EventHeader from '../components/event/EventHeader';
import EventDetailsSection from '../components/event/EventDetailsSection';
import EventMetricsSection from '../components/event/EventMetricsSection';
import EventEvaluationSection from '../components/event/EventEvaluationSection';
import StreamsSection from '../components/event/StreamsSection';
import PasscodeModal from '../components/PasscodeModal';

function ManageEvent() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Use direct localhost URL
  const eventUrl = `http://localhost:3000/event/${eventId}`;

  // Dummy metrics data
  const metrics = {
    totalRegistered: 158,
    totalAttendedOnline: 89,
    totalAttendedOffline: 45,
    totalAttendedBoth: 12,
    totalDidNotAttend: 36
  };

  useEffect(() => {
    // Simulate API call to fetch event details
    const fetchEvent = async () => {
      try {
        setTimeout(() => {
          // Dummy data
          const eventData = {
            id: eventId,
            name: 'Annual Charity Gala 2025',
            startDate: '2025-05-15',
            endDate: '2025-05-15',
            registrationDeadline: '2025-05-01',
            description: 'A prestigious event raising funds for education initiatives with notable speakers and entertainment.',
            location: 'Grand Hotel, Downtown',
            status: 'upcoming',
            isOnsite: true,
            isOffline: true,
            evaluation: '', // Empty evaluation initially
            streams: [
              { 
                id: 1, 
                platform: 'YouTube', 
                embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                views: 2345
              },
              { 
                id: 2, 
                platform: 'Mixlr', 
                embedUrl: 'https://mixlr.com/users/7520755/embed',
                views: 872
              }
            ]
          };
          
          setEvent(eventData);
          setLoading(false);
        }, 800);
      } catch (error) {
        toast.error('Failed to load event data');
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [eventId]);
  
  const handleBack = () => {
    navigate('/events');
  };
  
  const toggleEditMode = () => {
    setIsEditMode(prev => !prev);
    if (isEditMode) {
      toast.success('Event details updated successfully');
    }
  };
  
  const updateEventData = (updatedData) => {
    setEvent(prevEvent => ({
      ...prevEvent,
      ...updatedData
    }));
  };
  
  const copyEventUrl = () => {
    navigator.clipboard.writeText(eventUrl);
    toast.success('Event URL copied to clipboard!');
  };
  
  const updateEventEvaluation = (evaluationText) => {
    setEvent(prev => ({ ...prev, evaluation: evaluationText }));
    toast.success('Evaluation saved successfully!');
  };
  

  
  const closePasscodeModal = () => {
    setShowPasscodeModal(false);
  };

  if (loading) {
    return (
      <div className="manage-event-page-background">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-event-page-background">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      <div className="manage-event-container">
        <EventHeader 
          event={event} 
          handleBack={handleBack} 
        />
        
        <EventDetailsSection
          event={event}
          eventUrl={eventUrl}
          copyEventUrl={copyEventUrl}
          isEditMode={isEditMode}
          toggleEditMode={toggleEditMode}
          updateEventData={updateEventData}
        />
        
        <EventMetricsSection
          metrics={metrics}
          eventId={eventId}
        />
        
        <EventEvaluationSection
          event={event}
          eventId={eventId}
          updateEventEvaluation={updateEventEvaluation}
        />
        
        <StreamsSection event={event} />
      </div>
      
      {showPasscodeModal && (
        <PasscodeModal 
          eventId={eventId} 
          onClose={closePasscodeModal}
        />
      )}
    </div>
  );
}

export default ManageEvent;