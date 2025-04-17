import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard, faEdit, faSave, faTimes, faKey } from '@fortawesome/free-solid-svg-icons';

const EventEvaluationSection = ({ event, eventId, updateEventEvaluation }) => {
  const navigate = useNavigate();
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [evaluationText, setEvaluationText] = useState(event.evaluation || '');

  const handleEvaluationChange = (e) => {
    setEvaluationText(e.target.value);
  };

  const saveEvaluation = () => {
    updateEventEvaluation(evaluationText);
    setShowEvaluationForm(false);
  };
  
  const navigateToPasscodes = () => {
    navigate(`/events/${eventId}/passcodes`);
  };

  return (
    <section className="evaluation-section">
      <div className="section-header">
        <h2>
          <FontAwesomeIcon icon={faClipboard} /> Event Evaluation
        </h2>
      </div>
      
      <div className="evaluation-content">
        {event.evaluation && !showEvaluationForm ? (
          <>
            <div className="evaluation-text red-text">
              {event.evaluation}
            </div>
            <button 
              className="primary-button"
              onClick={() => {
                setEvaluationText(event.evaluation);
                setShowEvaluationForm(true);
              }}
            >
              <FontAwesomeIcon icon={faEdit} /> Edit Evaluation
            </button>
          </>
        ) : showEvaluationForm ? (
          <div className="evaluation-form">
            <textarea 
              value={evaluationText}
              onChange={handleEvaluationChange}
              placeholder="Enter your evaluation of the event..."
              rows={6}
              className="red-text-input"
            ></textarea>
            <div className="form-actions">
              <button 
                className="cancel-button"
                onClick={() => setShowEvaluationForm(false)}
              >
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
              <button 
                className="primary-button"
                onClick={saveEvaluation}
              >
                <FontAwesomeIcon icon={faSave} /> Save Evaluation
              </button>
            </div>
          </div>
        ) : (
          <div className="no-evaluation">
            <p>No evaluation has been added for this event yet.</p>
            <button 
              className="primary-button"
              onClick={() => setShowEvaluationForm(true)}
            >
              <FontAwesomeIcon icon={faEdit} /> Add Evaluation
            </button>
          </div>
        )}
      </div>
      
      <div className="passcode-section">
        <button 
          className="secondary-button"
          onClick={navigateToPasscodes}
        >
          <FontAwesomeIcon icon={faKey} /> Manage Frontdesk Passcodes
        </button>
      </div>
    </section>
  );
};

export default EventEvaluationSection;