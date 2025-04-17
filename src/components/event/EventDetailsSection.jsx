import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faLink, faCopy, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

const EventDetailsSection = ({ 
  event, 
  eventUrl, 
  copyEventUrl, 
  isEditMode, 
  toggleEditMode, 
  updateEventData 
}) => {
  const [editFormData, setEditFormData] = useState({
    name: event.name,
    startDate: event.startDate,
    endDate: event.endDate,
    registrationDeadline: event.registrationDeadline,
    location: event.location,
    status: event.status,
    isOnsite: event.isOnsite,
    isOffline: event.isOffline,
    description: event.description
  });

  // Update form data when event changes
  useEffect(() => {
    setEditFormData({
      name: event.name,
      startDate: event.startDate,
      endDate: event.endDate,
      registrationDeadline: event.registrationDeadline,
      location: event.location,
      status: event.status,
      isOnsite: event.isOnsite,
      isOffline: event.isOffline,
      description: event.description
    });
  }, [event]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateEventData(editFormData);
    toggleEditMode();
  };

  const cancelEdit = () => {
    setEditFormData({
      name: event.name,
      startDate: event.startDate,
      endDate: event.endDate,
      registrationDeadline: event.registrationDeadline,
      location: event.location,
      status: event.status,
      isOnsite: event.isOnsite,
      isOffline: event.isOffline,
      description: event.description
    });
    toggleEditMode();
  };

  return (
    <section className="event-details-section">
      <div className="section-header">
        <h2>Event Details</h2>
        {!isEditMode ? (
          <button className="edit-button" onClick={toggleEditMode}>
            <FontAwesomeIcon icon={faEdit} /> Edit
          </button>
        ) : (
          <div className="edit-actions">
            <button className="cancel-button" onClick={cancelEdit}>
              <FontAwesomeIcon icon={faTimes} /> Cancel
            </button>
            <button className="save-button" onClick={handleSubmit}>
              <FontAwesomeIcon icon={faSave} /> Save
            </button>
          </div>
        )}
      </div>
      
      {!isEditMode ? (
        <div className="event-details-grid">
          <div className="detail-item">
            <span className="detail-label">Event Name</span>
            <span className="detail-value">{event.name}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Start Date</span>
            <span className="detail-value">
              {new Date(event.startDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">End Date</span>
            <span className="detail-value">
              {new Date(event.endDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Registration Deadline</span>
            <span className="detail-value">
              {new Date(event.registrationDeadline).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Location</span>
            <span className="detail-value">{event.location}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Status</span>
            <span className={`detail-value status-badge ${event.status}`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Event Type</span>
            <span className="detail-value">
              {event.isOnsite && event.isOffline 
                ? 'Hybrid (Onsite & Online)' 
                : event.isOnsite 
                  ? 'Onsite Only' 
                  : 'Online Only'
              }
            </span>
          </div>
          
          <div className="detail-item full-width">
            <span className="detail-label">Description</span>
            <span className="detail-value description">{event.description}</span>
          </div>
          
          <div className="detail-item full-width">
            <span className="detail-label">
              <FontAwesomeIcon icon={faLink} /> Event URL
            </span>
            <div className="url-container">
              <span className="event-url">{eventUrl}</span>
              <button className="copy-button" onClick={copyEventUrl}>
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form className="event-edit-form">
          <div className="edit-grid">
            <div className="form-group">
              <label htmlFor="name">Event Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editFormData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={editFormData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={editFormData.endDate}
                onChange={handleChange}
                min={editFormData.startDate}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="registrationDeadline">Registration Deadline</label>
              <input
                type="date"
                id="registrationDeadline"
                name="registrationDeadline"
                value={editFormData.registrationDeadline}
                onChange={handleChange}
                max={editFormData.startDate}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={editFormData.location}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={editFormData.status}
                onChange={handleChange}
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className="form-group checkbox-group">
              <label>Event Type</label>
              <div className="checkboxes">
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="isOnsite"
                    name="isOnsite"
                    checked={editFormData.isOnsite}
                    onChange={handleChange}
                  />
                  <label htmlFor="isOnsite">Onsite</label>
                </div>
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="isOffline"
                    name="isOffline"
                    checked={editFormData.isOffline}
                    onChange={handleChange}
                  />
                  <label htmlFor="isOffline">Online</label>
                </div>
              </div>
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={editFormData.description}
                onChange={handleChange}
                rows="4"
              ></textarea>
            </div>
            
            <div className="form-group full-width">
              <label>
                <FontAwesomeIcon icon={faLink} /> Event URL
              </label>
              <div className="url-container">
                <span className="event-url">{eventUrl}</span>
                <button 
                  type="button" 
                  className="copy-button" 
                  onClick={copyEventUrl}
                >
                  <FontAwesomeIcon icon={faCopy} />
                </button>
              </div>
              <small>This URL will be used to share the event with attendees.</small>
            </div>
          </div>
        </form>
      )}
    </section>
  );
};

export default EventDetailsSection;