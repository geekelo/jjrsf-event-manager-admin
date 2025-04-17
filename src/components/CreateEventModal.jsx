import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave, faCalendarCheck, faMapMarkerAlt, faGlobe } from '@fortawesome/free-solid-svg-icons';

const CreateEventModal = ({ newEventData, onClose, onSubmit, onChange }) => {
  const modalRef = useRef(null);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    onChange({
      target: {
        name: name,
        value: checked
      }
    });
  };

  return (
    <div className="modal-overlay" onClick={handleClickOutside}>
      <div className="create-event-modal" ref={modalRef}>
        <div className="modal-header">
          <h2>Create New Event</h2>
          <button className="close-modal-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="create-event-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Event Name <span className="required">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                value={newEventData.name}
                onChange={onChange}
                placeholder="Enter event name"
                required
              />
            </div>
          </div>

          <div className="form-row two-columns">
            <div className="form-group">
              <label htmlFor="start_date">Start Date <span className="required">*</span></label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={newEventData.start_date}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="end_date">End Date</label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={newEventData.end_date}
                onChange={onChange}
                min={newEventData.start_date}
              />
            </div>
          </div>

          {/* Registration Deadline Field */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="registration_deadline">
                <FontAwesomeIcon icon={faCalendarCheck} className="form-icon" /> 
                Registration Deadline
              </label>
              <input
                type="date"
                id="registration_deadline"
                name="registration_deadline"
                value={newEventData.registration_deadline || ''}
                onChange={onChange}
                max={newEventData.start_date} // Deadline should be before start date
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="form-icon" />
                Location <span className="required">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={newEventData.location}
                onChange={onChange}
                placeholder="Enter event location"
                required
              />
            </div>
          </div>

          {/* Event Type Checkboxes */}
          <div className="form-row">
            <div className="form-group">
              <label className="checkbox-group-label">Event Type</label>
              <div className="checkbox-group">
                <div className="checkbox-option">
                  <input
                    type="checkbox"
                    id="online"
                    name="online"
                    checked={newEventData.online || false}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="online">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="form-icon" />
                    Online
                  </label>
                </div>
                
                <div className="checkbox-option">
                  <input
                    type="checkbox"
                    id="onsite"
                    name="onsite"
                    checked={newEventData.onsite || false}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="onsite">
                    <FontAwesomeIcon icon={faGlobe} className="form-icon" />
                    Onsite
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={newEventData.status}
                onChange={onChange}
              >
                <option value="ongoing">Ongoing</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={newEventData.description}
                onChange={onChange}
                placeholder="Enter event description"
                rows="4"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-button">
              <FontAwesomeIcon icon={faSave} /> Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;