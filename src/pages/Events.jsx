import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EventsHeader from '../components/EventsHeader';
import EventCard from '../components/EventCard';
import CreateEventModal from '../components/CreateEventModal';
import FilterPanel from '../components/FilterPanel';
import NoEventsMessage from '../components/NoEventsMessage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../stylesheets/events.css';

function EventsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Form data for creating a new event
  const [newEventData, setNewEventData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    location: '',
    status: 'ongoing', // Changed from 'planning' to 'ongoing'
    registrationDeadline: '', // New field
    isOnsite: false,          // New field
    isOffline: false          // New field
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
      status: 'ongoing' // Changed from 'planning'
    },
    {
      id: 5,
      name: 'Winter Fundraiser Ball',
      startDate: '2025-12-15',
      endDate: '2025-12-15',
      description: 'An elegant evening supporting youth development programs.',
      location: 'Riverside Hotel',
      status: 'ongoing' // Changed from 'planning'
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
      status: 'ongoing', // Changed from 'planning' to 'ongoing'
      registrationDeadline: '',  // Reset this too
      isOnsite: false,           // Reset this too
      isOffline: false           // Reset this too
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
      status: 'ongoing', // Changed from 'planning' to 'ongoing'
      registrationDeadline: '',  // Reset this too
      isOnsite: false,           // Reset this too
      isOffline: false           // Reset this too
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
      case 'ongoing': // Changed from 'planning'
        return 'event-status-ongoing'; // You might want to update this class name too
      case 'completed':
        return 'event-status-completed';
      default:
        return '';
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
        {/* Header with Title, Create Button, and Search/Filter Controls */}
        <EventsHeader 
          onCreateEvent={handleCreateEvent}
          onToggleFilters={handleToggleFilters}
          searchTerm={searchTerm}
          onSearch={handleSearch}
        />

        {/* Filter Panel */}
        {showFilters && (
          <FilterPanel
            filters={filters}
            onClose={handleToggleFilters}
            onChange={handleFilterChange}
            onApply={handleToggleFilters}
          />
        )}

        {/* Events List */}
        <div className="events-list">
          {sortedEvents.length > 0 ? (
            sortedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onManage={handleManageEvent}
                onViewDetails={handleViewDetails}
                getStatusBadgeClass={getStatusBadgeClass}
                formatDate={formatDate}
              />
            ))
          ) : (
            <NoEventsMessage onCreateEvent={handleCreateEvent} />
          )}
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateForm && (
        <CreateEventModal
          newEventData={newEventData}
          onClose={handleCloseForm}
          onSubmit={handleSubmitEvent}
          onChange={handleFormChange}
        />
      )}
    </div>
  );
}

export default EventsPage;