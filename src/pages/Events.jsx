import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarPlus, 
  faEllipsisVertical, 
  faMagnifyingGlass, 
  faFilter, 
  faLocationDot, 
  faCalendarDays, 
  faTimes,
  faSave,
  faCheck,
  faSort,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../stylesheets/events.css';

function EventsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const modalRef = useRef(null);
  
  // Form data for creating a new event
  const [newEventData, setNewEventData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    location: '',
    status: 'planning'
  });

  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    sortBy: 'date' // 'date', 'name', 'status'
  });
  
  // Dummy data for events (will be replaced with API data)
  const [events, setEvents] = useState([
    {
      id: 1,
      name: 'Annual Charity Gala',
      startDate: '2025-05-15',
      endDate: '2025-05-15',
      description: 'A prestigious event raising funds for education initiatives.',
      location: 'Grand Hotel, Downtown',
      status: 'upcoming'
    },
    {
      id: 2,
      name: 'Tech Conference 2025',
      startDate: '2025-06-10',
      endDate: '2025-06-12',
      description: 'Bringing together industry leaders to discuss the latest innovations.',
      location: 'Convention Center',
      status: 'upcoming'
    },
    {
      id: 3,
      name: 'Summer Music Festival',
      startDate: '2025-07-20',
      endDate: '2025-07-22',
      description: 'Three days of amazing performances from top artists.',
      location: 'City Park',
      status: 'upcoming'
    },
    {
      id: 4,
      name: 'Community Volunteer Day',
      startDate: '2025-08-05',
      endDate: '2025-08-05',
      description: 'Join us in giving back to the community through various activities.',
      location: 'Multiple Locations',
      status: 'planning'
    },
    {
      id: 5,
      name: 'Winter Fundraiser Ball',
      startDate: '2025-12-15',
      endDate: '2025-12-15',
      description: 'An elegant evening supporting youth development programs.',
      location: 'Riverside Hotel',
      status: 'planning'
    },
    {
      id: 6,
      name: 'Spring Cleanup Drive',
      startDate: '2025-04-10',
      endDate: '2025-04-10',
      description: 'Environmental initiative to clean local parks and waterways.',
      location: 'Citywide',
      status: 'completed'
    }
  ]);

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle clicking the manage button
  const handleManageEvent = (eventId) => {
    toast.info(`Opening management page for event #${eventId}`);
    navigate(`/events/${eventId}`);
  };

  // Handle creating a new event
  const handleCreateEvent = () => {
    setShowCreateForm(true);
  };

  // Handle closing the create form modal
  const handleCloseForm = () => {
    setShowCreateForm(false);
    // Reset form data
    setNewEventData({
      name: '',
      startDate: '',
      endDate: '',
      description: '',
      location: '',
      status: 'planning'
    });
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmitEvent = (e) => {
    e.preventDefault();
    
    // Validation
    if (!newEventData.name || !newEventData.startDate || !newEventData.location) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Create new event with unique ID
    const newEvent = {
      ...newEventData,
      id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1
    };
    
    // Add to events list
    setEvents([...events, newEvent]);
    
    // Close form and show success message
    setShowCreateForm(false);
    toast.success(`Event "${newEventData.name}" created successfully!`);
    
    // Reset form data
    setNewEventData({
      name: '',
      startDate: '',
      endDate: '',
      description: '',
      location: '',
      status: 'planning'
    });
  };

  // Toggle filter panel
  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Update filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle view event details
  const handleViewDetails = (event) => {
    toast.info(`Viewing details for: ${event.name}`);
    navigate(`/events/${event.id}`);
  };

  // Apply filters and search to events
  const filteredEvents = events.filter(event => {
    // Text search
    const matchesSearch = 
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = filters.status === 'all' || event.status === filters.status;
    
    // Date range filter
    let matchesDate = true;
    const today = new Date();
    const eventStartDate = new Date(event.startDate);
    
    if (filters.dateRange === 'upcoming30') {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      matchesDate = eventStartDate >= today && eventStartDate <= thirtyDaysFromNow;
    } else if (filters.dateRange === 'upcoming90') {
      const ninetyDaysFromNow = new Date();
      ninetyDaysFromNow.setDate(today.getDate() + 90);
      matchesDate = eventStartDate >= today && eventStartDate <= ninetyDaysFromNow;
    } else if (filters.dateRange === 'past') {
      matchesDate = eventStartDate < today;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Sort filtered events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (filters.sortBy === 'date') {
      return new Date(a.startDate) - new Date(b.startDate);
    } else if (filters.sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (filters.sortBy === 'status') {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  // Format date to display in a more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get status badge class based on event status
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'upcoming':
        return 'event-status-upcoming';
      case 'planning':
        return 'event-status-planning';
      case 'completed':
        return 'event-status-completed';
      default:
        return '';
    }
  };

  // Close modal when clicking outside
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleCloseForm();
    }
  };

  return (
    <div className="events-page-background">
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
      
      <div className="events-container">
        <div className="events-header">
          <h1 className="events-title">
            <FontAwesomeIcon icon={faCalendarDays} className="title-icon" /> Events
          </h1>
          <button 
            className="create-event-button" 
            onClick={handleCreateEvent}
          >
            <FontAwesomeIcon icon={faCalendarPlus} className="button-icon" />
            Create Event
          </button>
        </div>

        <div className="events-filters">
          <div className="search-container">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          <button className="filter-button" onClick={handleToggleFilters}>
            <FontAwesomeIcon icon={faFilter} />
            <span>Filter & Sort</span>
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="filter-panel">
            <div className="filter-panel-header">
              <h3>Filter & Sort Events</h3>
              <button className="close-button" onClick={handleToggleFilters}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="filter-panel-content">
              <div className="filter-group">
                <label className="filter-label">Status</label>
                <select 
                  name="status" 
                  className="filter-select"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="all">All Statuses</option>
                  <option value="planning">Planning</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label className="filter-label">Date Range</label>
                <select 
                  name="dateRange" 
                  className="filter-select"
                  value={filters.dateRange}
                  onChange={handleFilterChange}
                >
                  <option value="all">All Dates</option>
                  <option value="upcoming30">Next 30 Days</option>
                  <option value="upcoming90">Next 90 Days</option>
                  <option value="past">Past Events</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label className="filter-label">
                  <FontAwesomeIcon icon={faSort} /> Sort By
                </label>
                <select 
                  name="sortBy" 
                  className="filter-select"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                >
                  <option value="date">Date (Oldest First)</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
            
            <div className="filter-panel-footer">
              <button 
                className="apply-filters-button"
                onClick={handleToggleFilters}
              >
                <FontAwesomeIcon icon={faCheck} /> Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Events Grid */}
        <div className="events-list">
          {sortedEvents.length > 0 ? (
            sortedEvents.map(event => (
              <div className="event-card" key={event.id}>
                <div className="event-card-content">
                  <div className="event-header">
                    <h3 className="event-name">{event.name}</h3>
                    <span className={`event-status ${getStatusBadgeClass(event.status)}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="event-dates">
                    <FontAwesomeIcon icon={faCalendarDays} className="event-icon" />
                    {event.startDate === event.endDate ? (
                      <p>{formatDate(event.startDate)}</p>
                    ) : (
                      <p>{formatDate(event.startDate)} - {formatDate(event.endDate)}</p>
                    )}
                  </div>
                  
                  <p className="event-location">
                    <FontAwesomeIcon icon={faLocationDot} className="event-icon" />
                    {event.location}
                  </p>
                  <p className="event-description">{event.description}</p>
                </div>
                
                <div className="event-actions">
                  <button 
                    className="manage-event-button"
                    onClick={() => handleManageEvent(event.id)}
                  >
                    Manage
                  </button>
                  <div className="event-menu-dropdown">
                    <button className="event-menu-button">
                      <FontAwesomeIcon icon={faEllipsisVertical} />
                    </button>
                    <div className="event-menu-content">
                      <button onClick={() => handleViewDetails(event)}>
                        <FontAwesomeIcon icon={faEye} /> View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-events-message">
              <FontAwesomeIcon icon={faCalendarDays} size="2x" style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p>No events found. Try adjusting your search criteria or create a new event.</p>
              <button 
                className="create-event-button-alt" 
                onClick={handleCreateEvent}
              >
                <FontAwesomeIcon icon={faCalendarPlus} className="button-icon" />
                Create Event
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateForm && (
        <div className="modal-overlay" onClick={handleClickOutside}>
          <div className="create-event-modal" ref={modalRef}>
            <div className="modal-header">
              <h2>Create New Event</h2>
              <button className="close-modal-button" onClick={handleCloseForm}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitEvent} className="create-event-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Event Name <span className="required">*</span></label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newEventData.name}
                    onChange={handleFormChange}
                    placeholder="Enter event name"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row two-columns">
                <div className="form-group">
                  <label htmlFor="startDate">Start Date <span className="required">*</span></label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={newEventData.startDate}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="endDate">End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={newEventData.endDate}
                    onChange={handleFormChange}
                    min={newEventData.startDate} // End date must be after start date
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location">Location <span className="required">*</span></label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={newEventData.location}
                    onChange={handleFormChange}
                    placeholder="Enter event location"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={newEventData.status}
                    onChange={handleFormChange}
                  >
                    <option value="planning">Planning</option>
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
                    onChange={handleFormChange}
                    placeholder="Enter event description"
                    rows="4"
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={handleCloseForm}>
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  <FontAwesomeIcon icon={faSave} /> Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventsPage;